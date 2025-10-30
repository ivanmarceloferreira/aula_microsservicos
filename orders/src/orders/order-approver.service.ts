import { Injectable, OnModuleInit } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';
import { OrdersService } from './orders.service';

@Injectable()
export class OrderApproverService implements OnModuleInit {

    constructor(private redisService: RedisService,
                private ordersService: OrdersService
    ) {
    }

    async onModuleInit() {
        const sub = this.redisService.getSubscriber2();
        await sub.subscribe('order_processed', (err, count) => {
            if (err) {
                console.error('Failed to subscribe: ', err);
            } else {
                console.log(`Subscribed successfully! This client is currently subscribed to ${count} channels.`);
            }
        });

        sub.on('message', async (channel, message) => {
            console.log(`Received message from channel ${channel}: ${message}`);
            let order: any = JSON.parse(message);
            console.log('Approving order:', order);
            let existing = await this.ordersService.get(order.orderId);
            // AQUI VAI A REGRA DE NEGÓCIO DE VOCES
            if (existing) {
                existing.status = 'approved';
                await this.ordersService.update(existing);
                console.log(`Order ${order.orderId} status updated to approved`);
            }
            
        });


    }

}
