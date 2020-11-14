import * as React from 'react';

const { useState } = React;

import {
  FormControl,
  FormLabel,
  IconButton,
  Flex,
  Text,
} from '@chakra-ui/react';

import { EditIcon } from '@chakra-ui/icons';

interface Props {
  label: string;
  value: string;
  initialIsEditable?: boolean;
}

export const EditableField: React.FunctionComponent<
  Props & { children: any }
> = ({ label, value, initialIsEditable = false, children }) => {
  const [editable, setEditable] = useState(initialIsEditable);

  const content = editable ? (
    children({ onDone: () => setEditable(false) })
  ) : (
    <>
      <Text marginRight="5px" fontSize="md">
        {value}
      </Text>
      <IconButton
        onClick={() => setEditable(true)}
        aria-label="edit value"
        icon={<EditIcon />}
        size="sm"
        color="darkviolet"
        variant="link"
      />
    </>
  );

  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <Flex>{content}</Flex>
    </FormControl>
  );
};
