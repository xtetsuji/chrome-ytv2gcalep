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

const linkNode = document.createElement('a');
linkNode.appendChild(document.createTextNode('🗓'));
for (const [key, value] of [['href', gCalURL], ['style', 'font-size: 72pt'], ['target', '_blank']]) {
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

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

wait(2000).then( () => {
    console.log('append body', linkNode);
    document.body.appendChild(linkNode);
    document.body.appendChild(infoNode);
});
