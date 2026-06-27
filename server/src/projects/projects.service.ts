import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Admin } from '../admin/entities/admin.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,

    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async create(
    createProjectDto: CreateProjectDto,
    adminId: number,
  ) {
    const admin = await this.adminRepository.findOne({
      where: { id: adminId },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    const project = this.projectsRepository.create({
      ...createProjectDto,
      createdBy: admin,
    });

    return await this.projectsRepository.save(project);
  }

  async findAll() {
    return await this.projectsRepository.find({
      relations: {
        createdBy: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: {
        createdBy: true,
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    await this.projectsRepository.update(id, updateProjectDto);

    return this.findOne(id);
  }

  async remove(id: number) {
    const project = await this.findOne(id);

    await this.projectsRepository.remove(project);

    return {
      message: 'Project deleted successfully',
    };
  }
}
