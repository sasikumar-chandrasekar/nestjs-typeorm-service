import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiProperty({ example: 1, description: 'The unique identifier of the user' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  @Column()
  name: string;

  @ApiProperty({ example: 'john@example.com', description: 'The email of the user' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ example: 30, description: 'The age of the user', required: false })
  @Column({ nullable: true })
  age: number;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'The date when the user was created' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'The date when the user was last updated' })
  @UpdateDateColumn()
  updatedAt: Date;
}