import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

import { Contact } from './entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactService {
  private resend: Resend;

  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
    private readonly configService: ConfigService,
  ) {
    this.resend = new Resend(this.configService.getOrThrow<string>('RESEND_API_KEY'));
  }

  async create(createContactDto: CreateContactDto) {
    const contact = this.contactRepository.create(createContactDto);

    const saved = await this.contactRepository.save(contact);

    // Send email notification to the municipality inbox
    const adminEmail = this.configService.get<string>('CONTACT_NOTIFICATION_EMAIL') || 'info@goreworeda.gov.et';

    try {
      await this.resend.emails.send({
        from: this.configService.getOrThrow<string>('RESEND_FROM_EMAIL'),
        to: adminEmail,
        subject: `New Contact Form Submission: ${saved.subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <table style="border-collapse:collapse;width:100%;max-width:600px;">
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Name</td><td style="padding:8px;border:1px solid #ddd;">${saved.name}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Email</td><td style="padding:8px;border:1px solid #ddd;">${saved.email}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Subject</td><td style="padding:8px;border:1px solid #ddd;">${saved.subject}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Message</td><td style="padding:8px;border:1px solid #ddd;">${saved.message}</td></tr>
          </table>
          <p style="color:#666;font-size:12px;margin-top:16px;">Received on ${saved.createdAt?.toISOString()}</p>
        `,
      });
    } catch (error) {
      // Log the error but don't block the submission
      console.error('Failed to send email notification:', error);
    }

    return saved;
  }

  async findAll() {
    return await this.contactRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const contact = await this.contactRepository.findOne({
      where: { id },
    });

    if (!contact) {
      throw new NotFoundException('Contact message not found');
    }

    return contact;
  }

  async update(id: number, updateContactDto: UpdateContactDto) {
    await this.contactRepository.update(id, updateContactDto);

    return this.findOne(id);
  }

  async remove(id: number) {
    const contact = await this.findOne(id);

    await this.contactRepository.remove(contact);

    return {
      message: 'Contact message deleted successfully',
    };
  }
}
