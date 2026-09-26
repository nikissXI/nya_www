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
  validateTel,
  validateEmail,
} from "@/utils/strings";
import { useNavigate } from "react-router-dom";
import { setAuthToken } from "@/store/authKey";
import { isBusinessError } from "@/utils/api";
import { api } from "@/utils/endpoints";
import type { RegisterReqBody } from "@/utils/endpoints";
import {
  CARD_PADDING,
  CARD_STYLE,
  INPUT_STYLE,
  PasswordInput,
  SectionTitle,
} from "@/components/universal/ui";
import { FaEnvelope, FaMobileAlt } from "react-icons/fa";

/** 注册方式选项 */
const VERIFY_TYPES = [
  { value: "email", label: "邮箱", icon: FaEnvelope },
  { value: "tel", label: "手机", icon: FaMobileAlt },
];

export default function Page() {
  const navigate = useNavigate();

  // 用 selector 单独订阅，避免 store 任意状态变化都触发本页重渲染
  const uuid = useUserStateStore((s) => s.uuid);
  const embed = useUserStateStore((s) => s.embed);
  const getUserInfo = useUserStateStore((s) => s.getUserInfo);
  const openLoginModal = useUserStateStore((s) => s.openLoginModal);

  // 验证码拉取和图片
  const { fetchCaptcha } = useCaptcha();
  const [captchaImageUrl, setCaptchaImageUrl] = useState("");

  const [passwordAlertText, setPasswordAlertText] = useState("");

  // 填写的表单数据
  const [verifyType, setVerifyType] = useState("email");
  const [inputAccount, setInputAccount] = useState("");
  const [inputUsername, setInputUsername] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [inputPassword2, setInputPassword2] = useState("");
  const [inputCaptcha, setInputCaptcha] = useState("");

  useEffect(() => {
    const loadCaptcha = async () => {
      setCaptchaImageUrl(await fetchCaptcha());
    };
    loadCaptcha();
  }, [fetchCaptcha]);

  /** 换一张验证码并清空已填内容 */
  const refreshCaptcha = async () => {
    setCaptchaImageUrl(await fetchCaptcha());
    setInputCaptcha("");
  };

  const checkPassword = (pass1: string, pass2: string) => {
    setPasswordAlertText(getPasswordAlertText(pass1, pass2));
  };

  const handleRegisterEnter = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      handleRegister();
    }
  };

  const handleRegister = async () => {
    if (passwordAlertText) {
      openToast({
        content: "密码要求：不低于8位，包含数字和字母",
        status: "warning",
      });
      return;
    }

    if (
      !(
        inputAccount &&
        inputUsername &&
        inputPassword &&
        inputPassword2 &&
        inputCaptcha
      )
    ) {
      openToast({ content: "请完成资料填写", status: "warning" });
      return;
    }

    if (verifyType === "tel" && !validateTel(inputAccount)) {
      openToast({ content: `请正确填写手机号`, status: "warning" });
      return;
    }

    if (verifyType === "email" && !validateEmail(inputAccount)) {
      openToast({ content: `请正确填写邮箱地址`, status: "warning" });
      return;
    }

    const inviteCode = (localStorage.getItem("inviteCode") || "")
      .replace(/[^a-zA-Z0-9]/g, "")
      .toLowerCase();

    const req_data: RegisterReqBody = {
      verifyType: verifyType,
      account: inputAccount,
      // verify_code: inputVerifyCode,
      username: inputUsername,
      password: getHash(inputPassword),
      uuid: uuid,
      captcha_code: inputCaptcha.toLowerCase(),
      ...(inviteCode && {
        invite_code: inviteCode,
      }),
    };

    try {
      const token = await api.register(req_data);
      openToast({
        content: "注册成功，跳转到“个人中心”页面",
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

  return (
    <Flex direction="column" align="center" pb={6}>
      <Box {...CARD_STYLE} {...CARD_PADDING} maxW="380px" px={4} py={4}>
        <VStack spacing={3} align="stretch" onKeyDown={handleRegisterEnter}>
          {/* 注册方式 */}
          <Box>
            <SectionTitle>注册方式</SectionTitle>

            <Flex gap={2} mt={2}>
              {VERIFY_TYPES.map(({ value, label, icon }) => {
                const active = verifyType === value;
                return (
                  <Button
                    key={value}
                    flex="1"
                    size="sm"
                    bg={active ? "brand.solid" : "bg.subtle"}
                    color={active ? "white" : "text.muted"}
                    border="1px solid"
                    borderColor={active ? "brand.solid" : "border.line"}
                    _hover={{
                      bg: active ? "brand.solidHover" : "bg.hover",
                      color: active ? "white" : "text.main",
                    }}
                    onClick={() => {
                      setInputAccount("");
                      setVerifyType(value);
                    }}
                  >
                    <Icon as={icon} mr={1.5} />
                    {label}
                  </Button>
                );
              })}
            </Flex>
          </Box>

          {/* 账号 */}
          <Box>
            <SectionTitle>
              {verifyType === "tel" ? "手机号" : "邮箱地址"}
            </SectionTitle>

            <Input
              mt={1}
              value={inputAccount}
              onChange={(e) => setInputAccount(e.target.value)}
              placeholder={
                verifyType === "tel" ? "请输入手机号" : "请输入邮箱地址"
              }
              inputMode={verifyType === "tel" ? "numeric" : undefined}
              {...INPUT_STYLE}
            />
          </Box>

          {/* 账号昵称 */}
          <Box>
            <SectionTitle>账号昵称</SectionTitle>

            <Input
              mt={1}
              value={inputUsername}
              onChange={(e) => setInputUsername(e.target.value)}
              placeholder="请输入账号昵称"
              {...INPUT_STYLE}
            />

            <Text mt={1} fontSize="xs" color="text.faint">
              2-14 个字符，或 1-7 个汉字
            </Text>
          </Box>

          {/* 密码 */}
          <Box>
            <SectionTitle>密码</SectionTitle>

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

          {/* 确认密码 */}
          <Box>
            <SectionTitle>确认密码</SectionTitle>

            <Box mt={1}>
              <PasswordInput
                value={inputPassword2}
                onChange={(value) => {
                  setInputPassword2(value);
                  checkPassword(inputPassword, value);
                }}
                placeholder="请重复一次密码"
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

          <Button w="100%" mt={1} onClick={handleRegister}>
            注册
          </Button>

          {!embed && (
            <Text fontSize="sm" textAlign="center" color="text.muted">
              已有账号？
              <Text
                as="button"
                ml={1}
                color="brand.text"
                fontWeight="600"
                onClick={openLoginModal}
              >
                点击登录
              </Text>
            </Text>
          )}
        </VStack>
      </Box>
    </Flex>
  );
}
