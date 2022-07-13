
import { io } from 'socket.io-client';

import Advice from './presentation/advice';
import Background from './presentation/background';
import GameField from './presentation/game-field';

import consts from './consts.mjs';
import Overlay from './presentation/overlay';

require('./presentation/presentation.scss');

const { initialState, socketPort, phases } = consts;

let state = { ...initialState };

const background = new Background();
const advice = new Advice();
const gameField = new GameField(background);
const overlay = new Overlay();

const adviceStates = [phases.gathering, phases.pause, phases.end];
const fieldStates = [phases.present, phases.round1, phases.round2];

function update () {
  background.hide();
  overlay.updateFromState(state);
  if (adviceStates.indexOf(state.phase) > -1) {
    advice.show(state);
    overlay.hide();
    gameField.hide();
    advice.updateFromState(state);
  } else {
    advice.hide();

    if (fieldStates.indexOf(state.phase) > -1) {
      gameField.show(state);
    } else {
      gameField.hide();
    }
    if (state.reveal) {
      overlay.show();
    } else {
      overlay.hide();
    }
  }
}

const socket = io(`${window.location.protocol}//${window.location.hostname}:${socketPort}`);
socket.on('connect', () => {
  socket.emit('register', { role: 'presentation' });
});

socket.on('state', (newState) => {
  console.log(newState);
  state = {
    ...newState,
  };
  update();
});
socket.on('reveal', (reveal) => {
  console.log(reveal);
  state = {
    ...state,
    reveal,
  };
  update();
});
socket.on('present', (x) => {
  console.log(x);
  gameField.present(x);
});

socket.on('disconnect', () => {
  console.log(socket.id);
});
