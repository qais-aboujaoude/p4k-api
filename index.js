const axios   = require('axios'),
      cheerio = require('cheerio')
      baseURL = 'http://pitchfork.com'

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
const pitchfork = () => {
  return new Promise((resolve, reject) => {
    getAlbumReview('radiohead', 'a moon shaped pool')
      .then(url => {
        axios.get(`${baseURL}${url[0]}`)
        .then(r => {
          let $ = cheerio.load(r.data)
          return resolve({
            score: $('span.score').text(),
            reviewURL: `${baseURL}${url[0]}`,
            reviewTitle: $('.review-detail__abstract').text(),
            reviewBody: $('div.contents').text()
          })
        })
      })
      .catch(err => console.log(err))
  })
}

pitchfork().then(r => console.log(JSON.stringify(r)))
