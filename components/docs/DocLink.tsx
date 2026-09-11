import { Link, Text } from "@chakra-ui/react";

export default function DocLink({
  linkText,
  linkUrl,
}: {
  linkText: string;
  linkUrl: string;
}) {
  return (
    <Text my={3} textAlign="center">
      {linkText}
      <Link ml={1} color="#7dd4ff" href={linkUrl} target="_blank">
        {linkUrl}
      </Link>
    </Text>
  );
}
