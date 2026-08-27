import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';

import { Contact } from '../contact/entities/contact.entity';
import { News } from '../news/entities/news.entity';
import { Announcement } from '../announcements/entities/announcement.entity';

const RETENTION_DAYS = 30;

@Injectable()
export class PurgeService {
  private readonly logger = new Logger(PurgeService.name);

  constructor(
    @InjectRepository(Contact) private readonly contactRepo: Repository<Contact>,
    @InjectRepository(News) private readonly newsRepo: Repository<News>,
    @InjectRepository(Announcement) private readonly announcementRepo: Repository<Announcement>,
  ) {}

  /**
   * Runs daily at 3:00 AM.
   * Permanently deletes soft-deleted records older than RETENTION_DAYS.
   */
  @Cron('0 3 * * *')
  async handlePurge() {
    this.logger.log('Running soft-delete purge…');

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - RETENTION_DAYS);

    const where = { deletedAt: LessThan(cutoff) } as const;

    const [contacts, news, announcements] = await Promise.all([
      this.contactRepo.find({ where, withDeleted: true }),
      this.newsRepo.find({ where, withDeleted: true }),
      this.announcementRepo.find({ where, withDeleted: true }),
    ]);

    const counts = {
      contacts: contacts.length,
      news: news.length,
      announcements: announcements.length,
    };

    const total = counts.contacts + counts.news + counts.announcements;

    if (total === 0) {
      this.logger.log('No expired soft-deleted items found.');
      return;
    }

    // Hard-delete in parallel
    await Promise.all([
      contacts.length ? this.contactRepo.remove(contacts) : Promise.resolve(),
      news.length ? this.newsRepo.remove(news) : Promise.resolve(),
      announcements.length ? this.announcementRepo.remove(announcements) : Promise.resolve(),
    ]);

    this.logger.log(
      `Purged ${total} expired soft-deleted items (older than ${RETENTION_DAYS} days): ` +
      `contacts=${counts.contacts}, news=${counts.news}, announcements=${counts.announcements}`,
    );
  }
}
