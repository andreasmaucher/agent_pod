import { getGameState } from "@/actions/getGameState";
import { Lore } from "./components/Lore";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page() {
  const gameState = await getGameState();

  return <Lore gameState={gameState} />;
}
