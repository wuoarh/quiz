import questionData from '../question-data.mjs';
import getScore from '../get-score.mjs';
import SafeButton from './safe-button.js';

function AdminCardInputs (parent) {
  let socket;
  let current;

  const div = document.createElement('div');
  div.classList.add('panel', 'flex', 'col', 'card-inputs', 'showable');

  const label = document.createElement('div');
  label.classList.add('label', 'title');

  const questionLabel = document.createElement('div');
  questionLabel.classList.add('label', 'question');

  const answerLabel = document.createElement('div');
  answerLabel.classList.add('label', 'answer');

  div.appendChild(label);
  div.appendChild(questionLabel);
  div.appendChild(answerLabel);

  const showButton = new SafeButton('Auf den Schirm!', div, () => {
    if (socket) {
      const newCurrent = {
        x: current.x,
        y: current.y,
        score: current.score,
        category: questionData.categories[current.x - 1].label,
      };

      const timeout = questionData.categories[current.x - 1].questions[current.y - 1].timeout;

      if (timeout) newCurrent.timeout = timeout;

      socket.emit('current', newCurrent);
    }
  });

  const revealButton = document.createElement('button');
  revealButton.innerHTML = 'Reveal Question!';
  revealButton.addEventListener('click', () => {
    if (socket) {
      socket.emit('reveal', { x: current.x, y: current.y });
    }
  });
  div.appendChild(revealButton);

  const revealAnswersButton = document.createElement('button');
  revealAnswersButton.innerHTML = 'Reveal Answers!';
  revealAnswersButton.addEventListener('click', () => {
    if (socket) {
      socket.emit('state', { revealAnswers: true });
    }
  });
  div.appendChild(revealAnswersButton);

  const doneButton = new SafeButton('(Un)Done', div, () => {
    if (socket) {
      socket.emit('done', { x: current.x, y: current.y });
    }
  });

  const update = () => {
    if (current) {
      const category = questionData.categories[current.x - 1];
      const question = category.questions[current.y - 1];
      const labelComponents = [current.score, category.label];
      if (current.timeout) labelComponents.push(`${current.timeout}s`);
      if (question.note) labelComponents.push(`(${question.note})`);
      label.innerHTML = labelComponents.join(' ');
      questionLabel.innerHTML = question.label;
      answerLabel.innerHTML = question.answer;
      div.classList.add('visible');
    } else {
      div.classList.remove('visible');
    }
  };

  parent.appendChild(div);

  return {
    updateFromCurrentCard: (newCard, lastState) => {
      current = newCard;
      if (current) {
        current.score = getScore(current.x, current.y, lastState);
      }
      if (lastState) {
        if (lastState.reveal) {
          revealButton.classList.add('disabled');
          revealAnswersButton.classList.remove('disabled');
          doneButton.div.classList.remove('disabled');
        } else {
          revealButton.classList.remove('disabled');
          revealAnswersButton.classList.add('disabled');
          doneButton.div.classList.add('disabled');
        }
        if (lastState.revealAnswers) {
          revealAnswersButton.classList.add('disabled');
        } else {
          const playerEntries = lastState && lastState.players ? Object.entries(lastState.players) : [];
          const allPlayerCount = lastState && lastState.players ? playerEntries.length : 0;

          const allPlayersHandled = playerEntries.filter(([id, player]) => player.answer && (player.answer.accepted === true || player.answer.accepted === false)).length;
          if (allPlayersHandled < allPlayerCount) {
            doneButton.div.classList.add('disabled');
          } else {
            revealAnswersButton.classList.remove('disabled');
            doneButton.div.classList.remove('disabled');
          }
          revealAnswersButton.classList.remove('disabled');
        }
      }
      update();
    },
    updateFromState: (state) => {
      current = state.current;
      if (current) {
        current.score = getScore(current.x, current.y, state);
      }
      if (state.reveal) {
        revealButton.classList.add('disabled');
        revealAnswersButton.classList.remove('disabled');
        doneButton.div.classList.remove('disabled');
      } else {
        revealButton.classList.remove('disabled');
        revealAnswersButton.classList.add('disabled');
        doneButton.div.classList.add('disabled');
      }
      if (state.revealAnswers) {
        revealAnswersButton.classList.add('disabled');
      } else {
        const playerEntries = state && state.players ? Object.entries(state.players) : [];
        const allPlayerCount = state && state.players ? playerEntries.length : 0;

        const allPlayersHandled = playerEntries.filter(([id, player]) => !player.answer || (player.answer.accepted === true || player.answer.accepted === false)).length;
        if (allPlayersHandled < allPlayerCount) {
          revealAnswersButton.classList.add('disabled');
        } else {
          revealAnswersButton.classList.remove('disabled');
        }
      }

      update();
    },
    setSocket: (currentSocket) => {
      socket = currentSocket;
    },
  };
}

export default AdminCardInputs;
