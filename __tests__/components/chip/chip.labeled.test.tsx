import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LabeledChip } from "../../../src/components/chip/chip.labeled.component";

describe("LabeledChip", () => {
  it("should render the supplied label", () => {
    render(<LabeledChip label="YOU PICKED" option="rock" isWinningChip />);

    expect(screen.getByText("YOU PICKED")).toBeInTheDocument();
  });

  it("should render a chip when an option is supplied", () => {
    render(<LabeledChip label="YOU PICKED" option="paper" isWinningChip />);

    expect(screen.getByRole("button")).toHaveAttribute("data-option", "paper");
  });

  it("should pass the winning state to the chip", () => {
    render(
      <LabeledChip label="YOU PICKED" option="rock" isWinningChip={false} />,
    );

    expect(screen.getByRole("button")).toHaveAttribute("data-winning", "false");
  });

  it("should render a loading chip when no option is supplied", () => {
    const { container } = render(
      <LabeledChip label="THE HOUSE PICKED" isWinningChip={false} />,
    );

    const chip = container.querySelector(".chip");

    expect(chip?.className).toContain("status-loading");
  });
});
