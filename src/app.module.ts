import { Module } from '@nestjs/common';
import { TicketingModule } from './ticketing/ticketing.module';

@Module({
    imports: [TicketingModule],
})
export class AppModule {}
