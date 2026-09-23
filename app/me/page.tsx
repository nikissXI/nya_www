import {
  Box,
  Flex,
  Text,
  VStack,
  Heading,
  Divider,
  Image,
  Input,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Tag,
  Icon,
} from "@chakra-ui/react";
import { useUserStateStore } from "@/store/user-state";
import { Button } from "@/components/universal/button";
import { useEffect, useState } from "react";
import { openToast } from "@/components/universal/toast";
import {
  isInteger,
  getHash,
  getErrorMessage,
  getPasswordAlertText,
  copyText,
} from "@/utils/strings";
import { setAuthToken } from "@/store/authKey";
import useCaptcha from "@/utils/GetCaptcha";
import { useNavigate } from "react-router-dom";
import { NoticeText } from "@/components/universal/Notice";
import SponsorTag from "@/components/universal/SponsorTag";
import { isBusinessError, shouldSilenceError } from "@/utils/api";
import { api } from "@/utils/endpoints";
import {
  CARD_PADDING,
  CARD_STYLE,
  INPUT_STYLE,
  MODAL_STYLE,
  SectionTitle,
} from "@/components/universal/ui";
import {
  FaUser,
  FaIdCard,
  FaMobileAlt,
  FaEnvelope,
  FaQq,
  FaNetworkWired,
  FaHeart,
  FaShieldAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { MdContentCopy } from "react-icons/md";

/* ------------------- 本页公用的小组件 ------------------- */

/** 账号输入框（手机/邮箱/QQ 共用） */
const AccountInput = (props: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  numeric?: boolean;
}) => (
  <Input
    value={props.value}
    onChange={(e) => props.onChange(e.target.value)}
    placeholder={props.placeholder}
    inputMode={props.numeric ? "numeric" : undefined}
    {...INPUT_STYLE}
  />
);

/** 绑定/改绑弹窗：手机、邮箱、QQ 三个流程只有文案和账号输入区不同 */
const BindModal = (props: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  /** 账号输入区（QQ 需要额外的“验证QQ”行） */
  accountField: React.ReactNode;
  captchaValue: string;
  onCaptchaChange: (value: string) => void;
  captchaImageUrl: string;
  onCaptchaRefresh: () => void;
  onSubmit: () => void;
}) => (
  <Modal isOpen={props.isOpen} onClose={props.onClose} isCentered>
    <ModalOverlay />
    <ModalContent {...MODAL_STYLE} maxW="340px">
      <ModalHeader textAlign="center">{props.title}</ModalHeader>
      <ModalCloseButton />

      <ModalBody
        pb={6}
        onKeyDown={(e) => {
          if (e.key === "Enter") props.onSubmit();
        }}
      >
        <VStack spacing={2} align="stretch">
          {props.accountField}

          <Flex>
            <Input
              value={props.captchaValue}
              onChange={(e) => props.onCaptchaChange(e.target.value)}
              placeholder="请输入图片验证码"
              {...INPUT_STYLE}
            />

            <Image
              rounded={5}
              ml={1}
              src={props.captchaImageUrl}
              alt="验证码（点击刷新）"
              cursor="pointer"
              onClick={props.onCaptchaRefresh}
            />
          </Flex>

          <Button onClick={props.onSubmit}>提交</Button>
        </VStack>
      </ModalBody>
    </ModalContent>
  </Modal>
);

/** 信息行（图标 + 名称/值 + 右侧附加内容） */
const InfoRow = (props: {
  icon: React.ElementType;
  label: string;
  /** 值 */
  children?: React.ReactNode;
  /** 右侧附加内容：状态徽标、按钮等 */
  right?: React.ReactNode;
}) => (
  <Flex align="center" gap={3} py={2}>
    <Icon as={props.icon} boxSize={4} color="#7dd4ff" flexShrink={0} />

    <Box flex={1} minW={0} textAlign="left">
      <SectionTitle>{props.label}</SectionTitle>
      {props.children}
    </Box>

    {props.right}
  </Flex>
);

/** 绑定状态徽标 */
const BindTag = ({ bound }: { bound: boolean }) => (
  <Tag
    size="sm"
    flexShrink={0}
    borderRadius="md"
    fontWeight="bold"
    bg={bound ? "rgba(0, 230, 58, 0.16)" : "rgba(255, 255, 255, 0.1)"}
    color={bound ? "#00e63a" : "rgba(255, 255, 255, 0.65)"}
  >
    {bound ? "已绑定" : "未绑定"}
  </Tag>
);

