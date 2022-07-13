import consts from '../consts.mjs';
import getScore, { getScoreString } from '../get-score.mjs';

const { rowWidth, colHeight, phases } = consts;

const format = new Intl.NumberFormat('de-DE');

export default function Card (parent, x, y) {
  const div = document.createElement('div');

  const scoreSpan = document.createElement('span');
  scoreSpan.classList.add('score-label');

  const labelSpan = document.createElement('span');
  labelSpan.classList.add('question-label');

  const placeX = rowWidth * (x - 0.5);
  const placeY = 10 + colHeight * (y - 0.5);

  let timeout;

  const checkCurrent = (state) => {
    if (state.current && state.current.x === x && state.current.y === y) {
      clearTimeout(timeout);
      div.style.transform = '';
      div.style.zIndex = 10;
      const scale = 80 / (rowWidth * 0.8);
      if (state.reveal) {
        labelSpan.innerHTML = state.reveal.question;
      }
      div.style.transform = `translate3d(37.5vw, 50vh, 100px) rotate3d(1, 1, 1, 360deg) scale(${scale})`;
      div.style.width = `${Math.min(rowWidth * 0.8 - 5, rowWidth * 0.8)}vw`;
      div.classList.add('active');
      if (state.reveal) {
        // setTimeout(() => {
        div.classList.add('revealed');
        // }, 1000)
      }
    } else {
      div.style.transform = `translate3d(${placeX}vw, ${placeY}vh, 0)`;
      div.style.width = `${rowWidth * 0.8}vw`;
      div.classList.remove('revealed');
      div.classList.remove('active');
      labelSpan.innerHTML = '';
      timeout = setTimeout(() => {
        div.style.zIndex = 0;
      }, 1000);
    }
    if (
      state.round1.find((done) => done.x === x && done.y === y) ||
      state.round2.find((done) => done.x === x && done.y === y)
    ) {
      div.classList.add('done');
    } else {
      div.classList.remove('done');
    }
  };

  let score;
  const updateFromState = (state) => {
    score = getScore(x, y, state);
    scoreSpan.innerHTML = getScoreString(x, y, state);

    checkCurrent(state);
  };
  updateFromState({ phase: phases.round1, round1: [], round2: [] });

  div.classList.add('card');

  div.style.width = `${rowWidth * 0.8}vw`;
  div.style.minHeight = `${colHeight * 0.8}vh`;
  div.style.fontSize = `${colHeight * 0.4}vmin`;
  div.style.marginLeft = `-${rowWidth * 0.4}vw`;
  div.style.marginTop = `-${colHeight * 0.4}vh`;
  div.style.transform = `translate3d(${placeX}vw, ${placeY}vh, 0)`;

  div.appendChild(scoreSpan);
  div.appendChild(labelSpan);

  parent.appendChild(div);

  return {
    div,
    x,
    y,
    score,
    updateFromState,
  };
}
