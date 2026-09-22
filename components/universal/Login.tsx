import { Button } from "./button";
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
  Flex,
  Image,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useUserStateStore } from "@/store/user-state";
import { useEffect, useState } from "react";
import useCaptcha from "@/utils/GetCaptcha";
import { openToast } from "./toast";
import { getHash, getErrorMessage } from "@/utils/strings";
import { setAuthToken } from "@/store/authKey";
import { ApiError, isBusinessError } from "@/utils/api";
import { api } from "@/utils/endpoints";
import type { LoginReqBody } from "@/utils/endpoints";

export default function LoginModal() {
  const navigate = useNavigate();

  const { userInfo, uuid, getUserInfo, showLoginModal, setShowLoginModal } =
    useUserStateStore();

  // 验证码拉取和图片
  const { fetchCaptcha } = useCaptcha();
  const [captchaImageUrl, setCaptchaImageUrl] = useState("");

  // 填写的表单数据
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
    inputCaptcha: string,
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

    const req_data: LoginReqBody = {
      account: inputAccount,
      password: getHash(inputPassword),
      uuid: uuid,
      captcha_code: inputCaptcha.toLowerCase(),
    };

    try {
      const token = await api.login(req_data);
      openToast({ content: "登陆成功", status: "success" });
      if (token) setAuthToken(token);
      getUserInfo();
      setShowLoginModal();
    } catch (err) {
      if (err instanceof ApiError && err.isAuthError) {
        openToast({ content: "账号或密码错误", status: "warning" });
      } else if (isBusinessError(err)) {
        openToast({ content: err.message, status: "warning" });
      } else {
        openToast({
          content: getErrorMessage(err, "服务异常，请联系服主处理"),
          status: "error",
        });
        return;
      }

      // 登录失败后刷新验证码
      setCaptchaImageUrl(await fetchCaptcha());
      setInputCaptcha("");
    }
  };

  return (
    <Modal isOpen={showLoginModal} onClose={setShowLoginModal}>
      <ModalOverlay />
      <ModalContent bgColor="#274161" w="320px" mx={3}>
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
                    inputCaptcha,
                  );
                }}
                placeholder="请输入手机或邮箱"
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
                  navigate("/forgetPass");
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
                    e.target.value,
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
                  navigate("/register");
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
