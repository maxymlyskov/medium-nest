import ormConfig from '@app/ormconfig';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [TypeOrmModule.forRoot(ormConfig), TagsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
