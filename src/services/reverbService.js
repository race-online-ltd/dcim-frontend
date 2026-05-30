import echo from './echo';

function connectReverb() {
  window.sensorChannel = echo.channel('sensor-channel');
  window.upsChannel = echo.channel('sensor-channel');
}

function subscribeToChannel(callback) {
  if (!window.sensorChannel) connectReverb();

  window.sensorChannel.listen('.event_name', (data) => {
    callback(data.comment);
  });
}

function subscribeToUpsEvent(callback) {
  if (!window.upsChannel) connectReverb();

  window.upsChannel.listen('.ups_event', (data) => {
    callback(data);
  });
}

function unsubscribeFromChannel() {
  if (window.sensorChannel) {
    window.sensorChannel.stopListening('.event_name');
  }

  if (window.upsChannel) {
    window.upsChannel.stopListening('.ups_event');
  }

  echo.leaveChannel('sensor-channel');
}

export default {
  connectReverb,
  subscribeToChannel,
  subscribeToUpsEvent,
  unsubscribeFromChannel,
};
