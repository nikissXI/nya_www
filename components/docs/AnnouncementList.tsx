"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Text,
  useDisclosure,
  ModalCloseButton,
  Button,
  VStack,
} from "@chakra-ui/react";
// import { Button } from "../universal/button";

const announcement = [
  {
    date: "2025/05/13 - 23:30",
    content:
      "今日已将服务器节点迁移至腾讯云解决联机不稳定的问题，但服务器带宽只有10M，没钱升级高带宽服务器，估计高峰期网络会因为满载卡顿。",
  },
  {
    date: "2025/02/13 - 23:00",
    content: "重写喵服使用文档，更新赞助表",
  },
  {
    date: "2025/01/02 - 01:00",
    content:
      "优化检测在线逻辑，提高获取延迟精度，电脑(win)不再需要防火墙放通ping协议以检测在线",
  },
  {
    date: "2024/12/05 - 22:00",
    content: "更新了连接喵服的视频教程，就是怎么离线变在线",
  },
  {
    date: "2024/11/22 - 21:45",
    content: "如果安卓WG导入conf key报错，请到教程里下载最新的安装包更新",
  },
];

const AnnouncementModal = () => {
  const {
    isOpen: setAnnouncementIsOpen,
    onOpen: setAnnouncementOnOpen,
    onClose: setAnnouncementOnClose,
  } = useDisclosure();

  return (
    // <VStack spacing={3} align="center" mb={3}>
    //   <Button
    //     variant="link"
    //     // bg="#ffca3d"
    //     color="#ffca3d"
    //     fontWeight="bold"
    //     onClick={setAnnouncementOnOpen}
    //   >
    //     {/* 查看公告（{announcement[0]?.date}更新） */}
    //     喵服由雨云强力驱动 点我了解
    //   </Button>

    //   <Modal isOpen={setAnnouncementIsOpen} onClose={setAnnouncementOnClose}>
    //     <ModalOverlay />
    //     <ModalContent bgColor="#002f5c">
    //       <ModalCloseButton />

    //       <ModalBody py={6}>
    //         {/* {announcement.map((message, index) => (
    //           <Box key={index}>
    //             <Text fontWeight="bold" fontSize="lg" color="#ffca3d">
    //               {message.date}
    //             </Text>
    //             <Text pb={3}>{message.content}</Text>
    //           </Box>
    //         ))} */}
    //         <Text>123123</Text>
    //       </ModalBody>
    //     </ModalContent>
    //   </Modal>
    // </VStack>
    <Text color="#ffca3d" fontWeight="bold" textAlign="center" mx={5}>
      服务器于5月15日上午停服维护，看不到该公告的时候就是维护完毕了
    </Text>
  );
};

export default AnnouncementModal;
