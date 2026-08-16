import { GameBoard } from "@/components";
import { render, screen } from "@testing-library/react";
import { MockAppContext } from "mockUtils/mockAppContext";
import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("@/components/board/board.selection.component", () => ({
  GameBoardSelection: () => <div data-testid="selection" />,
}));

vi.mock("@/components/board/board.outcome.component", () => ({
  GameBoardOutcome: () => <div data-testid="outcome" />,
}));

describe("GameBoard", () => {
  beforeAll(() => {
    MockAppContext.update({ currentPlayerChoice: undefined });
  });

  it("should render selection-board when no player choice exists", () => {
    render(<GameBoard />);

    expect(screen.getByTestId("selection")).toBeInTheDocument();
    expect(screen.queryByTestId("outcome")).not.toBeInTheDocument();
  });

  it("should render outcome-board when player has selected a choice", () => {
    MockAppContext.update({ currentPlayerChoice: "rock" });

    render(<GameBoard />);

    expect(screen.getByTestId("outcome")).toBeInTheDocument();
    expect(screen.queryByTestId("selection")).not.toBeInTheDocument();
  });
});
