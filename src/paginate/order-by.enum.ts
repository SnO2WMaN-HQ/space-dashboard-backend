/* eslint-disable @shopify/typescript/prefer-pascal-case-enums */

import {registerEnumType} from '@nestjs/graphql';

export enum OrderBy {
  ASC = 'asc',
  DESC = 'desc',
}
registerEnumType(OrderBy, {name: 'OrderBy'});
