import { GameMode } from "@/utilities";
import { FC } from "react";
import "./footer.styles.scss";

type FooterProps = {
  board: GameMode;
  onToggleGameMode: () => void;
  onToggleRules: () => void;
};

export const Footer: FC<FooterProps> = ({
  board,
  onToggleGameMode,
  onToggleRules,
}) => {
  return (
    <footer className="footer">
      <button className="button-toggle" onClick={onToggleGameMode}>
        <span className={board === "standard" ? "selected" : ""}>Easy</span>
        <span className={board === "bonus" ? "selected" : ""}>Advanced</span>
      </button>

      <button className="button-outline" onClick={onToggleRules}>
        <span>Rules</span>
      </button>
    </footer>
  );
};
