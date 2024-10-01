"use client";

import {
  Box,
  Flex,
  Text,
  VStack,
  Heading,
  Divider,
  Image,
  Center,
  Input,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import { useUserStateStore } from "@/store/user-state";
import { useDisclosureStore } from "@/store/disclosure";
import { Button } from "@/components/universal/button";
import { useState, useEffect } from "react";
import { openToast } from "@/components/universal/toast";
import {
  getHash,
  validatePassword,
  validateTel,
  timestampToDateString,
} from "@/utils/strings";
import { getAuthToken, setAuthToken } from "@/store/authKey";
import useCaptcha from "@/utils/GetCaptcha";
import { useRouter } from "next/navigation";

export default function UserProfilePage() {
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { uuid, getUserInfo, userInfo, logout } = useUserStateStore();
  const { onToggle: loginToggle } = useDisclosureStore((state) => {
    return state.modifyLoginDisclosure;
  });
  const { onToggle: getWgnumToggle } = useDisclosureStore((state) => {
    return state.modifyGetWgnumDisclosure;
  });

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

  // 验证码拉取和图片
  const { fetchCaptcha } = useCaptcha();
  const [captchaImage, setCaptchaImage] = useState("");

  // 填写的表单数据
  const [inputNum, setInputNum] = useState("");
  const [inputCaptcha, setInputCaptcha] = useState("");

  // 修改用户名
  const [inputUsername, setInputUsername] = useState(userInfo?.username);
  const [hideModifyUsername, setHideModifyUsername] = useState(true);

  const modifyUsername = async (username: string) => {
    const req_data = {
      username: username,
    };
    const resp = await fetch(`${apiUrl}/modifyUsername`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(req_data),
    });

    if (resp.ok) {
      const data = await resp.json();
      if (data.code === 0) {
        openToast({ content: "修改成功" });
        getUserInfo();
      } else {
        openToast({ content: data.msg });
      }
    } else {
      openToast({ content: "服务异常，请联系服主处理" });
    }
  };

  // 绑定QQ相关
  const {
    isOpen: bindQQIsOpen,
    onOpen: bindQQOnOpen,
    onClose: bindQQOnClose,
  } = useDisclosure();

  const [verifyQQText, setVerifyQQText] = useState("");
  const [disableVerifyQQ, setDisableVerifyQQ] = useState(false);
  const [checkVerifyQQ, setCheckVerifyQQ] = useState(false);

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

  const handleBindQQ = async () => {
    const req_data = {
      qq: inputNum,
      uuid: uuid,
      captcha_code: inputCaptcha,
    };
    const resp = await fetch(`${apiUrl}/bindQQ`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(req_data),
    });

    if (resp.ok) {
      const data = await resp.json();
      if (data.code === 0) {
        openToast({ content: "绑定新QQ成功" });
        getUserInfo();
        bindQQOnClose();
      } else {
        openToast({ content: data.msg });
        setCaptchaImage(await fetchCaptcha());
      }
    } else {
      openToast({ content: "服务异常，请联系服主处理" });
    }
  };

  // 绑定手机相关
  const {
    isOpen: bindTELIsOpen,
    onOpen: bindTELOnopen,
    onClose: bindTELOnClose,
  } = useDisclosure();

  const [sendSMSText, setSendSMSText] = useState("获取验证码");
  const [disableSendSMS, setDisableSendSMS] = useState(false);
  const [inputTelCode, setInputTelCode] = useState("");

  const sendSMS = async (tel: string) => {
    const resp = await fetch(`${apiUrl}/telExist?tel=${tel}`);
    if (resp.ok) {
      const data = await resp.json();
      if (data.code === 1) {
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

  const handleBindTEL = async () => {
    const req_data = {
      tel: inputNum,
      tel_verify_code: inputTelCode,
      uuid: uuid,
      captcha_code: inputCaptcha,
    };
    const resp = await fetch(`${apiUrl}/bindTEL`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(req_data),
    });

    if (resp.ok) {
      const data = await resp.json();
      if (data.code === 0) {
        openToast({ content: "绑定新手机成功" });
        getUserInfo();
        bindTELOnClose();
      } else {
        openToast({ content: data.msg });
        setCaptchaImage(await fetchCaptcha());
      }
    } else {
      openToast({ content: "服务异常，请联系服主处理" });
    }
  };

  // 修改密码相关
  const {
    isOpen: changePassIsOpen,
    onOpen: changePassOnopen,
    onClose: changePassOnClose,
  } = useDisclosure();

  const [inputPassword0, setInputPassword0] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [inputPassword2, setInputPassword2] = useState("");
  const [passwordAlertText, setPasswordAlertText] = useState("");

  const checkPassword = (pass1: string, pass2: string) => {
    if (pass1 && pass2 && pass1 !== pass2) {
      setPasswordAlertText("两次输入的密码不一致");
      return;
    }

    if (pass1 && !validatePassword(pass1)) {
      setPasswordAlertText("不低于8位，包含数字和大小写字母");
      return;
    }
    setPasswordAlertText("");
  };

  const handleChangePass = async () => {
    if (passwordAlertText) {
      openToast({ content: "密码不符合要求" });
      return;
    }

    if (!(inputPassword0 && inputPassword && inputPassword2)) {
      openToast({ content: "请完成资料填写" });
      return;
    }

    const req_data = {
      password: getHash(inputPassword0),
      newPassword: getHash(inputPassword),
    };
    const resp = await fetch(`${apiUrl}/changePassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(req_data),
    });

    if (resp.ok) {
      const data = await resp.json();
      if (data.code === 0) {
        openToast({ content: "修改密码成功" });
        setAuthToken(data.token);
        changePassOnClose();
      } else {
        openToast({ content: data.msg });
      }
    } else {
      openToast({ content: "服务异常，请联系服主处理" });
    }
  };

  return (
    <Center>
      <Modal isOpen={bindQQIsOpen} onClose={bindQQOnClose}>
        <ModalOverlay />
        <ModalContent bgColor="#274161" maxW="320px">
          <ModalHeader textAlign="center">
            {userInfo?.qq ? "改绑QQ" : "绑定QQ"}
          </ModalHeader>

          <ModalCloseButton />

          <ModalBody>
            <VStack spacing={2} align="stretch">
              {isQQ ? (
                <>
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
                          setCheckVerifyQQ(false);
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
                            sendQQVerify(inputNum, checkVerifyQQ ? 1 : 0);
                          }
                        }}
                      >
                        验证QQ
                      </Button>
                    </Flex>
                    <Text color="#ffd648">{verifyQQText}</Text>
                  </Box>
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
                  <Button onClick={handleBindQQ}>提交</Button>
                </>
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={bindTELIsOpen} onClose={bindTELOnClose}>
        <ModalOverlay />
        <ModalContent bgColor="#274161" maxW="320px">
          <ModalHeader textAlign="center">
            {userInfo?.tel ? "改绑手机" : "绑定手机"}
          </ModalHeader>

          <ModalCloseButton />

          <ModalBody>
            <VStack spacing={2} align="stretch">
              {isQQ ? (
                <>
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
                </>
              ) : (
                <>
                  {" "}
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
                  <Button onClick={handleBindTEL}>提交</Button>
                </>
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={changePassIsOpen} onClose={changePassOnClose}>
        <ModalOverlay />
        <ModalContent bgColor="#274161" maxW="300px">
          <ModalHeader textAlign="center">修改密码</ModalHeader>

          <ModalCloseButton />

          <ModalBody>
            <VStack spacing={2} align="stretch">
              <Input
                type="password"
                value={inputPassword0}
                onChange={(e) => setInputPassword0(e.target.value)}
                placeholder="请输入旧密码"
              />

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
                placeholder="请重复一次新密码"
              />

              <Button onClick={handleChangePass}>提交</Button>

              <Button
                py={1}
                variant="link"
                color="#7dfffe"
                bgColor="transparent"
                onClick={() => {
                  changePassOnClose();
                  router.push("/forgetPass");
                }}
              >
                忘记密码
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Box px={5} w={{ md: "320px", base: "86vw" }}>
        {userInfo ? (
          <VStack spacing={1} align="stretch">
            <Heading mb={1} size="md" textAlign="center">
              账号信息
            </Heading>

            <Flex>
              <Text w="50px" textAlign="right">
                UID:
              </Text>
              <Text ml={5}>{userInfo.uid}</Text>
            </Flex>

            <Divider />

            <Flex>
              <Text w="50px" textAlign="right">
                昵称:
              </Text>

              <Input
                ml={5}
                w="8rem"
                fontSize="md"
                size="xs"
                value={inputUsername}
                onChange={(e) => {
                  setInputUsername(e.target.value);
                  if (e.target.value === userInfo.username) {
                    setHideModifyUsername(true);
                  } else {
                    setHideModifyUsername(false);
                  }
                }}
                placeholder="请输入昵称"
              />
              <Button
                hidden={hideModifyUsername}
                ml={1}
                color="#7dfffe"
                fontWeight="normal"
                variant="link"
                bgColor="transparent"
                onClick={() => {
                  if (inputUsername) {
                    modifyUsername(inputUsername);
                  }
                }}
              >
                修改
              </Button>
            </Flex>

            <Divider />

            <Flex>
              <Text w="50px" textAlign="right">
                QQ:
              </Text>
              <Flex ml={5}>
                {userInfo.qq}

                <Button
                  ml={3}
                  color="#7dfffe"
                  fontWeight="normal"
                  variant="link"
                  bgColor="transparent"
                  onClick={async () => {
                    setCaptchaImage(await fetchCaptcha());
                    bindQQOnOpen();
                    setInputNum("");
                    setInputCaptcha("");
                    setDisableVerifyQQ(false);
                    setCheckVerifyQQ(false);
                    setVerifyQQText("");
                  }}
                >
                  {userInfo.qq ? "换绑" : "点击绑定（非必要）"}
                </Button>
              </Flex>
            </Flex>

            <Divider />

            <Flex>
              <Text w="50px" textAlign="right">
                手机:
              </Text>
              <Flex ml={5}>
                {userInfo.tel}

                <Button
                  ml={3}
                  color="#7dfffe"
                  fontWeight="normal"
                  variant="link"
                  bgColor="transparent"
                  onClick={async () => {
                    setCaptchaImage(await fetchCaptcha());
                    bindTELOnopen();
                    setInputNum("");
                    setInputCaptcha("");
                    setSendSMSText("获取验证码");
                    setDisableSendSMS(false);
                    setInputTelCode("");
                  }}
                >
                  {userInfo.tel ? "换绑" : "点击绑定（非必要）"}
                </Button>
              </Flex>
            </Flex>

            {userInfo.wg_data ? (
              <VStack spacing={1} mt={5} align="stretch">
                <Heading mb={1} size="md" textAlign="center">
                  联机信息
                </Heading>

                <Flex>
                  <Text w="80px" textAlign="right">
                    联机编号:
                  </Text>
                  <Text ml={5}>{userInfo.wg_data.wgnum}</Text>
                </Flex>

                <Divider />

                <Flex>
                  <Text w="80px" textAlign="right">
                    IP地址:
                  </Text>
                  <Text ml={5}>{userInfo.wg_data.wg_ip}</Text>
                </Flex>

                <Divider />

                <Flex>
                  <Text w="80px" textAlign="right">
                    可用天数:
                  </Text>
                  <Text ml={5}>{userInfo.wg_data.ttl}</Text>
                </Flex>

                <Divider />

                <Flex>
                  <Text w="80px" textAlign="right">
                    最后连接:
                  </Text>
                  <Text ml={5}>
                    {userInfo.wg_data.last_connect_timestamp
                      ? timestampToDateString(
                          userInfo.wg_data.last_connect_timestamp
                        )
                      : "未连接过"}
                  </Text>
                </Flex>

                <Button
                  mt={2}
                  size="sm"
                  w="100px"
                  alignSelf="center"
                  bgColor="#992e98"
                  onClick={() => {
                    window.open(
                      "https://www.bilibili.com/video/BV1MK4y1s7mS",
                      "_blank"
                    );
                  }}
                >
                  联机教程
                </Button>
              </VStack>
            ) : (
              <VStack spacing={3} mt={5} align="center">
                <Heading size="md" color="#ffa629">
                  你还没联机编号呢
                </Heading>

                <Button
                  rounded={5}
                  onClick={getWgnumToggle}
                  bgColor="#007bc0"
                  size="sm"
                >
                  点我获取编号
                </Button>
              </VStack>
            )}

            <VStack spacing={5} mt={5}>
              <Button
                variant="link"
                bgColor="transparent"
                color="#7dfffe"
                onClick={() => changePassOnopen()}
              >
                修改密码
              </Button>

              <Button
                variant="link"
                bgColor="transparent"
                color="#ff3f0b"
                onClick={() => logout()}
              >
                退出登录
              </Button>
            </VStack>
          </VStack>
        ) : (
          <VStack spacing={6} align="center">
            <Heading size="md">你还没登陆呢</Heading>

            <Button
              variant="outline"
              rounded={10}
              onClick={loginToggle}
              border={0}
            >
              点击登录
            </Button>
          </VStack>
        )}
      </Box>
    </Center>
  );
}
