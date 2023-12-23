import { Command } from '../../lib/handler.js';

Command.create({
  name: 'menu',
  category: 'Owner',
  run: async ({ m, db, conn }) => {
    return m.reply(Command.indexMenu(m.prefix, ""))
  },
});