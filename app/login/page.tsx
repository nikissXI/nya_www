import { Box, Flex } from "@chakra-ui/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthForm from "@/components/universal/AuthForm";
import { CARD_PADDING, CARD_STYLE } from "@/components/universal/ui";

/**
 * /login 独立登录页
 * ------------------------------------------------------------------
 * 存在意义：给需要“可分享链接 / 移动端返回键正常”的场景用。
 * 站内引导仍然优先用登录弹窗（components/universal/Login.tsx），
 * 两边共用同一个 AuthForm，行为一致。
 *
 * 支持 `?redirect=/room` 登录后回跳；只接受站内相对路径，避免开放重定向。
 */
const DEFAULT_REDIRECT = "/me";

const getSafeRedirect = (raw: string | null) => {
  if (!raw) return DEFAULT_REDIRECT;
  // 必须以单个 "/" 开头（排除 "//evil.com"、"/\evil.com" 这类写法）
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/\\")) {
    return DEFAULT_REDIRECT;
  }
  return raw;
};

export default function Page() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  return (
    <Flex direction="column" align="center" pb={6}>
      <Box {...CARD_STYLE} {...CARD_PADDING} maxW="380px" px={4} py={4}>
        <AuthForm
          onSuccess={() =>
            navigate(getSafeRedirect(searchParams.get("redirect")), {
              replace: true,
            })
          }
        />
      </Box>
    </Flex>
  );
}
