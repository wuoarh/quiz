import consts from '../consts.mjs';
import Showable from '../showable';

function Login () {
  let socket;

  const inputHolder = new Showable('input-holder');

  const loginForm = document.createElement('form');
  loginForm.classList.add('login-form');

  const input = document.createElement('input');
  input.placeholder = 'Name';

  const submit = document.createElement('input');
  submit.setAttribute('type', 'submit');
  submit.setAttribute('value', 'Login');

  loginForm.appendChild(input);
  loginForm.appendChild(submit);

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (socket) {
      submit.setAttribute('disabled', 'disabled');
      socket.emit('create', {
        name: input.value,
        id: socket.id,
      });
    }
  });

  const updateFromState = (state) => {
    if (state.id && state.name) {
      inputHolder.hide();
    } else if (state.phase === consts.phases.gathering) {
      submit.removeAttribute('disabled');
      inputHolder.show();
    } else {
      inputHolder.hide();
    }
  };

  inputHolder.div.appendChild(loginForm);

  document.body.appendChild(inputHolder.div);

  return {
    div: inputHolder.div,
    updateFromState,
    show: () => {
      submit.removeAttribute('disabled');
      inputHolder.show();
    },
    hide: () => {
      inputHolder.hide();
    },
    setSocket: (currentSocket) => {
      socket = currentSocket;
    },
  };
}
export default Login;
