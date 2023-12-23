import { Command } from '../../lib/handler.js';

Command.create({
  name: 'listproduk',
  category: 'User',
  run: ({ m, db }) => {
    if (db.user[m.sender].mcder.products.length > 0) {
      const productList = db.user[m.sender].mcder.products.map(product => `${product.name} - Rp${product.price}`).join('\n');
      m.reply(`Daftar Produk:\n${productList}`);
    } else {
      m.reply('Belum ada produk tersedia.');
    }
  },
});
