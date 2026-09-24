import { useState, useEffect } from "react";
import {
  Text,
  Box,
  Flex,
  Input,
  Image,
  VStack,
  Icon,
  Spinner,
} from "@chakra-ui/react";
import { openToast } from "@/components/universal/toast";
import useCaptcha from "@/utils/GetCaptcha";
import { useUserStateStore } from "@/store/user-state";
import { Button } from "@/components/universal/button";
import {
  getHash,
  getErrorMessage,
  getPasswordAlertText,
  validateEmail,
} from "@/utils/strings";
import { useNavigate } from "react-router-dom";
import { setAuthToken } from "@/store/authKey";
import { isBusinessError } from "@/utils/api";
import { api } from "@/utils/endpoints";
import type { ResetReqBody } from "@/utils/endpoints";
import {
  CARD_PADDING,
  CARD_STYLE,
  INPUT_STYLE,
  PasswordInput,
  SectionTitle,
} from "@/components/universal/ui";
import { MdTipsAndUpdates } from "react-icons/md";

/** 验证码重新发送冷却时间（秒） */
const RESEND_COOLDOWN = 60;

export default function Page() {
  const navigate = useNavigate();

  // 用 selector 单独订阅，避免 store 任意状态变化都触发本页重渲染
  const uuid = useUserStateStore((s) => s.uuid);
  const getUserInfo = useUserStateStore((s) => s.getUserInfo);
  const openLoginModal = useUserStateStore((s) => s.openLoginModal);

  // 验证码拉取和图片
  const { fetchCaptcha } = useCaptcha();
  const [captchaImageUrl, setCaptchaImageUrl] = useState("");

  // 邮箱验证码发送状态
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const [passwordAlertText, setPasswordAlertText] = useState("");

  // 填写的表单数据
  const [inputAccount, setInputAccount] = useState("");
  const [inputVerifyCode, setInputVerifyCode] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [inputPassword2, setInputPassword2] = useState("");
  const [inputCaptcha, setInputCaptcha] = useState("");

  useEffect(() => {
    const loadCaptcha = async () => {
      setCaptchaImageUrl(await fetchCaptcha());
    };
    loadCaptcha();
  }, [fetchCaptcha]);

  // 验证码倒计时
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  /** 换一张验证码并清空已填内容 */
  const refreshCaptcha = async () => {
    setCaptchaImageUrl(await fetchCaptcha());
    setInputCaptcha("");
  };

  const checkPassword = (pass1: string, pass2: string) => {
    setPasswordAlertText(getPasswordAlertText(pass1, pass2));
  };

  const handleEnter = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      handleReset();
    }
  };

  const handleReset = async () => {
    if (passwordAlertText) {
      openToast({
        content: "密码要求：不低于8位，包含数字和字母",
        status: "warning",
      });
      return;
    }

    if (!(inputAccount && inputVerifyCode && inputPassword && inputCaptcha)) {
      openToast({ content: "请完成资料填写", status: "warning" });
      return;
    }

    const req_data: ResetReqBody = {
      verifyType: "email",
      account: inputAccount,
      verify_code: inputVerifyCode,
      password: getHash(inputPassword),
      uuid: uuid,
      captcha_code: inputCaptcha.toLowerCase(),
    };

    try {
      const token = await api.resetPass(req_data);
      openToast({
        content: "重置密码成功，跳转到“个人中心”页面",
        status: "success",
      });
      if (token) setAuthToken(token);
      getUserInfo();
      navigate("/me");
    } catch (err) {
      if (isBusinessError(err)) {
        openToast({ content: err.message, status: "warning" });
        await refreshCaptcha();
      } else {
        openToast({
          content: getErrorMessage(err, "服务异常，请联系服主处理"),
          status: "error",
        });
      }
    }
  };

  /** 发送邮箱验证码，发送成功返回 true（用于决定是否开始倒计时） */
  const sendEmail = async (email: string): Promise<boolean> => {
    if (!validateEmail(email)) {
      openToast({ content: `请正确填写电子邮箱`, status: "warning" });
      return false;
    }

    try {
      // 这两个接口用 code 表达“是 / 否”，需要自己判断
      const exist = await api.emailExist(email);
      if (exist.code === 0) {
        openToast({ content: "该电子邮箱未被注册", status: "warning" });
        return false;
      }

      const verify = await api.verifyEmail(email);
      openToast({
        content: verify.msg ?? "服务异常，请联系服主处理",
        status: verify.code === 0 ? "success" : "warning",
      });
      return verify.code === 0;
    } catch (err) {
      openToast({
        content: getErrorMessage(err, "服务异常，请联系服主处理"),
        status: "error",
      });
      return false;
    }
  };

  /** 点击“获取验证码”：发送成功后才开始倒计时，失败可立即重试 */
  const handleSendCode = async () => {
    if (!inputAccount || countdown > 0 || isSendingCode) return;

    setIsSendingCode(true);
    try {
      if (await sendEmail(inputAccount)) setCountdown(RESEND_COOLDOWN);
    } finally {
      setIsSendingCode(false);
    }
  };

  return (
    <Flex direction="column" align="center" pb={6}>
      <Box {...CARD_STYLE} {...CARD_PADDING} maxW="380px" px={4} py={4}>
        <VStack spacing={3} align="stretch" onKeyDown={handleEnter}>
          {/* 提示：本页只支持邮箱找回 */}
          <Flex
            align="flex-start"
            gap={2}
            p={2.5}
            borderRadius="control"
            bg="brand.soft"
            border="1px solid"
            borderColor="brand.line"
          >
            <Icon
              as={MdTipsAndUpdates}
              boxSize={4}
              color="brand.text"
              flexShrink={0}
              mt={0.5}
            />

            <Text
              fontSize="xs"
              color="brand.text"
              lineHeight="1.7"
              textAlign="left"
            >
              本页面仅支持通过电子邮箱找回密码；
              <br />
              如果只绑定了手机号，请联系服主找回。
            </Text>
          </Flex>

          {/* 账号 */}
          <Box>
            <SectionTitle>电子邮箱</SectionTitle>

            <Input
              mt={1}
              value={inputAccount}
              onChange={(e) => setInputAccount(e.target.value)}
              placeholder="请输入注册时使用的电子邮箱"
              {...INPUT_STYLE}
            />
          </Box>

          {/* 邮箱验证码 */}
          <Box>
            <SectionTitle>邮箱验证码</SectionTitle>

            <Flex gap={2} mt={1}>
              <Input
                inputMode="numeric"
                value={inputVerifyCode}
                onChange={(e) => setInputVerifyCode(e.target.value)}
                placeholder="请输入收到的验证码"
                {...INPUT_STYLE}
              />

              <Button
                px={4}
                flexShrink={0}
                isDisabled={countdown > 0 || isSendingCode}
                isLoading={isSendingCode}
                loadingText="发送中"
                onClick={handleSendCode}
              >
                {countdown > 0 ? `${countdown}s 后重发` : "获取验证码"}
              </Button>
            </Flex>
          </Box>

          {/* 新密码 */}
          <Box>
            <SectionTitle>新密码</SectionTitle>

            <Box mt={1}>
              <PasswordInput
                value={inputPassword}
                onChange={(value) => {
                  setInputPassword(value);
                  checkPassword(value, inputPassword2);
                }}
                placeholder="不低于 8 位，包含数字和字母"
              />
            </Box>

            {passwordAlertText && (
              <Text mt={1} fontSize="xs" color="warning.text">
                {passwordAlertText}
              </Text>
            )}
          </Box>

          {/* 确认新密码 */}
          <Box>
            <SectionTitle>确认新密码</SectionTitle>

            <Box mt={1}>
              <PasswordInput
                value={inputPassword2}
                onChange={(value) => {
                  setInputPassword2(value);
                  checkPassword(inputPassword, value);
                }}
                placeholder="请重复一次新密码"
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
                borderRadius="control"
                bg="bg.subtle"
                border="1px solid"
                borderColor="border.line"
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

            <Text mt={1} fontSize="xs" color="text.faint">
              看不清？点击图片刷新验证码
            </Text>
          </Box>

          <Button w="100%" mt={1} onClick={handleReset}>
            提交
          </Button>

          <Text fontSize="sm" textAlign="center" color="text.muted">
            想起来了？
            <Text
              as="button"
              ml={1}
              color="brand.text"
              fontWeight="600"
              onClick={() => navigate(-1)}
            >
              返回
            </Text>
          </Text>
        </VStack>
      </Box>
    </Flex>
  );
}
