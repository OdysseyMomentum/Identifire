import * as React from 'react';

import { useHistory, useParams } from 'react-router-dom';

import styled from 'styled-components';

import { Box, Text, Button } from '@chakra-ui/react';

import { Panel } from '../../components';

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
  const { id } = useParams();
  const history = useHistory();
  return (
    <>
      <Banner>
        <Text fontSize="1.2rem">ok</Text>
      </Banner>
      <Panel>
        <Box padding="1rem" borderRadius="1rem" backgroundColor="white">
          <Button onClick={() => history.push('/')}>End emergency</Button>
        </Box>
      </Panel>
    </>
  );
};
