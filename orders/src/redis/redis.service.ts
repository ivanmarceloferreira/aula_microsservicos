import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import IORedis, { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {

    private pub: Redis;
    private sub: Redis;

    constructor(cfg: ConfigService) {
        const host = cfg.get('REDIS_HOST', 'localhost');
        const port = parseInt(cfg.get('REDIS_PORT', '6379'));

        // this.client = new IORedis({ host, port });
        this.pub = new IORedis({ host, port });
        this.sub = new IORedis({ host, port });
    }

    async onModuleDestroy() {
        await this.pub.quit();
        await this.sub.quit();
    }

    getPublisher() {
        return this.pub;
    }

    getSubscriber() {
        return this.sub;
    }

}
