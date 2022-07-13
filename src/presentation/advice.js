import QRCode from 'qrcode';

import Showable from '../showable';
import PlayerList from './player-list';

function Advice () {
  const container = new Showable('advice-container');

  const adviceDiv = document.createElement('div');
  adviceDiv.classList.add('advice');

  const canvas = document.createElement('canvas');

  const updateCanvas = (host, callback) => {
    console.log(host);
    QRCode.toCanvas(canvas, host, function (error) {
      if (error) console.error(error);
      canvas.style.width = '';
      canvas.style.height = '';
      adviceDiv.appendChild(canvas);
      callback();
    });
  };

  const overlay = document.createElement('div');
  overlay.classList.add('overlay', 'visible');
  overlay.style.opacity = 1;

  const playerList = new PlayerList(false, overlay);

  container.div.appendChild(adviceDiv);
  container.div.appendChild(overlay);

  document.body.appendChild(container.div);

  let visible = false;
  return {
    div: adviceDiv.div,
    show: (state) => {
      if (visible) return;
      visible = true;
      updateCanvas(state.host, () => {
        playerList.show();
        container.show();
      });
    },
    hide: () => {
      if (!visible) return;
      visible = false;
      playerList.hide();
      container.hide();
    },
    updateFromState: (state) => {
      playerList.updateFromState(state);
    },
  };
}

export default Advice;
