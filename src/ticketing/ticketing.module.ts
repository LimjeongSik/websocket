import { Module } from '@nestjs/common';
import { TicketingGateway } from './ticketing.gateway';

@Module({
    providers: [TicketingGateway],
})
export class TicketingModule {}
