import { connect, Socket } from 'socket.io-client';

import { WebSocket as WebSocketType } from 'common-types';
export async function getSocket() {
  const socket = connect({
    host: 'ws://localhost',
  });

  return socket;
}

export async function acceptEvent(
  socket: SocketIOClient.Socket,
  payload: WebSocketType.User.AcceptEventAction['payload']
) {
  const action: WebSocketType.User.AcceptEventAction = {
    type: 'accept-event',
    payload,
  };

  socket.send(action);
}
