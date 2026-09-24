import { apiUrl, request, requestEnvelope } from "./api";

/**
 * 全项目接口清单
 * ------------------------------------------------------------
 * 约定：
 * - 所有接口都定义在这里，页面 / store 不要再手写 path 和泛型
 * - 返回值统一是 data（业务失败会抛 ApiError）；需要自己判断 code 或要读 msg 的接口
 *   用 requestEnvelope，返回 { code, msg, data }
 */

// ---------------- 后端数据结构（接口契约） ----------------

/** 公告 */
export interface AnnouncementItem {
  timestamp: number; // 公告发布时间戳（10位）
  content: string; // 公告内容
}
export interface AnnouncementsData {
  carouselMsg: string[]; // 轮播公告
  announcements: AnnouncementItem[]; // 服务器公告
}
/** 赞助名单项 */
export interface SponsorItem {
  uid: number;
  username: string;
  sponsorship: number;
}
/** 用户信息 */
export interface UserInfo {
  uid: number; // 用户uid
  username: string; // 昵称
  tel: string; // 手机
  email: string; // 邮箱
  qq: string; // QQ
  sponsorship: number; // 赞助金额
}
/** 用户当前使用的隧道信息 */
export interface UserWgInfo {
  node_alias: string; // 所选节点名称
  tunnel_name: string; // 隧道名称
  conf_text: string; // 所选节点的隧道conf内容，用于直接导入wireguard
  ping_host: string; // 用于获取节点延迟，WEB端通过xhr请求获取，APP端通过ICMP获取
  user_ip: string; // 隧道的IP地址
  net_type: string; // 所选节点的网络类型
  bandwidth: number; // 所选节点的用户中转带宽峰值
}
/** 房间成员 */
export interface Member {
  username: string; // 用户昵称
  ip: string; // 用户联机IP
  status: "在线" | "离线"; // 用户WG连接状态
  sponsorship: number; // 用户赞助金额
}
/** 房间信息 */
export interface RoomInfo {
  room_id: number; // 房间id，用于加入房间
  user_ip: string; // 用户自己的联机ip
  hoster_ip: string; // 房主的联机ip
  members: Member[]; // 房间成员
  room_max: number; // 房间最大人数
  room_passwd: string | null; // 房间加入密码
  room_game: string | null; // 房间游戏名称
}
/** 节点信息 */
export interface NodeInfo {
  alias: string; // 节点名称
  bandwidth: number; // 节点中转带宽峰值
  net: number; // 节点网络负载百分比（-1 表示故障）
  net_type: string; // 节点网络类型
  node_desc: string; // 节点描述
  ping_host: string; // 用于获取节点延迟的域名
  sponsor: boolean; // 是否赞助专用节点
  delay: number; // 网络延迟，单位ms
}
/** /userInfo 的 data */
export interface UserInfoPayload {
  reget_ip: boolean; // IP 变动，需要重新导入隧道
  user_info: UserInfo; // 用户信息
  user_wg_info?: UserWgInfo; // 用户的 WG 隧道信息
}
/** /getRoom 的 data */
export interface GetRoomPayload {
  is_online: boolean; // WG 是否在线
  room: RoomInfo | null; // 房间信息
  user_wg_info: UserWgInfo; // 后端返回的完整节点信息
  node_net_load: number; // 节点负载百分比
}

// ---------------- 请求体 ----------------

export type LoginReqBody = {
  account: string; // 手机或邮箱
  password: string; // 登陆密码 sha256
  uuid: string; // 表单 uuid
  captcha_code: string; // 图片验证码
};
export type RegisterReqBody = {
  verifyType: string; // 注册类型：tel 或 email
  account: string; // 手机或邮箱
  username: string; // 登陆用户名
  password: string; // 登陆密码 sha256
  uuid: string; // 表单 uuid
  captcha_code: string; // 图片验证码
  invite_code?: string; // 邀请码
};
export type ResetReqBody = {
  verifyType: string; // 找回方式：tel 或 email
  account: string; // 手机或邮箱
  verify_code: string; // 验证码
  password: string; // 新密码 sha256
  uuid: string; // 表单 uuid
  captcha_code: string; // 图片验证码
};
export type ChangePasswordReq = {
  password: string; // 旧密码 sha256
  newPassword: string; // 新密码 sha256
};
export type ModifyUsernameReq = {
  username: string;
};
export type BindQQReq = {
  qq: string;
  uuid: string;
  captcha_code: string;
};
export type BindTELReq = {
  tel: string;
  uuid: string;
  captcha_code: string;
};
export type BindEmailReq = {
  email: string;
  uuid: string;
  captcha_code: string;
};

