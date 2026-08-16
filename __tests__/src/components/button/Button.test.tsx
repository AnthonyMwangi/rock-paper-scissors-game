import { Button } from "@/components";
import { useLayout } from "@/hooks";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, Mock, vi } from "vitest";

describe("Button", () => {
  it("should render the label", () => {
    render(<Button label="Play" />);

    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
  });

  it("should call onClick prop when pressed", () => {
    const mockOnClick = vi.fn();

    render(<Button label="Play" onClick={mockOnClick} />);

    fireEvent.click(screen.getByRole("button"));

    expect(mockOnClick).toHaveBeenCalledOnce();
  });

  it("should set the label data attribute", () => {
    render(<Button label="Play Game" />);

    expect(screen.getByRole("button")).toHaveAttribute(
      "data-label",
      "play game",
    );
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Button label="Play" disabled />);

    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should be disabled while loading", () => {
    render(<Button label="Play" isLoading />);

    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should not call onClick while disabled", () => {
    const onClick = vi.fn();

    render(<Button label="Play" disabled onClick={onClick} />);

    fireEvent.click(screen.getByRole("button"));

    expect(onClick).not.toHaveBeenCalled();
  });

  it("should update icon size on layout change", () => {
    (useLayout as Mock).mockImplementationOnce((cb) => {
      cb({ layout: { height: 10 } });
    });

    render(<Button label="close" icon="IconClose" id="close-btn" />);

    fireEvent.click(screen.getByTestId("close-btn"));

    expect(screen.getByTestId("button-icon")).toHaveStyle("width:11px");
  });
});
