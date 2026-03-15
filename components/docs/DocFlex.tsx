import React from "react";
import { Flex } from "@chakra-ui/react";

const DocFlex = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex
      direction="column"
      justifyContent="space-between"
      alignItems="left"
      mb={5}
      mx="5vw"
    >
      {children}
    </Flex>
  );
};

export default DocFlex;
