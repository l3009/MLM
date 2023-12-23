import { Command } from '../../lib/handler.js';

Command.create({
  name: 'panel',
  category: 'paket',
  run: async ({ m, db, conn }) => {
    if (!db.users[m.sender]) {
      // Create user in the database if not exists
      db.users[m.sender] = {
        balance: 0,
        customers: [],
      };
    }
    if (!db.user[m.sender].daftar) {
      m.reply(`Maaf, Kamu belum daftar!`)
    }
    
    if (m.args[0] === '-rekrut') {
      const recruitedNumber = m.args[1];

      if (isNumeric(recruitedNumber)) {
        // Convert the number to the proper format
        const formattedNumber = formatWhatsAppNumber(recruitedNumber);

        // Add recruited user to the database
        if (!db.users[formattedNumber]) {
          db.users[formattedNumber] = {
            balance: 5000,
            customers: [],
          };

          m.reply(`Pengguna dengan nomor ${formattedNumber} berhasil direkrut. Saldo pengguna baru: 5000`);
        } else {
          m.reply(`Pengguna dengan nomor ${formattedNumber} sudah direkrut sebelumnya.`);
        }
      } else {
        m.reply('Kesalahan penggunaan: Nomor harus berupa angka.');
      }
    } else if (m.args[0] === '-register') {
      if (db.users[m.sender].daftar) {
        m.reply('Anda sudah terdaftar sebelumnya.');
      } else {
        // Register the user
        db.users[m.sender].daftar = true;

        // Inform the user about the registration fee and payment instructions
        m.reply('Anda berhasil terdaftar! Silakan lakukan pembayaran Rp30.000 untuk menyelesaikan pendaftaran.');
        
        // Send payment instructions to the authorized number for confirmation
        conn.sendMessage(db.config.authorNumber[0] + "@s.whatsapp.net", {
          text: `Pendaftaran baru dari ${m.sender}. Silakan tunggu konfirmasi pembayaran.`
        });
      }
    } else if (m.args[0] === '-konfirmasi') {
      // Assume m.args[1] contains the payment confirmation
      const confirmationMessage = m.args[1];

      if (confirmationMessage === 'terima') {
        // Confirm payment and update user's balance
        db.users[m.sender].balance += 30000;

        // Inform the user that payment is accepted
        conn.sendMessage(m.sender + "@s.whatsapp.net", {
          text: 'Pembayaran Anda telah diterima. Saldo sekarang: ' + db.users[m.sender].balance
        });
      } else {
        // Inform the user that payment is not accepted
        conn.sendMessage(m.sender + "@s.whatsapp.net", {
          text: 'Pembayaran Anda ditolak. Silakan coba lagi.'
        });
      }
    } else if (m.args[0] === '-profil') {
      // Display user profile information
      const userProfile = db.users[m.sender];
      const profileMessage = `Profil Pengguna:\n\n` +
        `Saldo: ${userProfile.balance}\n` +
        `Daftar Pelanggan: ${userProfile.customers.join(', ')}`;

      m.reply(profileMessage);
    } else {
      // Display usage instructions for the -menu command
      const usageGuide = 'Panduan Penggunaan Panel:\n\n' +
        '-rekrut [nomor] : Rekrut pengguna dengan nomor tertentu.\n' +
        '-register : Daftarkan diri dengan membayar Rp30.000.\n' +
        '-konfirmasi [terima/tolak] : Konfirmasi pembayaran registrasi.\n\n' +
        'Contoh Penggunaan:\n' +
        '-rekrut 081234567890\n' +
        '-register\n' +
        '-konfirmasi terima';
        '-profil';

      m.reply(usageGuide);
    }
  },
});

// Helper function to check if a value is numeric
function isNumeric(value) {
  return /^\d+$/.test(value);
}

// Helper function to format WhatsApp number
function formatWhatsAppNumber(number) {
  // Assuming the input number is in the format "6281361057300"
  const formattedNumber = number.replace(/^62/, '@s.whatsapp.net');
  return formattedNumber;
}