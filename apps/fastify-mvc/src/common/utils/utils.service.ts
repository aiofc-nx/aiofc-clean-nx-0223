import * as crypto from 'crypto';

import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {
  public generatePassword(): string {
    return crypto.randomUUID();
  }
}
