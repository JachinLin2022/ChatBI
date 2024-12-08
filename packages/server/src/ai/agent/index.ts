import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { openAI, type OpenAI } from '../api/openai.js';

import {
  generateSqlPrompt,
  generateVegaPrompt,
  generateIntentPrompt
} from '../../modules/chat/prompt-generator.js';
import { DatabaseService } from '../../modules/database/database.service.js';
import {
  getAssumptions,
  getDatabaseName,
  getQuerySql,
  getTableName,
  getVegaSpec,
} from '../../utils/index.js';

@Injectable()
export class AiAgent {
  private readonly logger = new Logger(AiAgent.name);

  private readonly lastMessageIds = new Map<string, string>();

  aiAgent: OpenAI;

  constructor(
    private config: ConfigService,
    private databaseService: DatabaseService,
  ) {
    if (this.config.get('OPENAI_API_KEY')) {
      this.aiAgent = openAI;
    } else {
      throw new Error('No API key provided');
    }
    this.aiAgent.init();
  }

  $onInit() {
    this.logger.debug('Init AiAgent');
  }

  public async vega(
    question: string,
    metadatas: Chat.Metadata[],
    conversationId: string,
  ): Promise<Chat.VegaAnswer> {
    // 1. Get all table schemas for generate context prompt
    const contextPrompt = generateVegaPrompt(metadatas);

    this.logger.debug(`Context prompt:\n${contextPrompt}`);
    const contextResponse = await this.aiAgent.sendMessage(contextPrompt);
    this.logger.debug(`Context prompt response:\n${contextResponse.text}`);
    // cache last message id
    this.lastMessageIds.set(conversationId, contextResponse.id);

    // 2. Send question prompt to AI agent
    const questionPrompt = `Question: ${question}`;
    this.logger.debug(`Question prompt:\n${questionPrompt}`);
    const parentMessageId = this.lastMessageIds.get(conversationId);
    const { id: msgId, text } = await this.aiAgent.sendMessage(
      questionPrompt,
      parentMessageId,
    );
    this.logger.debug(`Response: ${text}`);
    this.lastMessageIds.set(conversationId, msgId);

    try {
      // 3. Get vege specification from response
      const vegaSpec = getVegaSpec(text);
      this.logger.log(`Vega Spec: \n${vegaSpec}`);
      return {
        success: true,
        content: vegaSpec,
        // add metadata for ava analysis
        metadatas,
      };
    } catch (err) {
      this.logger.debug(`Error query: ${err}`);
      return {
        content: '',
        success: false,
        error: err?.message,
      };
    }
  }

  public async sql(
    question: string,
    conversationId: string,
  ): Promise<Chat.Answer> {

    // 意图识别
    const intentPrompt = generateIntentPrompt(question);
    this.logger.debug(`Intent Prompt:\n${intentPrompt}`);
    const intentResponse = await this.aiAgent.sendMessage(intentPrompt);
    this.logger.debug(`Intent prompt response:\n${intentResponse.text}`);

    if (intentResponse.text.indexOf('查询相关') < 0) {
      return {
        query: '',
        success: false,
        error: `该问题为查询无关问题，请重新输入！
        `,
      };
    }
    

    // 1. Get all table schemas for generate context prompt
    const tableSchemas = await this.databaseService.getAllTableSchemas();
    const dbType = await this.databaseService.getDbType();
    const contextPrompt = generateSqlPrompt(dbType, tableSchemas);

    this.logger.debug(`Context prompt:\n${contextPrompt}`);
    const contextResponse = await this.aiAgent.sendMessage(contextPrompt);
    this.logger.debug(`Context prompt response:\n${contextResponse.text}`);
    // cache last message id
    this.lastMessageIds.set(conversationId, contextResponse.id);

    // 2. Send question prompt to AI agent
    const questionPrompt = `Question: ${question}`;
    this.logger.debug(`Question prompt:\n${questionPrompt}`);
    const parentMessageId = this.lastMessageIds.get(conversationId);
    const { id: msgId, text } = await this.aiAgent.sendMessage(
      questionPrompt,
      parentMessageId,
    );
    this.logger.debug(`Response: ${text}`);
    this.lastMessageIds.set(conversationId, msgId);

    // 3. Get query from response
    const sql = getQuerySql(text);
    if (!sql) {
      return {
        query: '',
        success: false,
        error: `Could not get query for question: ${question}.`,
      };
    }

    // 4. Get assumptions from response
    const assumptions = getAssumptions(text);
    const databaseName = getDatabaseName(text);
    // 5. Get table name from response
    const tableName = getTableName(text);

    let query = '';
    try {
      query = sql.trim();
      this.logger.log(`Execute Query: \n${query}`);
      const result = await this.databaseService.query(query);
      const metadatas = await this.databaseService.getTableSchema(
        databaseName,
        tableName,
      );
      return {
        ...result,
        tableName: tableName,
        // add metadata for ava analysis
        metadatas,
        assumptions,
      };
    } catch (err) {
      this.logger.debug(`Error query: ${err}`);
      return {
        query: query,
        success: false,
        error: err?.message,
      };
    }
  }
}
