import { GameBoard, GameOption, GameOptionImage } from '@/utilities';
import { FC } from 'react';
import './chip.styles.scss';

type ChipProps = {
  board: GameBoard;
  option: GameOption;
  onSelectOption?: (option: GameOption) => void;
}

export const Chip: FC<ChipProps> = ({ board, option, onSelectOption }) => {
  return (
    <button className={`chip ${option} board--${board}`} onClick={() => onSelectOption?.(option)}>
      <div className="wrapper">
        <img className='icon' alt={`${option} icon`} src={GameOptionImage[option]} />
      </div>
      <div className='hover-animation' />
    </button>
  )
}
