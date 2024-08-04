import { Reflector } from '@nestjs/core';

export const Cache = Reflector.createDecorator<string[]>();
