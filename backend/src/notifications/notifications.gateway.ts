import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  
  @WebSocketGateway({ cors: true })
  export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    handleConnection(client: Socket) {
      console.log(`🟢 Client connected: ${client.id}`);
    }
  
    handleDisconnect(client: Socket) {
      console.log(`🔴 Client disconnected: ${client.id}`);
    }
  
    sendIncidentNotification(incident: any) {
      this.server.emit('incidentCreated', incident);
    }
  }
  