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
      <button className="button--toggle" onClick={onToggleGameMode}>
        <span className={board === "standard" ? "selected" : ""}>Original</span>
        <span className={board === "bonus" ? "selected" : ""}>Bonus</span>
      </button>
      <button className="button--outline" onClick={onToggleRules}>
        Rules
      </button>
    </footer>
  );
};
