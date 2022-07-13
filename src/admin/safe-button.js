function SafeButton (title, parent, callback) {
  let coolingDown = false;

  const button = document.createElement('button');
  button.innerHTML = title;

  button.addEventListener('click', () => {
    if (coolingDown) return;
    coolingDown = true;
    button.classList.add('disabled');

    callback();

    setTimeout(() => {
      coolingDown = false;
      button.classList.remove('disabled');
    }, 500);
  });

  parent.appendChild(button);

  return {
    div: button,
  };
}

export default SafeButton;
