import consts from '../consts.mjs';
import Showable from '../showable';

const format = new Intl.NumberFormat('de-DE');

const { phases } = consts;

function PlayerRow (parent, paramPlayer) {
  let showRanking = false;
  let showPoints = false;
  let showTime = false;

  const container = new Showable('player-row');

  const topRow = document.createElement('div');
  topRow.classList.add('player-row-row');

  const nameSpan = document.createElement('span');
  nameSpan.classList.add('player-name');

  const pointsSpan = document.createElement('span');
  pointsSpan.classList.add('player-points');

  const secondRow = document.createElement('div');
  secondRow.classList.add('player-row-row');

  const answerLabel = document.createElement('div');
  answerLabel.classList.add('answer-label');

  const timeSpan = document.createElement('span');
  timeSpan.classList.add('player-time');

  topRow.appendChild(nameSpan);
  topRow.appendChild(pointsSpan);
  topRow.appendChild(timeSpan);

  secondRow.appendChild(answerLabel);

  container.div.appendChild(topRow);
  container.div.appendChild(secondRow);

  let player = paramPlayer;

  const updateFromPlayer = (paramPlayer) => {
    if (paramPlayer) {
      console.log(paramPlayer, showTime);
      player = paramPlayer;
      nameSpan.innerHTML = paramPlayer.name;
      if (showPoints) {
        pointsSpan.innerHTML = format.format(paramPlayer.points);
        pointsSpan.style.display = '';
      } else {
        pointsSpan.style.display = 'none';
      }

      if (showTime && paramPlayer.answer) {
        answerLabel.innerHTML = paramPlayer.answer.answer;
        const seconds = paramPlayer.answer.answerTime / 1000;
        timeSpan.innerHTML = format.format(seconds) + 's';
        timeSpan.style.display = '';
        if (paramPlayer.answer.accepted === true) {
          container.div.classList.add('accepted');
          container.div.classList.remove('declined');
        } else if (paramPlayer.answer.accepted === false) {
          container.div.classList.remove('accepted');
          container.div.classList.add('declined');
        } else {
          container.div.classList.remove('accepted');
          container.div.classList.remove('declined');
        }
      } else {
        container.div.classList.remove('accepted');
        container.div.classList.remove('declined');
        timeSpan.style.display = 'none';
      }

      if (paramPlayer.connected) {
        container.div.classList.add('connected');
      } else {
        container.div.classList.remove('connected');
      }
    }
    if (showRanking) {
      container.div.classList.add('ranked');
    } else {
      container.div.classList.remove('ranked');
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
      showRanking = state.phase === phases.pause || state.phase === phases.end;
      showTime = state.phase === phases.round1 || state.phase === phases.round2;
      showPoints = showRanking || showTime;
      updateFromPlayer(state.players[player.id]);
    },
  };
}
export default PlayerRow;
