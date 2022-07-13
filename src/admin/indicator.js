function Indicator(title, parent) {
  const div = document.createElement('div');
  div.classList.add('indicator');

  const circle = document.createElement('div');
  circle.classList.add('circle');

  const titleSpan = document.createElement('span');
  titleSpan.classList.add('title');
  titleSpan.innerHTML = title;

  div.appendChild(circle);
  div.appendChild(titleSpan);

  parent.appendChild(div);

  return {
    div,
    update: (enable) => {
      let value;

      if (enable === true) value = 1;
      else if (enable === false) value = 0;
      else if (isNaN(enable)) value = 0;
      else value = enable;

      const degree = 360 * value;
      const left = 360 - degree;

      circle.style.backgroundImage = `conic-gradient(#0c0 ${degree}deg, #0000 ${degree}deg ${left}deg)`;
    },
    setTitle: (title) => {
      titleSpan.innerHTML = title;
    },
  };
}
export default Indicator;
