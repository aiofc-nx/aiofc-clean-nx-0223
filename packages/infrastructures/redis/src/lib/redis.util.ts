import { RedisConfig } from '@aiofc/config';
import { Redis, Cluster } from 'ioredis';

/**
 * Redis 工具类，提供 Redis 客户端实例的获取和管理。
 * 该类使用单例模式，确保在应用程序中只有一个 Redis 客户端实例。
 * 支持 Redis 单节点和集群模式。
 */
export class RedisUtility {
  /**
   * 获取 Redis 客户端实例。
   * 如果实例尚未创建，则会初始化一个新的实例。
   * @returns {Promise<Redis | Cluster>} 返回 Redis 或 Cluster 实例的 Promise。
   * @throws {Error} 如果实例化过程中发生错误，将抛出错误。
   */
  static get instance(): Redis | Cluster {
    return this._instance;
  }

  private static _instance: Redis | Cluster;
  private static initializing: Promise<Redis | Cluster> | null = null;

  /**
   * 创建 Redis 实例。
   * 根据配置的模式（单节点或集群）初始化 Redis 客户端实例。
   *
   * @returns {Promise<Redis | Cluster>} 返回一个 Promise，解析为 Redis 或 Cluster 实例。
   * @throws {Error} 如果在创建实例过程中发生错误，将抛出错误。
   *
   * @remarks
   * - 如果配置模式为 'cluster'，则使用 Redis.Cluster 创建集群实例。
   * - 如果配置模式为 'standalone'，则使用 Redis 创建单节点实例。
   * - 该方法会并行获取 Redis 配置，确保在创建实例时使用最新的配置。
   */
  private static async createInstance(): Promise<Redis | Cluster> {
    const [config] = await Promise.all([RedisConfig()]);
    if (config.mode === 'cluster') {
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
      this._instance = new Redis({
        host: config.standalone.host,
        port: config.standalone.port,
        password: config.standalone.password,
        db: config.standalone.db,
      });
    }
    return this._instance;
  }

  /**
   * 获取 Redis 客户端实例。
   * 如果实例尚未创建，则会初始化一个新的实例。
   * @returns {Promise<Redis | Cluster>} 返回 Redis 或 Cluster 实例的 Promise。
   * @throws {Error} 如果实例化过程中发生错误，将抛出错误。
   * @remarks
   * 该方法会返回一个 Redis 或 Cluster 实例的 Promise。
   * Redis Cluster 是一种强大的分布式解决方案，适用于需要高可用性和可扩展性的应用程序。
   * 通过合理配置和使用，您可以充分利用 Redis Cluster 的优势。
   */
  public static async client(): Promise<Redis | Cluster> {
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
