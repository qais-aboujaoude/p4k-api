const axios   = require('axios'),
      cheerio = require('cheerio')
      baseURL = 'http://pitchfork.com'
let selec = 'ul.results-fragment'

const getAlbumReview = (artist, album) => {
  return new Promise((resolve, reject) => {
    return axios.get(`${baseURL}/search/?query=${artist}+${album}`)
      .then(r => {
        let links = []
        let $ = cheerio.load(r.data)
        $('.results-fragment').find('.review__link').each((i, el) => {
          let link = $(el).attr('href')
          links.push(link)
        }) 
        return resolve(links)
      })
      .catch(err => console.log(err))
  })
}

getAlbumReview('radiohead', 'a moon shaped pool').then(r => console.log(r))

// axios.get(`${baseURL}/search/?query=${artist}+${album}`)
//   .then(r => {
//     let links = []
//     let $ = cheerio.load(r.data)
//     $('.results-fragment').find('.review__link').each((i, el) => {
//       let link = $(el).attr('href')
//       links.push(link)
//     }) 
//     console.log(links)
//   })
//   .catch(err => console.log(err))