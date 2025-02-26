import { Injectable, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { Repository } from 'typeorm';

import { HashingService } from '../../common/hashing/hashing.service';
import { DataSource } from '../../constants';
import { Users } from '../models/users.model';

import { UsersTypeOrmRepository } from './implementations/users.typeorm.repository';
import { USERS_REPOSITORY_TOKEN } from './users.repository.interface';

config();

export const configService = new ConfigService();

export function provideUsersRepository(): Provider[] {
  return [
    {
      provide: USERS_REPOSITORY_TOKEN,
      useFactory: async (dependenciesProvider: UsersRepoDependenciesProvider) =>
        provideUsersRepositoryFactory(dependenciesProvider),
      inject: [UsersRepoDependenciesProvider],
    },
    UsersRepoDependenciesProvider,
  ];
}

async function provideUsersRepositoryFactory(
  dependenciesProvider: UsersRepoDependenciesProvider
) {
  await ConfigModule.envVariablesLoaded;

  switch (configService.get('USERS_DATASOURCE')) {
    case DataSource.TYPEORM:
      return new UsersTypeOrmRepository(
        dependenciesProvider.typeOrmRepository,
        dependenciesProvider.hashingService
      );
  }
}

@Injectable()
export class UsersRepoDependenciesProvider {
  constructor(
    @InjectRepository(Users)
    public typeOrmRepository: Repository<Users>,
    public hashingService: HashingService
  ) {}
}
