import { Command } from '../../lib/handler.js';

Command.create({
  name: 'bayar',
  category: 'paket',
  run: async ({ m, db, conn }) => {
    const text = 'Pembayaran baru diterima:\n\nMetode Pembayaran: ' + m.args[0] + '\nNomor Rekening/Pulsa: ' + m.args[1] + '\nJumlah Pembayaran: ' + m.args[2];

    conn.sendMessage(db.config.authorNumber[0] + "@s.whatsapp.net", { text }, { quoted: m });

    if (m.args[0] && m.args[1] && m.args[2]) {
      const isBankValid = Object.keys(db.config.banks).includes(m.args[0]);
      if (!isBankValid) {
        m.reply('Metode pembayaran tidak valid. Silakan pilih metode pembayaran yang benar.');
        return;
      }

      // Simulate waiting for payment confirmation (Replace with actual implementation)
      await new Promise(resolve => setTimeout(resolve, 5000));

      const isPaymentAccepted = Math.random() < 0.8; // Simulating payment acceptance

      if (isPaymentAccepted) {
        // Update user's balance in the database (Replace with actual implementation)
        db.user.balance += parseFloat(m.args[2]);

        m.reply(`Pembayaran berhasil diterima. Saldo anda sekarang: ${db.user.balance}`);
      } else {
        m.reply('Pembayaran ditolak. Silakan coba lagi.');
      }
    } else {
      m.reply('Argumen tidak lengkap. Silakan masukkan metode pembayaran, nomor rekening/pulsa, dan jumlah pembayaran.');
    }
  },
});
