import * as React from 'react';

import axios from 'axios';

const { useEffect } = React;

import { Box, Heading, Button } from '@chakra-ui/react';

import { Panel, TextInput } from '../../components';

import { map } from '../map';

export const CreateEvent: React.FunctionComponent = () => {
  useEffect(() => {
    (async () => {
      // hardcoded the event location for now, in reality this will come from integration with the dispatch center
      const { data } = await axios.get(
        'https://eu1.locationiq.com/v1/search.php?key=pk.ebb6168d820aab1459e6f928e5c11671&q="80 biltstraat netherlands"&format=json'
      );
      const [{ lat, lon }] = data;
      // Hack
      // const lat = 52.0953925;
      // const lon = 5.1303194;
      map.addPin({ lat, lon });
    })();
  }, []);

  return (
    <Panel>
      <Box padding="1rem" borderRadius="md" backgroundColor="white">
        <Box marginBottom="1.2rem">
          <Heading size="lg">Create event</Heading>
        </Box>
        <Box marginBottom="1.2rem">
          <TextInput label="Address" value="Some address 123, 1234 AB" />
        </Box>
        <Box marginBottom="1.2rem">
          <TextInput label="Type" value="Fire" />
        </Box>
        <Box marginBottom="1.2rem">
          <TextInput label="Number of participants" value="2" />
        </Box>
        <Box marginBottom="0.5rem">
          <Button
            onClick={() => {
              console.log('do something!');
            }}
          >
            Create event
          </Button>
        </Box>
      </Box>
    </Panel>
  );
};
