import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    example: 'BAD_REQUEST',
    description: 'Error code for programmatic handling',
  })
  errorCode: string;

  @ApiProperty({
    example: 'Invalid input data',
    description: 'Human-readable error message',
  })
  message: string;

  @ApiProperty({
    example: 400,
    description: 'HTTP status code',
  })
  statusCode: number;

  @ApiProperty({
    example: '/api/users',
    description: 'Path where the error occurred',
  })
  path: string;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Timestamp when the error occurred',
  })
  timestamp: string;

  @ApiProperty({
    example: { field: 'email', message: 'Invalid email format' },
    description: 'Additional error details',
    required: false,
  })
  details?: any;
}
