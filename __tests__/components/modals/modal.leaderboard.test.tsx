import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LeaderboardModal } from "../../../src/components/modals/modal.leaderboard.component";
import * as utilities from "../../../src/utilities";

vi.mock("@/store", () => ({
  useGlobalStore: (selector: (state: unknown) => unknown) =>
    selector({
      app: {
        player: {
          uid: "player-1",
        },
        gameMode: "standard",
      },
    }),
}));

vi.mock("@/hooks/useLayout.ts", () => ({
  useLayout: vi.fn(),
}));

describe("LeaderboardModal", () => {
  const fetchLeaderboard = vi.spyOn(utilities.Firebase, "fetchLeaderboard");

  it("should render the leaderboard description", async () => {
    fetchLeaderboard.mockResolvedValue([]);

    const { container } = render(<LeaderboardModal />);

    expect(container.querySelector(".lb-description")).toBeInTheDocument();
  });

  it("should show a loading indicator while fetching data", () => {
    fetchLeaderboard.mockReturnValue(new Promise(() => {}));

    render(<LeaderboardModal />);

    expect(screen.getByTestId("lb-loader")).toBeInTheDocument();
  });

  it("should render leaderboard entries after loading", async () => {
    fetchLeaderboard.mockResolvedValue([
      {
        uid: "player-1",
        displayName: "Anthony",
        totalGames: 20,
        wins: 15,
        losses: 4,
        draws: 1,
        netScore: 11,
      },
    ]);

    render(<LeaderboardModal />);

    await waitFor(() => {
      expect(screen.getByText("Anthony (You)")).toBeInTheDocument();
    });

    expect(screen.getByText("15 Wins")).toBeInTheDocument();
    expect(screen.getByText("4 Losses")).toBeInTheDocument();
    expect(screen.getByText("11")).toBeInTheDocument();
  });

  it("should display the empty state when no entries are returned", async () => {
    fetchLeaderboard.mockResolvedValue([]);

    const { container } = render(<LeaderboardModal />);
    const listContainer = container.querySelector(".lb-list-container");

    await waitFor(() => {
      expect(listContainer?.className).toContain("is-empty");
    });
  });

  it("should display the first-place overlay for the top-ranked player", async () => {
    fetchLeaderboard.mockResolvedValue([
      {
        uid: "player-1",
        displayName: "Anthony",
        totalGames: 20,
        wins: 15,
        losses: 4,
        draws: 1,
        netScore: 11,
      },
    ]);

    render(<LeaderboardModal />);

    await waitFor(() => {
      expect(
        screen.getByText("Undisputed. Watch the Throne!"),
      ).toBeInTheDocument();
    });
  });
});
