import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { HttpService } from 'src/http/http.service';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private repo: Repository<Order>,
      private http: HttpService,
      private redis: RedisService
    ) {}

  async create(dto: CreateOrderDto) {
    // Aqui você poderia validar se o userId existe na API de usuários
    let user: any = await this.getUserCached(dto);
    console.log('User data from users service:', user);

    if (!user && !user.data) {
      throw new NotFoundException('User not found');
    }

    const order = this.repo.create({ userId: dto.userId, items: dto.items, status: 'new' });
    const saved = await this.repo.save(order);

    await this.redis.getPublisher().publish('order_created', JSON.stringify({
      orderId: saved.id,
      userId: dto.userId
    }));
    console.log('Published order_created event to Redis');

    return saved;
  }

  private async getUserCached(dto: CreateOrderDto) {
    const cacheKey = `user:${dto.userId}`;
    const cachedUser = await this.redis.getClient().get(cacheKey);
    if (cachedUser) {
      console.log('User data retrieved from cache');
      return JSON.parse(cachedUser);
    }
    
    const { data } = await this.http.instance.get(`/users/${dto.userId}`).catch(() => {
      throw new NotFoundException('User not found');
    });
    console.log('User data retrieved from users service, caching it now');
    await this.redis.getClient().set(cacheKey, JSON.stringify(data), 'EX', 60);

    return data;
  }

  list() {
    return this.repo.find();
  }

  get(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  update(order: Order) {
    return this.repo.save(order);
  }

}
