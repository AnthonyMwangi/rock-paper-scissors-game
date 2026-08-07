import { ModalComponent } from "@/components/modals/modal.base.component";
import { Layout, useLayout } from "@/hooks";
import { useGlobalStore } from "@/store";
import { classnames, Firebase, LeaderboardEntry } from "@/utilities";
import { FC, useCallback, useEffect, useState } from "react";

export const LeaderboardModal: FC = () => {
  const playerId = useGlobalStore((state) => state.app.player?.uid);

  const [error, setError] = useState<string>();
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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

  useEffect(() => {
    Firebase.fetchLeaderboard()
      .then(async (entries) => {
        const { player } = useGlobalStore.getState().app;

        // If user is not ranked show their stats at the end
        if (player?.uid && !entries.find((entry) => entry.uid === player.uid)) {
          const [userEntry] = await Firebase.fetchLeaderboard(player.uid);
          if (userEntry?.uid) entries.push(userEntry);
          setIsPlayerRanked(false);
        }

        setData(entries);
      })
      .catch((e) =>
        setError(
          `Uh oh! Something went wrong, Please close the board and try again — ${e.message}`,
        ),
      )
      .finally(() => setIsLoading(false));
  }, [isLoading]);

  const getOverlayCopy = useCallback(
    (entry: LeaderboardEntry, rank: number) => {
      if (rank === 1) return "#Undisputed. All hail the King!";
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

  const listRef = useLayout((e) => handleLayout(e.layout));

  return (
    <ModalComponent title="Leaderboard" modalName="leaderboard">
      <p className="lb-description">
        Wins earn you a point <b className="pos">(+1)</b>, losses cost you one{" "}
        <b className="neg">(-1)</b>. Draws don&apos;t count (nobody remembers a
        tie 🤪). Play enough games to make the cut, then let your record do the
        talking.
      </p>

      <div ref={listRef} className="lb-list-wrapper">
        <ul
          data-error={error}
          style={{ height: wrapperLayout?.height }}
          className={classnames("lb-list-container", {
            isEmpty: !isLoading && !data?.length,
            isLoading: isLoading,
            hasError: !!error,
          })}
        >
          {data.map((entry, index) => {
            const isPlayer = entry.uid === playerId;
            const isUnRankedPlayer = isPlayer && !isPlayerRanked;
            const rankCopy = getOverlayCopy(entry, index + 1);

            return (
              <li
                key={entry.uid}
                className={classnames("lb-entry", {
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
                      {`(${entry.totalGames}% Win Rate)`}
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
