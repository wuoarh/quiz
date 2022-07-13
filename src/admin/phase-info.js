import consts from '../consts.mjs';

function PhaseInfo () {
  let socket;

  const div = document.createElement('div');
  div.classList.add('panel', 'flex', 'col');

  const select = document.createElement('select');
  Object.keys(consts.phases).forEach((phase) => {
    const option = document.createElement('option');
    option.text = phase;
    option.value = phase;
    select.appendChild(option);
  });

  select.addEventListener('change', () => {
    if (socket) {
      socket.emit('state', { phase: select.value });
    }
  });

  div.appendChild(select);

  document.body.appendChild(div);

  return {
    updateFromState: (state) => {
      select.value = state.phase;
    },
    setSocket: (currentSocket) => {
      socket = currentSocket;
    },
  };
}

export default PhaseInfo;
