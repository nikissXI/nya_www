"use client";

import React, { useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalContent,
  ModalBody,
  ModalFooter,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useUserStateStore } from "@/store/user-state";
import { useDisclosureStore } from "@/store/disclosure";
import { getAuthToken } from "@/store/authKey";
import { WarningIcon } from "@chakra-ui/icons";
import { openToast } from "../universal/toast";
import { Button } from "../universal/button";

export default function GetWgnumModal() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { getUserInfo } = useUserStateStore();

  const { isOpen, onToggle } = useDisclosureStore((state) => {
    return state.modifyGetWgnumDisclosure;
  });

  useEffect(() => {}, []);

  const handleGetWgnum = async () => {
    onToggle();

    const resp = await fetch(`${apiUrl}/getWgnum`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    if (resp.ok) {
      const data = await resp.json();
      if (data.code === 0) {
        openToast({ content: "绑定编号成功", status: "success" });
        getUserInfo();
      } else {
        openToast({ content: data.msg, status: "warning" });
      }
    } else {
      openToast({ content: "服务异常，请联系服主处理", status: "error" });
    }
  };

  const tips = [
    "获取编号后到联机房间页面，看联机教程学会连接喵服",
    "我的信息页面，有个注意事项按钮，看看里面的内容",
  ];

  return (
    <Modal isOpen={isOpen} onClose={onToggle}>
      <ModalOverlay />
      <ModalContent bgColor="#001a32">
        <ModalHeader>关于联机编号</ModalHeader>

        <ModalCloseButton />

        <ModalBody>
          {tips.map((tip, index) => (
            <Text fontSize="sm" key={index} my={2}>
              <WarningIcon mr={2} />
              {tip}
            </Text>
          ))}
        </ModalBody>

        <ModalFooter alignSelf="center">
          <Button bgColor="#9d2e03" size="md" onClick={() => handleGetWgnum()}>
            我已知晓，获取编号
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