/** 房间操作类型 */
export type RoomHandleType =
  | "createRoom"
  | "joinRoom"
  | "closeRoom"
  | "exitRoom"
  | "delMember";
export type RoomActionParams = {
  handleType: RoomHandleType;
  value: string;
  roomPasswd?: string;
};

// ---------------- 接口定义 ----------------

export const api = {
  // ---------- 无需登录 ----------
  /** 图片验证码地址（带时间戳绕过缓存，不是 fetch 请求） */
  captchaUrl: (uuid: string) => `${apiUrl}/getCaptcha?uuid=${uuid}&t=${Date.now()}`,
  announcements: () =>
    request<AnnouncementsData>("/announcements", { auth: false }),
  nodeList: () => request<NodeInfo[]>("/nodeList", { auth: false }),
  sponsorList: () => request<SponsorItem[]>("/sponsorList", { auth: false }),
  login: (body: LoginReqBody) =>
    request<string>("/login", { method: "POST", auth: false, body }),
  register: (body: RegisterReqBody) =>
    request<string>("/register", { method: "POST", auth: false, body }),
  resetPass: (body: ResetReqBody) =>
    request<string>("/resetPass", { method: "POST", auth: false, body }),

  // ---------- 下面这些用 code 表达“是 / 否”，需要自己读 code / msg ----------
  qqExist: (qq: string) =>
    requestEnvelope<null>("/qqExist", { params: { qq }, auth: false }),
  verifyQQ: (uuid: string, qq: string) =>
    requestEnvelope<null>("/verifyQQ", { params: { uuid, qq }, auth: false }),
  telExist: (tel: string) =>
    requestEnvelope<null>("/telExist", { params: { tel }, auth: false }),
  verifyTEL: (tel: string) =>
    requestEnvelope<null>("/verifyTEL", { params: { tel }, auth: false }),
  emailExist: (email: string) =>
    requestEnvelope<null>("/emailExist", { params: { email }, auth: false }),
  verifyEmail: (email: string) =>
    requestEnvelope<null>("/verifyEmail", { params: { email }, auth: false }),

  // ---------- 需要登录 ----------
  userInfo: () => request<UserInfoPayload>("/userInfo"),
  confKey: () => request<string>("/getDownloadConfkey"),
  selectNode: (node_alias: string) =>
    requestEnvelope<UserWgInfo>("/selectNode", { params: { node_alias } }),
  getRoom: () => request<GetRoomPayload>("/getRoom"),
  changePassword: (body: ChangePasswordReq) =>
    request<string>("/changePassword", { method: "POST", body }),
  modifyUsername: (body: ModifyUsernameReq) =>
    request<null>("/modifyUsername", { method: "POST", body }),
  bindQQ: (body: BindQQReq) =>
    request<null>("/bindQQ", { method: "POST", body }),
  bindTEL: (body: BindTELReq) =>
    request<null>("/bindTEL", { method: "POST", body }),
  bindEmail: (body: BindEmailReq) =>
    request<null>("/bindEmail", { method: "POST", body }),

  /** 房间操作：创建 / 加入 / 关闭 / 退出 / 踢人，提示语用返回的 msg */
  roomAction: (params: RoomActionParams) =>
    requestEnvelope<null>("/handleRoom", { params }),
  setRoomPasswd: (roomPasswd: string) =>
    requestEnvelope<null>("/setRoomPasswd", { params: { roomPasswd } }),

  /** 游戏查房工具，msg 即结果文案 */
  escapistsHelper: (hosterIp: string) =>
    requestEnvelope<null>("/escapistsHelper", { params: { hosterIp } }),
  stardewValleyRoomCheck: (hosterIp: string) =>
    requestEnvelope<null>("/stardewValleyRoomCheck", { params: { hosterIp } }),
};
