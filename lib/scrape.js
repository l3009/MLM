import axios from "axios";
import cheerio from "cheerio";

export class Scrape {
  static async function otakusearch(query) {
    return new Promise(async (resolve, reject) => {
      const hasil = await axios.get(`https://otakudesu.cam/?s=${query}&post_type=anime`)
      const $ = cheerio.load(hasil?.data)
      const link = $('div.page').find('a').attr('href')
      const { data } = await axios.get(link)
      const $$ = cheerio.load(data)
      let result = {}
      result.img = $$('#venkonten .venser .fotoanime').find('img').attr('src')
      $$('#venkonten .infozingle').each((_, b) => {
        result.judul = $$(b).find(`p:nth-child(1) span`).text().replace('Judul: ', '')
        result.japanese = $$(b).find(`p:nth-child(2) span`).text().replace('Japanese: ', '');
        result.skor = $$(b).find(`p:nth-child(3) span`).text().replace('Skor: ', '')
        result.produser = $$(b).find(`p:nth-child(4) span`).text().replace('Produser: ', '')
        result.tipe = $$(b).find('p:nth-child(5)').text().replace('Tipe: ', '')
        result.status = $$(b).find('p:nth-child(6)').text().replace('Status: ', '')
        result.episode = $$(b).find('p:nth-child(7)').text().replace('Total Episode: ', '')
        result.durasi = $$(b).find('p:nth-child(8)').text().replace('Durasi: ', '')
        result.rilis = $$(b).find('p:nth-child(9)').text().replace('Tanggal Rilis: ', '')
        result.studio = $$(b).find('p:nth-child(10)').text().replace('Studio: ', '')
        result.genre = $$(b).find('p:nth-child(11)').text().replace('Genre: ', '')
      })
      resolve(result)
    })
  }
}