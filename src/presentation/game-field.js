import Card from './card.js';
import Category from '../category.js';
import consts from '../consts.mjs';
import Showable from '../showable.js';

const { cardsX, cardsY } = consts;

function GameField (background) {
  const gameField = new Showable('game-field');

  const cards = [];
  const categoryDivs = [];

  for (let x = 1; x <= cardsX; x++) {
    const categoryDiv = new Showable('category-container');
    Category(categoryDiv.div, x - 1);
    for (let y = 1; y <= cardsY; y++) {
      cards.push(new Card(categoryDiv.div, x, y));
    }
    gameField.div.appendChild(categoryDiv.div);
    categoryDivs.push(categoryDiv);
  }

  const updateFromState = (state) => {
    cards.forEach((card) => {
      card.updateFromState(state);
    });

    if (state.phase !== consts.phases.present) {
      categoryDivs.forEach((categoryDiv) => categoryDiv.show());
    } else {
      categoryDivs.forEach((categoryDiv) => categoryDiv.hide());
    }
  };

  document.body.appendChild(gameField.div);

  return {
    div: gameField.div,
    updateFromState,
    present: (x) => {
      categoryDivs[x - 1].show();
    },
    show: (state) => {
      updateFromState(state);

      if (state.current) {
        background.div.style.display = '';
        setTimeout(() => {
          background.show();
        });
      } else {
        background.hide();
        setTimeout(() => {
          background.div.style.display = 'none';
        }, 1000);
      }

      gameField.show();
    },
    hide: () => {
      gameField.hide();
    },
  };
}

export default GameField;
