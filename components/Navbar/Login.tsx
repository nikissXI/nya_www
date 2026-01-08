"use client";

import { Button } from "../universal/button";
import {
  Modal,
  ModalCloseButton,
  ModalOverlay,
  ModalContent,
  VStack,
  ModalHeader,
  ModalFooter,
  Input,
  ModalBody,
  Text,
  Flex,
  RadioGroup,
  Stack,
  Image,
  Radio,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useUserStateStore } from "@/store/user-state";
import { useEffect, useState } from "react";
import useCaptcha from "@/utils/GetCaptcha";
import { openToast } from "../universal/toast";
import { getHash, validateTel, validateEmail } from "@/utils/strings";
import { setAuthToken } from "@/store/authKey";

interface LoginReqBody {
  verifyType: string; // 注册类型：qq或tel
  account: string; // 手机或QQ
  password: string; // 登陆密码sha256
  uuid: string; // 表单uuid
  captcha_code: string; // 表单图片验证码
}

export function LoginModal() {
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const {
    userInfo,
    goToIssues,
    uuid,
    getUserInfo,
    showLoginModal,
    setShowLoginModal,
  } = useUserStateStore();

  // 验证码拉取和图片
  const { fetchCaptcha } = useCaptcha();
  const [captchaImageUrl, setCaptchaImageUrl] = useState("");

  // 填写的表单数据
  const [verifyType, setVerifyType] = useState("email");
  const [inputAccount, setInputAccount] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [inputCaptcha, setInputCaptcha] = useState("");

  const [disableLogin, setDisableLogin] = useState(true);

  const handleEnter = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  useEffect(() => {
    getUserInfo();
  }, [getUserInfo]);

  useEffect(() => {
    const loadCaptcha = async () => {
      if (!userInfo && showLoginModal) {
        setInputCaptcha("");
        setCaptchaImageUrl(await fetchCaptcha());
      }
    };
    loadCaptcha();
  }, [fetchCaptcha, showLoginModal, userInfo]);

  const toggleLoginButton = (
    inputAccount: string,
    inputPassword: string,
    inputCaptcha: string
  ) => {
    if (inputAccount && inputPassword && inputCaptcha) {
      setDisableLogin(false);
    } else {
      setDisableLogin(true);
    }
  };

  const handleLogin = async () => {
    if (!(inputAccount && inputPassword && inputCaptcha)) {
      return;
    }

    if (verifyType === "tel") {
      if (!validateTel(inputAccount)) {
        openToast({ content: `请正确填写手机号`, status: "warning" });
        return;
      }
    } else {
      if (!validateEmail(inputAccount)) {
        openToast({ content: `请正确填写电子邮箱`, status: "warning" });
        return;
      }
    }

    const req_data: LoginReqBody = {
      verifyType: verifyType,
      account: inputAccount,
      password: getHash(inputPassword),
      uuid: uuid,
      captcha_code: inputCaptcha.toLowerCase(),
    };

    const resp = await fetch(`${apiUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req_data),
    });

    if (resp.ok) {
      const data = await resp.json();
      if (data.code === 0) {
        openToast({ content: "登陆成功", status: "success" });
        setAuthToken(data.token);
        getUserInfo();
        setShowLoginModal();
        if (goToIssues === true) {
          router.push("/docs#issues");
        }
      } else {
        openToast({ content: data.msg, status: "warning" });
        setCaptchaImageUrl(await fetchCaptcha());
        setInputCaptcha("");
      }
    } else if (resp.status === 401) {
      openToast({ content: "账号或密码错误", status: "warning" });
      setCaptchaImageUrl(await fetchCaptcha());
      setInputCaptcha("");
    } else {
      openToast({ content: "服务异常，请联系服主处理", status: "error" });
    }
  };

  return (
    <Modal isOpen={showLoginModal} onClose={setShowLoginModal}>
      <ModalOverlay />
      <ModalContent bgColor="#274161" maxW="320px" mx={3}>
        <ModalHeader textAlign="center">登录</ModalHeader>

        <ModalCloseButton />

        <ModalBody py={0}>
          <VStack spacing={2} align="stretch" onKeyDown={handleEnter}>
            {/* {verifyType !== "tel" && (
              <Text color="#ffd648" fontSize="16px">
                提示：以前的QQ验证改为QQ邮箱
                <br />
                填写格式“QQ号@qq.com”
              </Text>
            )} */}

            <Flex>
              <Text ml={3}>登陆方式</Text>

              <RadioGroup
                ml={3}
                value={verifyType}
                onChange={(value) => {
                  setInputAccount("");
                  setVerifyType(value);
                  toggleLoginButton("", inputPassword, inputCaptcha);
                }}
              >
                <Stack spacing={3} direction="row">
                  <Radio value="email">电子邮箱</Radio>
                  <Radio value="tel">手机</Radio>
                </Stack>
              </RadioGroup>
            </Flex>

            <Flex border="1px" borderColor="#379fff" borderRadius="md">
              <Input
                px={3}
                py={2}
                variant="unstyled"
                type="text"
                value={inputAccount}
                onChange={(e) => {
                  setInputAccount(e.target.value);
                  toggleLoginButton(
                    e.target.value,
                    inputPassword,
                    inputCaptcha
                  );
                }}
                placeholder={
                  verifyType === "tel" ? "请输入手机号" : "请输入电子邮箱"
                }
              />
            </Flex>

            <Flex border="1px" borderColor="#379fff" borderRadius="md">
              <Input
                mr={5}
                px={3}
                py={2}
                variant="unstyled"
                type="password"
                value={inputPassword}
                onChange={(e) => {
                  setInputPassword(e.target.value);
                  toggleLoginButton(inputAccount, e.target.value, inputCaptcha);
                }}
                placeholder="请输入密码"
              />

              <Button
                mr={4}
                variant="link"
                // color="#7dfffe"
                bgColor="transparent"
                fontSize="sm"
                onClick={() => {
                  router.push("/forgetPass");
                  setShowLoginModal();
                }}
              >
                忘记密码?
              </Button>
            </Flex>

            <Flex border="1px" borderColor="#379fff" borderRadius="md">
              <Input
                px={3}
                py={2}
                variant="unstyled"
                value={inputCaptcha}
                onChange={(e) => {
                  setInputCaptcha(e.target.value);
                  toggleLoginButton(
                    inputAccount,
                    inputPassword,
                    e.target.value
                  );
                }}
                placeholder="请输入图片验证码"
              />

              <Image
                p={1}
                rounded="lg"
                ml={1}
                onClick={async () => {
                  setCaptchaImageUrl(await fetchCaptcha());
                  setInputCaptcha("");
                }}
                src={captchaImageUrl ? captchaImageUrl : undefined}
                alt="验证码"
                cursor="pointer"
              />
            </Flex>

            <Button onClick={handleLogin} isDisabled={disableLogin}>
              登录
            </Button>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <VStack spacing={2} align="start" w="100%">
            <Flex>
              首次使用？
              <Button
                variant="link"
                color="#7dfffe"
                bgColor="transparent"
                onClick={() => {
                  setShowLoginModal();
                  router.push("/register");
                }}
              >
                点我注册
              </Button>
            </Flex>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
