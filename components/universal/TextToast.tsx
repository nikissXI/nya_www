import { Center, Text } from "@chakra-ui/react";

export const TextToast = (props: { text: string; onClick?: () => void }) => {
  return (
    <Center>
      <Text
        mt={5}
        fontWeight="500"
        bg="white"
        color="black"
        fontSize="1rem"
        borderRadius="6rem"
        padding="0.375rem 1rem"
        cursor={props.onClick ? "pointer" : "default"}
        onClick={props?.onClick}
      >
        {props.text}
      </Text>
    </Center>
  );
};
