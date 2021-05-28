'use strict';
console.log(`listings: start`);

// TODO:
//  ボタンのデザインがイケてないし右寄せにならない

const programAddButonnHandler = async function(event) {
    // ボタン要素を this で取得したいので function リテラル
    // td に appendChild するので、this.parentNode は td として良い
    console.log('push button');
    const button = this;
    const td     = button.parentNode;
    const link   = td.querySelector('a.listingTablesTextLink');
    const url    = link.href;
    console.log(`button: programURL = ${url}`);
    const ytvpp  = new YTVProgramParser();
    ytvpp.url    = url;
    await ytvpp.parseURL(url).catch( (e) => {
        console.error(
            `listing: ytvpp.parseURL failed: ytvpp.document =`,
            ytvpp.document
        );
        throw e;
    } );
    console.log(`ytvpp: `, ytvpp);
    ytvpp.swap2to1(); // ちょっとこのインターフェースは直そう
    ytvpp.slice_description_limit_GCalURL_bytes(8195);
    const gCalURL = ytvpp.getGcalURL();
    console.log(`button: gCalURL=${ytvpp.gCalURL}`);
    console.log(`button: location change to gCalURL`);
    open(gCalURL);
};

const sleep = ms => new Promise( resolve => setTimeout(resolve, ms) );
async function getListingTableTextLink() {
    const interval = 100;
    let counter = 1;
    console.log(`listing/getListingTabeTextLink: start`);
    while (true) {
        console.log(`counter${counter}`);
        const nodes = document.querySelectorAll('a.listingTablesTextLink[href^="/program/"]');
        if ( nodes && nodes.length > 0 ) {
            console.log(`nodes defined`, nodes);
            return nodes;
        }
        if ( counter++ > 20 ) {
            console.log(`safe counter exit`);
            break;
        }
        await sleep(interval);
    }
}

(async () => {
    // const ms = 1000;
    // console.log(`listings: sleep ${ms}`);
    // await sleep(ms);
    // const programLinks = Array.from(
    //     document.querySelectorAll('a.listingTablesTextLink')
    // ).filter( a_el => a_el.href.match(/^https:\/\/tv.yahoo.co.jp\/program\/\d+$/) );

    const nodes = await getListingTableTextLink();
    const programLinks = Array.from(nodes);

    console.log(`programiLinks.length=${programLinks.length}, loop this`);

    for ( const programLink of programLinks ) {
        // a -> h4 -> div -> div -> td
        const tableCell = programLink.parentNode.parentNode.parentNode.parentNode;
        if ( tableCell.tagName.toLowerCase() !== 'td' ) {
            const a1 = programLink.parentNode;
            const a2 = a1.parentNode;
            const a3 = a2.parentNode;
            const a4 = a3.parentNode;
            console.error(`programiLink ancestors: ${programLink.tagName} ${a1.tagName} ${a2.tagName} ${a3.tagName} ${a4.tagName}`);
            throw new Error('YTVGcal: parse error: expect program link 4 ancestor td on listing. however td is missing');
        }
        const button = document.createElement('button');
        button.setAttribute('style', 'display: flex');
        button.appendChild(document.createTextNode('🗓登録'));
        button.addEventListener('click', programAddButonnHandler);
        tableCell.appendChild(button);
    }
})();

