import { useAppContext } from "@/context";
import { FC } from "react";
import { LeaderboardModal } from "./modal.leaderboard.component";
import { RulesModal } from "./modal.rules.component";
import { UsernameModal } from "./modal.username.component";

export const Modals: FC = () => {
  const { isModalOpen } = useAppContext();

  return (
    <>
      {isModalOpen.rules ? <RulesModal /> : null}
      {isModalOpen.leaderboard ? <LeaderboardModal /> : null}
      {isModalOpen.username ? <UsernameModal /> : null}
    </>
  );
};
