import questionData from './question-data.mjs';

const cardsX = questionData.categoryCount;
const cardsY = questionData.questionCount;

const rowWidth = 100 / cardsX;
const colHeight = 90 / cardsY;

const defaultTimeout = 45;
const socketPort = 3000;

const phases = {
  initial: 'initial',
  gathering: 'gathering',
  present: 'present',
  round1: 'round1',
  pause: 'pause',
  round2: 'round2',
  end: 'end',
};

const initialState = {
  current: undefined,
  phase: phases.initial,
  revealAnswers: false,
  questionNumber: 1,

  round1: [],
  round2: [],

  players: {},
  host: 'http://192.168.179.237:8081/',
};

export default {
  cardsX,
  cardsY,
  rowWidth,
  colHeight,
  defaultTimeout,
  initialState,
  socketPort,
  phases,
};
