import Ably from "ably";

const ablyAPI = new Ably.Realtime({
  key: "zA9pYA.wj0yaQ:9RlIUknm_rfW2k9EpmetVNrFJHt0yUOZ0I4IZpw1wEs",
});
let channel;

const connectAbly = () => {
  ablyAPI.connection.once("connected", () => {
   
  });
  channel = ablyAPI.channels.get("public:sensor-channel");
};

const subscribeToChannel = (callback) => {
  if (!channel) connectAbly();
  channel.subscribe("event_name", (message) => {
    const incomingData = message.data?.comment;
    callback(incomingData);
  });
};
// UPS EVENT
const subscribeToUpsEvent = (callback) => {
  if (!channel) connectAbly();

  channel.subscribe("ups_event", (message) => {
    const incomingUpsData = message.data;

    callback(incomingUpsData);
  });
};

const unsubscribeFromChannel = () => {
  if (channel) {
    channel.unsubscribe("event_name");
    channel.unsubscribe("ups_event");
  }
};

export default {
  connectAbly,
  subscribeToChannel,
  subscribeToUpsEvent,
  unsubscribeFromChannel,
};
