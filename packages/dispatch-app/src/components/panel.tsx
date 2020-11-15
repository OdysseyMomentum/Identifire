import * as React from 'react';
import styled from 'styled-components';
import { Box } from '@chakra-ui/react';

const Container = styled.div`
  pointer-events: all;
  width: 500px;
  min-height: 250px;
  position: relative;
  top: 3rem;
  left: 50px;
`;

export const Panel: React.FunctionComponent = ({ children }) => {
  return (
    <Container>
      <Box padding="1rem" borderRadius="md" backgroundColor="white">
        {children}
      </Box>
    </Container>
  );
};
