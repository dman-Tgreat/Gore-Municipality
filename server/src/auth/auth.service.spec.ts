import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { AdminService } from '../admin/admin.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Admin } from '../admin/entities/admin.entity';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;

  const mockAdminService = {
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockAdmin = {
    id: 1,
    fullName: 'Admin User',
    email: 'admin@gore.gov.et',
    password: '$2b$10$hashedpassword',
    isActive: true,
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-01-15'),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: AdminService, useValue: mockAdminService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: getRepositoryToken(Admin), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    const loginDto = { email: 'admin@gore.gov.et', password: 'password123' };

    it('should return access token on successful login', async () => {
      mockAdminService.findByEmail.mockResolvedValue(mockAdmin);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('jwt-token');

      const result = await service.login(loginDto);

      expect(mockAdminService.findByEmail).toHaveBeenCalledWith('admin@gore.gov.et');
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', mockAdmin.password);
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: 1,
        email: 'admin@gore.gov.et',
        fullName: 'Admin User',
      });
      expect(result).toEqual({
        success: true,
        message: 'Login successful',
        accessToken: 'jwt-token',
      });
    });

    it('should throw UnauthorizedException when admin not found', async () => {
      mockAdminService.findByEmail.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      await expect(service.login(loginDto)).rejects.toThrow('Invalid email or password,');
    });

    it('should throw UnauthorizedException when account is disabled', async () => {
      mockAdminService.findByEmail.mockResolvedValue({ ...mockAdmin, isActive: false });

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      await expect(service.login(loginDto)).rejects.toThrow('Account is disabled');
    });

    it('should throw UnauthorizedException when password is wrong', async () => {
      mockAdminService.findByEmail.mockResolvedValue(mockAdmin);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      await expect(service.login(loginDto)).rejects.toThrow('Invalid email or password');
    });
  });
});
