import { GameBoard, GameLogo } from '@/config';
import { FC, useMemo } from 'react';
import './header.styles.scss';

type HeaderProps = {
  board: GameBoard;
  score: number;
}

export const Header: FC<HeaderProps> = ({ board, score }) => {
  const logo = useMemo(() => GameLogo[board], [board]);

  return (
    <header className="header">
      <img className='logo' alt='app logo' src={logo} />

      <div className='score-card'>
        <label>SCORE</label>
        <h2>{score}</h2>
      </div>
    </header>
  )
}
