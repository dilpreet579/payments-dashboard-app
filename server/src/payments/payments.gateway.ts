import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class PaymentsGateway {
  @WebSocketServer()
  server: Server;

  emitPaymentCreated(payment: any) {
    this.server.emit('paymentCreated', payment);
  }
} 