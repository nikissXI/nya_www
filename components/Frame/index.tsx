"use client";

// import { gotoServerEditor, Inspector } from "react-dev-inspector";
import { Center, Spinner } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import { Box, Flex } from "@chakra-ui/react";
import { Header } from "../Navbar/Header";
import RelateGroupList from "../relateGroups";
import Toaster from "../universal/Toaster";
import { useUserStateStore } from "@/store/user-state";
import { useDisclosureStore } from "../../store/disclosure";
import { GameListModal } from "@/components/tutorial/GameList";
import Footer from "../Navbar/Footer";

const Frame = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const pathname = usePathname(); // 获取当前路径名
  const { logging } = useUserStateStore();

  const { isOpen: gameListIsOpen, onToggle: gameListOnToggle } =
    useDisclosureStore((state) => {
      return state.modifyGameListDisclosure;
    });

  return (
    <>
      <Toaster />

      <GameListModal isOpen={gameListIsOpen} onClose={gameListOnToggle} />

      <Flex
        position="relative"
        direction={{ base: "column", md: "row" }} // 移动端竖向，桌面端横向
        height="100vh"
      >
        {/* 头部导航栏 */}
        <Header path={pathname}></Header>

        {/* 主内容区域 */}
        <Box
          as="main"
          flex={{ base: "1", md: "4" }} // 移动端占据全部宽度，桌面端占据 2/3 宽度
          mt={{ base: 20, md: 100 }}
        >
          {logging ? (
            <Center>
              <Spinner size="lg" />
            </Center>
          ) : (
            children
          )}
        </Box>

        {/* 底部 */}
        <Footer />
        <RelateGroupList />
      </Flex>

      {/* <Inspector
        keys={["Ctrl", "Shift", "\\"]}
        onInspectElement={({ codeInfo }) => {
          console.log(codeInfo);
          // 拼接工作目录
          if (codeInfo.absolutePath === undefined) {
            codeInfo.absolutePath = `${process.env.CWD}/${codeInfo.relativePath}`;
            delete codeInfo.relativePath;
          }
          gotoServerEditor(codeInfo);
        }}
      /> */}
    </>
  );
};
export default Frame;
