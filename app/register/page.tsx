"use client";

import { useState, useEffect, useRef } from "react";
import {
  Text,
  Box,
  FormControl,
  FormLabel,
  Flex,
  Center,
  Input,
  Select,
  Image,
  VStack,
  RadioGroup,
  Radio,
  Stack,
} from "@chakra-ui/react";
import { openToast } from "@/components/universal/toast";
import useCaptcha from "@/hooks/GetCaptcha";
import { useUserStateStore } from "@/store/user-state";
import { Button } from "@/components/universal/button";
import {
  getHash,
  validatePassword,
  validateUsername,
  validateTel,
} from "@/utils/strings";
import { useRouter } from "next/navigation";

interface RegisterReqBody {
  verifyType: string; // 注册类型：qq或tel
  num: number; // 手机或QQ
  tel_verify_code: string; // 手机验证码
  username: string; // 登陆用户名
  password: string; // 登陆密码sha256
  uuid: string; // 表单uuid
  captcha_code: string; // 表单图片验证码
}

export default function Page() {
  const router = useRouter();
  const { uuid, getUserInfo } = useUserStateStore();

  const { fetchCaptcha } = useCaptcha();
  const [registerType, setRegisterType] = useState<"tel" | "qq">("tel");
  const [captchaImage, setCaptchaImage] = useState("");
  const [sendSMSText, setSendSMSText] = useState("获取验证码");

  const [verifyQQText, setVerifyQQText] = useState("");
  const [disableVerifyQQ, setDisableVerifyQQ] = useState(false);
  const [checkVerifyQQ, setCheckVerifyQQ] = useState(false);

  const [disableSendSMS, setDisableSendSMS] = useState(false);
  const [passwordAlertText, setPasswordAlertText] = useState("");

  const numRef = useRef<HTMLInputElement>(null);
  const telCodeRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const password2Ref = useRef<HTMLInputElement>(null);
  const captchaRef = useRef<HTMLInputElement>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [copyButtonText, setCopyButtonText] =
    useState<string>("点我复制链接到浏览器打开");
  const [isQQ, setIsQQ] = useState<boolean>(false);
  useEffect(() => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("QQ/")) {
      setIsQQ(true);
    }
  }, []);

  useEffect(() => {
    const loadCaptcha = async () => {
      const url = await fetchCaptcha();
      setCaptchaImage(url);
    };
    loadCaptcha();
  }, [fetchCaptcha]);

  const checkPassword = () => {
    if (
      passwordRef.current?.value &&
      password2Ref.current?.value &&
      passwordRef.current.value !== password2Ref.current.value
    ) {
      setPasswordAlertText("两次输入的密码不一致");
      return;
    }
    if (
      passwordRef.current?.value &&
      !validatePassword(passwordRef.current.value)
    ) {
      setPasswordAlertText("不低于8位，包含数字和大小写字母");
      return;
    }
    setPasswordAlertText("");
  };

  const handleRegister = async (data: RegisterReqBody) => {
    const response = await fetch(`${apiUrl}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.code === 0) {
        openToast({ content: "注册成功，跳转到“我的信息”页面" });
        localStorage.setItem("token", data.token);
        getUserInfo();
        // router.push("/me");
      } else {
        openToast({ content: data.msg });
        const imageUrl = await fetchCaptcha();
        setCaptchaImage(imageUrl);
      }
    } else {
      openToast({ content: "服务异常，请联系服主处理" });
    }
  };

  const sendSMS = async (tel: string) => {
    const resp = await fetch(`${apiUrl}/telExist?tel=${tel}`);
    if (resp.ok) {
      const data = await resp.json();
      if (data.code === 1) {
        openToast({ content: "该手机号已被注册" });
      } else {
        const resp = await fetch(`${apiUrl}/verifyTEL?tel=${tel}`);
        if (resp.ok) {
          const data = await resp.json();
          if (data.code === 0) {
            openToast({ content: data.msg });
            setDisableSendSMS(true);
            setSendSMSText("验证码已送");
          } else {
            openToast({ content: data.msg });
          }
        }
      }
    } else {
      openToast({ content: "服务异常，请联系服主处理" });
    }
  };

  const sendQQVerify = async (qq: string, verified: number) => {
    const resp = await fetch(`${apiUrl}/qqExist?qq=${qq}`);
    if (resp.ok) {
      const data = await resp.json();
      if (data.code === 1) {
        setVerifyQQText("该QQ号已被注册");
      } else {
        const resp = await fetch(
          `${apiUrl}/verifyQQ?uuid=${uuid}&qq=${qq}&verified=${verified}`
        );
        if (resp.ok) {
          const data = await resp.json();
          if (data.code === 0) {
            setVerifyQQText(data.msg);
            if (verified === 0) {
              setCheckVerifyQQ(true);
            } else {
              setDisableVerifyQQ(true);
            }
          } else {
            setVerifyQQText(data.msg);
          }
        }
      }
    } else {
      setVerifyQQText("服务异常，请联系服主处理");
    }
  };

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopyButtonText("链接已复制到剪切板");
    } catch (err) {
      alert(err);
      setCopyButtonText("复制链接失败");
    }
  };

  return (
    <Center>
      <Box p={5} maxW="300px">
        <VStack spacing={4} align="stretch">
          {isQQ && (
            <>
              <Text color="#ffd648" fontSize="16px">
                在QQ里打开该页面没法注册账号
              </Text>
              <Button size="sm" onClick={handleCopyLink}>
                {copyButtonText}
              </Button>
            </>
          )}

          <FormControl>
            <Flex alignItems="center">
              <RadioGroup
                defaultValue="tel"
                onChange={(value) => setRegisterType(value as "tel" | "qq")}
              >
                <Stack spacing={4} direction="row">
                  <Radio value="tel">使用手机注册</Radio>
                  <Radio value="qq">使用QQ注册</Radio>
                </Stack>
              </RadioGroup>
            </Flex>
          </FormControl>

          {registerType === "tel" ? (
            <>
              <FormControl>
                <Flex alignItems="center">
                  <Input
                    ref={numRef}
                    type="number"
                    placeholder="请输入手机号"
                  />
                </Flex>
              </FormControl>

              <FormControl>
                <Flex alignItems="center">
                  <Input ref={telCodeRef} placeholder="请输入短信验证码" />

                  <Button
                    ml={1}
                    px={6}
                    fontSize="15px"
                    isDisabled={disableSendSMS}
                    onClick={() => {
                      if (numRef.current?.value) {
                        if (validateTel(numRef.current.value)) {
                          sendSMS(numRef.current.value);
                        } else {
                          openToast({ content: "请正确输入手机号" });
                        }
                      }
                    }}
                  >
                    {sendSMSText}
                  </Button>
                </Flex>
              </FormControl>
            </>
          ) : (
            <>
              <FormControl>
                <Flex alignItems="center">
                  <Input
                    ref={numRef}
                    type="number"
                    placeholder="请输入QQ号"
                    onChange={() => {
                      setDisableVerifyQQ(false);
                      setCheckVerifyQQ(false);
                      setVerifyQQText("");
                    }}
                  />

                  <Button
                    ml={1}
                    px={6}
                    fontSize="15px"
                    isDisabled={disableVerifyQQ}
                    onClick={() => {
                      if (numRef.current?.value) {
                        sendQQVerify(
                          numRef.current.value,
                          checkVerifyQQ ? 1 : 0
                        );
                      }
                    }}
                  >
                    校验QQ
                  </Button>
                </Flex>

                <Text color="#ffd648">{verifyQQText}</Text>
              </FormControl>
            </>
          )}

          <FormControl>
            <Flex alignItems="center">
              <Input ref={usernameRef} placeholder="请输入账号昵称" />
            </Flex>
            <Text color="#ffffff82" fontSize="13px">
              允许中文、字母、数字，不超过10个字符
            </Text>
          </FormControl>

          <FormControl>
            <Flex alignItems="center">
              <Input
                ref={passwordRef}
                placeholder="请输入密码"
                type="password"
                onChange={checkPassword}
              />
            </Flex>
            <Text color="#ffd648" fontSize="15px">
              {passwordAlertText}
            </Text>
          </FormControl>

          <FormControl>
            <Flex alignItems="center">
              <Input
                ref={password2Ref}
                placeholder="请再重复一次密码"
                type="password"
                onChange={checkPassword}
              />
            </Flex>
          </FormControl>

          <FormControl>
            <Flex alignItems="center">
              <Input ref={captchaRef} placeholder="请输入图片验证码" />

              <Image
                rounded={5}
                ml={1}
                onClick={async () => {
                  const imageUrl = await fetchCaptcha();
                  setCaptchaImage(imageUrl);
                }}
                src={captchaImage}
                alt="验证码"
                cursor="pointer"
              />
            </Flex>
          </FormControl>

          <Button
            onClick={() => {
              if (passwordAlertText) {
                return;
              }
              if (
                numRef.current?.value &&
                usernameRef.current?.value &&
                passwordRef.current?.value &&
                password2Ref.current?.value &&
                captchaRef.current?.value &&
                ((registerType === "tel" && telCodeRef.current?.value) ||
                  registerType === "qq")
              )
                handleRegister({
                  verifyType: registerType,
                  num: Number(numRef.current.value),
                  tel_verify_code:
                    registerType === "tel"
                      ? (telCodeRef.current?.value as string)
                      : "",
                  username: usernameRef.current.value,
                  password: getHash(passwordRef.current.value),
                  uuid: uuid,
                  captcha_code: captchaRef.current.value.toLowerCase(),
                });
              else {
                openToast({ content: "请完成资料填写" });
              }
            }}
            w="240px"
            alignSelf="center"
          >
            注册
          </Button>
        </VStack>
      </Box>
    </Center>
  );
}
