import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundError, ConflictError, InternalServerError } from '../common/errors/custom-errors';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      this.logger.debug(`Creating user with data: ${JSON.stringify(createUserDto)}`);
      
      // Check if user with email already exists
      const existingUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });
      
      if (existingUser) {
        this.logger.warn(`User with email ${createUserDto.email} already exists`);
        throw new ConflictError('User with this email already exists', {
          field: 'email',
          value: createUserDto.email,
        });
      }
      
      const user = this.usersRepository.create(createUserDto);
      const savedUser = await this.usersRepository.save(user);
      this.logger.debug(`User saved successfully: ${savedUser.id}`);
      return savedUser;
    } catch (error) {
      if (error instanceof ConflictError) {
        throw error;
      }
      this.logger.error(`Error creating user: ${error.message}`, error.stack);
      throw new InternalServerError('Failed to create user');
    }
  }

  async findAll(): Promise<User[]> {
    try {
      this.logger.debug('Fetching all users from database');
      const users = await this.usersRepository.find();
      this.logger.debug(`Found ${users.length} users`);
      return users;
    } catch (error) {
      this.logger.error(`Error fetching users: ${error.message}`, error.stack);
      throw new InternalServerError('Failed to fetch users');
    }
  }

  async findOne(id: number): Promise<User> {
    try {
      this.logger.debug(`Fetching user with ID: ${id}`);
      const user = await this.usersRepository.findOne({ where: { id } });
      if (!user) {
        this.logger.warn(`User with ID ${id} not found`);
        throw new NotFoundError(`User with ID ${id} not found`, { userId: id });
      }
      this.logger.debug(`User found: ${user.email}`);
      return user;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      this.logger.error(`Error fetching user: ${error.message}`, error.stack);
      throw new InternalServerError('Failed to fetch user');
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      this.logger.debug(`Updating user ${id} with data: ${JSON.stringify(updateUserDto)}`);
      const user = await this.findOne(id);
      
      // Check if email is being updated and if it conflicts with existing user
      if (updateUserDto.email && updateUserDto.email !== user.email) {
        const existingUser = await this.usersRepository.findOne({
          where: { email: updateUserDto.email },
        });
        
        if (existingUser) {
          this.logger.warn(`Email ${updateUserDto.email} already in use`);
          throw new ConflictError('Email already in use', {
            field: 'email',
            value: updateUserDto.email,
          });
        }
      }
      
      Object.assign(user, updateUserDto);
      const updatedUser = await this.usersRepository.save(user);
      this.logger.debug(`User updated successfully: ${updatedUser.id}`);
      return updatedUser;
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ConflictError) {
        throw error;
      }
      this.logger.error(`Error updating user: ${error.message}`, error.stack);
      throw new InternalServerError('Failed to update user');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      this.logger.debug(`Deleting user with ID: ${id}`);
      const user = await this.findOne(id);
      await this.usersRepository.remove(user);
      this.logger.debug(`User deleted successfully: ${id}`);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      this.logger.error(`Error deleting user: ${error.message}`, error.stack);
      throw new InternalServerError('Failed to delete user');
    }
  }
}