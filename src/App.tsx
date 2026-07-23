import { GameBoard, GameOption, GameOptions, getComputerChoice, getUserOutcome, Result } from '@/utilities';
import { useCallback, useMemo, useState } from 'react';
import { Chip, Header } from './components';

export const App: React.FC = () => {
  const [gameBoard, setGameMode] = useState<GameBoard>('standard');
  const [gameResults, setGameResults] = useState<Result[]>([]);
  const [selectedOption, setSelectedOption] = useState<GameOption>();
  const [computedResult, setComputedResult] = useState<Result>();

  const options = useMemo(() => GameOptions[gameBoard], [gameBoard]);

  const userScore = useMemo(() => {
    return gameResults.filter(game => game.outcome === 'win').length
  }, [gameResults]);

  const handleSelectOption = useCallback((option: GameOption) => {
    setSelectedOption(option);

    setTimeout(() => {
      const computerChoice = getComputerChoice(options);

      const result = {
        userChoice: option,
        houseChoice: computerChoice,
        outcome: getUserOutcome(option, computerChoice),
        timestamp: Date.now(),
        board: gameBoard,
      }

      setGameResults(values => [...values, result]);
      setComputedResult(result);
    }, 1500);
  }, [gameBoard, options]);

  console.log('gameOutcomes', gameResults);

  return (
    <div className="app">
      <div className="content">
        <Header board={gameBoard} score={userScore} />

        <section className="game-board">
          {!selectedOption ? (
            <div className={`board-content-wrapper board--${gameBoard}`}>
              {options.map((option) => (
                <Chip key={option} option={option} onSelectOption={handleSelectOption} board={gameBoard} />
              ))}
            </div>
          ) : (
            <div className={`board-content-wrapper board--results`}>
              <div className="selected-option selection--user">
                <label className='selection-label'>YOU PICKED</label>
                <Chip option={selectedOption} board={gameBoard} />
              </div>

              <div className="selected-option selection--house">
                <label className='selection-label'>THE HOUSE PICKED</label>

                {computedResult?.houseChoice ? (
                  <Chip option={computedResult.houseChoice} board={gameBoard} />
                ) : (
                  <div className='chip chip--loader' />
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
