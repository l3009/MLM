import newWASocket, { jidDecode } from "@whiskeysockets/baileys";

export async function Sockets (conn, options = {}) {
  Object.defineProperties(conn, {
    chats: {
      value: {
        ...(options.chats || {})
      },
      writable: true
    },
    decodeJid: {
      value(jid) {
        if (/:\d+@/gi.test(jid)) {
          const decode = jidDecode(jid) || {};
          return ((decode.user && decode.server && decode.user + "@" + decode.server) || jid).trim();
        } else {
          return jid.trim();
        };
      },
      enumerable: true
    },
  });
  return conn;
};