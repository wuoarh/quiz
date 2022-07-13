import { Server } from 'socket.io';
import consts from './consts.mjs';
import getScore from './get-score.mjs';
import logger from './logger.mjs';
import questionData from './question-data.mjs';

const io = new Server(3000, {
  allowEIO3: true,
  cors: {
    origin: '*',
  },
});

const { initialState, phases } = consts;

let state = {
  ...initialState,
};

const sockets = {};
const playerSockets = {};

io.on('connection', (socket) => {
  logger.debug('new socket', socket.id);

  sockets[socket.id] = socket;

  const logRoundInfos = () => {
    try {
      console.log();

      const category = questionData.categories[state.current.x - 1];
      const question = category.questions[state.current.y - 1];
      console.log('Phase:      ', state.phase);
      console.log('Question #: ', state.questionNumber);
      console.log('Category:   ', category.label);
      console.log('Question:   ', question.label);
      console.log('Answer:     ', question.answer);
      console.log('Score:      ', getScore(state.current.x, state.current.y, state));
      console.log();

      Object.entries(state.players).forEach(([id, player]) => {
        console.log(player.name, '\t', player.answer, '\t', player.lastPoints, '=>', player.points);
        state.players[id].lastPoints = player.points;
      });

      console.log();

      state.questionNumber++;
    } catch (e) {
      console.error(e);
    }
  };

  const sendInitialData = (player) => {
    playerSockets[player.id] = socket;
    socket.player = player;
    socket.emit('phase', state.phase);
    socket.emit('player', player);
    socket.emit('answer', player.answer);
    socket.emit('points', player.points);
    if (state.current) {
      socket.emit('current', state.current);
    }
    if (state.reveal) {
      socket.emit('reveal', state.reveal);
    }
    io.sockets.emit('state', state);
  };

  const setUpAdminSocket = () => {
    socket.on('delete', (data) => {
      logger.info('delete player', data);
      if (data && data.id) {
        delete state.players[data.id];
        io.sockets.emit('state', state);

        if (playerSockets.hasOwnProperty(data.id)) {
          playerSockets[data.id].emit('authenticate');
          delete playerSockets[data.id];
        }
      }
    });

    socket.on('present', (data) => {
      logger.debug('present', data);
      if (data) {
        io.sockets.emit('present', data);
      }
    });

    socket.on('state', (data) => {
      logger.debug('new state', data);
      if (data?.phase !== state.phase) {
        io.sockets.emit('phase', data?.phase);
      }
      state = {
        ...state,
        ...data,
      };
      io.sockets.emit('state', state);
    });

    socket.on('current', (data) => {
      logger.debug('current question', data);
      state = {
        ...state,
        current: data,
        reveal: undefined,
      };
      io.sockets.emit('state', state);
      io.sockets.emit('current', data);
    });

    socket.on('reveal', (data) => {
      logger.info('reveal question', data);

      if (data && data.x && data.y) {
        const category = questionData.categories[data.x - 1];
        const question = category.questions[data.y - 1];

        const score = getScore(data.x, data.y, state);

        const reveal = {
          category: category.label,
          question: question.label,
          score,
        };

        state = {
          ...state,
          reveal,
          revealTime: +new Date(),
        };

        io.sockets.emit('state', state);
        io.sockets.emit('reveal', reveal);

        questionTimeout = setTimeout(endQuestion, (question.timeout || consts.defaultTimeout) * 1000);
      } else {
        delete state.reveal;
        io.sockets.emit('state', state);
        io.sockets.emit('reveal');
      }
    });

    let questionTimeout;
    const endQuestion = () => {
      clearTimeout(questionTimeout);
      logger.info('end question');
      // delete state.reveal;
      // io.sockets.emit('state', state);
      io.sockets.emit('end');
    };

    socket.on('end', () => {
      if (!state.reveal) return;
      endQuestion();
    });

    socket.on('reveal-answers', () => {
      if (!state.reveal) return;
      endQuestion();
      io.sockets.emit('reveal-answers');
    });

    socket.on('accept', (data) => {
      logger.debug('accept', data);
      if (data && data.id) {
        const player = state.players[data.id];
        if (player && player.answer) {
          player.answer.accepted = true;
          player.points += state.reveal.score;
          logger.info(
            'increased',
            player.name,
            'by',
            state.reveal.score,
            'to',
            player.points,
          );
          io.sockets.emit('state', state);
          if (playerSockets.hasOwnProperty(data.id)) {
            playerSockets[data.id].emit('answer', player.answer);
            playerSockets[data.id].emit('points', player.points);
          }
        }
      }
    });

    socket.on('decline', (data) => {
      logger.debug('decline', data);
      if (data && data.id) {
        const player = state.players[data.id];
        if (player && player.answer) {
          if (player.answer.accepted) {
            player.points -= state.reveal.score;
            logger.info(
              'decreased',
              player.name,
              'by',
              state.reveal.score,
              'to',
              player.points,
            );
          }
          player.answer.accepted = false;
          io.sockets.emit('state', state);
          if (playerSockets.hasOwnProperty(data.id)) {
            playerSockets[data.id].emit('answer', player.answer);
            playerSockets[data.id].emit('points', player.points);
          }
        }
      }
    });

    socket.on('set-points', (data) => {
      logger.debug('set-points', data);
      if (data && data.id) {
        const player = state.players[data.id];
        if (player) {
          player.points = data.points || 0;
          logger.info(
            'set',
            player.name,
            'to',
            player.points,
          );
          io.sockets.emit('state', state);
          if (playerSockets.hasOwnProperty(data.id)) {
            playerSockets[data.id].emit('points', player.points);
          }
        }
      }
    });

    socket.on('delete-answer', (data) => {
      logger.info('delete answer', data);
      if (data && data.id) {
        const player = state.players[data.id];
        if (player && player.answer) {
          delete state.players[data.id].answer;
          io.sockets.emit('state', state);
          if (playerSockets.hasOwnProperty(data.id)) {
            playerSockets[data.id].emit('answer');
          }
        }
      }
    });

    socket.on('done', (data) => {
      logger.debug('question (un)done', data);

      if (data && data.x && data.y) {
        const round1Entry = state.round1.find((done) => done.x === data.x && done.y === data.y);
        const round2Entry = state.round2.find((done) => done.x === data.x && done.y === data.y);
        if (round1Entry) {
          state = {
            ...state,
            round1: state.round1.filter((done) => !(done.x === data.x && done.y === data.y)),
          };
        } else if (round2Entry) {
          state = {
            ...state,
            round2: state.round2.filter((done) => !(done.x === data.x && done.y === data.y)),
          };
        } else {
          logRoundInfos();

          if (state.phase === phases.round2) {
            state = {
              ...state,
              current: undefined,
              reveal: undefined,
              revealAnswers: false,
              round2: state.round2.concat(data),
            };
          } else {
            state = {
              ...state,
              current: undefined,
              reveal: undefined,
              revealAnswers: false,
              round1: state.round1.concat(data),
            };
          }

          Object.keys(state.players).forEach((id) => {
            delete state.players[id].answer;
          });
          endQuestion();
          io.sockets.emit('answer');
          io.sockets.emit('reveal');
          io.sockets.emit('current');
        }

        io.sockets.emit('state', state);
      }
    });
  };

  const setUpPlayerSocket = () => {
    socket.on('create', (data) => {
      logger.info('create player', data);
      if (data && data.name && data.id) {
        const player = {
          name: data.name,
          id: data.id,
          points: 0,
          lastPoints: 0,
          connected: true,
        };
        state.players[data.id] = player;
        sendInitialData(player);
        io.sockets.emit('state', state);
      } else {
        socket.emit('phase', state.phase);
        socket.emit('authenticate');
      }
    });

    socket.on('answer', (answer) => {
      if (!socket.player || !state.players.hasOwnProperty(socket.player.id)) {
        console.error(
          'answer from unknown player! ',
          answer,
          socket.id,
          socket.player,
        );
        return;
      }
      const answerTime = +new Date() - state.revealTime;
      logger.debug(socket.player.name, 'answered ', answer, ' in ', answerTime);
      state.players[socket.player.id].answer = {
        answer,
        answerTime,
      };
      io.sockets.emit('state', state);
      socket.emit('answer', state.players[socket.player.id].answer);
    });
  };

  socket.on('register', (data) => {
    logger.debug('register', data);
    if (data?.role === 'presentation') {
      socket.emit('state', state);
    } else if (data?.role === 'admin') {
      setUpAdminSocket();
      socket.emit('state', state);
    } else if (data?.role === 'player') {
      setUpPlayerSocket();
      const id = data?.id;
      if (Object.prototype.hasOwnProperty.call(state.players, id)) {
        const player = state.players[id];
        if (player) {
          player.connected = true;
          sendInitialData(player);
        } else {
          socket.emit('phase', state.phase);
          socket.emit('authenticate');
        }
      } else {
        socket.emit('phase', state.phase);
        socket.emit('authenticate');
      }
    }
  });

  socket.on('disconnect', () => {
    logger.debug(socket.player?.name, 'disconnected', socket.id);
    if (socket.player) {
      socket.player.connected = false;
      try {
        state.players[socket.player.id].connected = false;
      } catch (e) {
        console.error(e);
      }
      io.sockets.emit('state', state);
    }
    delete sockets[socket.id];
  });

  socket.emit('phase', state.phase);
});
