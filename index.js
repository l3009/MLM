import { createServer } from 'http';
import { spawn } from 'child_process'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { watchFile, unwatchFile } from 'fs'

console.log('Starting . . .')
createServer(function (req, res) {
  console.log(`Just got a request at ${req.url}!`)
  res.write('Yo!');
  res.end();
}).listen(8080);

function start() {
  let args = [join(fileURLToPath(import.meta.url), "main.js"), ...process.argv.slice(2)]
  let p = spawn(process.argv[0], args, { stdio: ['inherit', 'inherit', 'inherit', 'ipc'] })
  .on('message', data => {
    if (data == 'reset') {
      console.log('Restarting . . .')
      p.kill()
      start()
    }
  })
  .on("exit", (_, code) => {
    if (code !== 0) start()
    watchFile(args[0], () => {
      unwatchFile(args[0])
      start()
    })
  })
}

start()