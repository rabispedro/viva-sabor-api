import { UUID } from 'crypto';

export class UserResponseDto {
  id: UUID;
  name: string;
  birthDate: Date;
  email: string;
  phone: string;
}
