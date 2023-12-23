Command.create({
  name: 'tambahproduk',
  category: 'Owner',
  run: async ({ m, db, conn }) => {
    // Check and create structure if undefined
    if (!db.user[m.sender].mcder) {
      db.user[m.sender].mcder = {
        products: [],
      };
    }

    if (m.args[0] === '-text') {
      // Adding product using text input
      const productName = m.args[1];
      const productPrice = parseFloat(m.args[2]);

      if (!productName || isNaN(productPrice)) {
        m.reply('Kesalahan penggunaan: Nama produk dan harga harus diisi dengan benar.');
        return;
      }

      // Add the product to the database
      db.user[m.sender].mcder.products.push({
        name: productName,
        price: productPrice,
      });

      m.reply(`Produk ${productName} dengan harga ${productPrice} berhasil ditambahkan.`);
    } else if (m.args[0] === '-image') {
      // Adding product using an image
      const quotedMessage = await m.quoted.download();

      // Assuming the image is saved using FS, adjust the path accordingly
      const imagePath = 'media/image/image.jpg';
      const productName = m.args[1];
      const productPrice = parseFloat(m.args[2]);

      if (!productName || isNaN(productPrice)) {
        m.reply('Kesalahan penggunaan: Nama produk dan harga harus diisi dengan benar.');
        return;
      }

      // Save the image
      fs.writeFileSync(imagePath, quotedMessage);

      // Add the product to the database
      db.user[m.sender].mcder.products.push({
        name: productName,
        price: productPrice,
        image: imagePath,
      });

      m.reply(`Produk ${productName} dengan harga ${productPrice} berhasil ditambahkan.`);
    } else {
      // Display usage instructions for the -tambahproduk command
      const usageGuide = 'Panduan Penggunaan Tambah Produk:\n\n' +
        '-text [nama_produk] [harga] : Tambah produk dengan nama dan harga menggunakan teks.\n' +
        '-image [nama_produk] [harga] : Tambah produk dengan nama, harga, dan gambar menggunakan foto.\n\n' +
        'Contoh Penggunaan:\n' +
        '-text MakananEnak 15000\n' +
        '-image MinumanSegar 10000';

      m.reply(usageGuide);
    }
  },
});
