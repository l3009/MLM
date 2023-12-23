import { Command } from '../../lib/handler.js';

Command.create({
  name: 'hapusproduk',
  category: 'Owner',
  run: async ({ m, db, conn }) => {
    if (m.args[0]) {
      const productName = m.args[0];

      // Check if the product exists
      const productIndex = db.user[m.sender].mcder.products.findIndex(product => product.name === productName);

      if (productIndex !== -1) {
        // Remove the product from the database
        db.user[m.sender].mcder.products.splice(productIndex, 1);
        m.reply(`Produk ${productName} berhasil dihapus.`);
      } else {
        m.reply(`Produk ${productName} tidak ditemukan.`);
      }
    } else {
      // Display usage instructions for the -hapusproduk command
      m.reply('Kesalahan penggunaan: Gunakan -hapusproduk [nama_produk] untuk menghapus produk.');
    }
  },
});
