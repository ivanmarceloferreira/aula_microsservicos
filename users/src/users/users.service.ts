import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './User.model';

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private repo: Repository<User>) {}

    findAll() {
        return this.repo.find();
    }

    create(name: string, email: string, password: string) {
        const user = this.repo.create({ name, email, password });
        return this.repo.save(user);
    }

    async findOne(id: number) {
        console.log('Finding user by id:', id);
        const user = await this.repo.findOne({ where: { id } });

        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

}
