'use strict';
const ytvpp = new YTVProgramParser();
ytvpp.parse(document);
console.log(ytvpp);
const gCalURL = ytvpp.getGcalURL();
console.log(ytvpp.gCalURL);

const linkNode = document.createElement('a');
linkNode.appendChild(document.createTextNode('🗓'));
for (const [key, value] of [['href', gCalURL], ['style', 'font-size: 72pt'], ['target', '_blank']]) {
    linkNode.setAttribute(key, value);
}

const infoNode = document.createElement('pre');
infoNode.appendChild(document.createTextNode(ytvpp.getInformationText()));

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

wait(2000).then( () => {
    console.log('append body', linkNode);
    document.body.appendChild(linkNode);
    document.body.appendChild(infoNode);
})
