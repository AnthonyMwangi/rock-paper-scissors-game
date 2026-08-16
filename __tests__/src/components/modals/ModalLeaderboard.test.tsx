import { LeaderboardModal } from "@/components/modals/ModalLeaderboard.component";
import { useLayout } from "@/hooks";
import * as utilities from "@/utilities";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MockStore } from "mockUtils/mockStore";
import { beforeAll, describe, expect, it, Mock, vi } from "vitest";

describe("LeaderboardModal", () => {
  const mockLeaderboardEntry = {
    uid: "player-1",
    displayName: "Player",
    totalGames: 20,
    wins: 15,
    losses: 4,
    draws: 1,
    netScore: 11,
    lossRate: 0,
    winRate: 0,
    mode: "standard",
  } satisfies utilities.ParsedLeaderboardEntry;

  const fetchLeaderboard = vi.spyOn(utilities.Firebase, "fetchLeaderboard");

  beforeAll(() => {
    MockStore.update({
      player: {
        uid: "player-1",
      },
      gameMode: "standard",
    });
  });

  it("should render the leaderboard description", async () => {
    fetchLeaderboard.mockResolvedValueOnce([]);

    const { container } = render(<LeaderboardModal />);

    expect(container.querySelector(".lb-description")).toBeInTheDocument();
  });

  it("should show a loading indicator while fetching data", () => {
    fetchLeaderboard.mockReturnValueOnce(new Promise(() => {}));

    render(<LeaderboardModal />);

    expect(screen.getByTestId("lb-loader")).toBeInTheDocument();
  });

  it("should render leaderboard entries after loading", async () => {
    fetchLeaderboard.mockResolvedValueOnce([mockLeaderboardEntry]);

    render(<LeaderboardModal />);

    await waitFor(() => {
      expect(screen.getByText("Player (You)")).toBeInTheDocument();
    });

    expect(screen.getByText("15 Wins")).toBeInTheDocument();
    expect(screen.getByText("4 Losses")).toBeInTheDocument();
    expect(screen.getByText("11")).toBeInTheDocument();
  });

  it("should display the empty state when no entries are returned", async () => {
    fetchLeaderboard.mockResolvedValueOnce([]);

    render(<LeaderboardModal />);

    await waitFor(() => {
      expect(screen.getByTestId("lb-list-container")).toHaveClass(
        "lb-list-container--is-empty",
      );
    });
  });

  it("should handle error when fetchLeaderboard fails", async () => {
    const mockError = "mock-error";

    fetchLeaderboard.mockRejectedValueOnce(new Error(mockError));

    render(<LeaderboardModal />);

    await waitFor(() => {
      expect(screen.getByTestId("lb-list-container")).toHaveAttribute(
        "data-error",
        expect.stringContaining(mockError),
      );
    });
  });

  it("should display the overlay for the top-3 players", async () => {
    const mockPlayerId = "player-current";

    MockStore.update({
      player: {
        uid: mockPlayerId,
      },
    });

    fetchLeaderboard.mockResolvedValueOnce([
      { ...mockLeaderboardEntry, uid: "player-1" },
      { ...mockLeaderboardEntry, uid: "player-2" },
      { ...mockLeaderboardEntry, uid: "player-3" },
      { ...mockLeaderboardEntry, uid: mockPlayerId },
      { ...mockLeaderboardEntry, uid: "player-4" },
    ]);

    render(<LeaderboardModal />);

    await waitFor(() => {
      expect(screen.getByTestId("lb-list-container").className).toContain(
        "has-data",
      );
    });

    const overlays = screen.queryAllByTestId("lb-overlay");

    expect(overlays[0]).toHaveTextContent("Undisputed. Watch the Throne!");
    expect(overlays[1]).toHaveTextContent("Silver's just Gold with a grudge.");
    expect(overlays[2]).toHaveTextContent("Podium locked in. Eyes on #1.");
    expect(overlays[3]).toHaveTextContent("Welcome to the big league!");
    expect(overlays[4]).toBeUndefined();
  });

  it("should update wrapper height on layout change", () => {
    (useLayout as Mock).mockImplementationOnce((cb) => {
      cb({ layout: { height: 10 } });
    });

    const { rerender } = render(<LeaderboardModal />);

    const wrapper = screen.getByTestId("lb-list-wrapper");

    expect(wrapper).toHaveStyle("height:10px");

    // Update to different value
    (useLayout as Mock).mockImplementationOnce((cb) => {
      cb({ layout: { height: 20 } });
    });

    rerender(undefined);

    expect(wrapper).toHaveStyle("height:10px");
  });

  it("should handle game mode filtering", async () => {
    fetchLeaderboard.mockReset();
    fetchLeaderboard.mockResolvedValue([mockLeaderboardEntry]);

    MockStore.update({
      gameMode: "standard",
      player: { uid: undefined },
    });

    render(<LeaderboardModal />);

    await waitFor(() => {
      expect(screen.getByTestId("lb-list-container").className).toContain(
        "filter-standard",
      );
    });

    await act(() => {
      fireEvent.click(screen.getByTestId("bonus-toggle-button"));
      Promise.resolve();
    });

    await waitFor(() => {
      expect(screen.getByTestId("lb-list-container").className).toContain(
        "filter-bonus",
      );
    });
  });
});
