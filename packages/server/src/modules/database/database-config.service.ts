import { Injectable, Logger } from '@nestjs/common';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class DatabaseConfigService {
  
  private readonly logger = new Logger(DatabaseConfigService.name);
  private readonly configPath = './databaseConfigs.json';

  async saveConfig(configData: any) {
    try {
      this.logger.log('saveConfig');
      await writeFile(this.configPath, JSON.stringify(configData, null, 2));
      return { success: true, message: 'Configuration saved successfully' };
    } catch (error) {
      return { success: false, message: 'Failed to save configuration', error: error.message };
    }
  }

  async getConfig() {
    try {
      this.logger.log('getConfig');
      const configData = await readFile(this.configPath, 'utf8');
      return JSON.parse(configData);
    } catch (error) {
      return { success: false, message: 'Failed to get configuration', error: error.message };
    }
  }

  // 新增的删除配置方法
  async deleteConfig(key: string) {
    this.logger.log('deleteConfig');
    try {
      const currentConfigs = await this.getConfig();
      const updatedConfigs = currentConfigs.filter((config: any) => config.key !== key);
      await writeFile(this.configPath, JSON.stringify(updatedConfigs, null, 2));
      return { success: true, message: 'Configuration deleted successfully' };
    } catch (error) {
      return { success: false, message: 'Failed to delete configuration', error: error.message };
    }
  }
}