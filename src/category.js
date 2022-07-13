import consts from './consts.mjs';
import questionData from './question-data.mjs';

const { rowWidth } = consts;

export default function Category (parent, x) {
  const div = document.createElement('div');
  div.classList.add('category');

  const span = document.createElement('span');
  span.innerHTML = questionData.categories[x].label;

  div.appendChild(span);

  const placeX = rowWidth * x;
  div.style.width = `${rowWidth}vw`;
  div.style.left = `${placeX}vw`;

  parent.appendChild(div);
}
