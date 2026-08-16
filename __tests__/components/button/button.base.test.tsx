import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../../../src/components";

vi.mock("@/hooks/useLayout.ts", () => ({
  useLayout: vi.fn(),
}));

describe("Button", () => {
  it("renders the label", () => {
    render(<Button label="Play" />);

    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
  });

  it("calls onClick", () => {
    const onClick = vi.fn();

    render(<Button label="Play" onClick={onClick} />);

    fireEvent.click(screen.getByRole("button"));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("sets the label data attribute", () => {
    render(<Button label="Play Game" />);

    expect(screen.getByRole("button")).toHaveAttribute(
      "data-label",
      "play game",
    );
  });

  it("is disabled when disabled is true", () => {
    render(<Button label="Play" disabled />);

    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("is disabled while loading", () => {
    render(<Button label="Play" isLoading />);

    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("does not call onClick while disabled", () => {
    const onClick = vi.fn();

    render(<Button label="Play" disabled onClick={onClick} />);

    fireEvent.click(screen.getByRole("button"));

    expect(onClick).not.toHaveBeenCalled();
  });
});
