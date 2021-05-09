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
        this.parse_description();
    }
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
}
