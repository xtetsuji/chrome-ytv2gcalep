const HTMLParser = require('fast-html-parser');
const axios = require('axios');

const URL = "https://tv.yahoo.co.jp/program/85451299/"
// Make a request for a user with a given ID
axios.get(URL)
  .then(function (response) {
    // handle success
    root = HTMLParser.parse(response.data);
    const __next = root.querySelector('#__next');
    const Noclass = __next.querySelector('');
    const main = Noclass.querySelector('main');
    const article = main.querySelector('article');
    const inner = article.querySelector('.inner');
    const narrowWrap = inner.getChild(2);
    const sectionProgramRating = narrowWrap.querySelector('.sectionProgramRating');
    const programRating = sectionProgramRating.querySelector('.programRating');
    const programRatingContent = programRating.querySelector('.programRatingContent');
    const title = programRatingContent.querySelector('h1').text;
    console.log(programRatingContent);

    const channelClass = programRatingContent.querySelector('.channel');
    // const channel = channelClass.querySelector('p').text;
    // console.log(channel);
    
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })