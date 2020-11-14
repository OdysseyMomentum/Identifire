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
