import { GameBoard } from "@/components";
import { render } from "@testing-library/react";
import { MockAppContext } from "mockUtils/mockAppContext";
import { describe, expect, it } from "vitest";

describe("GameBoard", () => {
  it("should render standard selection-board when no player choice exists", () => {
    MockAppContext.update({
      currentPlayerChoice: undefined,
      gameMode: "standard",
    });

    const { container } = render(<GameBoard />);
    const wrapper = container.querySelector(".board-content-wrapper");

    expect(wrapper).toBeInTheDocument();
    expect(wrapper?.className).toContain("board-standard");
  });

  it("should render bonus selection-board when no player choice exists", () => {
    MockAppContext.update({
      currentPlayerChoice: undefined,
      gameMode: "bonus",
    });

    const { container } = render(<GameBoard />);
    const wrapper = container.querySelector(".board-content-wrapper");

    expect(wrapper).toBeInTheDocument();
    expect(wrapper?.className).toContain("board-bonus");
  });

  it("should render outcome-board when player has selected a choice", () => {
    MockAppContext.update({ currentPlayerChoice: "rock" });

    const { container } = render(<GameBoard />);
    const wrapper = container.querySelector(".board-content-wrapper");

    expect(wrapper).toBeInTheDocument();
    expect(wrapper?.className).toContain("board-outcome");
  });
});
