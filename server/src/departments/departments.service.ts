import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Department } from './entities/department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentsRepository: Repository<Department>,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto) {
    const department = this.departmentsRepository.create(createDepartmentDto);

    return await this.departmentsRepository.save(department);
  }

  async findAll() {
    return await this.departmentsRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const department = await this.departmentsRepository.findOne({
      where: { id },
    });

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    return department;
  }

  async update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    await this.departmentsRepository.update(id, updateDepartmentDto);

    return this.findOne(id);
  }

  async remove(id: number) {
    const department = await this.findOne(id);

    await this.departmentsRepository.remove(department);

    return {
      message: 'Department deleted successfully',
    };
  }
}
