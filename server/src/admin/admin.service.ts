import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Admin } from './entities/admin.entity';

@Injectable()
export class AdminService {

  constructor(
    @InjectRepository(Admin)
    private userRepository: Repository<Admin>,
  ) {}

  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async create(userData: Partial<Admin>) {
    const user = this.userRepository.create(userData);

    return this.userRepository.save(user);
  }
}