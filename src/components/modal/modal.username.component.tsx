import { ModalComponent } from "@/components/modal/modal.base.component";
import { useAppContext } from "@/context/app.context";
import {
  classnames,
  Firebase,
  USERNAME_ERROR_MESSAGES,
  validateUsername,
} from "@/utilities";
import { ChangeEvent, FC, useCallback, useMemo, useState } from "react";

export const UsernameModal: FC = () => {
  const { onToggleUsernameModal } = useAppContext();

  const [username, setUsername] = useState<string>("");
  const [submitErrorCount, setSubmitErrorCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handle username input
   * - Clear any previous submit errors
   */
  const handleUsernameInput = useCallback(
    (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
      if (submitErrorCount) setSubmitErrorCount(null);
      return setUsername(e.target.value || "");
    },
    [submitErrorCount],
  );

  /**
   * Validate username on-type and on-submit
   */
  const handleValidation = useCallback(
    (isFinal: boolean) => {
      if (!username && !isFinal) return undefined;
      const validationFormat = validateUsername(username);
      return !validationFormat.valid
        ? USERNAME_ERROR_MESSAGES[validationFormat.reason]
        : undefined;
    },
    [username],
  );

  /**
   * Save username and close modal
   */
  const handleSaveUsername = useCallback(async () => {
    const error = handleValidation(true);
    if (error) return setSubmitErrorCount((c) => (c || 0) + 1);

    setIsLoading(true);
    await Firebase.updateUserName(username).finally(() => {
      setIsLoading(false);
    });

    return onToggleUsernameModal();
  }, [handleValidation, onToggleUsernameModal, username]);

  const validationErrorMessage = useMemo(
    () => handleValidation(false),
    [handleValidation],
  );

  return (
    <ModalComponent
      title=""
      modalName="username"
      onCloseModal={onToggleUsernameModal}
      classNameModifiers={{ type: "username" }}
    >
      <div className="md-input-wrapper">
        <h2 className="md-heading">Don&lsquo;t play as a ghost!</h2>

        <label htmlFor="display-name-input" className="md-input-label">
          Enter your name to claim your spot on the leaderboard
        </label>

        <input
          type="name"
          key={submitErrorCount}
          className={classnames("md-input", {
            hasError: !!submitErrorCount && !!validationErrorMessage,
          })}
          placeholder="Enter your name"
          onChange={handleUsernameInput}
          id="display-name-input"
          autoComplete="name"
          value={username}
        />

        <span className="md-input-error">{validationErrorMessage}</span>

        <button
          onClick={handleSaveUsername}
          className={classnames("md-save-button", { isLoading })}
          disabled={isLoading}
        >
          <span>Update Username</span>
        </button>
      </div>
    </ModalComponent>
  );
};
