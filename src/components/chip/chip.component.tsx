import { GameBoard, GameOption, GameOptionImage } from '@/config';
import { FC, Fragment } from 'react';
import './chip.styles.base.scss';

type ChipProps = {
  board: GameBoard;
  option: GameOption;
  onSelectOption: (option: GameOption) => void;
}

export const Chip: FC<ChipProps> = ({ board, option, onSelectOption }) => {
  return (
    <Fragment key={option}>
      <hr className={`line board--${board}`} />

      <button className={`chip ${option} board--${board}`} onClick={() => onSelectOption(option)}>
        <div className="wrapper">
          <img className='icon' alt={`${option} icon`} src={GameOptionImage[option]} />
        </div>
      </button>
    </Fragment>
  )
}
