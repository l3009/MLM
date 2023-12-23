// Fungsi konversi mata uang
function konversiMataUang(jumlah, kurs) {
  if (jumlah >= 0 && kurs > 0) {
    return jumlah * kurs;
  } else {
    return "Masukkan jumlah dan kurs yang valid";
  }
}

// Fungsi perhitungan total uang
function hitungTotalUang(uang1, uang2) {
  if (uang1 >= 0 && uang2 >= 0) {
    return uang1 + uang2;
  } else {
    return "Masukkan jumlah uang yang valid";
  }
}

// Contoh penggunaan
let jumlahDolar = 50;
let kursRupiah = 15000;
let hasilKonversi = konversiMataUang(jumlahDolar, kursRupiah);
console.log("Hasil konversi: " + hasilKonversi + " Rupiah");

let uang1 = 100;
let uang2 = 75;
let totalUang = hitungTotalUang(uang1, uang2);
console.log("Total uang: " + totalUang);
