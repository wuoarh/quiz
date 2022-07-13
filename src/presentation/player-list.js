import consts from '../consts.mjs';
import Showable from '../showable';
import PlayerRow from './player-row';

function PlayerList (voting, parent) {
  const container = new Showable('player-list');

  const playerProgress = new Showable('player-progress');

  container.div.appendChild(playerProgress.div);

  if (voting) {
    container.div.classList.add('voting');
  }

  const playerRows = {};

  const updateFromState = (state) => {
    Object.entries(playerRows).forEach(([id, playerRow]) => {
      if (!state.players.hasOwnProperty(id)) {
        playerRow.remove();
        delete playerRows[id];
      } else if (!state.players[id].answer && voting) {
        playerRow.remove();
        delete playerRows[id];
      }
    });
    Object.entries(state.players).forEach(([key, player]) => {
      if (!playerRows.hasOwnProperty(player.id)) {
        if (!voting || state.players[player.id].answer) {
          const playerRow = new PlayerRow(container.div, player);
          playerRows[player.id] = playerRow;
          playerRow.updateFromState(state);
          playerRow.show();
        }
      } else {
        playerRows[player.id].updateFromState(state);
      }
    });
    if (
      state.phase === consts.phases.round1 ||
      state.phase === consts.phases.round2
    ) {
      playerProgress.show();
      const allPlayerCount = Object.entries(state.players).length;
      const answeredPlayerCount = Object.entries(playerRows).length;
      playerProgress.div.style.transform = `scaleX(${
        answeredPlayerCount / allPlayerCount
      })`;
      if (state.revealAnswers) {
        container.div.classList.add('reveal-answers');
      } else {
        container.div.classList.remove('reveal-answers');
      }
    } else {
      container.div.classList.remove('reveal-answers');
      playerProgress.hide();
    }
  };

  parent.appendChild(container.div);

  return {
    div: container.div,
    show: () => {
      container.show();
    },
    hide: () => {
      container.hide();
    },
    updateFromState,
  };
}
export default PlayerList;
