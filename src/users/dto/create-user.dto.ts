import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsNumber } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'The email of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 30,
    description: 'The age of the user',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  age?: number;
}
