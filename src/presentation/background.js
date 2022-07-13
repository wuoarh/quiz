function Background () {
  const div = document.createElement('div');
  div.classList.add('background');
  div.style.display = 'none';
  document.body.appendChild(div);

  let visible = false;
  return {
    div,
    show: () => {
      if (visible) return;
      visible = true;
      div.classList.add('visible');
    },
    hide: () => {
      if (!visible) return;
      visible = false;
      div.classList.remove('visible');
    },
  };
}

export default Background;
