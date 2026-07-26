import iconClose from "@/images/icon-close.svg";
import iconYoutube from "@/images/icon-youtube.svg";
import { GameMode, GameRules } from "@/utilities";
import { FC, useCallback, useMemo, useState } from "react";
import "./modal.styles.scss";

type ModalProps = {
  board: GameMode;
  onCloseModal: () => void;
};

export const Modal: FC<ModalProps> = ({ board, onCloseModal }) => {
  const [isVideoMode, setIsVideoMode] = useState(false);

  const rulesImageUrl = useMemo(() => GameRules[board], [board]);

  const handleToggleVideo = useCallback(() => {
    if (board === "bonus") {
      setIsVideoMode((currentValue) => !currentValue);
    }
  }, [board]);

  return (
    <div className="modal">
      <div className={`md-content ${isVideoMode ? "content--video" : ""}`}>
        <button className="md-close-button" onClick={onCloseModal}>
          <img className="md-close-icon" alt="close icon" src={iconClose} />
        </button>

        <div className="md-header">
          <h2 className="md-title">RULES</h2>
        </div>

        <div
          className={`md-content-wrapper ${isVideoMode ? "content--video" : ""}`}
        >
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

          {board === "bonus" ? (
            <button
              className={`md-video-button ${isVideoMode ? "content--video" : ""}`}
              onClick={handleToggleVideo}
            >
              {isVideoMode ? (
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
