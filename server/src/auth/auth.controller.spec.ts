import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AdminService } from '../admin/admin.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Admin } from '../admin/entities/admin.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAdminService = { findByEmail: jest.fn() };
  const mockJwtService = { signAsync: jest.fn() };
  const mockRepository = { create: jest.fn(), save: jest.fn(), find: jest.fn(), findOne: jest.fn(), update: jest.fn(), remove: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        { provide: AdminService, useValue: mockAdminService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: getRepositoryToken(Admin), useValue: mockRepository },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call authService.login and return the result', async () => {
      const loginDto = { email: 'admin@gore.gov.et', password: 'password123' };
      const expected = { success: true, message: 'Login successful', accessToken: 'token' };
      jest.spyOn(service, 'login').mockResolvedValue(expected as any);

      const result = await controller.login(loginDto);

      expect(service.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(expected);
    });
  });
});
