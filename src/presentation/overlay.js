import consts from '../consts.mjs';
import PlayerList from './player-list';

function Overlay () {
  const div = document.createElement('div');
  div.classList.add('overlay');

  const progress = document.createElement('div');
  progress.classList.add('progress-bar');

  const updateFromState = (state) => {
    if (state.current && state.current.timeout) {
      progress.style.animationDuration = `${state.current.timeout}s`;
    } else {
      progress.style.animationDuration = `${consts.defaultTimeout}s`;
    }
    if (state.revealAnswers) {
      progress.style.animationDuration = '0s';
    }
    playerList.updateFromState(state);
  };

  const playerList = new PlayerList(true, div);

  div.appendChild(progress);

  document.body.appendChild(div);

  let visible = false;

  return {
    div,
    updateFromState,
    show: () => {
      playerList.show();
      if (visible) return;
      visible = true;
      div.classList.add('visible');
      setTimeout(() => {
        div.style.opacity = 1;
      });
    },
    hide: () => {
      playerList.hide();
      if (!visible) return;
      visible = false;
      div.style.opacity = 0;
      setTimeout(() => {
        div.classList.remove('visible');
      }, 200);
    },
  };
}

export default Overlay;
