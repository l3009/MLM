import { Command } from '../../lib/handler.js';

Command.create({
  name: 'paket',
  category: 'paket',
  run: async ({ m, db, conn }) => {
    const createPaketFunction = (...args) => {
      let result = "";
      for (const [index, arg] of args.entries()) {
        result += `${index + 1}. ${arg}\n`;
      }
      return result;
    };

    // List of features
    const paketFeatures = createPaketFunction(
      "Profil perusahaan",
      "    - Owner dan founder",
      "    - Alamat dan bergerak di bidang",
      "Legalitas",
      "Produk mja",
      "    - Teh gaharu",
      "    - Madu mja",
      "    - smt-bren",
      "    - Mja ghr fit",
      "    - Mja pro",
      "    - M joss",
      "    - M slim",
      "    - Sabun gaharu",
      "    - Jelita mja",
      "    - Mja manja Q",
      "    - Kopirudal",
      "    - Mja jrenkco",
      "    - Skincare",
      "Penggunaan mja dalam penyembuhan penyakit",
      "Bagaimana membeli produk mja?",
      "Keuntungan menjadi mitra mja",
      "    - Bisnis",
      "Form registrasi paket"
    );

    // Reply with the result
    m.reply(paketFeatures);
  },
});


import { Command } from '../../lib/handler.js';

Command.create({
  name: 'bayar',
  category: 'paket',
  run: async ({ m, db, conn }) => {
    // disini
  }
})