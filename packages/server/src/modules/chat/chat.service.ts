import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { getFieldType } from '../../utils/index.js';
import { DatabaseService } from '../database/database.service.js';
import { AiAgent } from './../../ai/agent/index.js';
import { envs } from '../../config/envs.js';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  @Inject()
  private agent: AiAgent;

  constructor(
    private httpService: HttpService,
    private databaseService: DatabaseService,
  ) {
    // noop
  }

  async test() {
    return this.databaseService.query('select * from products limit 10;');
  }

  async getSchemas() {
    return this.databaseService.getSchemas();
  }

  async getConfig() {
    return {
      success: true,
      data: {
        // IMPORTANT: apiKey should not be exposed to the client side
        // apiKey: envs.OPENAI_API_KEY,
        baseUrl: envs.OPENAI_API_BASE_URL,
        model: envs.OPENAI_MODEL,
      },
    };
  }

  async chat(payload: Chat.Message) {
    try {
      // TODO: support conversation id
      const result = await this.agent.sql(
        payload.text,
        payload.conversationId || '123',
      );

      if (!result.success) {
        return {
          success: false,
          content: result.error
            ? result.error
            : 'Sorry, I can not answer your question, please try again.',
        };
      }

      // extract table name
      const tableName = result.tableName;
      let table = null;
      if (tableName) {
        this.logger.debug(`Table name: ${tableName}`);
        table = {
          name: tableName,
          metadatas: result.metadatas.fields.map((field) => {
            return {
              field: field.name,
              type: getFieldType(field.name, field.type),
            };
          }),
          data: result.rows,
          database: result.database,
        };
      }

      return {
        success: true,
        table,
        content: `
【用户问题】:
\`\`\`
${payload.text}
\`\`\`

【生成的数据库查询语句】:
\`\`\`
${result.query}
\`\`\`
`,
      };
    } catch (e) {
      this.logger.error(e);

      return {
        success: false,
        content: 'Server error, please try again later.',
      };
    }
  }

  async vega(payload: Chat.VegaMessage) {
    try {
      const { text, conversationId = '123', metadatas } = payload;
      const result = await this.agent.vega(text, metadatas, conversationId);

      if (!result.success) {
        return {
          success: false,
          content: result.error
            ? result.error
            : 'Sorry, I can not answer your question, please try again.',
        };
      }

      return {
        ...result,
        success: true,
        metadatas,
      };
    } catch (e) {
      this.logger.error(e);

      return {
        success: false,
        content: 'Server error, please try again later.',
      };
    }
  }
}
