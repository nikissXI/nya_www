import { Link, Text } from "@chakra-ui/react";

export default function DocLink({
  linkText,
  linkUrl,
}: {
  linkText: string;
  linkUrl: string;
}) {
  return (
    <Text my={3} textAlign="center" color="text.muted">
      {linkText}
      <Link
        ml={1}
        color="brand.text"
        href={linkUrl}
        target="_blank"
        rel="noreferrer"
        wordBreak="break-all"
      >
        {linkUrl}
      </Link>
    </Text>
  );
}
