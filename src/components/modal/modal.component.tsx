import { useAppContext } from "@/context/app.context";
import iconClose from "@/images/icon-close.svg";
import iconYoutube from "@/images/icon-youtube.svg";
import { classnames, GameRules } from "@/utilities";
import { FC, useCallback, useMemo, useState } from "react";
import "./modal.styles.scss";

export const Modal: FC = () => {
  const { gameMode, onToggleRulesModal } = useAppContext();

  const [isVideoContent, setIsVideoContent] = useState(false);

  const rulesImageUrl = useMemo(() => GameRules[gameMode], [gameMode]);

  const handleToggleVideo = useCallback(() => {
    if (gameMode === "bonus") {
      setIsVideoContent((currentValue) => !currentValue);
    }
  }, [gameMode]);

  return (
    <div className="modal">
      <div
        className={classnames("md-content", {
          contentType: isVideoContent ? "video" : "image",
        })}
      >
        <button className="md-close-button" onClick={onToggleRulesModal}>
          <img className="md-close-icon" alt="close icon" src={iconClose} />
        </button>

        <div className="md-header">
          <h2 className="md-title">RULES</h2>
        </div>

        <div className="md-content-wrapper">
          <img
            src={rulesImageUrl}
            className="md-content-image"
            alt="game rules"
          />

          <iframe
            title="YouTube video player"
            src="https://www.youtube.com/embed/iSHPVCBsnLw?si=o5k8hBQ5hfh2GaLW&amp;start=24"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            className="md-youtube-player"
            allowFullScreen={false}
          />

          {gameMode === "bonus" ? (
            <button className="md-video-button" onClick={handleToggleVideo}>
              {isVideoContent ? (
                <span>View Rules Matrix</span>
              ) : (
                <img alt="play video" src={iconYoutube} />
              )}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
