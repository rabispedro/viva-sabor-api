import { UUID } from 'crypto';

export class UserResponseDto {
  id: UUID;
  firstName: string;
  lastName: string;
  roles: string[];
  birthDate: Date;
  email: string;
  phone: string;
  image_url?: string;
  isActive: boolean;
}
