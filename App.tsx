import { Box, ChakraProvider } from "@chakra-ui/react";
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Frame from "@/components/Frame";
import "@/app/globals.css";

const HomePage = lazy(() => import("@/app/page"));
const DocsPage = lazy(() => import("@/app/docs/page"));
const AresVirus2Page = lazy(() => import("@/app/docs/aresVirus2/page"));
const ArkPage = lazy(() => import("@/app/docs/ark/page"));
const DoNotStarvePage = lazy(() => import("@/app/docs/doNotStarve/page"));
const IsaacPage = lazy(() => import("@/app/docs/isaac/page"));
const JuicyRealmPage = lazy(() => import("@/app/docs/juicyRealm/page"));
const L4d2Page = lazy(() => import("@/app/docs/l4d2/page"));
const MachinesAtWar3Page = lazy(() => import("@/app/docs/machinesAtWar3/page"));
const MindustryPage = lazy(() => import("@/app/docs/mindustry/page"));
const MinecraftPage = lazy(() => import("@/app/docs/minecraft/page"));
const OvercookedPage = lazy(() => import("@/app/docs/overcooked/page"));
const ProjectZomboidPage = lazy(() => import("@/app/docs/projectZomboid/page"));
const SlayTheSpirePage = lazy(() => import("@/app/docs/slayTheSpire/page"));
const StardewValleyPage = lazy(() => import("@/app/docs/stardewValley/page"));
const SurvivalcraftPage = lazy(() => import("@/app/docs/survivalcraft/page"));
const TerrariaPage = lazy(() => import("@/app/docs/terraria/page"));
const TheEscapistsPage = lazy(() => import("@/app/docs/theEscapists/page"));
const WizardOfLegendPage = lazy(() => import("@/app/docs/wizardOfLegend/page"));
const ForgetPassPage = lazy(() => import("@/app/forgetPass/page"));
const MePage = lazy(() => import("@/app/me/page"));
const RegisterPage = lazy(() => import("@/app/register/page"));
const RoomPage = lazy(() => import("@/app/room/page"));
const SponsorPage = lazy(() => import("@/app/sponsor/page"));

export default function App() {
  return (
    <ChakraProvider>
      <Box
        position="fixed"
        inset={0}
        zIndex={-1}
        backgroundImage="url('/images/bg.png')"
        backgroundRepeat="repeat"
        backgroundSize="auto"
      />
      <Box
        as="header"
        position="fixed"
        top={-50}
        left={0}
        width="100%"
        height="105px"
        zIndex={99}
        backgroundImage="url('/images/head_bg.webp')"
        backgroundRepeat="repeat-x"
        backgroundSize="auto"
      />
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
            <Route path="/docs/aresVirus2" element={<AresVirus2Page />} />
            <Route path="/docs/ark" element={<ArkPage />} />
            <Route path="/docs/doNotStarve" element={<DoNotStarvePage />} />
            <Route path="/docs/isaac" element={<IsaacPage />} />
            <Route path="/docs/juicyRealm" element={<JuicyRealmPage />} />
            <Route path="/docs/l4d2" element={<L4d2Page />} />
            <Route
              path="/docs/machinesAtWar3"
              element={<MachinesAtWar3Page />}
            />
            <Route path="/docs/mindustry" element={<MindustryPage />} />
            <Route path="/docs/minecraft" element={<MinecraftPage />} />
            <Route path="/docs/overcooked" element={<OvercookedPage />} />
            <Route
              path="/docs/projectZomboid"
              element={<ProjectZomboidPage />}
            />
            <Route path="/docs/slayTheSpire" element={<SlayTheSpirePage />} />
            <Route path="/docs/stardewValley" element={<StardewValleyPage />} />
            <Route path="/docs/survivalcraft" element={<SurvivalcraftPage />} />
            <Route path="/docs/terraria" element={<TerrariaPage />} />
            <Route path="/docs/theEscapists" element={<TheEscapistsPage />} />
            <Route
              path="/docs/wizardOfLegend"
              element={<WizardOfLegendPage />}
            />
            <Route path="/forgetPass" element={<ForgetPassPage />} />
            <Route path="/me" element={<MePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/room" element={<RoomPage />} />
            <Route path="/sponsor" element={<SponsorPage />} />
          </Routes>
        </Suspense>
      </Frame>
    </ChakraProvider>
  );
}
