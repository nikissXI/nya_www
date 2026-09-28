/**
 * 安卓APP下载地址
 * ------------------------------------------------------------------
 * 首页（app/page.tsx）与 WG 安装教程（app/docs/page.tsx）共用同一份，
 * 发新版只要改这里的版本号；APP 自身带更新检查，会在 APP 里提示用户升级。
 */
export const ANDROID_APP_VERSION = "0.0.3";

export const ANDROID_APP_URL = `/download/android_v${ANDROID_APP_VERSION}.apk`;
