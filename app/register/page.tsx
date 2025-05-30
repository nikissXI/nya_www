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
  validateEmail,
} from "@/utils/strings";
import { useRouter } from "next/navigation";
import { setAuthToken } from "@/store/authKey";

interface RegisterReqBody {
  verifyType: string; // 注册类型：tel或email
  account: string; // 手机或邮箱
  verify_code: string; // 手机验证码
  username: string; // 登陆用户名
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

  const [sendVerifyButtonText, setSendVerifyButtonText] =
    useState("获取验证码");

  // const [verifyQQText, setVerifyQQText] = useState("");
  // const [disableVerifyQQ, setDisableVerifyQQ] = useState(false);

  const [passwordAlertText, setPasswordAlertText] = useState("");

  // 填写的表单数据
  const [verifyType, setVerifyType] = useState("email");
  const [inputAccount, setInputAccount] = useState("");
  const [inputVerifyCode, setInputVerifyCode] = useState("");
  const [inputUsername, setInputUsername] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [inputPassword2, setInputPassword2] = useState("");
  const [inputCaptcha, setInputCaptcha] = useState("");

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
        // inputVerifyCode &&
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

    const req_data: RegisterReqBody = {
      verifyType: verifyType,
      account: inputAccount,
      verify_code: inputVerifyCode,
      username: inputUsername,
      password: getHash(inputPassword),
      uuid: uuid,
      captcha_code: inputCaptcha.toLowerCase(),
    };

