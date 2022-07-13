import Showable from '../showable';
import SafeButton from './safe-button';

const format = new Intl.NumberFormat('de-DE');

function AdminPlayerRow (parent, paramPlayer) {
  let socket;

  const container = new Showable('player-row');

  const topRow = document.createElement('div');
  topRow.classList.add('player-row-row');

  const nameSpan = document.createElement('span');
  nameSpan.classList.add('player-name');

  const pointsInput = document.createElement('input');
  pointsInput.classList.add('player-points');
  pointsInput.setAttribute('type', 'number');
  pointsInput.setAttribute('step', 100);
  pointsInput.value = 0;
  pointsInput.addEventListener('change', () => {
    if (socket) {
      socket.emit('set-points', { id: player.id, points: parseInt(pointsInput.value) });
    }
  });

  const secondRow = document.createElement('div');
  secondRow.classList.add('player-row-row');

  const answerLabel = document.createElement('div');
  answerLabel.classList.add('answer-label');

  const answerButtons = document.createElement('div');

  const declineButton = new SafeButton('-', answerButtons, () => {
    console.log('decline', player.id, socket);
    if (socket) {
      socket.emit('decline', { id: player.id });
    }
  });

  const acceptButton = new SafeButton('+', answerButtons, () => {
    console.log('accept', player.id, socket);
    if (socket) {
      socket.emit('accept', { id: player.id });
    }
  });

  const deleteAnswerButton = document.createElement('button');
  deleteAnswerButton.innerHTML = 'X';
  deleteAnswerButton.addEventListener('click', () => {
    console.log('delete answer', player.id, socket);
    if (socket) {
      socket.emit('delete-answer', { id: player.id });
    }
  });

  answerButtons.appendChild(deleteAnswerButton);

  const deletePlayerButton = document.createElement('button');
  deletePlayerButton.innerHTML = 'X';
  deletePlayerButton.style.fontWeight = '600';
  deletePlayerButton.addEventListener('click', () => {
    const reallyDelete = confirm('Are you sure?');
    if (reallyDelete) {
      console.log('delete', player.id, socket);
      if (socket) {
        socket.emit('delete', { id: player.id });
      }
    }
  });

  topRow.appendChild(nameSpan);
  topRow.appendChild(pointsInput);
  topRow.appendChild(deletePlayerButton);

  secondRow.appendChild(answerLabel);
  secondRow.appendChild(answerButtons);

  container.div.appendChild(topRow);
  container.div.appendChild(secondRow);

  let player = paramPlayer;

  const updateFromPlayer = (paramPlayer) => {
    if (paramPlayer) {
      console.log(paramPlayer);
      player = paramPlayer;
      nameSpan.innerHTML = paramPlayer.name;
      pointsInput.value = paramPlayer.points;
      if (player.answer) {
        answerLabel.innerHTML = player.answer.answer;
        if (player.answer.accepted === true) {
          answerLabel.classList.add('accepted');
          answerLabel.classList.remove('declined');
        } else if (player.answer.accepted === false) {
          answerLabel.classList.remove('accepted');
          answerLabel.classList.add('declined');
        } else {
          answerLabel.classList.remove('accepted');
          answerLabel.classList.remove('declined');
        }
        secondRow.style.display = '';
      } else {
        secondRow.style.display = 'none';
        answerLabel.innerHTML = '';
      }

      if (paramPlayer.connected) {
        container.div.classList.add('connected');
      } else {
        container.div.classList.remove('connected');
      }
    }
  };
  updateFromPlayer(paramPlayer);

  parent.appendChild(container.div);

  return {
    div: container.div,
    player: player,
    id: player.id,
    show: () => {
      container.show();
    },
    hide: () => {
      container.hide();
    },
    remove: () => {
      parent.removeChild(container.div);
    },
    updateFromState: (state) => {
      updateFromPlayer(state.players[player.id]);
    },
    setSocket: (currentSocket) => {
      socket = currentSocket;
    },
  };
}
export default AdminPlayerRow;
