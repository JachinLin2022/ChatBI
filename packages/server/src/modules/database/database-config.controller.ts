import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { DatabaseConfigService } from './database-config.service.js';

@Controller('database-config')
export class DatabaseConfigController {
  constructor(private readonly databaseConfigService: DatabaseConfigService) {}

  @Post()
  async saveDatabaseConfig(@Body() configData: any) {
    return this.databaseConfigService.saveConfig(configData);
  }

  @Get()
  async getDatabaseConfig() {
    return this.databaseConfigService.getConfig();
  }

  @Delete(':key')
  async deleteDatabaseConfig(@Param('key') key: string) {
    return this.databaseConfigService.deleteConfig(key);
  }
}