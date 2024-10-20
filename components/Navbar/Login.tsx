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
  Grid,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useUserStateStore } from "@/store/user-state";
import { useEffect, useState } from "react";
import useCaptcha from "@/utils/GetCaptcha";
import { openToast } from "../universal/toast";
import { getHash, isInteger } from "@/utils/strings";
import { useDisclosureStore } from "@/store/disclosure";
import { setAuthToken } from "@/store/authKey";

interface LoginReqBody {
  verifyType: string; // 注册类型：qq或tel
  num: number; // 手机或QQ
  password: string; // 登陆密码sha256
  uuid: string; // 表单uuid
  captcha_code: string; // 表单图片验证码
}

export function LoginModal() {
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
  const [verifyType, setVerifyType] = useState("tel");
  const [inputNum, setInputNum] = useState("");
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
      if (!logging && !logined && loginIsOpen) {
        setCaptchaImage(await fetchCaptcha());
      }
    };
    loadCaptcha();
  }, [logging, fetchCaptcha, loginIsOpen, logined]);

  const toggleLoginButton = (
    inputNum: string,
    inputPassword: string,
    inputCaptcha: string
  ) => {
    if (inputNum && inputPassword && inputCaptcha) {
      setDisableLogin(false);
    } else {
      setDisableLogin(true);
    }
  };

  const handleLogin = async () => {
    if (!(inputNum && inputPassword && inputCaptcha)) {
      return;
    }

    if (!isInteger(inputNum)) {
      const text = verifyType === "tel" ? "手机号" : "QQ号";
      openToast({ content: `请正确填写${text}` });
      return;
    }

    const req_data: LoginReqBody = {
      verifyType: verifyType,
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
    <Modal isOpen={loginIsOpen} onClose={loginToggle}>
      <ModalOverlay />
      <ModalContent bgColor="#274161" maxW="320px" mx={3}>
        <ModalHeader textAlign="center">
          {logined ? `你好！${userInfo?.username}` : "登录"}
        </ModalHeader>

        <ModalCloseButton />

        <ModalBody py={0}>
          <VStack spacing={2} align="stretch" onKeyDown={handleEnter}>
            {verifyType !== "tel" && (
              <Text color="#ffd648" fontSize="16px">
                提示：是用Q号做账号，不是用登陆QQ的账密，新用户先注册
              </Text>
            )}

            <Flex>
              <Text ml={3}>登陆方式</Text>

              <RadioGroup
                ml={5}
                defaultValue="tel"
                onChange={(value) => {
                  setInputNum("");
                  setVerifyType(value);
                  toggleLoginButton("", inputPassword, inputCaptcha);
                }}
              >
                <Stack spacing={4} direction="row">
                  <Radio value="tel">手机</Radio>
                  <Radio value="qq">QQ</Radio>
                </Stack>
              </RadioGroup>
            </Flex>

            <Flex border="1px" borderColor="#379fff" borderRadius="md">
              <Input
                px={3}
                py={2}
                variant="unstyled"
                type="number"
                value={inputNum}
                onChange={(e) => {
                  setInputNum(e.target.value);
                  toggleLoginButton(
                    e.target.value,
                    inputPassword,
                    inputCaptcha
                  );
                }}
                placeholder={
                  verifyType === "tel" ? "请输入手机号" : "请输入QQ号"
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
                  toggleLoginButton(inputNum, e.target.value, inputCaptcha);
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
                  loginToggle();
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
                  toggleLoginButton(inputNum, inputPassword, e.target.value);
                }}
                placeholder="请输入图片验证码"
              />

              <Image
                p={1}
                rounded="lg"
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

            <Button onClick={handleLogin} isDisabled={disableLogin}>
              登录
            </Button>

            {/* <Grid templateColumns="1fr 1fr" gap={2}>
              <Button
                // bgColor="transparent"
                onClick={() => {
                  router.push("/register");
                  loginToggle();
                }}
              >
                注册
              </Button>
              <Button onClick={handleLogin} isDisabled={disableLogin}>
                登录
              </Button>
            </Grid> */}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <VStack spacing={2} align="start" w="full">
            <Flex>
              首次使用？
              <Button
                variant="link"
                color="#7dfffe"
                bgColor="transparent"
                onClick={() => {
                  loginToggle();
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
