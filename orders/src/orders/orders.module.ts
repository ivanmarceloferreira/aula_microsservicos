import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from './order.entity';
import { HttpModule } from 'src/http/http.module';
import { HttpService } from 'src/http/http.service';
import { RedisModule } from 'src/redis/redis.module';
import { RedisService } from 'src/redis/redis.service';
import { OrderProcessorService } from './order-processor.service';
import { OrderApproverService } from './order-approver.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), HttpModule, RedisModule],
  controllers: [OrdersController],
  providers: [OrdersService, HttpService, RedisService, OrderProcessorService, OrderApproverService],
})
export class OrdersModule {}
