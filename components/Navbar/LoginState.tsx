"use client";

import { Button } from "../universal/button";
import {
  Modal,
  ModalCloseButton,
  ModalOverlay,
  ModalContent,
  VStack,
  ModalHeader,
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
import useCaptcha from "@/hooks/GetCaptcha";
import { openToast } from "../universal/toast";
import { getHash } from "@/utils/strings";
import { useDisclosureStore } from "@/store/disclosure";
import { setAuthToken } from "@/store/authKey";

interface LoginReqBody {
  verifyType: string; // 注册类型：qq或tel
  num: number; // 手机或QQ
  password: string; // 登陆密码sha256
  uuid: string; // 表单uuid
  captcha_code: string; // 表单图片验证码
}

export function LoginStateText() {
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const { isOpen: loginIsOpen, onToggle: loginToggle } = useDisclosureStore(
    (state) => {
      return state.modifyLoginDisclosure;
    }
  );
  const { logging, logined, userInfo, uuid, getUserInfo } = useUserStateStore();

  // 验证码拉取和图片
  const { fetchCaptcha } = useCaptcha();
  const [captchaImage, setCaptchaImage] = useState("");

  // 填写的表单数据
  const [registerType, setRegisterType] = useState("tel");
  const [inputNum, setInputNum] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [inputCaptcha, setInputCaptcha] = useState("");

  const handleEnter = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  useEffect(() => {
    const loadCaptcha = async () => {
      if (!logging && !logined && loginIsOpen) {
        setCaptchaImage(await fetchCaptcha());
      }
    };
    loadCaptcha();
  }, [logging, fetchCaptcha, loginIsOpen]);

  const handleLogin = async () => {
    if (!(inputNum && inputPassword && inputCaptcha)) {
      return;
    }

    const req_data: LoginReqBody = {
      verifyType: registerType,
      num: Number(inputNum),
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
        openToast({ content: "登陆成功" });
        setAuthToken(data.token);
        getUserInfo();
        loginToggle();
      } else {
        openToast({ content: data.msg });
        setCaptchaImage(await fetchCaptcha());
        setInputCaptcha("");
      }
    } else if (resp.status === 401) {
      openToast({ content: "账号或密码错误" });
      setCaptchaImage(await fetchCaptcha());
      setInputCaptcha("");
    } else {
      openToast({ content: "服务异常，请联系服主处理" });
    }
  };

  return (
    <>
      <Modal isOpen={loginIsOpen} onClose={loginToggle}>
        <ModalOverlay />
        <ModalContent bgColor="#274161" maxW="300px">
          <ModalHeader textAlign="center">
            {logined ? `你好！${userInfo?.username}` : "登录"}
          </ModalHeader>

          <ModalCloseButton />

          <ModalBody>
            <VStack spacing={2} align="stretch" onKeyDown={handleEnter}>
              <Flex alignItems="center">
                登陆方式
                <RadioGroup
                  ml={5}
                  defaultValue="tel"
                  onChange={(value) => {
                    setInputNum("");
                    setRegisterType(value);
                  }}
                >
                  <Stack spacing={4} direction="row">
                    <Radio value="tel">手机</Radio>
                    <Radio value="qq">QQ</Radio>
                  </Stack>
                </RadioGroup>
              </Flex>

              <Flex alignItems="center">
                <Input
                  type="number"
                  value={inputNum}
                  onChange={(e) => setInputNum(e.target.value)}
                  placeholder={
                    registerType === "tel" ? "请输入手机号" : "请输入QQ号"
                  }
                />
              </Flex>

              <Flex alignItems="center">
                <Input
                  type="password"
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  placeholder="请输入密码"
                />
              </Flex>

              <Flex alignItems="center">
                <Input
                  value={inputCaptcha}
                  onChange={(e) => setInputCaptcha(e.target.value)}
                  placeholder="请输入图片验证码"
                />

                <Image
                  rounded={5}
                  ml={1}
                  onClick={async () => {
                    setCaptchaImage(await fetchCaptcha());
                    setInputCaptcha("");
                  }}
                  src={captchaImage}
                  alt="验证码"
                  cursor="pointer"
                />
              </Flex>

              <Button onClick={handleLogin}>登录</Button>

              <Flex>
                <Button
                  mt={2}
                  variant="link"
                  color="#7dfffe"
                  bgColor="transparent"
                  onClick={() => {
                    router.push("/forgetPass");
                    loginToggle();
                  }}
                >
                  忘记密码
                </Button>
              </Flex>

              <Flex>
                没有账号？
                <Button
                  variant="link"
                  color="#7dfffe"
                  bgColor="transparent"
                  onClick={() => {
                    router.push("/register");
                    loginToggle();
                  }}
                >
                  注册一个
                </Button>
              </Flex>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Button
        position="fixed"
        top={3}
        left={{ md: "4.2rem", base: "0.5rem" }}
        minW="6.5rem"
        variant="link"
        rounded={10}
        onClick={async () => {
          if (logined) {
            router.push("/me");
          } else {
            loginToggle();
          }
        }}
        _hover={{ textDecoration: "none" }}
        _active={{ textDecoration: "none" }}
        bg="transparent"
        display={{ md: "block", base: "none" }}
      >
        <Text fontSize={{ md: "lg", base: "md" }} fontWeight="bold">
          {logined ? userInfo?.username : "点击登录"}
        </Text>
      </Button>
    </>
  );
}
