'use strict';
const ytvpp = new YTVProgramParser();
ytvpp.parse(document);
console.log(ytvpp);

// URL 全体で 8192文字（8191 OK / 8192 NG）制限？
// URL 全体で
// 8195 OK
// 8196 NG
// const limit_byte_num = 7988;
// console.log(`limitation encoded description to ${limit_byte_num} bytes`);
// ytvpp.limit_encoded_description_bytes(limit_byte_num);

ytvpp.slice_description_limit_GCalURL_bytes(8195);

const gCalURL = ytvpp.getGcalURL();
console.log(ytvpp.gCalURL);

const iconNode = document.createElement('img');
//iconNode.setAttribute('src', chrome.runtime.getURL('google_calendar.png'));
iconNode.setAttribute('src', 'https://play-lh.googleusercontent.com/Jsbb0EeesKUbDTl3UyDKO6sNz45RCMh7gnoI6giQcQz1f5Mj0J4TRh7Psyu53vShh-qm=s180-rw');
iconNode.setAttribute('width', '35');
iconNode.setAttribute('height', '35');
const linkNode = document.createElement('a');
//linkNode.appendChild(document.createTextNode('🗓'));
linkNode.appendChild(iconNode);
for (const [key, value] of [['href', gCalURL], ['style', 'font-size: 1em'], ['target', '_blank'], ['class', 'buttonSnsLink'], ['title', 'Googleカレンダーに放送予定を追加する']]) {
    linkNode.setAttribute(key, value);
}

const infoNode = document.createElement('pre');
infoNode.appendChild(document.createTextNode(
    ytvpp.getInformationText() + "\n" +
    `${gCalURL} => length: ${gCalURL.length}
ytvpp.description.length: ${ytvpp.description.length}
encodeURIComponent(ytvpp.description).length: ${encodeURIComponent(ytvpp.description).length}
`
));

//const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

//wait(10).then( () => {
    //console.log('append body', linkNode);
    document.body.appendChild(linkNode);
    document.body.appendChild(infoNode);
//    wait(20).then( () => {
        //console.log('append snsContainer', linkNode);
        const snsContainer = document.querySelector(".buttonSnsContainer");
        snsContainer.appendChild(linkNode);
//    });
//} );
