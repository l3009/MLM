import spin from 'spinnies';
import textAnimation from '@kazesolo/text-animation';
import fs from 'fs';
import chalk from 'chalk';
import { delay } from '@whiskeysockets/baileys';
import { db } from "../lib/database.js";

export function connectionUpdate (update, start) {
  var spinner = { 
    "interval": 120,
    "frames": [
      "Waiting for a message.",
      "Waiting for a message..",
      "Waiting for a message...",
      "Waiting for a message.." 
    ]
  };
  let globalSpinner;
  var getGlobalSpinner = (disableSpins = false) => {
    if(!globalSpinner) globalSpinner = new spin({ color: 'blue', succeedColor: 'green', spinner, disableSpins });
    return globalSpinner;
  };
  let spins = getGlobalSpinner(false)
  if(update.connection === 'close') {
    textAnimation.rainbow(`Connection info : Reconnecting . . .`);
    start();
  } else if(update.connection === 'open') {
    setInterval(() => {
      spins.add(`1`, { text: `${chalk.bold.white(`\nIncoming message: ${db.config?.chat}`)}` });
    }, 120)
    textAnimation.rainbow(`Connection info: Connect . . .`);
  };
};