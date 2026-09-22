import { useState, useEffect } from "react";
import {
  Text,
  Box,
  Flex,
  Center,
  Input,
  Image,
  VStack,
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
import type { ResetReqBody } from "@/utils/endpoints";

export default function Page() {
  const navigate = useNavigate();

  const { uuid, getUserInfo } = useUserStateStore();

  // 验证码拉取和图片
  const { fetchCaptcha } = useCaptcha();
  const [captchaImageUrl, setCaptchaImageUrl] = useState("");

  const [sendVerifyButtonText, setSendVerifyButtonText] =
    useState("获取验证码");
  // const [disableSendSMS, setDisableSendSMS] = useState(false);

  // const [verifyQQText, setVerifyQQText] = useState("");
  // const [disableVerifyQQ, setDisableVerifyQQ] = useState(false);

  const [passwordAlertText, setPasswordAlertText] = useState("");

  // 填写的表单数据
  const [verifyType, setVerifyType] = useState("email");
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
      verifyType: verifyType,
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
        setCaptchaImageUrl(await fetchCaptcha());
        setInputCaptcha("");
      } else {
        openToast({
          content: getErrorMessage(err, "服务异常，请联系服主处理"),
          status: "error",
        });
      }
    }
  };

  const sendSMS = async (tel: string) => {
    if (!validateTel(tel)) {
      openToast({ content: `请正确填写手机号`, status: "warning" });
      return;
    }

    try {
      // 这两个接口用 code 表达“是 / 否”，需要自己判断
      const exist = await api.telExist(tel);
      if (exist.code === 0) {
        openToast({ content: "该手机号未被注册", status: "warning" });
        return;
      }

      const verify = await api.verifyTEL(tel);
      openToast({
        content: verify.msg ?? "服务异常，请联系服主处理",
        status: verify.code === 0 ? "success" : "warning",
      });
      if (verify.code === 0) setSendVerifyButtonText("验证码已发");
    } catch (err) {
      openToast({
        content: getErrorMessage(err, "服务异常，请联系服主处理"),
        status: "error",
      });
    }
  };

  const sendEmail = async (email: string) => {
    if (!validateEmail(email)) {
      openToast({ content: `请正确填写电子邮箱`, status: "warning" });
      return;
    }

    try {
      const exist = await api.emailExist(email);
      if (exist.code === 0) {
        openToast({ content: "该电子邮箱未被注册", status: "warning" });
        return;
      }

      const verify = await api.verifyEmail(email);
      openToast({
        content: verify.msg ?? "服务异常，请联系服主处理",
        status: verify.code === 0 ? "success" : "warning",
      });
      if (verify.code === 0) setSendVerifyButtonText("验证码已发");
    } catch (err) {
      openToast({
        content: getErrorMessage(err, "服务异常，请联系服主处理"),
        status: "error",
      });
    }
  };

  return (
    <Center>
      <VStack spacing={3} align="stretch" maxW="300px" onKeyDown={handleEnter}>
        {/* <Flex>
          重置方式
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
        </Flex> */}
        <Text textAlign="center">
          本页面仅支持通过电子邮箱找回密码
          <br />
          如果仅绑定了手机号，联系服主找回
        </Text>

        <Input
          type="text"
          value={inputAccount}
          onChange={(e) => setInputAccount(e.target.value)}
          placeholder={verifyType === "tel" ? "请输入手机号" : "请输入电子邮箱"}
        />

        <Flex>
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
              setCaptchaImageUrl(await fetchCaptcha());
              setInputCaptcha("");
            }}
            src={captchaImageUrl ? captchaImageUrl : undefined}
            alt="验证码"
            cursor="pointer"
          />
        </Flex>

        <Button onClick={handleReset}>提交</Button>
      </VStack>
    </Center>
  );
}
