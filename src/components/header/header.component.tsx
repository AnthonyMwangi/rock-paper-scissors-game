import './header.styles.scss';

import { FC } from 'react';


type HeaderProps = {
  logo: string;
  score: number;
}

export const Header: FC<HeaderProps> = ({ logo, score }) => {
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
