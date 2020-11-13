import styled from 'styled-components';

export const Overlay = styled.div<{ level: number }>`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: ${({ level }) => level};
`;
