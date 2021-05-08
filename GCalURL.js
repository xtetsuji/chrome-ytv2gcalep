class GCalURL {
    constructor(param) {
        this.text     = param.text     || '';
        this.details  = param.details  || '';
        this.location = param.location || '';
        //this.dates    = param.dates    || '';
        this.start    = param.start;
        this.end      = param.end;
    }
    static getUTC(date_arg) {
        const date = typeof date_arg === 'string' ? new Date(date_arg) : date_arg;
        const zerofill = str => ('0'+str).slice(-2);
        return date.getUTCFullYear() +
            zerofill(date.getUTCMonth()+1) +
            zerofill(date.getUTCDate()) +
            'T' +
            zerofill(date.getUTCHours()) +
            zerofill(date.getUTCMinutes()) +
            zerofill(date.getUTCSeconds()) +
            'Z';
    }
    getURL() {
        // CLASS = this.constructor
        // CLASS.name = 'CLASS'
        return 'https://www.google.com/calendar/event?' +
        'action='   + 'TEMPLATE' +
        '&text='    + encodeURIComponent(this.text) +
        '&details=' + encodeURIComponent(this.details) +
        '&location='+ encodeURIComponent(this.location) +
        '&dates='   + GCalURL.getUTC(this.start) + '/' + GCalURL.getUTC(this.end) +
        '&trp='     + 'false' ;
        // '&sprop='   + encodeURIComponent(this.sprop) +
        // '&sprop='   + 'name:' + encodeURIComponent('service');
    }
}
