import { ToggleButton } from "@/components";
import { ModalComponent } from "@/components/modals/modal.base.component";
import { Layout, useLayout } from "@/hooks";
import { Icons } from "@/images";
import { useGlobalStore } from "@/store";
import {
  clsx,
  Firebase,
  GameMode,
  GameModeName,
  LeaderboardEntry,
} from "@/utilities";
import { FC, useCallback, useEffect, useMemo, useState } from "react";

export const LeaderboardModal: FC = () => {
  const playerId = useGlobalStore((state) => state.app.player?.uid);
  const globalGameMode = useGlobalStore((state) => state.app.gameMode);

  const [error, setError] = useState<string>();
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [gameModeFilter, setGameModeFilter] = useState(globalGameMode);

  const [isPlayerRanked, setIsPlayerRanked] = useState<boolean>(true);
  const [wrapperLayout, setWrapperLayout] = useState<Layout>();

  const handleLayout = useCallback(
    (layout: Layout) => {
      if (!wrapperLayout?.height) {
        setWrapperLayout(layout);
      }
    },
    [wrapperLayout?.height],
  );

  const fetchLeaderboardData = useCallback(async () => {
    try {
      setData([]);
      setIsLoading(true);

      const entries = await Firebase.fetchLeaderboard(gameModeFilter);

      // If user is not ranked show their stats at the end
      if (playerId && !entries.find((entry) => entry.uid === playerId)) {
        const [userEntry] = await Firebase.fetchLeaderboard(
          gameModeFilter,
          playerId,
        );
        if (userEntry?.uid) entries.push(userEntry);
        setIsPlayerRanked(false);
      }

      setData(entries);
    } catch (e: unknown) {
      setError(
        `Uh oh! Something went wrong, Please close the board and try again — ${(e as Error).message}`,
      );
    } finally {
      setIsLoading(false);
    }
  }, [gameModeFilter, playerId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLeaderboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameModeFilter]);

  const getOverlayCopy = useCallback(
    (entry: LeaderboardEntry, rank: number) => {
      if (rank === 1) return "Undisputed. Watch the Throne!";
      if (rank === 2) return "Silver's just Gold with a grudge.";
      if (rank === 3) return "Podium locked in. Eyes on #1.";
      if (entry.uid === playerId) {
        return isPlayerRanked
          ? "Welcome to the big league!"
          : "You're not on the board yet. Keep grinding!";
      }
      return undefined;
    },
    [isPlayerRanked, playerId],
  );

  const gameModes = useMemo(() => {
    return Object.entries(GameModeName).map(([name, label]) => ({
      id: name,
      onClick: () => setGameModeFilter(name as GameMode),
      disabled: isLoading,
      label,
    }));
  }, [isLoading]);

  const listRef = useLayout((e) => handleLayout(e.layout));

  return (
    <ModalComponent title="Leaderboard" modalName="leaderboard">
      <div
        ref={listRef}
        style={{ height: wrapperLayout?.height }}
        className="lb-list-wrapper"
      >
        <p className="lb-description">
          Wins earn you a point <b className="pos">(+1)</b>, losses cost you one{" "}
          <b className="neg">(-1)</b>. Draws don&apos;t count (nobody remembers
          a tie 🤪). Play enough games to make the cut, then let your record do
          the talking.
        </p>

        <div className="lb-filter">
          <ToggleButton
            theme="dark"
            selectedOptionID={gameModeFilter}
            options={gameModes}
          />
        </div>

        <ul
          data-error={error}
          className={clsx("lb-list-container", {
            isEmpty: !isLoading && !data?.length,
            isLoading: isLoading,
            hasError: !!error,
          })}
        >
          {isLoading ? <Icons.IconLoader className="lb-loading-icon" /> : null}

          {data.map((entry, index) => {
            const isPlayer = entry.uid === playerId;
            const isUnRankedPlayer = isPlayer && !isPlayerRanked;
            const rankCopy = getOverlayCopy(entry, index + 1);

            return (
              <li
                key={entry.uid}
                className={clsx("lb-entry", {
                  isPlayer,
                  isUnRankedPlayer,
                })}
              >
                <p className="lb-entry-position">
                  {isUnRankedPlayer ? "#" : index + 1}
                </p>

                <div className="lb-entry-content">
                  <p className="lb-entry-username">
                    {isPlayer
                      ? `${entry.displayName} (You)`
                      : entry.displayName}
                  </p>

                  <p className="lb-entry-metrics">
                    <span className="lb-metric-total">
                      {entry.totalGames} Games
                    </span>
                    <span className="lb-metric-wins">{entry.wins} Wins</span>
                    <span className="lb-metric-draws">{entry.draws} Draws</span>
                    <span className="lb-metric-losses">
                      {entry.losses} Losses
                    </span>
                    <span className="lb-metric-rate">
                      {`(${entry.totalGames.toFixed(0)}% Win Rate)`}
                    </span>
                  </p>
                </div>

                <div className="lb-entry-points">
                  <p className="lb-points-value">{entry.netScore}</p>
                  <p className="lb-points-label">POINTS</p>
                </div>

                {rankCopy ? (
                  <div className="lb-overlay-wrapper">
                    <em className="lb-entry-overlay">{rankCopy}</em>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </ModalComponent>
  );
};
