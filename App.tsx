import { Box, ChakraProvider } from "@chakra-ui/react";
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Frame from "@/components/Frame";
import "@/app/globals.css";

const HomePage = lazy(() => import("@/app/page"));
const DocsPage = lazy(() => import("@/app/docs/page"));
const ForgetPassPage = lazy(() => import("@/app/forgetPass/page"));
const MePage = lazy(() => import("@/app/me/page"));
const RegisterPage = lazy(() => import("@/app/register/page"));
const RoomPage = lazy(() => import("@/app/room/page"));
const SponsorPage = lazy(() => import("@/app/sponsor/page"));
const OfflineCheckPage = lazy(() => import("@/app/offlineCheck/page"));

// 文档页配置：新增游戏文档只需在这里加一行
const docPages = [
  {
    path: "universal",
    component: lazy(() => import("@/app/docs/universal/page")),
  },
  {
    path: "aresVirus2",
    component: lazy(() => import("@/app/docs/aresVirus2/page")),
  },
  { path: "ark", component: lazy(() => import("@/app/docs/ark/page")) },
  {
    path: "doNotStarve",
    component: lazy(() => import("@/app/docs/doNotStarve/page")),
  },
  { path: "isaac", component: lazy(() => import("@/app/docs/isaac/page")) },
  {
    path: "juicyRealm",
    component: lazy(() => import("@/app/docs/juicyRealm/page")),
  },
  { path: "l4d2", component: lazy(() => import("@/app/docs/l4d2/page")) },
  {
    path: "machinesAtWar3",
    component: lazy(() => import("@/app/docs/machinesAtWar3/page")),
  },
  {
    path: "mindustry",
    component: lazy(() => import("@/app/docs/mindustry/page")),
  },
  {
    path: "minecraft",
    component: lazy(() => import("@/app/docs/minecraft/page")),
  },
  {
    path: "overcooked",
    component: lazy(() => import("@/app/docs/overcooked/page")),
  },
  {
    path: "projectZomboid",
    component: lazy(() => import("@/app/docs/projectZomboid/page")),
  },
  {
    path: "slayTheSpire",
    component: lazy(() => import("@/app/docs/slayTheSpire/page")),
  },
  {
    path: "stardewValley",
    component: lazy(() => import("@/app/docs/stardewValley/page")),
  },
  {
    path: "survivalcraft",
    component: lazy(() => import("@/app/docs/survivalcraft/page")),
  },
  {
    path: "terraria",
    component: lazy(() => import("@/app/docs/terraria/page")),
  },
  {
    path: "theEscapists",
    component: lazy(() => import("@/app/docs/theEscapists/page")),
  },
  {
    path: "wizardOfLegend",
    component: lazy(() => import("@/app/docs/wizardOfLegend/page")),
  },
];

export default function App() {
  return (
    <ChakraProvider>
      <Frame>
        <Suspense
          fallback={
            <Box p={8} textAlign="center">
              加载中...
            </Box>
          }
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/forgetPass" element={<ForgetPassPage />} />
            <Route path="/me" element={<MePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/room" element={<RoomPage />} />
            <Route path="/sponsor" element={<SponsorPage />} />
            <Route path="/offlineCheck" element={<OfflineCheckPage />} />

            {/* 文档页：由配置数组自动生成 */}
            {docPages.map(({ path, component: Component }) => (
              <Route
                key={path}
                path={`/docs/${path}`}
                element={<Component />}
              />
            ))}
          </Routes>
        </Suspense>
      </Frame>
    </ChakraProvider>
  );
}
