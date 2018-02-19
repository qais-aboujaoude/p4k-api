const axios = require('axios'),
  cheerio = require('cheerio'),
  baseURL = 'http://pitchfork.com'

/**
 * @async
 * @method getReviewURL Uses the Pitchfork page to search for a query of artist name + album
 * scrapes for .review__link
 * @param {string} query 
 * @return {Promise<{array:string}>} array of urls
 */
const getReviewURL = (query) => {
  return new Promise((resolve, reject) => {
    return axios.get(`${baseURL}/search/?query=${query}`)
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

const p4k = module.exports = {
  /**
   * @async 
   * @method getReview calls getReviewURL and uses the returned links to get an object
   * of album score, URL and written review
   * @param {string} artist name of the artists to search for
   * @param {string} album name of the album to search for
   * @return {Promise<{object:string}>} 
   */
  getReview: (artist, album) => {
    return new Promise((resolve, reject) => {
      getReviewURL(`${artist}+${album}`)
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

}
