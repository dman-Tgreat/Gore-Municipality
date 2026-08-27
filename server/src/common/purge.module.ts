import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurgeService } from './purge.service';
import { Contact } from '../contact/entities/contact.entity';
import { News } from '../news/entities/news.entity';
import { Announcement } from '../announcements/entities/announcement.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contact, News, Announcement]),
  ],
  providers: [PurgeService],
})
export class PurgeModule {}
