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
  Button,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useUserStateStore } from "@/store/user-state";
import { useDisclosureStore } from "@/store/disclosure";
import { getAuthToken } from "@/store/authKey";
import { WarningIcon } from "@chakra-ui/icons";
import { openToast } from "../universal/toast";

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
        openToast({ content: "绑定编号成功" });
        getUserInfo();
      } else {
        openToast({ content: data.msg });
      }
    } else {
      openToast({ content: "服务异常，请联系服主处理" });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onToggle}>
      <ModalOverlay />
      <ModalContent bgColor="#001a32">
        <ModalHeader>关于联机编号</ModalHeader>

        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={2} align="stretch">
            <Text>
              <WarningIcon mr={2} />
              喵服使用的是WireGuard（简称WG）这个VPN进行组网实现局域网联机功能，获取编号后跟着教程安装WG
            </Text>
            <Text>
              <WarningIcon mr={2} />
              每个账号只能绑定一个编号，同一个编号不能多个设备同时使用，联机时请各用各的编号
            </Text>
            <Text>
              <WarningIcon mr={2} />
              绑定的编号如果连续30天不使用就会解绑，需要就领个新的，解绑的编号可从WG中删除
            </Text>
            <Text>
              <WarningIcon mr={2} />
              仅支持在国内使用
            </Text>
          </VStack>
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
