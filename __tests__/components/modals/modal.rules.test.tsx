import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RulesModal } from "../../../src/components/modals/modal.rules.component";

const setState = vi.fn();
const trackEvent = vi.fn();

vi.mock("@/store", () => ({
  useGlobalStore: vi.fn(() => "standard"),
}));

vi.mock("@/hooks/useLayout.ts", () => ({
  useLayout: vi.fn(),
}));

describe("RulesModal", () => {
  it("should render the rules title", () => {
    render(<RulesModal />);

    expect(screen.getByRole("heading", { name: "rules" })).toBeInTheDocument();
  });

  it("should render the rules matrix", () => {
    render(<RulesModal />);

    expect(screen.getByTestId("rules-image")).toBeInTheDocument();
  });

  it("should render the rules video iframe", () => {
    render(<RulesModal />);

    expect(screen.getByTitle("YouTube video player")).toBeInTheDocument();
  });
});
