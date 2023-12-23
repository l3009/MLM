import { Command } from '../../lib/handler.js';

Comment.create({
  name: 'setbank',
  category: 'Owner',
  run: ({ m, db }) => {
    if (m.isOwner) {  // Check if the user is the owner
      if (m.args[0] && m.args[1] && m.args[2] && m.args[3]) {
        const bankName = m.args[0].toUpperCase();
        const accountNumber = m.args[1];
        const accountHolder = m.args[2];

        // Check if the bank already exists
        if (db.config.banks[bankName]) {
          m.reply(`Bank ${bankName} sudah terdaftar. Gunakan perintah lain untuk mengubah informasi.`);
        } else {
          // Add the new bank information to the config
          db.config.banks[bankName] = {
            name: bankName,
            accountNumber,
            accountHolder,
          };

          m.reply(`Bank ${bankName} berhasil ditambahkan.`);
        }
      } else {
        // Provide a helpful guide for the correct command usage
        const usageGuide = 'Argumen tidak lengkap. Gunakan format: `nama_bank nomor_rekening pemilik_rekening`';
        m.reply(`Kesalahan penggunaan:\n\n${usageGuide}`);
      }
    } else {
      m.reply('Anda tidak memiliki izin untuk menggunakan perintah ini.');
    }
  },
});
