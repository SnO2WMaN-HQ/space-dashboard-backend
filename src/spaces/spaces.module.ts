import {Module} from '@nestjs/common';
import {PrismaModule} from '../prisma/prisma.module';
import {SpacesResolver} from './spaces.resolver';
import {SpacesService} from './spaces.service';

@Module({
  imports: [PrismaModule],
  providers: [SpacesService, SpacesResolver],
  exports: [SpacesService],
})
export class SpacesModule {}
