import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EvidenceModule } from './evidence/evidence.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [EvidenceModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
