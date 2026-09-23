import { useEffect, useState } from "react";
import { Box, Flex, Image, Input, Spinner, Text, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { openToast } from "./toast";
import { Button } from "./button";
import { INPUT_STYLE, PasswordInput, SectionTitle } from "./ui";
import useCaptcha from "@/utils/GetCaptcha";
import { useUserStateStore } from "@/store/user-state";
import { getHash, getErrorMessage } from "@/utils/strings";
import { setAuthToken } from "@/store/authKey";
import { ApiError, isBusinessError } from "@/utils/api";
import { api } from "@/utils/endpoints";
import type { LoginReqBody } from "@/utils/endpoints";

/**
 * 登录表单（手机/邮箱 + 密码 + 图形验证码）
 * ------------------------------------------------------------------
 * 被两处复用，行为完全一致：
 * - `components/universal/Login.tsx`：全站常驻的登录弹窗（默认入口）
 * - `app/login/page.tsx`：/login 独立页面，给需要深链/返回键的场景用
 */
export default function AuthForm({
  onSuccess,
  onLeave,
}: {
  /** 登录成功后的收尾（弹窗里用于关闭弹窗） */
  onSuccess?: () => void;
  /** 跳去注册/找回密码前的收尾（弹窗里用于关闭弹窗） */
  onLeave?: () => void;
}) {
  const navigate = useNavigate();

  const uuid = useUserStateStore((s) => s.uuid);
  const getUserInfo = useUserStateStore((s) => s.getUserInfo);

  // 验证码拉取和图片
  const { fetchCaptcha } = useCaptcha();
  const [captchaImageUrl, setCaptchaImageUrl] = useState("");

  // 填写的表单数据
  const [inputAccount, setInputAccount] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [inputCaptcha, setInputCaptcha] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 三项都填了才允许提交（派生值，不再手写状态同步）
  const canSubmit = Boolean(inputAccount && inputPassword && inputCaptcha);

  useEffect(() => {
    let cancelled = false;

    const loadCaptcha = async () => {
      const url = await fetchCaptcha();
      if (!cancelled) setCaptchaImageUrl(url);
    };
    loadCaptcha();

    return () => {
      cancelled = true;
    };
  }, [fetchCaptcha]);

  /** 换一张验证码并清空已填内容 */
  const refreshCaptcha = async () => {
    setCaptchaImageUrl(await fetchCaptcha());
    setInputCaptcha("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!canSubmit || isSubmitting) return;

    const req_data: LoginReqBody = {
      account: inputAccount,
      password: getHash(inputPassword),
      uuid: uuid,
      captcha_code: inputCaptcha.toLowerCase(),
    };

    setIsSubmitting(true);
    try {
      const token = await api.login(req_data);
      openToast({ content: "登陆成功", status: "success" });
      if (token) setAuthToken(token);
      getUserInfo();
      onSuccess?.();
    } catch (err) {
      if (err instanceof ApiError && err.isAuthError) {
        openToast({ content: "账号或密码错误", status: "warning" });
      } else if (isBusinessError(err)) {
        openToast({ content: err.message, status: "warning" });
      } else {
        // 网络/服务异常时保留验证码，方便直接重试
        openToast({
          content: getErrorMessage(err, "服务异常，请联系服主处理"),
          status: "error",
        });
        return;
      }

      // 登录失败后刷新验证码
      await refreshCaptcha();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={3} align="stretch">
        {/* 账号 */}
        <Box>
          <SectionTitle>手机 / 邮箱</SectionTitle>

          <Input
            mt={1}
            value={inputAccount}
            onChange={(e) => setInputAccount(e.target.value)}
            placeholder="请输入手机或邮箱"
            autoComplete="username"
            {...INPUT_STYLE}
          />
        </Box>

        {/* 密码 */}
        <Box>
          <SectionTitle>密码</SectionTitle>

          <Box mt={1}>
            <PasswordInput
              value={inputPassword}
              onChange={setInputPassword}
              placeholder="请输入密码"
              autoComplete="current-password"
            />
          </Box>
        </Box>

        {/* 图形验证码 */}
        <Box>
          <SectionTitle>图形验证码</SectionTitle>

          <Flex gap={2} mt={1}>
            <Input
              value={inputCaptcha}
              onChange={(e) => setInputCaptcha(e.target.value)}
              placeholder="请输入图片验证码"
              {...INPUT_STYLE}
            />

            <Flex
              w="104px"
              h="40px"
              flexShrink={0}
              align="center"
              justify="center"
              overflow="hidden"
              cursor="pointer"
              borderRadius="md"
              bg="rgba(255, 255, 255, 0.06)"
              border="1px solid"
              borderColor="rgba(255, 255, 255, 0.14)"
              onClick={refreshCaptcha}
            >
              {captchaImageUrl ? (
                <Image
                  src={captchaImageUrl}
                  alt="验证码（点击刷新）"
                  w="100%"
                  h="100%"
                  objectFit="cover"
                />
              ) : (
                <Spinner size="xs" />
              )}
            </Flex>
          </Flex>

          <Text mt={1} fontSize="xs" color="rgba(255, 255, 255, 0.5)">
            看不清？点击图片刷新验证码
          </Text>
        </Box>

        <Button
          type="submit"
          w="100%"
          mt={1}
          isLoading={isSubmitting}
          isDisabled={!canSubmit}
        >
          登录
        </Button>

        <Flex justify="center" gap={5} fontSize="sm">
          <Text
            as="button"
            type="button"
            color="#7dd4ff"
            onClick={() => {
              onLeave?.();
              navigate("/forgetPass");
            }}
          >
            忘记密码？
          </Text>

          <Text
            as="button"
            type="button"
            color="#7dd4ff"
            onClick={() => {
              onLeave?.();
              navigate("/register");
            }}
          >
            注册新账号
          </Text>
        </Flex>
      </VStack>
    </form>
  );
}
