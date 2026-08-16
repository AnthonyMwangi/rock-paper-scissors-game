import { GameBoardOutcome } from "@/components/board/GameBoardOutcome.component";
import { GameOutcome } from "@/utilities";
import { fireEvent, render, screen } from "@testing-library/react";
import { MockAppContext } from "mockUtils/mockAppContext";
import { beforeAll, describe, expect, it, vi } from "vitest";

describe("GameBoardOutcome", () => {
  const mockResetGame = vi.fn();

  beforeAll(() => {
    MockAppContext.update({
      currentPlayerChoice: "rock",
      currentGameResult: undefined,
      onResetGame: mockResetGame,
    });
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
      MockAppContext.update({
        currentGameResult: {
          outcome: outcome as GameOutcome,
          opponentChoice: "paper",
        },
      });

      render(<GameBoardOutcome />);

      expect(screen.getByText(new RegExp(outcome, "i"))).toBeInTheDocument();
    },
  );

  it("should render the Play Again button after a result is available", () => {
    MockAppContext.update({
      currentGameResult: {
        outcome: "win",
        opponentChoice: "scissors",
      },
    });

    render(<GameBoardOutcome />);

    expect(
      screen.getByRole("button", { name: "Play Again" }),
    ).toBeInTheDocument();
  });

  it("should reset the game and request the username modal when Play Again is clicked", () => {
    render(<GameBoardOutcome />);

    fireEvent.click(screen.getByRole("button", { name: "Play Again" }));

    expect(mockResetGame).toHaveBeenCalledWith({
      showUsernameModal: true,
    });
  });
});
