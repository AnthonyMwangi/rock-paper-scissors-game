import { ModalComponent } from "@/components/modals/modal.base.component";
import { Icons } from "@/images";
import { useGlobalStore } from "@/store";
import {
  BONUS_RULES_VIDEO,
  Firebase,
  GameRules,
  VideoPlayerStatus,
} from "@/utilities";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";

export const RulesModal: FC = () => {
  const videoRef = useRef<HTMLIFrameElement>(null);
  const gameMode = useGlobalStore((state) => state.app.gameMode);

  const [isVideoContent, setIsVideoContent] = useState(false);

  const RulesImageComponent = useMemo(() => GameRules[gameMode], [gameMode]);

  const handleToggleVideo = useCallback(() => {
    if (gameMode === "bonus") {
      const newValue = !isVideoContent;

      if (newValue) {
        Firebase.trackEvent("RPS_RULES_VIDEO_VIEWED", {
          id: BONUS_RULES_VIDEO.ID,
        });
      }

      return setIsVideoContent(newValue);
    }
  }, [gameMode, isVideoContent]);

  /**
   * Enable the iframe to start posting state events
   */
  const onVideoLoad = () => {
    if (!videoRef.current) return;

    videoRef.current.contentWindow?.postMessage(
      JSON.stringify({ event: "listening", id: BONUS_RULES_VIDEO.ID }),
      BONUS_RULES_VIDEO.ORIGIN,
    );
  };

  /**
   * Listen for the iframe state events
   */
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== BONUS_RULES_VIDEO.ORIGIN) return;

      let data;
      try {
        data = JSON.parse(event.data);
      } catch {
        return; // not a JSON message, ignore
      }

      if (data?.info?.playerState === VideoPlayerStatus.Playing) {
        Firebase.trackEvent("RPS_RULES_VIDEO_PLAYED", {
          videoUrl: data?.videoUrl ?? "null",
          currentTime: data?.currentTime ?? "null",
          duration: data?.duration ?? "null",
          playbackRate: data?.playbackRate ?? "null",
          title: data?.videoData?.title ?? "null",
          eventId: data?.videoData?.eventId ?? "null",
          author: data?.videoData?.author ?? "null",
        });
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <ModalComponent
      title="rules"
      modalName="rules"
      classNameModifiers={{
        media: isVideoContent ? "video" : "image",
      }}
    >
      <div className="md-content-image">
        <RulesImageComponent className="md-image-icon" />
      </div>

      <iframe
        title="YouTube video player"
        src={`https://www.youtube.com/embed/${BONUS_RULES_VIDEO.ID}?si=o5k8hBQ5hfh2GaLW&amp;start=24&amp;enablejsapi=1`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        className="md-youtube-player"
        allowFullScreen={false}
        onLoad={onVideoLoad}
        ref={videoRef}
      />

      {gameMode === "bonus" ? (
        <button className="md-video-button" onClick={handleToggleVideo}>
          {isVideoContent ? (
            <span>View Rules Matrix</span>
          ) : (
            <Icons.Youtube className="md-youtube-icon" />
          )}
        </button>
      ) : null}
    </ModalComponent>
  );
};
