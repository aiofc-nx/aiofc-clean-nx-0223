import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BcryptService } from '../../../common/hashing/bcrypt.service';
import { HashingService } from '../../../common/hashing/hashing.service';
import { MailerModule } from '../../../common/mailer/mailer.module';
import { UtilsModule } from '../../../common/utils/utils.module';
import { Users } from '../../users/models/users.model';
import { provideUsersRepository } from '../../users/repositories/users.repository.provider';
import { UsersService } from '../../users/users.service';

import { ForgotPasswordController } from './forgot-password.controller';
import { ForgotPasswordService } from './forgot-password.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), MailerModule, UtilsModule],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    ForgotPasswordService,
    UsersService,
    ...provideUsersRepository(),
  ],
  controllers: [ForgotPasswordController],
})
export class ForgotPasswordModule {}
