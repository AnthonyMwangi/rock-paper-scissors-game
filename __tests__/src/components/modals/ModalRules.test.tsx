import { RulesModal } from "@/components/modals/ModalRules.component";
import { render, screen } from "@testing-library/react";
import { MockStore } from "mockUtils/mockStore";
import { beforeAll, describe, expect, it } from "vitest";

describe("RulesModal", () => {
  beforeAll(() => {
    MockStore.update({ gameMode: "standard" });
  });

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
