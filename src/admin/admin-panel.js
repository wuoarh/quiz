import Indicator from './indicator';

function AdminPanel () {
  let socket;
  const adminPanel = document.createElement('div');
  adminPanel.classList.add('admin-panel');

  const serverIndicator = new Indicator('Server', adminPanel);
  const playerIndicator = new Indicator('Players', adminPanel);
  const answeredIndicator = new Indicator('Answered', adminPanel);
  const handledIndicator = new Indicator('Handled', adminPanel);

  const updateFromState = (state) => {
    serverIndicator.update(!!socket);

    const playerEntries = state && state.players ? Object.entries(state.players) : [];
    const allPlayerCount = state && state.players ? playerEntries.length : 0;

    const allPlayersConnected = playerEntries.filter(([id, player]) => player.connected).length;
    playerIndicator.update(allPlayersConnected / allPlayerCount);
    playerIndicator.setTitle(`Player (${allPlayersConnected}/${allPlayerCount})`);

    const allPlayersAnswered = playerEntries.filter(([id, player]) => player.answer).length;
    answeredIndicator.update(allPlayersAnswered / allPlayerCount);
    answeredIndicator.setTitle(`Answered (${allPlayersAnswered}/${allPlayerCount})`);

    const allPlayersHandled = playerEntries.filter(([id, player]) => !player.answer || (player.answer.accepted === true || player.answer.accepted === false)).length;
    handledIndicator.update(allPlayersHandled / allPlayerCount);
    handledIndicator.setTitle(`Handled (${allPlayersHandled}/${allPlayerCount})`);
  };

  document.body.appendChild(adminPanel);

  return {
    div: adminPanel,
    updateFromState,
    setSocket: (currentSocket) => {
      socket = currentSocket;
      updateFromState();
    },
  };
}
export default AdminPanel;
