import { io } from 'socket.io-client';

import Login from './user/login.js';
import UserOverlay from './user/user-overlay.js';

import consts from './consts.mjs';

require('./index.scss');

const { socketPort } = consts;

const login = new Login();
const overlay = new UserOverlay();

const urlParams = new URLSearchParams(window.location.search);

let id = urlParams.get('id') || localStorage.getItem('id');
let name = urlParams.get('name') || localStorage.getItem('name');

const { phases } = consts;

let state = { id, name, points: 0, phase: phases.initial };

const checkLogin = () => {
  if ((state.id && state.name) || overlayPhases.indexOf(state.phase) > -1) {
    overlay.show(state);
    login.hide();
  } else {
    overlay.hide();
    login.updateFromState(state);
  }
};

const clearState = () => {
  delete state.id;
  delete state.name;
  delete state.reveal;
  delete state.current;
  delete state.answer;
  state.points = 0;
};

const socket = io(`${window.location.protocol}//${window.location.hostname}:${socketPort}`);
socket.on('connect', () => {
  overlay.setSocket(socket);
  login.setSocket(socket);
  socket.emit('register', { role: 'player', id: id || socket.id });
});

socket.on('authenticate', () => {
  console.log('authenticate', state.phase);
  id = undefined;
  name = undefined;
  localStorage.clear();
  window.history.replaceState({}, '', `${location.origin}`);
  clearState();

  checkLogin();
});

socket.on('player', (player) => {
  console.log('player exists', player);
  id = player.id;
  name = player.name;
  localStorage.setItem('id', player.id);
  localStorage.setItem('name', player.name);
  const params = new URLSearchParams(location.search);
  params.set('id', id);
  params.set('name', name);
  window.history.replaceState({}, '', `${location.origin}?${params.toString()}`);

  state = {
    ...state,
    id,
    name,
    points: player.points,
  };

  login.hide();
  overlay.show(state);
});

const overlayPhases = [
  phases.present,
  phases.round1,
  phases.pause,
  phases.round2,
  phases.end,
];

socket.on('phase', (phase) => {
  state = {
    ...state,
    phase,
  };
  checkLogin();
});

socket.on('answer', (answer) => {
  console.log('answer', answer);
  state = {
    ...state,
    answer,
  };
  checkLogin();
});

socket.on('points', (points) => {
  console.log('points', points);
  state = {
    ...state,
    points,
  };
  checkLogin();
});

socket.on('unknown', () => {
  localStorage.clear();
  id = undefined;
  name = undefined;
  window.history.replaceState({}, '', `${location.origin}`);
  clearState();

  checkLogin();
});

socket.on('current', (data) => {
  if (data) {
    state = {
      ...state,
      current: data,
    };
  } else {
    delete state.current;
  }

  overlay.updateFromState(state);
});

socket.on('reveal', (data) => {
  if (data) {
    state = {
      ...state,
      reveal: data,
    };
  } else {
    delete state.reveal;
  }

  overlay.updateFromState(state);
});

socket.on('end', () => {
  delete state.reveal;
  overlay.updateFromState(state);
});

socket.on('disconnect', () => {
  console.log(socket.id);
  clearState();

  overlay.updateFromState(state);
});
