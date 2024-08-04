import { UUID } from 'crypto';

export class User {
  id: UUID;
  name: string;
  birthDate: Date;
  email: string;
  phone: string;
}
