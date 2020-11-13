import styled from 'styled-components';

type Size = 's' | 'm' | 'l';

const remSizes = {
  s: '0.5rem',
  m: '1rem',
  l: '1.5rem',
};

export const Text = styled.div<{ size: Size; bold?: boolean }>`
  font-size: ${({ size }) => remSizes[size]};
  font-weight: ${({ bold }) => (bold ? 500 : undefined)};
`;
