import { useAppContext } from "@/context";
import { FC } from "react";
import { LeaderboardModal } from "./ModalLeaderboard.component";
import { RulesModal } from "./ModalRules.component";
import { UsernameModal } from "./ModalUsername.component";

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
