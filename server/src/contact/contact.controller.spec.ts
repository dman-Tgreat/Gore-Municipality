import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { Contact } from './entities/contact.entity';

describe('ContactController', () => {
  let controller: ContactController;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockConfigService = {
    getOrThrow: jest.fn((key: string) => {
      if (key === 'RESEND_API_KEY') return 're_test_key';
      if (key === 'RESEND_FROM_EMAIL') return 'test@example.com';
      throw new Error(`Missing config: ${key}`);
    }),
    get: jest.fn((key: string) => {
      if (key === 'CONTACT_NOTIFICATION_EMAIL') return 'admin@example.com';
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactController],
      providers: [
        ContactService,
        {
          provide: getRepositoryToken(Contact),
          useValue: mockRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<ContactController>(ContactController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
