import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString, MaxLength } from 'class-validator';

export class PublishMessageDto {
  @ApiProperty({ example: 'user.created' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  pattern!: string;

  @ApiProperty({
    example: {
      id: 1,
      fullName: 'John Doe',
    },
  })
  @IsObject()
  payload!: Record<string, unknown>;
}
