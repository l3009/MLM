import { readdirSync } from 'fs';
import { join } from 'path';

class CommandManager {
  commands = new Map();

  create({ name, category, run }) {
    this.commands.set(name, { name, category, run });
  }

  run(name, options) {
    const command = this.commands.get(name);

    if (command) {
      if (command.run) {
        command.run(options);
      }
      return true;
    } else {
      return false;
    }
  }

  initCommandsPath(commandsPath) {
    const path = commandsPath;
    const commandsFolder = readdirSync(path);

    commandsFolder.forEach(file => {
      const filePath = join(path, file);
      const isDirectory = !file.includes('.');

      if (isDirectory) {
        const subcommandsFolder = readdirSync(filePath);

        subcommandsFolder.forEach(filee => {
          if (filee.endsWith('.js')) {
            const subcommandPath = join(filePath, filee);
            import(subcommandPath);
          }
        });
      } else if (file.endsWith('.js')) {
        import(filePath);
      }
    });
  }

  indexMenu(prefix, text) {
    const groups = {};

    for (let item of Array.from(this.commands.values())) {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item.name);
    }

    for (let item of Array.from(this.functions.values())) {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item.name);
    }

    for (const group in groups) {
      text += `\n╓─── *${group}* (${groups[group].length})\n`;
      text += `║\n`;

      for (let member of groups[group]) {
        text += `║ - ${prefix + member}\n`;
      }

      text += `║\n`;
      text += `╙────────────`;
    }

    return text;
  }
}

export const Command = new CommandManager();