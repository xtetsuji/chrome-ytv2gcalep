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
    const narrowWrap_ = inner.getChild(2);
    const sectionProgramRating = narrowWrap_.querySelector('.sectionProgramRating');
    const programRating = sectionProgramRating.querySelector('.programRating');
    const programRatingContent = programRating.querySelector('.programRatingContent');
    const title = programRatingContent.querySelector('h1').text;

    // failed
    // const channel = programRatingContent.querySelector('.channel')
    // const channelText = programRatingContent.querySelector('.channelText')
    // const TVStation = channelText.text
    // console.log(TVStation);

    const programTime = inner.querySelector('.programTime');
    const programTimeContainer = programTime.querySelector('.programTimeContainer');
    const programTimeDetail = programTimeContainer.querySelector('.programTimeDetail');
    const schedule = programTimeDetail.querySelector('.schedule');
    const date_ = schedule.getChild(0);
    const date = date_.getChild(0);
    const month = date.text[0];
    const day = date.text[2];
    

    const scheduleStart = schedule.getChild(0);
    const startTime_ = scheduleStart.getChild(2);
    const startTime = startTime_.text

    const scheduleEnd = schedule.getChild(2);
    const endTime_ = scheduleEnd.getChild(0);
    const endTime = endTime_.text;

    const narrowWrap = inner.getChild(5);
    const programVideoContent = narrowWrap.querySelector('.programVideoContent');
    const programVideoContentText = programVideoContent.querySelector('p');
    const description = programVideoContentText.text;
    
    console.log(title);
    console.log(month);
    console.log(day);
    console.log(startTime);
    console.log(endTime);
    console.log(description);
    
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })