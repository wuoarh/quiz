import consts from '../consts.mjs';
import Showable from '../showable';

const format = new Intl.NumberFormat('de-DE');

function UserOverlay () {
  let socket;

  const userOverlay = new Showable('user-overlay');

  const nameSpan = document.createElement('span');
  nameSpan.classList.add('player-name', 'label');

  const pointsSpan = document.createElement('span');
  pointsSpan.classList.add('player-points', 'label');

  const labelContainer = new Showable('label-container');

  const scoreSpan = document.createElement('span');
  scoreSpan.classList.add('question-score', 'label');

  const categorySpan = document.createElement('span');
  categorySpan.classList.add('question-category', 'label');

  const revealContainer = new Showable('reveal-container');

  const progress = document.createElement('div');
  progress.classList.add('progress');

  const questionField = document.createElement('div');
  questionField.classList.add('question-label');

  const questionForm = new Showable('question-form', 'form');

  const questionInput = document.createElement('input');
  questionInput.classList.add('question-input');

  const submit = document.createElement('input');
  submit.setAttribute('type', 'submit');
  submit.setAttribute('value', 'Absenden');
  submit.classList.add('question-submit');

  questionForm.div.appendChild(questionInput);
  questionForm.div.appendChild(submit);

  questionForm.div.addEventListener('submit', (e) => {
    e.preventDefault();
    if (socket) {
      submit.setAttribute('disabled', 'disabled');
      socket.emit('answer', questionInput.value);
      questionForm.hide();
    }
  });

  const updateFromState = (state) => {
    nameSpan.innerHTML = state.name;
    pointsSpan.innerHTML = format.format(state.points);

    submit.setAttribute('disabled', 'disabled');
    questionInput.value = '';

    if (state.current) {
      if (state.current && state.current.timeout) {
        progress.style.animationDuration = `${state.current.timeout}s`;
      } else {
        progress.style.animationDuration = `${consts.defaultTimeout}s`;
      }
      categorySpan.innerHTML = state.current.category;
      scoreSpan.innerHTML = format.format(state.current.score);
      labelContainer.show();
    } else {
      progress.style.animationDuration = `${consts.defaultTimeout}s`;
      labelContainer.hide();
      revealContainer.hide();
    }
    if (state.answer) {
      progress.style.animationDuration = '0s';
    }

    if (!state.answer && state.reveal) {
      submit.removeAttribute('disabled');
      categorySpan.innerHTML = state.reveal.category;
      questionField.innerHTML = state.reveal.question;
      scoreSpan.innerHTML = format.format(state.reveal.score);
      if (revealContainer.show()) {
        questionInput.value = '';
        questionForm.show();
      }
    } else {
      revealContainer.hide();
    }

    if (state.answer) {
      if (state.answer.accepted === true) {
        labelContainer.div.classList.add('accepted');
        labelContainer.div.classList.remove('declined');
      } else if (state.answer.accepted === false) {
        labelContainer.div.classList.remove('accepted');
        labelContainer.div.classList.add('declined');
      } else {
        labelContainer.div.classList.remove('accepted');
        labelContainer.div.classList.remove('declined');
      }
    } else {
      labelContainer.div.classList.remove('accepted');
      labelContainer.div.classList.remove('declined');
    }
  };

  labelContainer.div.appendChild(categorySpan);
  labelContainer.div.appendChild(scoreSpan);

  userOverlay.div.appendChild(labelContainer.div);

  revealContainer.div.appendChild(questionField);
  revealContainer.div.appendChild(questionForm.div);
  revealContainer.div.appendChild(progress);

  userOverlay.div.appendChild(revealContainer.div);

  userOverlay.div.appendChild(pointsSpan);
  userOverlay.div.appendChild(nameSpan);

  document.body.appendChild(userOverlay.div);

  return {
    div: userOverlay.div,
    updateFromState,
    show: (state) => {
      updateFromState(state);
      userOverlay.show();
    },
    hide: () => {
      userOverlay.hide();
      labelContainer.hide();
      revealContainer.hide();
    },
    setSocket: (currentSocket) => {
      socket = currentSocket;
    },
  };
}
export default UserOverlay;
