import { writeFileSync } from 'fs';
import { Command } from '../lib/handler.js';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { colorize, Colors } from '../lib/colorize.js';
import { db } from '../lib/database.js';
import { func } from '../lib/function.js';
import { format, inspect } from 'util';
import moment from 'moment-timezone';
import { exec } from 'child_process';

export async function onMessageUpsert({ m, store }, conn, prefix) {
  if (!m.isOwner && m.key.remoteJid == 'status@broadcast' && db.config.self) {
    return;
  } else if (!m.isOwner && !m.key.remoteJid == 'status@broadcast' && db.config.self) {
    return;
  }

  if (m.isGroup && db.config.auto.read) {
    await conn.readMessages([m.key]);
  }

  if (!m.message) return;

  m.blockList =
    (await conn.fetchBlocklist().catch(() => undefined)) || [];
  m.isOwner = [
    conn.decodeJid(conn.user.id),
    ...db.config.authorNumber.map((number) => number),
  ]
    .map((v) => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net')
    .includes(m.sender);
  m.isMods =
    m.isOwner ||
    db.config.mods
      .map((v) => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net')
      .includes(m.sender);
  m.isPrems =
    m.isOwner ||
    db.config.prems
      .map((v) => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net')
      .includes(m.sender);
  m.groupMetadata = (m.isGroup
    ? await conn.groupMetadata(m.chat).catch(() => undefined)
    : {}) || {};
  m.participants = (m.isGroup ? m.groupMetadata.participants : []) || [];
  m.user =
    (m.isGroup
      ? m.participants.find(
          (u) => conn.decodeJid(u.id) === m.sender
        )
      : {}) || {};
  m.bot =
    (m.isGroup
      ? m.participants.find(
          (u) => conn.decodeJid(u.id) == conn.decodeJid(conn.user.id)
        )
      : {}) || {};
  m.isRAdmin = m.user?.admin == 'superadmin' || false;
  m.isAdmin = m.isRAdmin || m.user?.admin == 'admin' || false;
  m.isBotAdmin = m.bot?.admin || false;
  
  // Adding variations for different protocols
  m.protocol = {
    isWhatsApp: m.isGroup ? m.groupMetadata?.participants.some(p => p.jid === 's.whatsapp.net') : false,
    isTelegram: m.isGroup ? m.groupMetadata?.participants.some(p => p.jid === 'telegram.org') : false,
    // Add more protocols as needed
  };
  
  // Variation for extending entries
  m.extendEntry = (entry, extension) => {
    if (entry && typeof entry === 'object' && extension && typeof extension === 'object') {
      return { ...entry, ...extension };
    }
    return entry;
  }; 
  
  db.config.chat++;
  writeFileSync('./database/config.json', JSON.stringify(db.config, null, 2));

  if (!m.isGroup && m.isCmd) {
    console.log(
      `${colorize('\n[ PC ]', Colors.FgGreen)}\n` +
        `${colorize('[ Name ]:', Colors.FgMagenta)} ${m.pushName}\n` +
        `${colorize('[ CMD ]:', Colors.FgMagenta)} ${m.command}\n` +
        `${colorize('[ ==================== ]', Colors.FgGreen)}`
    );
  } else if (m.isGroup && m.isCmd) {
    console.log(
      `${colorize('\n[ GC ]', Colors.FgGreen)}\n` +
        `${colorize('[ Name ]:', Colors.FgMagenta)} ${m.pushName}\n` +
        `${colorize('[ CMD ]:', Colors.FgMagenta)} ${m.command}\n` +
        `${colorize('[ ==================== ]', Colors.FgGreen)}`
    );
  } else if (!m.isGroup && !m.isCmd) {
    console.log(
      `${colorize('\n[ PC ]', Colors.FgGreen)}\n` +
        `${colorize('[ Name ]:', Colors.FgMagenta)} ${m.pushName}\n` +
        `${colorize('[ MSG ]:', Colors.FgMagenta)} ${m.body}\n` +
        `${colorize('[ ==================== ]', Colors.FgGreen)}`
    );
  } else if (m.isGroup && !m.isCmd) {
    console.log(
      `${colorize('\n[ GC ]', Colors.FgGreen)}\n` +
        `${colorize('[ Name ]:', Colors.FgMagenta)} ${m.pushName}\n` +
        `${colorize('[ MSG ]:', Colors.FgMagenta)} ${m.body}\n` +
        `${colorize('[ ==================== ]', Colors.FgGreen)}`
    );
  }

  if (m.sender) {
    if (db.user[m.sender] === undefined) {
      db.user[m.sender] = {
        daftar: false,
        mcder: {
          products: [],
        },
        balance: 0,
        costumers: [],
        banks: {
          BRI: {
            name: 'Bank Rakyat Indonesia',
            accountNumber: 'Your_BRI_Account_Number',
            accountHolder: 'Your_Name'
          },
          BCA: {
            name: 'Bank Central Asia',
            accountNumber: 'Your_BCA_Account_Number',
            accountHolder: 'Your_Name'
          },
          DANA: {
            name: 'DANA',
            accountNumber: 'Your_DANA_Account_Number',
            accountHolder: 'Your_Name'
          },
          OVO: {
            name: 'OVO',
            accountNumber: 'Your_OVO_Account_Number',
            accountHolder: 'Your_Name'
          },
          GOPAY: {
            name: 'GOPAY',
            accountNumber: 'Your_GOPAY_Account_Number',
            accountHolder: 'Your_Name'
          }
        }
      };
      if (db.config.auto.post) {
        return conn.sendMessage(m.sender, {
          text: `Halo kak ${m.pushName}, Yuk gabung dengan kami di *${db.config.storeName}*, Disini kamu bisa menghasilkan uang lebih cepat dan penjualan kamu juga bakal lebih laris nantinya, Yuk daftar sekarang!\n\nUntuk melakukan pendaftaran kamu cukup melakukan registrasi dengan cara ketik *${prefix}reg nama toko*\n\nContoh : ${prefix}reg ${db.config.storeName}`,
        });
      }
    }
    writeFileSync('./database/user.json', JSON.stringify(db.user, null, 2));
  } else if (m.isGroup) {
    if (db.group[m.chat] === undefined) {
      db.group[m.chat] = {
        antilink: {
          group: false,
          youtube: false,
          instagram: false,
          telegram: false,
          facebook: false,
          twitter: false,
          threads: false,
          snackvideo: false,
        },
        badword: {
          status: false,
          database: [],
        },
        mute: false,
      };
    }
    writeFileSync('./database/group.json', JSON.stringify(db.group, null, 2));
  }
  
  if (m.body.startsWith('>')) {
    if (!m.isOwner) return;
    if (!m.query)
      return m.reply(
        'just JavaScript code (empty eval - use eval within the scope of Nodejs with ESMODULE type)'
      );

    let evaluate;
    try {
      evaluate = await eval(`(async () => { ${m.query} })()`);
      if (typeof evaluate !== 'string') evaluate = await inspect(evaluate);
    } catch (err) {
      evaluate = err.stack.toString();
    }

    await m.reply(await format(evaluate))
  } else if (m.body.startsWith('=>')) {
    if (!m.isOwner) return;
    if (!m.query)
      return m.reply(
        'just JavaScript code (empty eval - use eval within the scope of Nodejs with ESMODULE type)'
      );

    let evaluate;
    try {
      evaluate = await eval(`${m.query}`);
      if (typeof evaluate !== 'string') evaluate = await inspect(evaluate);
    } catch (err) {
      evaluate = err.stack.toString();
    }

    await m.reply(await format(evaluate))
  } else if (m.body.startsWith('$')) {
    if (!m.isOwner) return;
    if (!m.query)
      return m.reply('Only exec code (reads terminal code, e.g., process)');

    exec(m.query, async (err, stdout) => {
      if (err) return m.reply(`${err}`);
      if (stdout) {
        return m.reply(`${stdout}`);
      }
    });
  }

  Command.initCommandsPath(join(dirname(fileURLToPath(import.meta.url)), '../plugins'));
  
  if (m.isCmd && m.command.length > 0) {
    if (
      conn.groupMetadata(db.config.storeGID).then((v) =>
        v.participants.map((v) => v.id).includes(m.sender)
      )
    ) {
      const exists = Command.run(m.command, { conn, m, db, func });
      
      if (!exists) {
        // Add a startsWithInsensitive prototype method to String
        String.prototype.startsWithInsensitive = function(prefix) {
          return this.toLowerCase().startsWith(prefix.toLowerCase());
        };
        // Usage
        if (m.body.startsWithInsensitive('=>') || m.body.startsWithInsensitive('$')) return;
        else m.reply(`Maaf, Perintah ${m.command} tidak ditemukan.`);
      }
    } else {
      return m.reply(
        `Maaf, Kamu tidak dapat menggunakan layanan *${db.config.storeName}*, Silahkan bergabung dalam grup terlebih dahulu!\n\nAgar bisa mengakses *${db.config.storeName}* dan mendapatkan dukungan serta informasi pembaruan.\n\n${db.config.storeGLink}`
      );
    }
  }
}