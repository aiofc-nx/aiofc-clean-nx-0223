import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BcryptService } from '../../common/hashing/bcrypt.service';
import { HashingService } from '../../common/hashing/hashing.service';
import { Users } from '../../users/models/users.model';
import { provideUsersRepository } from '../../users/repositories/users.repository.provider';
import { UsersService } from '../../users/users.service';

import jwtConfig from './config/jwt.config';
import { AccessTokenGuard } from './guards/access-token/access-token.guard';
import { AuthenticationGuard } from './guards/authentication/authentication.guard';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
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
    LoginService,
    UsersService,
    ...provideUsersRepository(),
  ],
  controllers: [LoginController],
})
export class LoginModule {}
