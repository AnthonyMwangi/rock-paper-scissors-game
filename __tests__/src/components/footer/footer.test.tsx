import { Footer } from "@/components/footer/footer.component";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { MockAppContext } from "mockUtils/mockAppContext";
import { MockStore } from "mockUtils/mockStore";
import { beforeAll, describe, expect, it, vi } from "vitest";

describe("Footer", () => {
  const mockOnResetGame = vi.fn();
  const mockOnToggleModal = vi.fn();
  const mockSetGameMode = vi.fn();

  beforeAll(() => {
    MockStore.update({
      setGameMode: mockSetGameMode,
    });

    MockAppContext.update({
      gameMode: "standard",
      onResetGame: mockOnResetGame,
      onToggleModal: mockOnToggleModal,
    });
  });

  it("should render toggle button for the game modes", () => {
    render(<Footer />);

    expect(screen.getByTestId("standard-toggle-button")).toBeInTheDocument();
    expect(screen.getByTestId("bonus-toggle-button")).toBeInTheDocument();
  });

  it("should mark the current game mode as selected", () => {
    render(<Footer />);

    expect(screen.getByTestId("standard-toggle-button").className).toContain(
      "is-selected",
    );

    expect(screen.getByTestId("bonus-toggle-button").className).not.toContain(
      "is-selected",
    );
  });

  it("should disable game mode selection when the player has already selected a move", () => {
    MockAppContext.update({
      currentPlayerChoice: "rock",
    });

    render(<Footer />);

    expect(screen.getByTestId("standard-toggle-button")).toBeDisabled();
    expect(screen.getByTestId("bonus-toggle-button")).toBeDisabled();

    MockAppContext.update({
      currentPlayerChoice: undefined,
    });
  });

  it("should enable game mode selection before the player selects a move", () => {
    render(<Footer />);

    expect(screen.getByTestId("standard-toggle-button")).not.toBeDisabled();
    expect(screen.getByTestId("bonus-toggle-button")).not.toBeDisabled();
  });

  it("should change the game mode when another mode is selected", () => {
    render(<Footer />);

    expect(screen.getByTestId("bonus-toggle-button")).not.toBeDisabled();

    act(() => {
      fireEvent.click(screen.getByTestId("bonus-toggle-button"));
    });

    expect(mockSetGameMode).toHaveBeenCalledWith("bonus");
  });

  it("should reset the game after changing the game mode", () => {
    render(<Footer />);

    act(() => {
      fireEvent.click(screen.getByTestId("bonus-toggle-button"));
    });

    expect(mockOnResetGame).toHaveBeenCalledWith({
      showUsernameModal: false,
    });
  });

  it("should not reset the game when the current game mode is selected", () => {
    mockSetGameMode.mockReset();
    mockOnResetGame.mockReset();

    render(<Footer />);

    act(() => {
      fireEvent.click(screen.getByTestId("standard-toggle-button"));
    });

    expect(mockSetGameMode).not.toHaveBeenCalled();
    expect(mockOnResetGame).not.toHaveBeenCalled();
  });

  it("should open the leaderboard modal", () => {
    render(<Footer />);

    fireEvent.click(screen.getByTestId("leaderboard-modal-button"));

    expect(mockOnToggleModal).toHaveBeenCalledWith("leaderboard");
  });

  it("should open the profile modal", () => {
    render(<Footer />);

    fireEvent.click(screen.getByTestId("username-modal-button"));

    expect(mockOnToggleModal).toHaveBeenCalledWith("username");
  });

  it("should open the rules modal", () => {
    render(<Footer />);

    fireEvent.click(screen.getByTestId("rules-modal-button"));

    expect(mockOnToggleModal).toHaveBeenCalledWith("rules");
  });

  it("should toggle the mobile menu state", () => {
    const { container } = render(<Footer />);

    const fab = container.querySelector(".fab-action-button")!;

    fireEvent.click(fab);

    expect(container.querySelector("footer")?.className).toContain(
      "is-menu-open",
    );

    fireEvent.click(fab);

    expect(container.querySelector("footer")?.className).not.toContain(
      "is-menu-open",
    );
  });
});
