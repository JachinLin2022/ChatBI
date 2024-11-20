import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from './database.service.js';
import { DatabaseConfigController } from './database-config.controller.js';
import { DatabaseConfigService } from './database-config.service.js';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: config.get('DB_TYPE'),
          url: config.get('DB_CONNECTION_URL'),
        };
      },
    }),
  ],
  controllers: [DatabaseConfigController],
  providers: [DatabaseService, DatabaseConfigService],
  exports: [DatabaseService],
})
export class DatabaseModule {
  // noop
}
