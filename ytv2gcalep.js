// OGATA Tetsuji
// 2011/04/04
// 2014/04/21
// TODO: 非対応ページではそもそも実行しない
//       検索結果のページの追加ボタン

var a_els     = document.getElementsByTagName("a"),
    a_els_len = a_els.length,
    a_el,
    mydt, mydt_match,
    g_favicon, g_favicon_span,
    //shortcut  = getShortcut(),
    i;

for( i = 0; i < a_els_len; i++ ){
    a_el = a_els[i];
    if( !a_el.href.match(/^https?:\/\/calendar\.yahoo\.co\.jp\//) )
         continue;

    // a_el を引数にとって a_el.href を変更してもらうのもいいかも
        //mydt = a_el.parentNode.parentNode.getElementsByTagName("strong")[0].innerHTML.match(/\d\d:\d\d/g)[1];

    //mydt_match = document.getElementsByClassName("pt5p")[0].childNodes[0].innerText.match(/(\d?\d)時(\d?\d)分\D*$/); // TODO: ここのマッチが「新番組」「最終回」で失敗する "pt5p" が沢山あるから
    for(i=0;i<2;i++){ // ad-hoc...
        mydt_match = document.getElementsByClassName("pt5p")[i];
        mydt_match = (mydt_match.childNodes[0].innerText||'').match(/(\d?\d)時(\d?\d)分\D*$/);
        if(!mydt_match || mydt_match.length != 3) continue; // うまくいかなかったから再チャレンジ
        break; // うまくいったからもういい
    }


    //console.log("mydt_match", mydt_match);
    mydt = mydt_match[1]+":"+mydt_match[2];

    //var mydt = document.getElementsByClassName("calendar")[0].parentNode.href
    a_el.href = y2g_url(a_el.href, mydt);
    a_el.target = '_blank';

//     if (typeof shortcut !== 'undefined') {
//         shortcut.add("c", function(){
//             window.open(a_el.href);
//         };
//     }

    //a_el.getElementsByTagName("img").item(0).src="http://calendar.google.com/googlecalendar/images/favicon.ico";
}

// アイコンの書き換え
g_favicon = document.createElement("img");
g_favicon.src = "http://calendar.google.com/googlecalendar/images/favicon.ico";
g_favicon_span = document.getElementsByClassName("calendar")[0];
g_favicon_span.appendChild(g_favicon);
g_favicon_span.cssText = "background-image: none;"; // ad-hoc...

function html_unescape(str) {
    return(str.replace(/&lt;/g,'<')
              .replace(/&gt;/g,'>')
              .replace(/&quot;/g,'"')
              .replace(/&apos;/g,"'")
              .replace(/&amp;/g,'&'));
}

function y2g_url(url, mydt){
    //console.log(">>>>>> y2g_url: process: (url="+url+", mydt="+mydt+")");
    var qs = url.match(/\?(.*)/)[1],
        param_url = decodeURIComponent(qs.match(/&URL=(.*)$/)[1]),
        param = {}, gparam = {},
        qsarr = qs.split("&"),
        qsarrlen = qsarr.length,
        gparam_keys = ["action", "text", "dates", "sprop", "details", "location"],
        gparam_keys_len = gparam_keys.length,
        gqsarr = [],
        pair, i;

    //console.log("y2g_url: qs="+UnescapeEUCJP(qs));
    //console.log("y2g_url: param_url="+UnescapeEUCJP(param_url));

    for(i = 0; i < qsarrlen; i++ ) {
	pair = qsarr[i].split("=");
	//console.log("key, value = " + pair[0] + ", " + pair[1]);
	//param[pair[0]] = pair[0] === "TITLE" || pair[0] === "DESC" ? UnescapeEUCJP(pair[1]) : decodeURIComponent(pair[1]);
        param[pair[0]] = html_unescape( decodeURIComponent(pair[1].replace(/\+/g,' ')) );
    }

    if(param['ENC'] && param['ENC'] != 'UTF-8') {
        throw new Error('Unexpected charset error.');
    }

    gparam["action"] = "TEMPLATE";

//    var title_match = param["TITLE"].match(/^(.*)\((.*?)\)/);
//    gparam["text"] = title_match[1];
//    gparam["location"] = title_match[2];

    // rewrite at 2011/04/04
    var title_match = param["Title"],
        main_em = document.getElementById("main").getElementsByTagName("em"),
        em_idx = main_em.length === 9 ? 5 : 6; // 放送中の場合は「放送中です」という em 要素が入る
    gparam["text"] = title_match.replace(/\(.*?\)$/,'');
    gparam["location"] = document.getElementsByClassName("pb5p")[0].childNodes[1].innerText.match(/^[^１]*/)[0];
    gparam["dates"] = detect_gdates( param["ST"], mydt );
    gparam["sprop"] = param["URL"].replace(/^http:/, "website:");
    gparam["details"] = param["URL"]+"\n"+main_em[em_idx].innerText;

    for( i = 0; i < gparam_keys_len; i++ ) {
	var key = gparam_keys[i];
	gqsarr[gqsarr.length] = key+"="+encodeURIComponent(gparam[key]);
    }
    return "http://www.google.com/calendar/event?"+gqsarr.join("&");
}

function detect_gdates(st, mydt) {
    var st_,
        starr = st.split("T"),
        st_1 = starr[0], st_2 = starr[1], // st_1 が YYYYmmdd、ST_2がHHMM
        cur_date = st_1, // st_1 は後半でいじるので DT 用に確保
                         // mydt は存在すれば HH:MM (H:MM の場合もある)
        st_2_hour = parseInt(st_2.match(/^(\d\d)/)[1],10);
    //console.log("detect_gdates:(st,mydt,starr,st_1,st_2,cur_date,st_2_hour)",st,mydt,starr,st_1,st_2,cur_date,st_2_hour);
    if( st_2_hour >= 24 ) { // 24時以降の翌日表現
	var st_2_hour_mod = st_2_hour - 24;
	st_2_hour_mod = st_2_hour_mod.toString();
	if ( st_2_hour_mod.length == 1 ) {
	    st_2_hour_mod = "0"+st_2_hour_mod;
	}
	st_2 = st_2.replace(/^\d\d/, st_2_hour_mod);
	if(typeof st_1 === "undefined"){throw new Error("undefined st_1");}
	var st_1d = new Date(str2date(st_1).getTime()+86400*1000);
	st_1 = "".concat(st_1d.getFullYear(), pad02(st_1d.getMonth()+1), pad02(st_1d.getDate()));
    }
    st_ = "".concat(st_1, "T", st_2); // YYYYMMDDTHHHMM
    //console.log("st_1="+st_1+" st_="+st_);

    if(typeof st_ === "undefined")
        throw new Error("undefined st_");

    var date_st = str2date(st_);
    var time_st = date_st.getTime();

    if(!mydt) {
	var fmt = "";
	fmt += date_st.getUTCFullYear();
	fmt += date_st.getUTCMonth()+1;
	fmt += date_st.getUTCDate();
	fmt += "T";
	fmt += date_st.getUTCHours();
	fmt += date_st.getUTCSeconds();
	return fmt+"/"+fmt;
    }

    var mydt_ = mydt.replace(/\D/g, ""); //コロンを削除
    if(mydt_.length === 3) {
        mydt_ = "0".concat(mydt_);
    }
    var dt = cur_date+"T"+mydt_;
    
    // STの組み立てのコピペです…
    var dtarr     = dt.split("T");
    var dt_1      = dtarr[0], dt_2 = dtarr[1];
    var dt_2_hour = parseInt(dt_2.match(/^(\d\d)/)[1],10);
    //console.log("detect_gdates:(dt,mydt,dtarr,dt_1,dt_2,cur_date,dt_2_hour)",dt,mydt,dtarr,dt_1,dt_2,cur_date,dt_2_hour);
    if( dt_2_hour >= 24 ) { // 24時以降の翌日表現
	var dt_2_hour_mod = dt_2_hour - 24;
	dt_2_hour_mod = dt_2_hour_mod.toString();
	if ( dt_2_hour_mod.length == 1 ) {
	    dt_2_hour_mod = "0"+dt_2_hour_mod;
	}
	dt_2 = dt_2.replace(/^\d\d/, dt_2_hour_mod);
	if(typeof dt_1 === "undefined"){throw new Error("undefined dt_1");}
	var dt_1d = new Date(str2date(dt_1).getTime()+86400*1000);
	dt_1 = "".concat(dt_1d.getFullYear(),pad02(dt_1d.getMonth()+1), pad02(dt_1d.getDate()));
    }
    var dt_ = dt_1 + "T" + dt_2; // YYYYMMDDTHHHMM
    //console.log("dt_1="+dt_1+" dt_="+dt_);

    if( typeof dt_ === "undefined" )
        throw new Error("undefined dt_");

    var date_dt = str2date(dt_);
    var time_dt = date_dt.getTime();

    var st_fmt = "", dt_fmt = "";
    st_fmt += date_st.getUTCFullYear();
    st_fmt += pad02(date_st.getUTCMonth()+1);
    st_fmt += pad02(date_st.getUTCDate());
    st_fmt += "T";
    st_fmt += pad02(date_st.getUTCHours());
    st_fmt += pad02(date_st.getUTCMinutes());
    st_fmt += "00Z";
    dt_fmt += date_dt.getUTCFullYear();
    dt_fmt += pad02(date_dt.getUTCMonth()+1);
    dt_fmt += pad02(date_dt.getUTCDate());
    dt_fmt += "T";
    dt_fmt += pad02(date_dt.getUTCHours());
    dt_fmt += pad02(date_dt.getUTCMinutes());
    dt_fmt += "00Z";
    return st_fmt+"/"+dt_fmt;
}

function str2date(str) {
    // フォーマットは YYYYmmdd または YYYYmmddTHHMM のみ
    var m, format;
    if( m = str.match(/^(\d\d\d\d)(\d\d)(\d\d)$/) ) {
	format = m[1]+"/"+m[2]+"/"+m[3];
    }
    else if( m = str.match(/^(\d\d\d\d)(\d\d)(\d\d)T(\d\d)(\d\d)$/) ) {
	format = m[1]+"/"+m[2]+"/"+m[3]+" "+m[4]+":"+m[5];
    }
    return new Date(format);
}

function pad02(arg) {
    var str;
    str = typeof arg === "number" ? arg.toString() : arg;
    return str.length === 1 ? "0"+str : str;
}
