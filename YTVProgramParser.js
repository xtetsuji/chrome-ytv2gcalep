class YTVProgramParser {
    constructor() {
        this.node = {};
    }
    parse(d) {
        if( !d && typeof document !== 'undefined' ) d = document;
        if( !d ) throw new Error("document is not found");
        this.document = d;

        this.node.schedule = d.querySelector('#__next main article .inner .programTime .programTimeContainer .programTimeDetail .schedule');
        this.node.schedule_between = this.node.schedule.querySelectorAll("time");
        this.parse_dates();
        this.parse_title();
        this.parse_description();
    }
    parse_dates() {
        const between_texts = [this.start_text, this.end_text] =
            Array.from(this.node.schedule_between).map(
                node => node.getAttribute("datetime")
            );
        const between_dates = [this.start_date, this.end_date] =
            between_texts.map( text => {
                console.log(text, typeof text);
                const [year, month, day, hour, min] =
                    text.split(/[-: ]/).map(
                        part => Number(part.replace(/^0+/, ''))
                    );
                return new Date(year, month - 1, day, hour, min);
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
}
