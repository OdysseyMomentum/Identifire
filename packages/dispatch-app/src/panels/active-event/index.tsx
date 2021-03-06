import * as React from 'react';
import { v4 } from 'uuid';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { RestAPI, WebSocket } from 'common-types';
import { connect, Socket } from 'socket.io-client';
import { Box, Text, Button, Spinner } from '@chakra-ui/react';
import 'react-chatbox-component/dist/style.css';
import { ChatBox } from 'react-chatbox-component';

import { Panel } from '../../components';
import { useAppContext } from '../../app_context';
import { map } from '../../services/map';

const { useState, useEffect, useRef } = React;

const Banner = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: #f02d3a;
  top: 0;
  left: 0;
  right: 0;
  height: 2rem;
`;

const DISPATCH_USER_CHAT_ID = 'DISPATCH_USER_CHAT_ID';

export const ActiveEvent: React.FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();
  const { api, wsUrl } = useAppContext();
  const history = useHistory();

  const [event, setEvent] = useState<null | RestAPI.Dispatch.GetEventResponse>(
    null
  );

  const [socket, setSocket] = useState<undefined | typeof Socket>();

  interface Message {
    id: string;
    text: string;
    sender: {
      uid: string;
      name: string;
      avatar: string;
    };
  }

  function chatToMessage(chat: WebSocket.Chat): Message {
    return {
      id: v4(),
      text: chat.payload.content,
      sender: {
        name: chat.payload.name,
        avatar:
          chat.payload.avatarUrl ??
          'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png',
        uid: chat.payload.userId
          ? String(chat.payload.userId)
          : DISPATCH_USER_CHAT_ID,
      },
    };
  }

  const [messages, setMessages] = useState<Message[]>([
    {
      id: v4(),
      text: 'Hello, please stand by for instructions.',
      sender: {
        name: 'Dispatch',
        uid: DISPATCH_USER_CHAT_ID,
        avatar:
          'https://image.freepik.com/free-vector/call-center-service-illustration_24877-52388.jpg',
      },
    },
  ]);

  const setupWs = async () => {
    const socket = connect(wsUrl);

    await new Promise((res) => {
      socket.on('connect', res);
    });
    setSocket(socket);
    const subscribeMessage: WebSocket.Action = {
      type: 'dispatch->server/subscribe-to-event',
      payload: { eventId: event.id },
    };
    socket.emit('message', subscribeMessage);

    socket.on('message', (m: WebSocket.Action) => {
      console.log('received message from server', m);
      switch (m.type) {
        case 'server->dispatch/participant-location-update':
          console.log(
            'received server->dispatch/participant-location-update',
            m
          );

          map.updateUserPins(m.payload.users);
          break;
        case 'mobile<->dispatch/chat':
          setMessages((ms) => ms.concat(chatToMessage(m)));
          break;
        default:
      }
    });
  };

  useEffect(() => {
    (async () => {
      console.log('get event by id');
      setEvent(await api.dispatchEvent.get(id));
    })();
  }, [id]);

  useEffect(() => {
    if (event) {
      if (!map.hasCurrentEventPin()) {
        console.log('setting event pin');

        map.setCurrentEventPin({ lat: event.latitude, lon: event.longitude });
      }
      if (!socket || !socket.connected) {
        console.log('setting up ws');
        setupWs();
      }
    }
    return () => {
      if (socket && socket.disconnected) {
        console.log('closing socket');
        socket.close();
      }
    };
  }, [event]);

  useEffect(() => {
    if (socket) {
      // Hack to make the text input display full screen
      document
        .querySelector('.message-input')!
        .setAttribute('style', 'width: 100%');
    }
  }, [socket]);

  return (
    <>
      {event && (
        <Banner>
          <Text fontSize="1.2rem">{event.address}</Text>
        </Banner>
      )}
      <Panel>
        {!event && <Spinner size="lg" />}
        {socket && (
          <>
            <Box marginBottom="1.2rem">
              <Box marginBottom="0.8rem">
                <Text fontSize="1.2rem" fontWeight="500">
                  User(s):{' '}
                  {Array.from(
                    new Set(
                      messages
                        .map((m) => m.sender.name)
                        .filter((n) => n !== 'Dispatch')
                    )
                  ).join(', ')}
                </Text>
              </Box>
              <ChatBox
                messages={messages}
                user={{
                  uid: DISPATCH_USER_CHAT_ID,
                }}
                onSubmit={(m) => {
                  const message = {
                    id: v4(),
                    text: m,
                    sender: {
                      name: 'Dispatch',
                      uid: DISPATCH_USER_CHAT_ID,
                      avatar:
                        'https://image.freepik.com/free-vector/call-center-service-illustration_24877-52388.jpg',
                    },
                  };
                  const chat: WebSocket.Chat = {
                    type: 'mobile<->dispatch/chat',
                    payload: {
                      content: message.text,
                      eventId: event.id,
                      name: message.sender.name,
                      avatarUrl: message.sender.avatar,
                    },
                  };
                  socket.send(chat);
                }}
              />
            </Box>
            {event && (
              <Button
                onClick={() => {
                  if (socket && event) {
                    const endEventMessage: WebSocket.Action = {
                      type: 'dispatch->server/end-emergency-event',
                      payload: {
                        eventId: event.id,
                      },
                    };
                    socket.emit('message', endEventMessage);
                  }
                  if (socket) {
                    socket.close();
                  }
                  map.removeUserPins();

                  history.push('/');
                }}
              >
                End emergency
              </Button>
            )}
          </>
        )}
      </Panel>
    </>
  );
};
