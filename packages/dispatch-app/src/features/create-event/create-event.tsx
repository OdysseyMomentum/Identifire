import * as React from 'react';

import { Box, Heading } from '@chakra-ui/react';

import { Panel, TextInput } from '../../components';

export const CreateEvent: React.FunctionComponent = () => {
  return (
    <Panel>
      <Box padding="1rem" borderRadius="md" backgroundColor="white">
        <Box marginBottom="1rem">
          <Heading size="lg">Create event</Heading>
        </Box>
        <Box marginBottom="0.5rem">
          <TextInput label="Address" value="Some address 123, 1234 AB" />
        </Box>
      </Box>
    </Panel>
  );
};
