import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: 'reverb',
  key: 'ewiurewds8df8',

  wsHost: '172.17.118.82',
  wsPort: 8080,
  forceTLS: false,
  enabledTransports: ['ws', 'wss'],
});

export default echo;
