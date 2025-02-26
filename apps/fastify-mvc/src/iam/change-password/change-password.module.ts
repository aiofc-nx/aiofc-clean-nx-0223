import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BcryptService } from '../../common/hashing/bcrypt.service';
import { HashingService } from '../../common/hashing/hashing.service';
import { MailerModule } from '../../common/mailer/mailer.module';
import { Users } from '../../users/models/users.model';
import { provideUsersRepository } from '../../users/repositories/users.repository.provider';
import { UsersService } from '../../users/users.service';
import jwtConfig from '../login/config/jwt.config';
import { AccessTokenGuard } from '../login/guards/access-token/access-token.guard';
import { AuthenticationGuard } from '../login/guards/authentication/authentication.guard';

import { ChangePasswordController } from './change-password.controller';
import { ChangePasswordService } from './change-password.service';

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    TypeOrmModule.forFeature([Users]),
    MailerModule,
  ],
  controllers: [ChangePasswordController],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    AccessTokenGuard,
    ChangePasswordService,
    UsersService,
    JwtService,
    ...provideUsersRepository(),
  ],
})
export class ChangePasswordModule {}
