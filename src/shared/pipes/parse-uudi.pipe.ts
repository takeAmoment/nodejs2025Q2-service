import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ErorrMessagesEnum } from 'src/constants';
import { validate as isUUID } from 'uuid';

@Injectable()
export class ParseUUDIPipe implements PipeTransform {
  transform(value: string) {
    if (!isUUID(value)) {
      throw new BadRequestException(ErorrMessagesEnum.INCORECT_UUDI_FORMAT);
    }

    return value;
  }
}
