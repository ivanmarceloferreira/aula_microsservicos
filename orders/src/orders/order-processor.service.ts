import { Injectable, OnModuleInit } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';
import { OrdersService } from './orders.service';
import { Order } from './order.entity';

@Injectable()
export class OrderProcessorService implements OnModuleInit {

    constructor(private redisService: RedisService,
                private ordersService: OrdersService
    ) {
    }

    async onModuleInit() {
        const sub = this.redisService.getSubscriber();
        await sub.subscribe('order_created', (err, count) => {
            if (err) {
                console.error('Failed to subscribe: ', err);
            } else {
                console.log(`Subscribed successfully! This client is currently subscribed to ${count} channels.`);
            }
        });

        sub.on('message', async (channel, message) => {
            console.log(`Received message from channel ${channel}: ${message}`);
            let order: any = JSON.parse(message);
            console.log('Processing order:', order);
            let existing = await this.ordersService.get(order.orderId);
            
            if (existing) {
                existing.status = 'processing';
                await this.ordersService.update(existing);
                console.log(`Order ${order.orderId} status updated to processing`);
            }

        });

    }

}