export default function UserProfilePage() {
  const navigate = useNavigate();
  // 用 selector 单独订阅，避免 store 任意状态变化都触发本页重渲染
  const uuid = useUserStateStore((s) => s.uuid);
  const getUserInfo = useUserStateStore((s) => s.getUserInfo);
  const userInfo = useUserStateStore((s) => s.userInfo);
  const userWgInfo = useUserStateStore((s) => s.userWgInfo);
  const logout = useUserStateStore((s) => s.logout);
  const openLoginModal = useUserStateStore((s) => s.openLoginModal);

  // 修改用户名（进入编辑态才出现输入框）
  const [inputUsername, setInputUsername] = useState(userInfo?.username);
  const [isEditingUsername, setIsEditingUsername] = useState(false);

  // 验证码拉取和图片
  const { fetchCaptcha } = useCaptcha();
  const [captchaImageUrl, setCaptchaImageUrl] = useState("");

  // 填写的表单数据
  const [inputAccount, setInputAccount] = useState("");
  const [inputCaptcha, setInputCaptcha] = useState("");

  // 拉一张新验证码并清空已填的验证码（打开绑定弹窗、点图刷新、提交失败时共用）
  const refreshCaptcha = async () => {
    setCaptchaImageUrl(await fetchCaptcha());
    setInputCaptcha("");
  };

  /** 统一的请求失败提示：业务失败用警示色（后端 msg 即原因），其它异常用错误色 */
  const toastRequestError = async (
    err: unknown,
    options: { refreshCaptcha?: boolean } = {},
  ) => {
    // 凭证失效（已统一登出）/ 数据异常（已刷新页面）不再重复提示
    if (shouldSilenceError(err)) return;

    if (isBusinessError(err)) {
      openToast({ content: err.message, status: "warning" });
      if (options.refreshCaptcha) {
        setCaptchaImageUrl(await fetchCaptcha());
      }
      return;
    }
    openToast({
      content: getErrorMessage(err, "服务异常，请联系服主处理"),
      status: "error",
    });
  };

  /** 保存昵称，成功返回 true */
  const saveUsername = async (): Promise<boolean> => {
    if (!inputUsername) return false;

    try {
      await api.modifyUsername({ username: inputUsername });
      openToast({ content: "修改成功", status: "success" });
      getUserInfo();
      return true;
    } catch (err) {
      await toastRequestError(err);
      return false;
    }
  };

  /** 保存昵称成功后退出编辑态 */
  const handleSaveUsername = async () => {
    if (await saveUsername()) setIsEditingUsername(false);
  };

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

    try {
      // 这两个接口用 code 表达“是 / 否”，需要自己判断，所以用 requestEnvelope
      const exist = await api.qqExist(qq);
      if (exist.code === 1) {
        setVerifyQQText("该QQ号已被注册");
        return;
      }

      const verify = await api.verifyQQ(uuid, qq);
      setVerifyQQText(verify.msg ?? "服务异常，请联系服主处理");
      if (verify.code === 0) {
        setDisableVerifyQQ(true);
      }
    } catch (err) {
      setVerifyQQText(getErrorMessage(err, "服务异常，请联系服主处理"));
    }
  };

  const handleBindQQ = async () => {
    try {
      await api.bindQQ({
        qq: inputAccount,
        uuid: uuid,
        captcha_code: inputCaptcha,
      });
      openToast({ content: "绑定新QQ成功", status: "success" });
      getUserInfo();
      bindQQOnClose();
    } catch (err) {
      await toastRequestError(err, { refreshCaptcha: true });
    }
  };

  // 绑定手机相关
  const {
    isOpen: bindTELIsOpen,
    onOpen: bindTELOnopen,
    onClose: bindTELOnClose,
  } = useDisclosure();

  const handleBindTEL = async () => {
    try {
      await api.bindTEL({
        tel: inputAccount,
        uuid: uuid,
        captcha_code: inputCaptcha,
      });
      openToast({ content: "绑定新手机成功", status: "success" });
      getUserInfo();
      bindTELOnClose();
    } catch (err) {
      await toastRequestError(err, { refreshCaptcha: true });
    }
  };

  // 绑定邮箱相关
  const {
    isOpen: bindEmailIsOpen,
    onOpen: bindEmailOnopen,
    onClose: bindEmailOnClose,
  } = useDisclosure();

  const handleBindEmail = async () => {
    try {
      await api.bindEmail({
        email: inputAccount,
        uuid: uuid,
        captcha_code: inputCaptcha,
      });
      openToast({ content: "绑定新电子邮箱成功", status: "success" });
      getUserInfo();
      bindEmailOnClose();
    } catch (err) {
      await toastRequestError(err, { refreshCaptcha: true });
    }
  };

  // 修改密码相关
  const {
    isOpen: changePassIsOpen,
    onOpen: changePassOnopen,
    onClose: changePassOnClose,
  } = useDisclosure();

  // 退出登录二次确认
  const {
    isOpen: logoutConfirmIsOpen,
    onOpen: logoutConfirmOnopen,
    onClose: logoutConfirmOnClose,
  } = useDisclosure();

  const [inputPassword0, setInputPassword0] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [inputPassword2, setInputPassword2] = useState("");
  const [passwordAlertText, setPasswordAlertText] = useState("");

  const checkPassword = (pass1: string, pass2: string) => {
    setPasswordAlertText(getPasswordAlertText(pass1, pass2));
  };

  // 用户信息更新后（改绑/修改昵称等）同步输入框
  useEffect(() => {
    setInputUsername(userInfo?.username);
  }, [userInfo?.username]);

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

    try {
      const token = await api.changePassword({
        password: getHash(inputPassword0),
        newPassword: getHash(inputPassword),
      });
      openToast({ content: "修改密码成功", status: "success" });
      if (token) setAuthToken(token);
      changePassOnClose();
    } catch (err) {
      await toastRequestError(err);
    }
  };

  const handleChangePassEnter = (
    event: React.KeyboardEvent<HTMLDivElement>,
  ) => {
    if (event.key === "Enter") {
      handleChangePass();
    }
  };

  return (
    <Flex direction="column" px={{ base: 4, md: 8 }} align="center">
      {/* 绑定/改绑手机 */}
      <BindModal
        isOpen={bindTELIsOpen}
        onClose={bindTELOnClose}
        title={userInfo?.tel ? "改绑手机" : "绑定手机"}
        accountField={
          <AccountInput
            value={inputAccount}
            onChange={setInputAccount}
            placeholder="请输入手机号"
            numeric
          />
        }
        captchaValue={inputCaptcha}
        onCaptchaChange={setInputCaptcha}
        captchaImageUrl={captchaImageUrl}
        onCaptchaRefresh={refreshCaptcha}
        onSubmit={handleBindTEL}
      />

      {/* 绑定/改绑电子邮箱 */}
      <BindModal
        isOpen={bindEmailIsOpen}
        onClose={bindEmailOnClose}
        title={userInfo?.email ? "改绑电子邮箱" : "绑定电子邮箱"}
        accountField={
          <AccountInput
            value={inputAccount}
            onChange={setInputAccount}
            placeholder="请输入电子邮箱"
          />
        }
        captchaValue={inputCaptcha}
        onCaptchaChange={setInputCaptcha}
        captchaImageUrl={captchaImageUrl}
        onCaptchaRefresh={refreshCaptcha}
        onSubmit={handleBindEmail}
      />

      {/* 绑定/改绑QQ */}
      <BindModal
        isOpen={bindQQIsOpen}
        onClose={bindQQOnClose}
        title={userInfo?.qq ? "改绑QQ" : "绑定QQ"}
        accountField={
          <Box>
            <Flex>
              <AccountInput
                value={inputAccount}
                onChange={(value) => {
                  setInputAccount(value);
                  setDisableVerifyQQ(false);
                  setVerifyQQText("");
                }}
                placeholder="请输入QQ号"
                numeric
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

            <Text color="#ffd648" fontSize="sm">
              {verifyQQText}
            </Text>
          </Box>
        }
        captchaValue={inputCaptcha}
        onCaptchaChange={setInputCaptcha}
        captchaImageUrl={captchaImageUrl}
        onCaptchaRefresh={refreshCaptcha}
        onSubmit={handleBindQQ}
      />

      {/* 修改密码 */}
      <Modal isOpen={changePassIsOpen} onClose={changePassOnClose} isCentered>
        <ModalOverlay />
        <ModalContent {...MODAL_STYLE} maxW="340px">
          <ModalHeader textAlign="center">修改密码</ModalHeader>
          <ModalCloseButton />

          <ModalBody pb={6} onKeyDown={handleChangePassEnter}>
            <VStack spacing={2} align="stretch">
              <Input
                type="password"
                value={inputPassword0}
                onChange={(e) => setInputPassword0(e.target.value)}
                placeholder="请输入旧密码"
                {...INPUT_STYLE}
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
                  {...INPUT_STYLE}
                />

                <Text color="#ffd648" fontSize="sm">
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
                {...INPUT_STYLE}
              />

              <Button onClick={handleChangePass}>提交</Button>

              <Button
                py={1}
                variant="link"
                color="#7dfffe"
                bgColor="transparent"
                onClick={() => {
                  changePassOnClose();
                  navigate("/forgetPass");
                }}
              >
                忘记密码
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* 退出登录二次确认 */}
      <Modal
        isOpen={logoutConfirmIsOpen}
        onClose={logoutConfirmOnClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent {...MODAL_STYLE} maxW="320px">
          <ModalHeader textAlign="center">退出登录</ModalHeader>
          <ModalCloseButton />

          <ModalBody pb={4}>
            <Text fontSize="sm" color="rgba(255, 255, 255, 0.85)">
              确认退出当前账号？退出后需要重新登录才能进入联机房间。
            </Text>
          </ModalBody>

          <ModalFooter gap={3}>
            <Button
              bgColor="transparent"
              color="rgba(255, 255, 255, 0.75)"
              onClick={logoutConfirmOnClose}
            >
              取消
            </Button>
            <Button
              bgColor="#b8332f"
              onClick={() => {
                logout();
                logoutConfirmOnClose();
              }}
            >
              确认退出
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Box w="100%">
        {!userInfo ? (
          <VStack spacing={3} align="center">
            <Heading size="md">你还没登录呢</Heading>

            <Button
              variant="outline"
              rounded={10}
              onClick={openLoginModal}
              border={0}
            >
              点击登录
            </Button>

            <NoticeText />
          </VStack>
        ) : (
          <VStack spacing={3} w="100%" maxW="440px" mx="auto" align="stretch">
            {/* 账号信息（含昵称与账号绑定） */}
            <Box {...CARD_STYLE} {...CARD_PADDING}>
              <SectionTitle>账号信息</SectionTitle>

              <VStack
                spacing={0}
                align="stretch"
                mt={1}
                divider={<Divider borderColor="rgba(255, 255, 255, 0.1)" />}
              >
                <InfoRow
                  icon={FaUser}
                  label="昵称"
                  right={
                    !isEditingUsername && (
                      <Button
                        size="sm"
                        px={3}
                        flexShrink={0}
                        onClick={() => {
                          setInputUsername(userInfo.username);
                          setIsEditingUsername(true);
                        }}
                      >
                        修改
                      </Button>
                    )
                  }
                >
                  <Text fontSize="sm" isTruncated>
                    {userInfo.username}
                  </Text>
                </InfoRow>

                {isEditingUsername && (
                  <Flex gap={2} py={2}>
                    <Input
                      value={inputUsername}
                      onChange={(e) => setInputUsername(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveUsername();
                      }}
                      placeholder="请输入昵称"
                      {...INPUT_STYLE}
                    />
                    <Button px={4} flexShrink={0} onClick={handleSaveUsername}>
                      保存
                    </Button>
                    <Button
                      px={3}
                      flexShrink={0}
                      bgColor="transparent"
                      color="rgba(255, 255, 255, 0.7)"
                      onClick={() => setIsEditingUsername(false)}
                    >
                      取消
                    </Button>
                  </Flex>
                )}

                <InfoRow icon={FaIdCard} label="UID">
                  <Text fontSize="sm">{userInfo.uid}</Text>
                </InfoRow>

                {Number(userInfo.sponsorship) > 0 && (
                  <InfoRow
                    icon={FaHeart}
                    label="赞助金额"
                    right={<SponsorTag amount={userInfo.sponsorship} />}
                  >
                    <Text fontSize="sm" fontWeight="bold" color="#ffd012">
                      {userInfo.sponsorship} 元
                    </Text>
                  </InfoRow>
                )}

                <InfoRow icon={FaNetworkWired} label="喵服IP">
                  {userWgInfo?.user_ip ? (
                    <Flex align="center" gap={1.5}>
                      <Text fontSize="sm" isTruncated>
                        {userWgInfo.user_ip}
                      </Text>
                      <Icon
                        as={MdContentCopy}
                        boxSize={3.5}
                        color="#7dd4ff"
                        cursor="pointer"
                        flexShrink={0}
                        onClick={() => copyText(userWgInfo.user_ip)}
                      />
                    </Flex>
                  ) : (
                    <Text fontSize="sm" color="rgba(255, 255, 255, 0.55)">
                      未选择节点
                    </Text>
                  )}
                </InfoRow>

                <InfoRow
                  icon={FaMobileAlt}
                  label="手机"
                  right={
                    <>
                      <BindTag bound={!!userInfo.tel} />

                      <Button
                        size="sm"
                        px={3}
                        flexShrink={0}
                        onClick={async () => {
                          await refreshCaptcha();
                          setInputAccount("");
                          bindTELOnopen();
                        }}
                      >
                        {userInfo.tel ? "换绑" : "绑定"}
                      </Button>
                    </>
                  }
                >
                  <Text
                    fontSize="sm"
                    isTruncated
                    color={userInfo.tel ? "white" : "rgba(255, 255, 255, 0.55)"}
                  >
                    {userInfo.tel || "未绑定手机"}
                  </Text>
                </InfoRow>

                <InfoRow
                  icon={FaEnvelope}
                  label="电子邮箱"
                  right={
                    <>
                      <BindTag bound={!!userInfo.email} />

                      <Button
                        size="sm"
                        px={3}
                        flexShrink={0}
                        onClick={async () => {
                          await refreshCaptcha();
                          setInputAccount("");
                          bindEmailOnopen();
                        }}
                      >
                        {userInfo.email ? "换绑" : "绑定"}
                      </Button>
                    </>
                  }
                >
                  <Text
                    fontSize="sm"
                    isTruncated
                    color={
                      userInfo.email ? "white" : "rgba(255, 255, 255, 0.55)"
                    }
                  >
                    {userInfo.email || "未绑定电子邮箱"}
                  </Text>
                </InfoRow>

                <InfoRow
                  icon={FaQq}
                  label="QQ"
                  right={
                    <>
                      <BindTag bound={!!userInfo.qq} />

                      <Button
                        size="sm"
                        px={3}
                        flexShrink={0}
                        onClick={async () => {
                          await refreshCaptcha();
                          setInputAccount("");
                          setVerifyQQText("");
                          setDisableVerifyQQ(false);
                          bindQQOnOpen();
                        }}
                      >
                        {userInfo.qq ? "换绑" : "绑定"}
                      </Button>
                    </>
                  }
                >
                  <Text
                    fontSize="sm"
                    isTruncated
                    color={userInfo.qq ? "white" : "rgba(255, 255, 255, 0.55)"}
                  >
                    {userInfo.qq || "未绑定QQ"}
                  </Text>
                </InfoRow>
              </VStack>
            </Box>

            {/* 账号安全：左半修改密码 / 右半退出登录，各自在所在半边居中 */}
            <Box {...CARD_STYLE} {...CARD_PADDING}>
              <Flex align="stretch" gap={3}>
                <Flex flex="1" minW={0} align="center" justify="center" gap={2}>
                  <Icon
                    as={FaShieldAlt}
                    boxSize={4}
                    color="#7dd4ff"
                    flexShrink={0}
                  />

                  <Button
                    size="sm"
                    px={3}
                    flexShrink={0}
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
                </Flex>

                <Flex flex="1" minW={0} align="center" justify="center" gap={2}>
                  <Icon
                    as={FaSignOutAlt}
                    boxSize={4}
                    color="#ff6b5e"
                    flexShrink={0}
                  />

                  <Button
                    size="sm"
                    px={3}
                    flexShrink={0}
                    bgColor="#b8332f"
                    onClick={logoutConfirmOnopen}
                  >
                    退出登录
                  </Button>
                </Flex>
              </Flex>
            </Box>
          </VStack>
        )}
      </Box>
    </Flex>
  );
}
