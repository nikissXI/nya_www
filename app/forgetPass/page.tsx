"use client";

import { useState, useEffect } from "react";
import {
  Text,
  Box,
  Flex,
  Center,
  Input,
  Image,
  VStack,
  RadioGroup,
  Radio,
  Stack,
} from "@chakra-ui/react";
import { openToast } from "@/components/universal/toast";
import useCaptcha from "@/utils/GetCaptcha";
import { useUserStateStore } from "@/store/user-state";
import { Button } from "@/components/universal/button";
import {
  getHash,
  validatePassword,
  validateTel,
  isInteger,
} from "@/utils/strings";
import { useRouter } from "next/navigation";
import { setAuthToken } from "@/store/authKey";

interface ResetReqBody {
  verifyType: string; // 注册类型：qq或tel
  num: number; // 手机或QQ
  tel_verify_code: string; // 手机验证码
  password: string; // 登陆密码sha256
  uuid: string; // 表单uuid
  captcha_code: string; // 表单图片验证码
}

export default function Page() {
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const { uuid, getUserInfo } = useUserStateStore();

  // 验证码拉取和图片
  const { fetchCaptcha } = useCaptcha();
  const [captchaImage, setCaptchaImage] = useState("");

  const [sendSMSText, setSendSMSText] = useState("获取验证码");
  const [disableSendSMS, setDisableSendSMS] = useState(false);

  const [verifyQQText, setVerifyQQText] = useState("");
  const [disableVerifyQQ, setDisableVerifyQQ] = useState(false);

  const [passwordAlertText, setPasswordAlertText] = useState("");

  // 填写的表单数据
  const [verifyType, setVerifyType] = useState("tel");
  const [inputNum, setInputNum] = useState("");
  const [inputTelCode, setInputTelCode] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [inputPassword2, setInputPassword2] = useState("");
  const [inputCaptcha, setInputCaptcha] = useState("");

  // 检测是否在QQ内打开
  const [copyButtonText, setCopyButtonText] =
    useState("点击复制网页链接到剪切板");
  const [isQQ, setIsQQ] = useState(false);
  useEffect(() => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("QQ/") || userAgent.includes("WeChat/")) {
      setIsQQ(true);
    }
  }, []);

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.permissions) {
        await navigator.clipboard.writeText(window.location.href);
        setCopyButtonText("链接已复制到剪切板");
      } else {
        throw new Error("不支持自动复制");
      }
    } catch (err) {
      openToast({ content: String(err) });
      setCopyButtonText("复制链接失败，请自行复制");
    }
  };

  useEffect(() => {
    const loadCaptcha = async () => {
      setCaptchaImage(await fetchCaptcha());
    };
    loadCaptcha();
  }, [fetchCaptcha]);

  const checkPassword = (pass1: string, pass2: string) => {
    if (pass1 && pass2 && pass1 !== pass2) {
      setPasswordAlertText("两次输入的密码不一致");
      return;
    }
    if (pass1 && !validatePassword(pass1)) {
      setPasswordAlertText("不低于8位，包含数字和字母");
      return;
    }
    setPasswordAlertText("");
  };

  const handleEnter = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      handleReset();
    }
  };

  const handleReset = async () => {
    if (passwordAlertText) {
      openToast({ content: "密码要求：不低于8位，包含数字和字母" });
      return;
    }

    if (
      !(
        inputNum &&
        inputCaptcha &&
        ((verifyType === "tel" && inputTelCode) || verifyType === "qq")
      )
    ) {
      openToast({ content: "请完成资料填写" });
      return;
    }

    const req_data: ResetReqBody = {
      verifyType: verifyType,
      num: Number(inputNum),
      tel_verify_code: inputTelCode,
      password: getHash(inputPassword),
      uuid: uuid,
      captcha_code: inputCaptcha.toLowerCase(),
    };
    const resp = await fetch(`${apiUrl}/resetPass`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req_data),
    });

    if (resp.ok) {
      const data = await resp.json();
      if (data.code === 0) {
        openToast({ content: "重置密码成功，跳转到“个人中心”页面" });
        setAuthToken(data.token);
        getUserInfo();
        router.push("/me");
      } else {
        openToast({ content: data.msg });
        setCaptchaImage(await fetchCaptcha());
        setInputCaptcha("");
      }
    } else {
      openToast({ content: "服务异常，请联系服主处理" });
    }
  };

  const sendSMS = async (tel: string) => {
    if (!isInteger(tel)) {
      openToast({ content: `请正确填写手机号` });
      return;
    }

    const resp = await fetch(`${apiUrl}/telExist?tel=${tel}`);
    if (resp.ok) {
      const data = await resp.json();
      if (data.code === 0) {
        openToast({ content: "该手机号未被注册" });
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

  const sendQQVerify = async (qq: string) => {
    if (!isInteger(qq)) {
      openToast({ content: `请正确填写QQ号` });
      return;
    }

    const resp = await fetch(`${apiUrl}/qqExist?qq=${qq}`);
    if (resp.ok) {
      const data = await resp.json();
      if (data.code === 0) {
        setVerifyQQText("该QQ号未被注册");
      } else {
        const resp = await fetch(`${apiUrl}/verifyQQ?uuid=${uuid}&qq=${qq}`);
        if (resp.ok) {
          const data = await resp.json();
          if (data.code === 0) {
            setVerifyQQText(data.msg);
            setDisableVerifyQQ(true);
          } else {
            setVerifyQQText(data.msg);
          }
        }
      }
    } else {
      setVerifyQQText("服务异常，请联系服主处理");
    }
  };

  if (isQQ) {
    return (
      <VStack spacing={3} align="center">
        <Text color="#ffd648" fontSize="16px">
          在QQ或微信中无法使用该功能
          <br />
          请到浏览器中打开网站再操作
          <br />
          如果误触发请联系群主处理，谢谢
        </Text>

        <Button size="sm" onClick={handleCopyLink}>
          {copyButtonText}
        </Button>

        {copyButtonText === "点我复制链接到浏览器打开" ? (
          ""
        ) : (
          <Text>
            如果复制失败就手动复制吧
            <br />
            {window.location.href}
          </Text>
        )}
      </VStack>
    );
  }

  return (
    <Center>
      <VStack spacing={3} align="stretch" maxW="300px" onKeyDown={handleEnter}>
        <Flex>
          重置方式
          <RadioGroup
            ml={5}
            defaultValue="tel"
            onChange={(value) => {
              setInputNum("");
              setVerifyType(value);
            }}
          >
            <Stack spacing={4} direction="row">
              <Radio value="tel">手机</Radio>
              <Radio value="qq">QQ</Radio>
            </Stack>
          </RadioGroup>
        </Flex>

        {verifyType === "tel" ? (
          <>
            <Input
              type="number"
              value={inputNum}
              onChange={(e) => setInputNum(e.target.value)}
              placeholder="请输入手机号"
            />

            <Flex>
              <Input
                type="number"
                value={inputTelCode}
                onChange={(e) => setInputTelCode(e.target.value)}
                placeholder="请输入短信验证码"
              />

              <Button
                ml={1}
                px={6}
                fontSize="15px"
                isDisabled={disableSendSMS}
                onClick={() => {
                  if (inputNum) {
                    if (validateTel(inputNum)) {
                      sendSMS(inputNum);
                    } else {
                      openToast({ content: "请正确输入手机号" });
                    }
                  }
                }}
              >
                {sendSMSText}
              </Button>
            </Flex>
          </>
        ) : (
          <>
            <Box>
              <Flex>
                <Input
                  type="number"
                  value={inputNum}
                  onChange={(e) => {
                    setInputNum(e.target.value);
                    setDisableVerifyQQ(false);
                    setVerifyQQText("");
                  }}
                  placeholder="请输入QQ号"
                />

                <Button
                  ml={1}
                  px={6}
                  fontSize="15px"
                  isDisabled={disableVerifyQQ}
                  onClick={() => {
                    if (inputNum) {
                      sendQQVerify(inputNum);
                    }
                  }}
                >
                  验证QQ
                </Button>
              </Flex>

              <Text color="#ffd648">{verifyQQText}</Text>
            </Box>
          </>
        )}

        <Box>
          <Input
            type="password"
            value={inputPassword}
            onChange={(e) => {
              setInputPassword(e.target.value);
              checkPassword(e.target.value, inputPassword2);
            }}
            placeholder="请输入新密码"
          />

          <Text color="#ffd648" fontSize="14px">
            {passwordAlertText}
          </Text>
        </Box>

        <Input
          type="password"
          value={inputPassword2}
          onChange={(e) => {
            setInputPassword2(e.target.value);
            checkPassword(inputPassword, e.target.value);
          }}
          placeholder="请重复一次密码"
        />

        <Flex>
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

        <Button onClick={handleReset}>提交</Button>
      </VStack>
    </Center>
  );
}
