class YTVProgramParser {
    constructor() {
        this.node = {};
    }
    parse(d) {
        if( !d && typeof document !== 'undefined' ) d = document;
        if( !d ) throw new Error("document is not found");
        this.document = d;

        this.parse_dates();
        this.parse_title();
        this.parse_location();
        this.parse_description();
    }
    /**
     * 現在のページではなく引数URLのパースを行う
     * @param {string} url - https://tv.yahoo.co.jp/program/数字 の URL
     * @return {Promise} - resolve として parse 完了を教えてくれる Promise
     */
    async parseURL(url) {
        const res  = await fetch(url);
        // DOMParser は noscript を解釈しない（？）ようで、<noscript><iframe></noscript>  ... <noscript></iframe></noscript> で iframe に包まれてしまい、がっぽり見たい情報がはずされてしまう対策
        const text = await res.text().then( text => text.replace(/<noscript>.*?<\/noscript>/g, '') );
        this.document = new DOMParser().parseFromString(text, 'text/html');
        this.parseND();
    }
    parseND() {
        const nd = this.nd = JSON.parse(this.document.getElementById('__NEXT_DATA__').innerText);
        console.log(`nd=`, nd);
        this.nd = nd;
        const masterData = nd['props']['initialState']['mindsMaster']['data']['ResultSet']['Result'];
        //const mindsAll = nd['props']['initialState']['mindsAll']['data']['ResultSet']['Result'];
        const data = masterData[0]; // どちらが正しい？
        // date
        this.start_date2 = new Date(data['broadCastStartDate'] * 1000);
        this.end_date2   = new Date(data['broadCastEndDate'] * 1000);

        // title
        this.title2 = data['programTitle'];

        // location
        this.location2 = data['serviceName'];

        // description
        // 最終更新日を入れる？
        const descriptionText = JSON.parse(data['descriptions']).map( obj => `■${obj['title']}\n\n${obj['note']}` ).join("\n\n\n");
        this.description2 = [data['title'], data['summary'], descriptionText].join("\n\n");
    }
    swap2to1() {
        for ( const key of ['start_date', 'end_date', 'title', 'location', 'description'] ) {
            const key2 = key+'2';
            [this[key], this[key2]] = [this[key2], this[key]];
        }
    }
    // getDocument(arg) {
    //     if ( typeof arg === 'undefined' ) {
    //         arg = document;
    //     }
    //     if ( arg instanceof HTMLDocument ) {
    //         return arg;
    //     } else if ( typeof arg === 'string' && arg.match(/^https?:\/\//) ) {
    //         return new DOMParser().parseFromString()
    //     }
    // }
    parse_dates() {
        // <time> の datetime="YYYY-MM-DD HH:MM" は HH:MM 部分が午後だとおかしい、ただ YYYY-MM-DD は日付またぎも含めて信用できると思われる
        // なので YYYY-MM-DD は time 要素の datetime 属性から拾い、HH:MM は表示要素の span の中から拾う
        const [start_node, end_node] = document.querySelectorAll('.scheduleText');
        const [start_dstr, end_dstr] = [
            start_node,
            end_node
        ].map( (node) =>
            node.getAttribute('datetime').replace(/ .*/, '')
        );
        const [start_tstr, end_tstr] = [
            [start_node, 3],
            [end_node, 1]
        ].map( ([node, i]) =>
            node.querySelector(`span:nth-child(${i})`).innerText
        );
        [this.start_date, this.end_date] = [
            [start_dstr, start_tstr],
            [end_dstr,   end_tstr]
        ].map( ([dstr, tstr]) => {
            const [hour, minute] = tstr.split(/:/);
            const [year, month, day] = dstr.split(/-/);
            return new Date(year, month - 1, day, hour, minute);
        } );
    }
    parse_title() {
        this.title = this.document.querySelector(".programRatingContentTitle").innerText;
    }
    parse_description() {
        this.description = this.document.querySelector(".programInfoContent").parentElement.innerText;
    }
    parse_location() { // テレビ局
        this.location = this.document.querySelectorAll(".channelText")[0].innerHTML.replace(/<.*/, '')
    }
    // slice_description(number) {
    //     this.description = `DUMMY(${new Date().toString()})` + this.description.slice(0, number);
    // }
    // limit_encoded_description_bytes(bytenum) {
    //     let description = this.description;
    //     if ( encodeURIComponent(description).length < bytenum ) return;
    //     while ( encodeURIComponent(description).length >= bytenum ) {
    //         description = description.slice(0, -1);
    //     }
    //     this.description = description;
    //     console.log(`limitation work end`);
    // }
    slice_description_limit_GCalURL_bytes(bytenum) {
        const excess_byte = this.getGcalURL().length - bytenum;
        if ( excess_byte <= 0 ) return;
        console.log(`slice_description_limit_GCalURL_bytes: bytenum=${bytenum}, but GCalURL_length=${this.getGcalURL().length}. start ${excess_byte} bytes diet. current description length is ${this.description.length}`);
        const getBytes = string => encodeURIComponent(string).length;
        let description = this.description;
        const original_description_byte = getBytes(description);
        // 減量バイト数が超過バイト数を上回れば抜けてOK
        while ( original_description_byte - getBytes(description) <= excess_byte ) {
            description = description.slice(0, -1);
        }
        console.log(`diet end. dieted description length is ${description.length}`);
        this.description = description;
    }
    getGcalURL() {
        const gcalurl = new GCalURL({
            text: this.title,
            details: this.description,
            location: this.location,
            start: this.start_date,
            end: this.end_date
        });
        return gcalurl.getURL();
    }
    getInformationText() {
        return `Title: ${this.title}

Details: ${this.description.replace(/(?<=\n)/g, '    ')}

Location: ${this.location}

Start: ${this.start_date.toString()}

End: ${this.end_date.toString()}`
    }
    getInformationText2() {
        return `Title2: ${this.title2}

Details2: ${this.description2.replace(/(?<=\n)/g, '    ')}

Location2: ${this.location2}

Start2: ${this.start_date2.toString()}

End2: ${this.end_date2.toString()}`

    }
}
