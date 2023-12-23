import fs from 'fs';
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const dirr = join(dirname(fileURLToPath(import.meta.url)), "../database");
const file = {
  config: join(dirr, "config.json"),
  user: join(dirr, "user.json"), 
}

try {
  fs.accessSync(file.config);
} catch (err) {
  if(String(err).includes("no such file or directory")) {
    fs.writeFileSync('./database/config.json', JSON.stringify({}, null, 2));
  }
}

try {
  fs.accessSync(file.user);
} catch (err) {
  if(String(err).includes("no such file or directory")) {
    fs.writeFileSync('./database/user.json', JSON.stringify({}, null, 2));
  }
} 

export let db = {
  config: JSON.parse(fs.readFileSync('./database/config.json')),
  user: JSON.parse(fs.readFileSync('./database/user.json'))
};