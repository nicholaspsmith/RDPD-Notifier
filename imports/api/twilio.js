import * as Twilio from 'twilio';

export function sendMessage(message, number) {
  const client = new Twilio.RestClient();
  client.sendMessage({
      to: number,
      from: '+14243638367',
      body: message
  });
}

