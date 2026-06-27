import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ContactService } from './contact.service';
import { Contact } from './entities/contact.entity';

describe('ContactService', () => {
  let service: ContactService;

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

    service = module.get<ContactService>(ContactService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
