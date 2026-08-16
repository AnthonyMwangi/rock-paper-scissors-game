import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { GameBoard } from "../../../src/components";
import { AppContextValues } from "../../../src/context";

const mockContext: Partial<AppContextValues> = {
  currentPlayerChoice: undefined,
};

vi.mock("@/context/app.context", () => ({
  useAppContext: () => mockContext,
}));

vi.mock("@/components/board/board.selection.component", () => ({
  GameBoardSelection: () => <div data-testid="selection" />,
}));

vi.mock("@/components/board/board.outcome.component", () => ({
  GameBoardOutcome: () => <div data-testid="outcome" />,
}));

describe("GameBoard", () => {
  it("should render selection-board when no player choice exists", () => {
    render(<GameBoard />);

    expect(screen.getByTestId("selection")).toBeInTheDocument();
    expect(screen.queryByTestId("outcome")).not.toBeInTheDocument();
  });

  it("should render outcome-board when player has selected a choice", () => {
    mockContext.currentPlayerChoice = "rock";

    render(<GameBoard />);

    expect(screen.getByTestId("outcome")).toBeInTheDocument();
    expect(screen.queryByTestId("selection")).not.toBeInTheDocument();

    mockContext.currentPlayerChoice = undefined;
  });
});
