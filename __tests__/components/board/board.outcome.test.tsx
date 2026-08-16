import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GameBoardOutcome } from "../../../src/components/board/board.outcome.component";
import { AppContextValues } from "../../../src/context";

const mockResetGame = vi.fn();

const mockContext: Partial<AppContextValues> = {
  currentPlayerChoice: "rock",
  currentGameResult: undefined,
  onResetGame: mockResetGame,
};

vi.mock("@/context/app.context", () => ({
  useAppContext: () => mockContext,
}));

vi.mock("@/components", () => ({
  LabeledChip: ({ label }: { label: string }) => <div>{label}</div>,
}));

describe("GameBoardOutcome", () => {
  beforeEach(() => {
    mockContext.currentPlayerChoice = "rock";
    mockContext.currentGameResult = undefined;
    mockResetGame.mockReset();
  });

  it("should render the player and house labels while waiting for the result", () => {
    render(<GameBoardOutcome />);

    expect(screen.getByText("YOU PICKED")).toBeInTheDocument();
    expect(screen.getByText("THE HOUSE PICKED")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Play Again" }),
    ).not.toBeInTheDocument();
  });

  it.each(["win", "lose", "draw"])(
    "should render the %s outcome",
    (outcome) => {
      mockContext.currentGameResult = {
        outcome,
        opponentChoice: "paper",
      };

      render(<GameBoardOutcome />);

      expect(screen.getByText(new RegExp(outcome, "i"))).toBeInTheDocument();
    },
  );

  it("should render the Play Again button after a result is available", () => {
    mockContext.currentGameResult = {
      outcome: "win",
      opponentChoice: "scissors",
    };

    render(<GameBoardOutcome />);

    expect(
      screen.getByRole("button", { name: "Play Again" }),
    ).toBeInTheDocument();
  });

  it("should reset the game and request the username modal when Play Again is clicked", () => {
    mockContext.currentGameResult = {
      outcome: "win",
      opponentChoice: "scissors",
    };

    render(<GameBoardOutcome />);

    fireEvent.click(screen.getByRole("button", { name: "Play Again" }));

    expect(mockContext.onResetGame).toHaveBeenCalledWith({
      showUsernameModal: true,
    });
  });
});
