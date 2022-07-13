import { io } from 'socket.io-client';

import consts from './consts.mjs';

import AdminGameField from './admin/admin-game-field';
import PhaseInfo from './admin/phase-info';
import AdminPlayerList from './admin/admin-player-list.js';
import AdminPanel from './admin/admin-panel.js';

require('./admin.scss');

const { initialState, socketPort } = consts;

let state = { ...initialState };

const phaseInfo = new PhaseInfo();
const gameField = new AdminGameField();
const playerList = new AdminPlayerList();
const panel = new AdminPanel();

function update () {
  phaseInfo.updateFromState(state);
  gameField.updateFromState(state);
  playerList.updateFromState(state);
  panel.updateFromState(state);
}

const socket = io(`${window.location.protocol}//${window.location.hostname}:${socketPort}`);
socket.on('connect', () => {
  phaseInfo.setSocket(socket);
  gameField.setSocket(socket);
  playerList.setSocket(socket);
  panel.setSocket(socket);

  socket.emit('register', { role: 'admin' });
});

socket.on('state', (newState) => {
  console.log(newState);
  state = {
    ...newState,
  };
  update();
});

socket.on('disconnect', () => {
  console.log(socket.id);
  panel.setSocket();
});