    const resp = await fetch(`${apiUrl}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req_data),
    });

    if (resp.ok) {
      const data = await resp.json();
      if (data.code === 0) {
        openToast({
          content: "注册成功，跳转到“个人中心”页面",
          status: "success",
        });
        setAuthToken(data.token);
        getUserInfo();
        router.push("/me");
      } else {
        openToast({ content: data.msg, status: "warning" });
        setCaptchaImage(await fetchCaptcha());
        setInputCaptcha("");
      }
    } else {
      openToast({ content: "服务异常，请联系服主处理", status: "error" });
    }
  };

  const sendSMS = async (tel: string) => {
    if (!validateTel(tel)) {
      openToast({ content: `请正确填写手机号`, status: "warning" });
      return;
    }

    const resp = await fetch(`${apiUrl}/telExist?tel=${tel}`);
    if (resp.ok) {
      const data = await resp.json();
      if (data.code === 1) {
        openToast({ content: "该手机号已被注册", status: "warning" });
      } else {
        const resp = await fetch(`${apiUrl}/verifyTEL?tel=${tel}`);
        if (resp.ok) {
          const data = await resp.json();
          if (data.code === 0) {
            openToast({ content: data.msg, status: "success" });
            setSendVerifyButtonText("验证码已发");
          } else {
            openToast({ content: data.msg, status: "warning" });
          }
        }
      }
    } else {
      openToast({ content: "服务异常，请联系服主处理", status: "error" });
    }
  };

  const sendEmail = async (email: string) => {
    if (!validateEmail(email)) {
      openToast({ content: `请正确填写电子邮箱`, status: "warning" });
      return;
    }

    const resp = await fetch(`${apiUrl}/emailExist?email=${email}`);
    if (resp.ok) {
      const data = await resp.json();
      if (data.code === 1) {
        openToast({ content: "该电子邮箱已被注册", status: "warning" });
      } else {
        const resp = await fetch(`${apiUrl}/verifyEmail?email=${email}`);
        if (resp.ok) {
          const data = await resp.json();
          if (data.code === 0) {
            openToast({ content: data.msg, status: "success" });
            setSendVerifyButtonText("验证码已发");
          } else {
            openToast({ content: data.msg, status: "warning" });
          }
        }
      }
    } else {
      openToast({ content: "服务异常，请联系服主处理", status: "error" });
    }
  };

  // const sendQQVerify = async (qq: string) => {
  //   if (!isInteger(qq)) {
  //     openToast({ content: `请正确填写QQ号` });
  //     return;
  //   }

  //   const resp = await fetch(`${apiUrl}/qqExist?qq=${qq}`);
  //   if (resp.ok) {
  //     const data = await resp.json();
  //     if (data.code === 1) {
  //       setVerifyQQText("该QQ号已被注册");
  //     } else {
  //       const resp = await fetch(`${apiUrl}/verifyQQ?uuid=${uuid}&qq=${qq}`);
  //       if (resp.ok) {
  //         const data = await resp.json();
  //         if (data.code === 0) {
  //           setVerifyQQText(data.msg);
  //           setDisableVerifyQQ(true);
  //         } else {
  //           setVerifyQQText(data.msg);
  //         }
  //       }
  //     }
  //   } else {
  //     setVerifyQQText("服务异常，请联系服主处理");
  //   }
  // };

  // if (isQQ) {
  //   return (
  //     <VStack spacing={3} align="center">
  //       <Text color="#ffd648" fontSize="16px">
  //         在QQ或微信中无法使用该功能
  //         <br />
  //         请到浏览器中打开网站再操作
  //         <br />
  //         如果误触发请联系群主处理，谢谢
  //       </Text>

  //       <Button size="sm" onClick={handleCopyLink}>
  //         {copyButtonText}
  //       </Button>

  //       {copyButtonText === "点我复制链接到浏览器打开" ? (
  //         ""
  //       ) : (
  //         <Text>
  //           如果复制失败就手动复制吧
  //           <br />
  //           {window.location.href}
  //         </Text>
  //       )}
  //     </VStack>
  //   );
  // }

  return (
    <Center>
      <VStack
        p={5}
        spacing={3}
        align="stretch"
        maxW="300px"
        onKeyDown={handleRegisterEnter}
      >
        {/* <Text color="#ffd648" fontSize="16px">
          注册尽量用邮箱，短信贵T.T
        </Text> */}

        <Flex>
          注册方式
          <RadioGroup
            ml={3}
            value={verifyType}
            onChange={(value) => {
              setInputAccount("");
              setSendVerifyButtonText("获取验证码");
              setVerifyType(value);
            }}
          >
            <Stack spacing={3} direction="row">
              <Radio value="email">电子邮箱</Radio>
              <Radio value="tel">手机</Radio>
            </Stack>
          </RadioGroup>
        </Flex>

        <Text display={verifyType === "email" ? "none" : "flex"}>
          建议使用电子邮箱，忘记密码无法通过手机号找回
        </Text>

        <Input
          type="text"
          value={inputAccount}
          onChange={(e) => setInputAccount(e.target.value)}
          placeholder={verifyType === "tel" ? "请输入手机号" : "请输入电子邮箱"}
        />

        <Flex display={verifyType === "tel" ? "none" : "flex"}>
          <Input
            type="number"
            value={inputVerifyCode}
            onChange={(e) => setInputVerifyCode(e.target.value)}
            placeholder="请输入验证码"
          />

          <Button
            ml={1}
            px={6}
            fontSize="15px"
            onClick={() => {
              if (!inputAccount) return;

              if (verifyType === "tel") sendSMS(inputAccount);
              else sendEmail(inputAccount);
            }}
          >
            {sendVerifyButtonText}
          </Button>
        </Flex>

        <Box>
          <Input
            value={inputUsername}
            onChange={(e) => setInputUsername(e.target.value)}
            placeholder="请输入账号昵称"
          />

          <Text color="#ffffff82" fontSize="13px">
            允许中文、字母、数字，不超过10个字符
          </Text>
        </Box>

        <Box>
          <Input
            type="password"
            value={inputPassword}
            onChange={(e) => {
              setInputPassword(e.target.value);
              checkPassword(e.target.value, inputPassword2);
            }}
            placeholder="请输入密码"
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
            src={captchaImage ? captchaImage : undefined}
            alt="验证码"
            cursor="pointer"
          />
        </Flex>

        <Button onClick={handleRegister}>注册</Button>
      </VStack>
    </Center>
  );
}
