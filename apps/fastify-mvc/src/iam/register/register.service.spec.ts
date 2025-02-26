import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { HashingService } from '../../common/hashing/hashing.service';
import { MailerService } from '../../common/mailer/mailer.service';
import { Users } from '../../users/models/users.model';
import { UsersService } from '../../users/users.service';

import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterService } from './register.service';

const registerUserDto: RegisterUserDto = {
  name: 'name #1',
  username: 'username #1',
  email: 'test@example.com',
  password: 'password123',
};

describe('RegisterService', () => {
  let service: RegisterService;
  let repository: Repository<Users>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterService,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn().mockResolvedValue(registerUserDto),
          },
        },
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('some string'),
          },
        },
        {
          provide: HashingService,
          useValue: {
            hash: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Users),
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RegisterService>(RegisterService);
    repository = module.get<Repository<Users>>(getRepositoryToken(Users));
  });

  describe('Create user', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
      expect(repository).toBeDefined();
    });

    it('should create a user during registration', async () => {
      expect(
        await service.register({
          name: 'name #1',
          username: 'username #1',
          email: 'test@example.com',
          password: 'password123',
        })
      ).toEqual(registerUserDto);
    });
  });
});
