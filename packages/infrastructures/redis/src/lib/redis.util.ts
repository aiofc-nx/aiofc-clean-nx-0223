import { IRedisConfig } from '@aiofc/config';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis, Cluster } from 'ioredis';

@Injectable()
export class RedisUtility {
  private _instance: Redis | Cluster;
  private initializing: Promise<Redis | Cluster> | null = null;

  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService
  ) {}

  private async createInstance(): Promise<Redis | Cluster> {
    const config = this.configService.get<IRedisConfig>('redis');

    if (config?.mode === 'cluster') {
      // 集群模式
      this._instance = new Redis.Cluster(
        config.cluster.map((node) => ({
          host: node.host,
          port: node.port,
          password: node.password,
        })),
        {
          redisOptions: {
            password: config.cluster[0].password,
            db: config.standalone.db,
          },
        }
      );
    } else {
      // 单机模式
      this._instance = new Redis({
        host: config?.standalone?.host,
        port: config?.standalone?.port,
        password: config?.standalone?.password,
        db: config?.standalone?.db,
      });
    }
    return this._instance;
  }

  public async getClient(): Promise<Redis | Cluster> {
    if (!this._instance) {
      if (!this.initializing) {
        this.initializing = this.createInstance();
      }
      this._instance = await this.initializing;
      this.initializing = null;
    }
    return this._instance;
  }
}
