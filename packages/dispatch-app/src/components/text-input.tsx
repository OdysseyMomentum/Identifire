import * as React from 'react';

const { useState } = React;

import {
  FormControl,
  Input,
  FormLabel,
  Button,
  Flex,
  Text,
} from '@chakra-ui/react';

import { EditIcon } from '@chakra-ui/icons';

interface Props {
  label: string;
  value: string;
  initialIsEditable?: boolean;
}

export const TextInput: React.FunctionComponent<Props> = ({
  label,
  value,
  initialIsEditable = false,
}) => {
  const [editable, setEditable] = useState(initialIsEditable);

  if (!editable) {
    return (
      <FormControl>
        <FormLabel>{label}</FormLabel>
        <Flex>
          <Text marginRight="5px" fontSize="md">
            {value}
          </Text>
          <Button
            rightIcon={<EditIcon />}
            size="xsm"
            color="darkviolet"
            variant="link"
          ></Button>
        </Flex>
      </FormControl>
    );
  }

  return (
    <FormControl>
      <Input value={value} onChange={() => {}} />
    </FormControl>
  );
};
