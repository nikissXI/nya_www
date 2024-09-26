import { Flex, Text } from '@chakra-ui/react';

export const TextToast = (props: { text: string; onClick?: () => void }) => {
  return (
    <Flex
      bg="transparent"
      align="center"
      mt="0.75rem"
      maxW="60vw"
      textAlign="center"
      justifyContent="center"
    >
      <Text
        textAlign="center"
        fontWeight="500"
        maxW="60vw"
        bg="white"
        color="black"
        fontSize="0.875rem"
        borderRadius="6rem"
        padding="0.375rem 1rem"
        cursor={props.onClick ? 'pointer' : 'default'}
        onClick={props?.onClick}
      >
        {props.text}
      </Text>
    </Flex>
  );
};
