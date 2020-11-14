import * as React from 'react';

import { useHistory, useParams } from 'react-router-dom';

import styled from 'styled-components';

import { RestAPI } from 'common-types';

import { Box, Text, Button, Spinner, Textarea } from '@chakra-ui/react';

import { Panel } from '../../components';

import { useAppContext } from '../../app_context';

import { map } from '../../services/map';

const { useState, useEffect } = React;

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

export const ActiveEvent: React.FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<null | RestAPI.Dispatch.GetEventResponse>(
    null
  );
  const { api } = useAppContext();
  const history = useHistory();

  useEffect(() => {
    (async () => {
      setEvent(await api.dispatchEvent.get(id));
    })();
  }, [id]);

  useEffect(() => {
    if (event && !map.hasCurrentEventPin()) {
      map.addCurrentEventPin({ lat: event.latitude, lon: event.longitude });
    }
  }, [event]);

  return (
    <>
      {event && (
        <Banner>
          <Text fontSize="1.2rem">{event.address}</Text>
        </Banner>
      )}
      <Panel>
        <Box padding="1rem" borderRadius="1rem" backgroundColor="white">
          <Box marginBottom="1.2rem">
            <Textarea style={{ height: '100px' }} />
          </Box>
          {!event && <Spinner size="lg" />}
          {event && (
            <Button onClick={() => history.push('/')}>End emergency</Button>
          )}
        </Box>
      </Panel>
    </>
  );
};
