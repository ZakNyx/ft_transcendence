import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';

import { MessageService } from './message.service';
import { Socket, Server } from 'socket.io';
import { messageDTO } from '../dto/chatDto';
import { dmDTO } from '../dto/chatDto';
import { roomDTO } from '../dto/chatDto';
import { roomInviteDTO } from '../dto/chatDto';
import { actionDTO } from '../dto/chatDto';
import { friendRequestDTO } from '../dto/chatDto';
import { roomJoinDTO } from '../dto/chatDto';
import { AuthGuard } from '@nestjs/passport';
import { UseFilters, UseGuards } from '@nestjs/common';
import { AllExceptionFilter } from '../http/exception.filter';
import { JwtService } from '@nestjs/jwt';

@UseFilters(new AllExceptionFilter())
@WebSocketGateway({
  namespace: "Chat",
  cors: {
    origin: '*',
  },
})
export class MessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private messageService: MessageService, private jwtservice: JwtService) {}

  @WebSocketServer() server: Server;
  private mapy = new Map<string, Socket>();

  @SubscribeMessage('createDm')
  async handleAddDm(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: dmDTO,
  ) {
    this.messageService.createDm(client, payload, this.mapy);
  }

  @SubscribeMessage('createRoom')
  async handleAddRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: roomDTO,
  ) {
    this.messageService.createRoom(client, this.server, payload, this.mapy);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() payload: messageDTO,
  ) {
    this.messageService.createMessage(payload, this.server);
  }

  // @SubscribeMessage('roomInvite')
  // async handleRoomInvite(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() payload: roomInviteDTO,
  // ) {
  //   this.messageService.sendRoomInvite(client, this.server, payload, this.mapy);
  // }

  // @SubscribeMessage('roomInviteAccepted')
  // async handleRoomInviteApproval(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() payload: roomInviteDTO,
  // ) {
  //   this.messageService.roomInviteApproval(client, this.server, payload, this.mapy);
  // }

  // @SubscribeMessage('roomInviteRejected')
  // async handleRoomInviteRejection(
  //   @MessageBody() payload: roomInviteDTO,
  // ) {
  //   this.messageService.roomInviteRejection(payload, this.mapy);
  // }

  // @SubscribeMessage('notifClicked')
  // async handleNotifClicked(
  //   @MessageBody() payload: roomInviteDTO,
  // ) {
  //   this.messageService.notifClicked(payload);
  // }

  @SubscribeMessage('promote')
  async handlePromotion(
    @MessageBody() payload: actionDTO,
  ) {
    this.messageService.promoteUser(this.server, payload, this.mapy);
  }

  @SubscribeMessage('demote')
  async handleDemotion(
    @MessageBody() payload: actionDTO,
  ) {
    this.messageService.demoteUser(this.server, payload, this.mapy);
  }

  @SubscribeMessage('mute')
  async handleMute(
    @MessageBody() payload: actionDTO,
  ) {
    this.messageService.muteUser(this.server, payload, this.mapy);
  }

  @SubscribeMessage('unmute')
  async handleUnmute(
    @MessageBody() payload: actionDTO,
  ) {
    this.messageService.unmuteUser(this.server, payload, this.mapy);
  }

  @SubscribeMessage('kick')
  async handleKick(
    @MessageBody() payload: actionDTO,
  ) {
    this.messageService.kickUser(this.server, payload, this.mapy);
  }

  @SubscribeMessage('ban')
  async handleBan(
    @MessageBody() payload: actionDTO,
  ) {
    this.messageService.banUser(this.server, payload, this.mapy);
  }

  @SubscribeMessage('unban')
  async handleUnban(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: actionDTO,
  ) {
    this.messageService.unbanUser(client, this.server, payload, this.mapy);
  }

  @SubscribeMessage('transferOwnership')
  async handleOwnershipTransfer(
    @MessageBody() payload: actionDTO,
  ) {
    this.messageService.OwnershipTransfer(this.server, payload, this.mapy);
  }

  @SubscribeMessage('changePassword')
  async handleRoomPasswordChange(
    @MessageBody() info: [number, string],
  ) {
    this.messageService.changePassword(info);
  }

  @SubscribeMessage('blockUser')
  async handleUserBlock(
    @ConnectedSocket() client: Socket,
    @MessageBody() blockedUserId: string,
  ) {
    this.messageService.blockUser(client, blockedUserId, this.mapy);
  }

  @SubscribeMessage('unblockUser')
  async handleUserUnblock(
    @ConnectedSocket() client: Socket,
    @MessageBody() unblockedUserId: string,
  ) {
    this.messageService.unblockUser(client, unblockedUserId, this.mapy);
  }

  // @SubscribeMessage('sendFriendRequest')
  // async handleFriendRequest(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() befriendedUserId: number,
  // ) {
  //   this.messageService.sendFriendRequest(client, befriendedUserId, this.mapy);
  // }

  // @SubscribeMessage('acceptFriendRequest')
  // async handleFriendRequestApproval(
  //   @MessageBody() payload: friendRequestDTO,
  // ) {
  //   this.messageService.friendRequestApproval(payload, this.mapy);
  // }

  // @SubscribeMessage('rejectFriendRequest')
  // async handleFriendRequestRejection(
  //   @MessageBody() payload: friendRequestDTO,
  // ) {
  //   this.messageService.friendRequestRejection(payload, this.mapy);
  // }

  // begin
  // @SubscribeMessage('friendRequest')
  // async handleFriendNotif(@ConnectedSocket() client: Socket, @MessageBody() body: any,)
  // {
  //   const clientId = this.validateToken(client.handshake.auth.token);
  //   this.messageService.friendRequest(clientId.sub, this.server ,body, this.mapy, client);
  // }

  // @SubscribeMessage('acceptedFriendInvite')
  // async handleFriendNotifAccept(@ConnectedSocket() client: Socket, @MessageBody() body: any,)
  // {
  //   const clientId = this.validateToken(client.handshake.auth.token);
  //   this.messageService.friendRequestAccept(clientId.sub, this.server ,body, this.mapy, client);
  // }

  // @SubscribeMessage('declinedFriendInvite')
  // async handleFriendNotifDecline(@ConnectedSocket() client: Socket, @MessageBody() body: any,)
  // {
  //   const clientId = this.validateToken(client.handshake.auth.token);
  //   this.messageService.friendRequestDecline(clientId.sub, this.server ,body, this.mapy, client);
  // }

  // end


  @SubscribeMessage('joinRoom')
  async handleRoomJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: roomJoinDTO,
  ) {
    this.messageService.roomJoin(this.server, client, payload);
  }

  @SubscribeMessage('leaveRoom')
  async handleRoomExit(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: number,
  ) {
    this.messageService.roomExit(client, this.server, roomId, this.mapy);
  }

  afterInit(server: Server) {
    //console.log(server);
    //Do stuffs
  }

  handleDisconnect(client: Socket) {
    for (let entry of this.mapy.entries()) {
      console.log('Chat socket disconnected11!');
      if (entry[1] == client) this.mapy.delete(entry[0]);
    }
  }

  validateToken(token : string) {
    try {
      const payload = this.jwtservice.decode(token);
      if (!payload)
        return null;
      return payload;
    }
    catch (err) {
      console.error('Chat Error : ', err);
    }

  }

  async handleConnection(client: Socket) {
    console.log(`client  connected in Chat gateway: ${client.id}`);
    const userId = this.validateToken(client.handshake.headers.authorization.slice(7));

    if (!userId) {
      console.log('Chat socket disconnected!');
      client.disconnect();
      return ;
    }

    if (this.mapy.has(userId["username"]))
      this.mapy.set(userId["username"], client);
    else
      this.mapy.set(userId["username"], client);

    await this.messageService.fetchState(client, userId["username"]);
  }
}
