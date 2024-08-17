import { ResponseAddressDto } from '../dto/response-address.dto';
import { Address } from '../entities/address.entity';

export class AddressesMapper {
  static mapToDto(address: Address): ResponseAddressDto {
    return { ...address } as unknown as ResponseAddressDto;
  }

  static mapToEntity(address: ResponseAddressDto): Address {
    return { ...address } as unknown as Address;
  }
}
