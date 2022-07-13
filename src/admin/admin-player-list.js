import AdminPlayerRow from './admin-player-row';

function AdminPlayerList () {
  const container = document.createElement('div');
  container.classList.add('player-list');
  let socket;

  const playerRows = {};

  const updateFromState = (state) => {
    Object.entries(playerRows).forEach(([id, playerRow]) => {
      if (!state.players.hasOwnProperty(id)) {
        playerRow.remove();
        delete playerRows[id];
      }
    });
    Object.entries(state.players).forEach(([key, player]) => {
      if (!playerRows.hasOwnProperty(player.id)) {
        const playerRow = new AdminPlayerRow(container, player);
        playerRows[player.id] = playerRow;
        playerRow.setSocket(socket);
        playerRow.show();
      } else {
        playerRows[player.id].updateFromState(state);
      }
    });
  };

  document.body.appendChild(container);

  return {
    div: container,
    show: () => {
      container.show();
    },
    hide: () => {
      container.hide();
    },
    updateFromState,
    setSocket: (currentSocket) => {
      socket = currentSocket;
      Object.entries(playerRows).forEach(([id, playerRow]) => {
        playerRow.setSocket(currentSocket);
      });
    },
  };
}
export default AdminPlayerList;
