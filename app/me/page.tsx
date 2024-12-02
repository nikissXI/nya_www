"use client";

import {
  Box,
  Tooltip,
  Flex,
  Text,
  VStack,
  Heading,
  Collapse,
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
import { useState } from "react";
import { openToast } from "@/components/universal/toast";
import { WarningIcon } from "@chakra-ui/icons";
import {
  isInteger,
  getHash,
  validatePassword,
  validateTel,
  timestampToDateString,
  validateEmail,
} from "@/utils/strings";
import { getAuthToken, setAuthToken } from "@/store/authKey";
import useCaptcha from "@/utils/GetCaptcha";
import { useRouter } from "next/navigation";

const calculateDaysDifference = (timestamp: number): string => {
  // 计算时间戳差值（毫秒）
  const timestamp_now = new Date().getTime();
  const differenceInMilliseconds = Math.abs(timestamp_now - timestamp * 1000);

  // 将差值转换为天数
  const millisecondsInADay = 1000 * 60 * 60 * 24; // 1天的毫秒数
  const differenceInDays = Math.floor(
    differenceInMilliseconds / millisecondsInADay
  );

  return `${15 - differenceInDays}天`;
};

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

  const [showTips, setShowTips] = useState(false);

  const tips = [
    "同一个编号不能多个设备同时连接，否则会互相挤掉线。这些网络环境容易连接喵服失败：校园网、公司网、中国大陆外",
    "绑定的编号如果可用天数归零就会解绑，失效的隧道可从WG中删除。需要就领取新的，WG隧道也要导入新的",
    "移动设备联机时，其他人加入时，当主机的游戏不能后台，否则无法加入",
    "只要设备能连上喵服就能互相通信，不限系统，如果游戏支持，可以实现手机与电脑联机",
    "如果喵服网站功能异常，先换一个浏览器试试，不行再找服主反馈",
    "遇到阅读教程后无法解决的问题，就找服主（QQ:1299577815）",
  ];

  // 修改用户名
  const [inputUsername, setInputUsername] = useState(userInfo?.username);
  const [hideModifyUsername, setHideModifyUsername] = useState(true);

  const modifyUsername = async () => {
    if (!inputUsername) return;

    const req_data = {
      username: inputUsername,
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
        openToast({ content: "修改成功", status: "success" });
        getUserInfo();
      } else {
        openToast({ content: data.msg, status: "warning" });
      }
    } else {
      openToast({ content: "服务异常，请联系服主处理", status: "error" });
    }
  };

  const handlemodifyUsernameEnter = (
    event: React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (event.key === "Enter") {
      modifyUsername();
    }
  };

  // 验证码拉取和图片
  const { fetchCaptcha } = useCaptcha();
  const [captchaImage, setCaptchaImage] = useState("");

  // 填写的表单数据
  const [inputAccount, setInputAccount] = useState("");
  const [inputCaptcha, setInputCaptcha] = useState("");

  // 绑定验证用的
  const [sendVerifyButtonText, setSendVerifyButtonText] =
    useState("获取验证码");
  const [inputVerifyCode, setInputVerifyCode] = useState("");

  // 绑定QQ相关
  const {
    isOpen: bindQQIsOpen,
    onOpen: bindQQOnOpen,
    onClose: bindQQOnClose,
  } = useDisclosure();

  const [verifyQQText, setVerifyQQText] = useState("");
  const [disableVerifyQQ, setDisableVerifyQQ] = useState(false);

  const sendQQVerify = async (qq: string) => {
    if (!isInteger(qq)) {
      openToast({ content: `请正确填写QQ号`, status: "warning" });
      return;
    }

    const resp = await fetch(`${apiUrl}/qqExist?qq=${qq}`);
    if (resp.ok) {
      const data = await resp.json();
      if (data.code === 1) {
        setVerifyQQText("该QQ号已被注册");
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

  const handleBindQQ = async () => {
    const req_data = {
      qq: inputAccount,
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
        openToast({ content: "绑定新QQ成功", status: "success" });
        getUserInfo();
        bindQQOnClose();
      } else {
        openToast({ content: data.msg, status: "warning" });
        setCaptchaImage(await fetchCaptcha());
      }
    } else {
      openToast({ content: "服务异常，请联系服主处理", status: "error" });
    }
  };

  const handleBindQQEnter = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      handleBindQQ();
    }
  };

  // 绑定手机相关
  const {
    isOpen: bindTELIsOpen,
    onOpen: bindTELOnopen,
    onClose: bindTELOnClose,
  } = useDisclosure();

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

  const handleBindTEL = async () => {
    const req_data = {
      tel: inputAccount,
      verify_code: inputVerifyCode,
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
        openToast({ content: "绑定新手机成功", status: "success" });
        getUserInfo();
        bindTELOnClose();
      } else {
        openToast({ content: data.msg, status: "warning" });
        setCaptchaImage(await fetchCaptcha());
      }
    } else {
      openToast({ content: "服务异常，请联系服主处理", status: "error" });
    }
  };

  const handleBindTELEnter = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      handleBindTEL();
    }
  };

  // 绑定邮箱相关
  const {
    isOpen: bindEmailIsOpen,
    onOpen: bindEmailOnopen,
    onClose: bindEmailOnClose,
  } = useDisclosure();

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

  const handleBindEmail = async () => {
    const req_data = {
      email: inputAccount,
      verify_code: inputVerifyCode,
      uuid: uuid,
      captcha_code: inputCaptcha,
    };
    const resp = await fetch(`${apiUrl}/bindEmail`, {
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
        openToast({ content: "绑定新电子邮箱成功", status: "success" });
        getUserInfo();
        bindTELOnClose();
      } else {
        openToast({ content: data.msg, status: "warning" });
        setCaptchaImage(await fetchCaptcha());
      }
    } else {
      openToast({ content: "服务异常，请联系服主处理", status: "error" });
    }
  };

  const handleBindEmailEnter = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      handleBindEmail();
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
      setPasswordAlertText("不低于8位，包含数字和字母");
      return;
    }
    setPasswordAlertText("");
  };

  const handleChangePass = async () => {
    if (passwordAlertText) {
      openToast({
        content: "密码要求：不低于8位，包含数字和字母",
        status: "warning",
      });
      return;
    }

    if (!(inputPassword0 && inputPassword && inputPassword2)) {
      openToast({ content: "请完成资料填写", status: "warning" });
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
        openToast({ content: "修改密码成功", status: "success" });
        setAuthToken(data.token);
        changePassOnClose();
      } else {
        openToast({ content: data.msg, status: "warning" });
      }
    } else {
      openToast({ content: "服务异常，请联系服主处理", status: "error" });
    }
  };

  const handleChangePassEnter = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      handleChangePass();
    }
  };

  return (
    <Center>
      <Modal isOpen={bindTELIsOpen} onClose={bindTELOnClose}>
        <ModalOverlay />
        <ModalContent bgColor="#274161" maxW="320px">
          <ModalHeader textAlign="center">
            {userInfo?.tel ? "改绑手机" : "绑定手机"}
          </ModalHeader>

          <ModalCloseButton />

          <ModalBody onKeyDown={handleBindTELEnter}>
            <VStack spacing={2} align="stretch">
              <Input
                type="number"
                value={inputAccount}
                onChange={(e) => setInputAccount(e.target.value)}
                placeholder="请输入手机号"
              />

              <Flex>
                <Input
                  type="number"
                  value={inputVerifyCode}
                  onChange={(e) => setInputVerifyCode(e.target.value)}
                  placeholder="请输入短信验证码"
                />

                <Button
                  ml={1}
                  px={6}
                  fontSize="15px"
                  onClick={() => {
                    if (inputAccount) sendSMS(inputAccount);
                  }}
                >
                  {sendVerifyButtonText}
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
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={bindEmailIsOpen} onClose={bindEmailOnClose}>
        <ModalOverlay />
        <ModalContent bgColor="#274161" maxW="320px">
          <ModalHeader textAlign="center">
            {userInfo?.email ? "改绑电子邮箱" : "绑定电子邮箱"}
          </ModalHeader>

          <ModalCloseButton />

          <ModalBody onKeyDown={handleBindEmailEnter}>
            <VStack spacing={2} align="stretch">
              <Input
                type="text"
                value={inputAccount}
                onChange={(e) => setInputAccount(e.target.value)}
                placeholder="请输入电子邮箱"
              />
              <Flex>
                <Input
                  type="number"
                  value={inputVerifyCode}
                  onChange={(e) => setInputVerifyCode(e.target.value)}
                  placeholder="请输入邮件验证码"
                />

                <Button
                  ml={1}
                  px={6}
                  fontSize="15px"
                  onClick={() => {
                    if (inputAccount) sendEmail(inputAccount);
                  }}
                >
                  {sendVerifyButtonText}
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
              <Button onClick={handleBindEmail}>提交</Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={bindQQIsOpen} onClose={bindQQOnClose}>
        <ModalOverlay />
        <ModalContent bgColor="#274161" maxW="320px">
          <ModalHeader textAlign="center">
            {userInfo?.qq ? "改绑QQ" : "绑定QQ"}
          </ModalHeader>

          <ModalCloseButton />

          <ModalBody onKeyDown={handleBindQQEnter}>
            <VStack spacing={2} align="stretch">
              <Box>
                <Flex>
                  <Input
                    type="number"
                    value={inputAccount}
                    onChange={(e) => {
                      setInputAccount(e.target.value);
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
                      if (inputAccount) {
                        sendQQVerify(inputAccount);
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
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={changePassIsOpen} onClose={changePassOnClose}>
        <ModalOverlay />
        <ModalContent bgColor="#274161" maxW="300px">
          <ModalHeader textAlign="center">修改密码</ModalHeader>

          <ModalCloseButton />

          <ModalBody onKeyDown={handleChangePassEnter}>
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

      <Box maxW={{ md: "100%", base: "90vw" }}>
        {userInfo ? (
          <VStack spacing={1} align="center">
            <VStack spacing={1} align="stretch" w="260px">
              <Heading mb={1} size="md" textAlign="center">
                账号信息
              </Heading>

              <Flex>
                <Text w="50px" textAlign="right">
                  UID:
                </Text>
                <Text ml={3}>{userInfo.uid}</Text>
              </Flex>

              <Divider />

              <Flex>
                <Text w="50px" textAlign="right">
                  昵称:
                </Text>

                <Input
                  ml={3}
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
                  onKeyDown={handlemodifyUsernameEnter}
                />
                <Button
                  hidden={hideModifyUsername}
                  ml={1}
                  color="#7dfffe"
                  fontWeight="normal"
                  variant="link"
                  bgColor="transparent"
                  onClick={() => {
                    modifyUsername();
                  }}
                >
                  修改
                </Button>
              </Flex>

              <Divider />

              <Flex>
                <Text w="50px" textAlign="right">
                  手机:
                </Text>
                <Flex ml={3}>
                  {userInfo.tel}

                  <Button
                    ml={1}
                    color="#7dfffe"
                    fontWeight="normal"
                    variant="link"
                    bgColor="transparent"
                    onClick={async () => {
                      setCaptchaImage(await fetchCaptcha());
                      bindTELOnopen();
                      setInputAccount("");
                      setInputVerifyCode("");
                      setInputCaptcha("");
                      setSendVerifyButtonText("获取验证码");
                    }}
                  >
                    {userInfo.tel ? "换绑" : "点击绑定（非必要）"}
                  </Button>
                </Flex>
              </Flex>

              <Divider />

              <Flex whiteSpace="nowrap">
                <Text w="50px" textAlign="right">
                  邮箱:
                </Text>
                <Flex ml={3}>
                  <Tooltip label={userInfo.email} placement="top" hasArrow>
                    <Box
                      maxWidth={{ md: "100%", base: "55vw" }} // 设置最大宽度
                      whiteSpace="nowrap" // 不换行
                      overflow="hidden" // 溢出隐藏
                      textOverflow="ellipsis" // 使用省略号表示溢出内容
                      cursor="pointer" // 鼠标悬停时显示手型光标
                    >
                      {userInfo.email}
                    </Box>
                  </Tooltip>

                  <Button
                    ml={1}
                    color="#7dfffe"
                    fontWeight="normal"
                    variant="link"
                    bgColor="transparent"
                    onClick={async () => {
                      setCaptchaImage(await fetchCaptcha());
                      bindEmailOnopen();
                      setInputAccount("");
                      setInputVerifyCode("");
                      setInputCaptcha("");
                      setSendVerifyButtonText("获取验证码");
                    }}
                  >
                    {userInfo.email ? "换绑" : "点击绑定（非必要）"}
                  </Button>
                </Flex>
              </Flex>

              <Divider />

              <Flex>
                <Text w="50px" textAlign="right">
                  QQ:
                </Text>
                <Flex ml={3}>
                  {userInfo.qq}

                  <Button
                    ml={1}
                    color="#7dfffe"
                    fontWeight="normal"
                    variant="link"
                    bgColor="transparent"
                    onClick={async () => {
                      setCaptchaImage(await fetchCaptcha());
                      bindQQOnOpen();
                      setInputAccount("");
                      setVerifyQQText("");
                      setInputCaptcha("");
                      setDisableVerifyQQ(false);
                    }}
                  >
                    {userInfo.qq ? "换绑" : "点击绑定（非必要）"}
                  </Button>
                </Flex>
              </Flex>

              {userInfo.sponsorship ? (
                <>
                  <Divider />
                  <Flex>
                    <Text w="50px" textAlign="right">
                      赞助:
                    </Text>
                    <Text ml={3}>{userInfo.sponsorship}元</Text>
                  </Flex>
                </>
              ) : null}
            </VStack>

            {userInfo.wg_data ? (
              <VStack spacing={1} mt={5} align="stretch" w="260px">
                <Heading mb={1} size="md" textAlign="center">
                  联机信息
                </Heading>

                <Flex>
                  <Text w="80px" textAlign="right">
                    联机编号:
                  </Text>
                  <Text ml={3}>{userInfo.wg_data.wgnum}</Text>
                </Flex>

                <Divider />

                <Flex>
                  <Text w="80px" textAlign="right">
                    IP地址:
                  </Text>
                  <Text ml={3}>{userInfo.wg_data.wg_ip}</Text>
                </Flex>

                <Divider />

                <Flex>
                  <Text w="80px" textAlign="right">
                    剩余天数:
                  </Text>
                  <Text ml={3}>
                    {calculateDaysDifference(
                      userInfo.wg_data.last_connect_timestamp
                    )}
                    （在线后重置15）
                  </Text>
                </Flex>

                {/* <Divider /> */}

                {/* <Flex>
                  <Text w="80px" textAlign="right">
                    最后连接:
                  </Text>
                  <Text ml={3}>
                    {userInfo.wg_data.last_connect_timestamp
                      ? timestampToDateString(
                          userInfo.wg_data.last_connect_timestamp
                        )
                      : "未连接过"}
                  </Text>
                </Flex> */}

                {/* <Button
                  mt={2}
                  size="sm"
                  w="100px"
                  alignSelf="center"
                  bgColor="#992e98"
                  onClick={() => {
                    router.push("/tutorial");
                  }}
                >
                  连接喵服教程
                </Button> */}
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

            <Button
              size="sm"
              alignSelf="center"
              mt={3}
              bgColor="#b5352a"
              fontSize="16px"
              onClick={() => setShowTips(!showTips)}
            >
              联机注意事项
            </Button>

            <Box
              mx={3}
              px={3}
              border="2px" // 边框宽度
              borderColor="#31b8ce" // 边框颜色
              borderRadius="md" // 边框圆角
            >
              <Collapse in={showTips}>
                {tips.map((tip, index) => (
                  <Text fontSize="sm" key={index} my={2}>
                    <WarningIcon mr={2} />
                    {tip}
                  </Text>
                ))}
              </Collapse>
            </Box>

            <VStack spacing={5} mt={5}>
              <Button
                variant="link"
                bgColor="transparent"
                color="#7dfffe"
                onClick={() => {
                  setInputPassword0("");
                  setInputPassword("");
                  setInputPassword2("");
                  setPasswordAlertText("");
                  changePassOnopen();
                }}
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
