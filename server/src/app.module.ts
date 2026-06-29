import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { NewsModule } from './news/news.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { DepartmentsModule } from './departments/departments.module';
import { ProjectsModule } from './projects/projects.module';
import { DocumentsModule } from './documents/documents.module';
import { ContactModule } from './contact/contact.module';
import { UploadModule } from './upload/upload.module';
import { InvestmentsModule } from './investments/investments.module';
import { HeroSlidesModule } from './hero-slides/hero-slides.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal:true,
    }),
    

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities:true,
      synchronize:true,
    }),

    AdminModule,

    AuthModule,

    NewsModule,

    AnnouncementsModule,

    DepartmentsModule,

    ProjectsModule,

    DocumentsModule,

    ContactModule,

    UploadModule,

    InvestmentsModule,

    HeroSlidesModule,

    SettingsModule,
  ],
})
export class AppModule {}
