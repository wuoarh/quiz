import consts from '../consts.mjs';

import AdminCard from './admin-card.js';
import AdminCardInputs from './admin-card-inputs.js';
import AdminCategory from './admin-category.js';
import questionData from '../question-data.mjs';

const { cardsX, cardsY, phases } = consts;

const activePhases = [phases.present, phases.round1, phases.round2];

function AdminGameField () {
  let currentCard;
  let socket;
  let lastState;

  const setCurrentCard = (newCard) => {
    currentCard = newCard;
    cardInputs.updateFromCurrentCard(currentCard, lastState);
  };

  const div = document.createElement('div');
  div.classList.add('game-field');

  const cards = [];

  for (let x = 1; x <= cardsX; x++) {
    const category = AdminCategory(div, x - 1);
    category.div.addEventListener('click', () => {
      if (socket) {
        socket.emit('present', x);
      }
    });
    for (let y = 1; y <= cardsY; y++) {
      const question = questionData.categories[x - 1].questions[y - 1];
      const card = new AdminCard(div, x, y, question.timeout);
      card.div.addEventListener('click', () => {
        if (card.div.classList.contains('active')) {
          card.div.classList.remove('active');
          setCurrentCard(undefined);
          if (socket) {
            socket.emit('current');
            socket.emit('reveal');
          }
        } else {
          cards.forEach((card) => {
            card.div.classList.remove('active');
          });
          card.div.classList.add('active');
          setCurrentCard(card);
        }
      });
      cards.push(card);
    }
  }

  const cardInputs = new AdminCardInputs(div);

  document.body.appendChild(div);

  return {
    div,
    updateFromState: (state) => {
      if (activePhases.indexOf(state.phase) > -1) {
        div.classList.remove('disabled');
      } else {
        div.classList.add('disabled');
      }
      lastState = state;
      cards.forEach((card) => {
        card.updateFromState(state);
      });
      cardInputs.updateFromState(state);
    },
    setSocket: (currentSocket) => {
      socket = currentSocket;
      cardInputs.setSocket(currentSocket);
    },
  };
}

export default AdminGameField;
