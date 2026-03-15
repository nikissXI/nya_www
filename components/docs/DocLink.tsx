import React from "react";
import { Link, Text } from "@chakra-ui/react";

const DocLink: React.FC<{
  linkText: string;
  linkUrl: string;
}> = ({ linkText, linkUrl }) => {
  return (
    <Text my={3} textAlign="center">
      {linkText}
      <Link ml={1} color="#7dd4ff" href={linkUrl} target="_blank">
        {linkUrl}
      </Link>
    </Text>
  );
};

export default DocLink;
