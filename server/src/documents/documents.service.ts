import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Document } from './entities/document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { Admin } from '../admin/entities/admin.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentsRepository: Repository<Document>,

    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async create(
    createDocumentDto: CreateDocumentDto,
    adminId: number,
  ) {
    const admin = await this.adminRepository.findOne({
      where: { id: adminId },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    const document = this.documentsRepository.create({
      ...createDocumentDto,
      createdBy: admin,
    });

    return await this.documentsRepository.save(document);
  }

  async findAll() {
    return await this.documentsRepository.find({
      relations: {
        createdBy: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const document = await this.documentsRepository.findOne({
      where: { id },
      relations: {
        createdBy: true,
      },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    return document;
  }

  async update(id: number, updateDocumentDto: UpdateDocumentDto) {
    await this.documentsRepository.update(id, updateDocumentDto);

    return this.findOne(id);
  }

  async remove(id: number) {
    const document = await this.findOne(id);

    await this.documentsRepository.remove(document);

    return {
      message: 'Document deleted successfully',
    };
  }
}
