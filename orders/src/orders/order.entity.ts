import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Order {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column( { nullable: true } )
  userId: number;

  @Column({ default: 'new' })
  status: string;

  @Column({ type: 'jsonb' })
  items: any; // simplificado: array de itens

}
