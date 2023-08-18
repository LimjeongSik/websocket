/* eslint-disable @typescript-eslint/no-unused-vars */
import { Logger } from '@nestjs/common';
import {
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    namespace: 'ticketing',
    cors: {
        origin: '*',
    },
})
export class TicketingGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    constructor() {}

    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('TicketingGateway');
    private seats = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 1, 1, 0, 1, 1, 1, 1, 1],
        [0, 0, 0, 1, 0, 1, 1, 0, 1, 1],
        [0, 1, 0, 1, 0, 1, 1, 0, 1, 1],
        [0, 1, 0, 1, 0, 1, 1, 0, 1, 1],
        [0, 1, 0, 1, 0, 1, 1, 0, 1, 1],
    ];

    @SubscribeMessage('ticketing')
    handleEvent(@MessageBody() data: any): void {
        // this.server.emit('message', data);
    }

    @SubscribeMessage('reserve')
    handleReserveEvent(@MessageBody() data: any): void {
        const { row, col } = data;
        const success = this.reserveSeat(row, col);
        console.log(success);
        if (success) {
            this.server.emit('seat', this.seats);
        }
    }

    afterInit(server: Server) {
        this.logger.log('Initialized!');
    }

    handleConnection(client: Socket, data: any) {
        this.logger.log(`Client connected: ${client.id}`);
        client.emit('seat', this.seats);
    }

    handleDisconnect(client: Socket, ...args: any[]) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    reserveSeat(row: number, col: number) {
        if (this.seats[row][col] === 1) {
            this.seats[row][col] = 0;
            return true;
        }
        return false;
    }
}
