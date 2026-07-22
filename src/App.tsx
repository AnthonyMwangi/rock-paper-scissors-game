import { GameBoard, GameOption, GameOptions, getComputerChoice, getUserOutcome, Result } from '@/utilities';
import { useCallback, useMemo, useState } from 'react';
import { Chip, Header } from './components';

export const App: React.FC = () => {
  const [gameBoard, setGameMode] = useState<GameBoard>('standard');
  const [gameResults, setGameResults] = useState<Result[]>([]);

  const options = useMemo(() => GameOptions[gameBoard], [gameBoard]);

  const userScore = useMemo(() => {
    return gameResults.filter(game => game.outcome === 'win').length
  }, [gameResults]);

  const handleSelectOption = useCallback((selectedOption: GameOption) => {
    const computerChoice = getComputerChoice(options);

    setGameResults(values => [...values, {
      computerChoice,
      userChoice: selectedOption,
      outcome: getUserOutcome(selectedOption, computerChoice),
      timestamp: Date.now(),
      board: gameBoard,
    }]);
  }, [gameBoard, options]);

  console.log('gameOutcomes', gameResults);

  return (
    <div className="app">
      <div className="content">
        <Header board={gameBoard} score={userScore} />

        <section className="game-board">
          <div className={`board-content-wrapper board--${gameBoard}`}>
            {options.map((option) => (
              <Chip key={option} option={option} onSelectOption={handleSelectOption} board={gameBoard} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
