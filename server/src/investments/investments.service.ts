import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Investment } from './entities/investment.entity';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { UpdateInvestmentDto } from './dto/update-investment.dto';
import { Admin } from '../admin/entities/admin.entity';

@Injectable()
export class InvestmentsService {
  constructor(
    @InjectRepository(Investment)
    private readonly investmentRepository: Repository<Investment>,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async create(createInvestmentDto: CreateInvestmentDto, adminId: number) {
    const admin = await this.adminRepository.findOne({ where: { id: adminId } });
    if (!admin) throw new NotFoundException('Admin not found');

    const investment = this.investmentRepository.create({
      ...createInvestmentDto,
      createdBy: admin,
    });

    return await this.investmentRepository.save(investment);
  }

  async findAll() {
    return await this.investmentRepository.find({
      relations: { createdBy: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const investment = await this.investmentRepository.findOne({
      where: { id },
      relations: { createdBy: true },
    });

    if (!investment) throw new NotFoundException('Investment not found');
    return investment;
  }

  async update(id: number, updateInvestmentDto: UpdateInvestmentDto) {
    await this.investmentRepository.update(id, updateInvestmentDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const investment = await this.findOne(id);
    await this.investmentRepository.remove(investment);
    return { message: 'Investment deleted successfully' };
  }
}
