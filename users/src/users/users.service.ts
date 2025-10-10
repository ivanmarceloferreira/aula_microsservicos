import { Injectable } from '@nestjs/common';
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

    findOne(id: number) {
        return this.repo.findOneBy({ id });
    }

}
