import React from "react";
import { Tag, TagLabel, TagLeftIcon } from "@chakra-ui/react";
import { FaStar, FaCrown } from "react-icons/fa";
import { keyframes } from "@emotion/react";

type SponsorTagProps = {
  amount: number;
};

const glow = keyframes`
  0% {
    box-shadow: 0 0 6px 2px rgba(255, 208, 18, 0.6);
  }
  50% {
    box-shadow: 0 0 12px 4px rgba(255, 208, 18, 1);
  }
  100% {
    box-shadow: 0 0 6px 2px rgba(255, 208, 18, 0.6);
  }
`;

const gradient = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const SponsorTag: React.FC<SponsorTagProps> = ({ amount }) => {
  let bg = "#ffd012";
  let color = "white";
  let icon = null;
  let size = "md";
  let animation = undefined;
  let bgGradient = undefined;

  if (amount === 0) {
    bg = "gray.300";
    color = "black";
  } else if (amount < 50) {
    bg = "orange.400";
    color = "white";
    icon = FaStar;
  } else {
    // 大额赞助，渐变背景+发光动画
    color = "black";
    icon = FaCrown;
    bgGradient = "linear-gradient(270deg, #ffd012, #ff6f00, #ffd012)";
    animation = `${gradient} 4s ease infinite, ${glow} 2s ease-in-out infinite`;
  }

  return (
    <Tag
      ml={2}
      bg={bgGradient ? undefined : bg}
      bgGradient={bgGradient}
      bgSize="200% 200%"
      color={color}
      fontWeight="bold"
      size={size}
      borderRadius="md"
      animation={animation}
      cursor="default"
      userSelect="none"
    >
      {icon && <TagLeftIcon as={icon} mr={1} />}
      <TagLabel>赞助者</TagLabel>
    </Tag>
  );
};

export default SponsorTag;
