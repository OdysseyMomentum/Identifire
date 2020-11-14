import { WS_URL } from '@env';

import { connect, Socket } from 'socket.io-client';

import { WebSocket as WebSocketType } from 'common-types';
export async function getSocket() {
  const socket = connect({
    host: WS_URL,
  });

  return socket;
}

export async function acceptEvent(
  socket: SocketIOClient.Socket,
  payload: WebSocketType.AcceptEvent['payload']
) {
  const action: WebSocketType.AcceptEvent = {
    type: 'mobile->server/accept-event',
    payload,
  };

  socket.send(action);
}

export async function updateLocation(
  socket: SocketIOClient.Socket,
  payload: WebSocketType.UpdateLocation['payload']
) {
  const action: WebSocketType.UpdateLocation = {
    type: 'server->dispatch/participant-location-update',
    payload,
  };

  socket.send(action);
}

export async function sendChat(
  socket: SocketIOClient.Socket,
  payload: WebSocketType.Chat['payload']
) {
  const action: WebSocketType.Chat = {
    type: 'mobile<->dispatch/chat',
    payload,
  };

  socket.send(action);
}
