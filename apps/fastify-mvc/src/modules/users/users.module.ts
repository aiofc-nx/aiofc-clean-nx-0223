import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BcryptService } from '../../common/hashing/bcrypt.service';
import { HashingService } from '../../common/hashing/hashing.service';
import { MailerModule } from '../../common/mailer/mailer.module';

import { Users } from './models/users.model';
import { provideUsersRepository } from './repositories/users.repository.provider';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), MailerModule],
  controllers: [UsersController],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    UsersService,
    ...provideUsersRepository(),
  ],
})
export class UsersModule {}
