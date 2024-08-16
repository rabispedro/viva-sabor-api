import { ResponseAddressDto } from '../dto/response-address.dto';
import { Address } from '../entities/address.entity';

export class AddressesMapper {
  static map(address: Address): ResponseAddressDto {
    return { ...address };
  }
}
