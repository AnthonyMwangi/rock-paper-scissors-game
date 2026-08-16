import { useAppContext } from "@/context";
import { useLayout, UseLayoutCallback } from "@/hooks";
import { Icons } from "@/images";
import { clsx, GameModal, ModifierValue } from "@/utilities";
import { FC, PropsWithChildren } from "react";
import "./modal.base.styles.scss";

type ModalComponentProps = PropsWithChildren<{
  title?: string;
  classNameModifiers?: Record<string, ModifierValue>;
  modalName: Lowercase<GameModal>;
  disableCloseBtn?: boolean;
  onLayout?: UseLayoutCallback;
}>;

export const ModalComponent: FC<ModalComponentProps> = ({
  title,
  children,
  onLayout,
  classNameModifiers = {},
  disableCloseBtn,
  modalName,
}) => {
  const { gameMode, onToggleModal } = useAppContext();

  const contentWrapperRef = useLayout((e) => onLayout?.(e));

  return (
    <div className="modal">
      <div id={modalName} className={clsx("md-content", classNameModifiers)}>
        <button
          className="md-close-button"
          disabled={disableCloseBtn}
          onClick={() =>
            onToggleModal(modalName, { mode: gameMode, ...classNameModifiers })
          }
        >
          <Icons.IconClose className="md-close-icon" />
        </button>

        <div className="md-header">
          {title ? <h1 className="md-title">{title}</h1> : null}
        </div>

        <div ref={contentWrapperRef} className="md-content-wrapper">
          {children}
        </div>
      </div>
    </div>
  );
};
