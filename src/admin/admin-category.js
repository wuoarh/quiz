import consts from '../consts.mjs';
import data from '../question-data.mjs';

const { rowWidth } = consts;

export default function AdminCategory (parent, x) {
  const div = document.createElement('div');
  div.classList.add('category');

  const span = document.createElement('span');
  span.innerHTML = data.categories[x].label;

  div.appendChild(span);

  const placeX = rowWidth * x * 0.5;
  div.style.width = `${rowWidth * 0.5}vw`;
  div.style.left = `${placeX}vw`;

  parent.appendChild(div);

  return {
    div,
  };
}
