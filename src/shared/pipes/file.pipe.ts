import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class FilePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const kilobytes: number = 1000;

    return value.size < 10 * kilobytes;
  }
}
