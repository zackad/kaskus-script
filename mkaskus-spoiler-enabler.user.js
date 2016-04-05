// ==UserScript==
// @name           mKaskus Spoiler Enabler
// @namespace      https://openuserjs.org/users/zackad/
// @homepageURL    http://www.kaskus.co.id/profile/4125324
// @description    Spoiler di m.kaskus layaknya versi desktop
// @author         zackad
// @version        0.3.7
// @include        http://m.kaskus.co.id/*
// @include        http://fjb.m.kaskus.co.id/*
// @include        /^https?://(www|fjb).kaskus.co.id/(thread|lastpost|post|show_post|group/discussion)/*/
// @grant          GM_addStyle
// @license        MIT License
// @require        http://code.jquery.com/jquery-1.10.1.min.js
// @require        http://cdn.kaskus.com/themes_2.0/js/ajaxfileupload.js
// @run-at         document-end
// @copyright       2015-2016, zackad
// ==/UserScript==
/*
    LATEST UPDATE
    v0.3.7
    - patch read more on fjb.m
    - prev & next gambar
*/
$(document).ready(function(){
    /*===========================================
      GLOBAL SETTINGS
    *\===========================================*/
    var Settings = {
        __DEBUG__ : false,         //debug version
        SHOW_ORIGIN_LINK: false,   //ganti nilainya menjadi 'true' untuk menampilkan grey link
        SHOW_IMAGE_ONCLICK: true,  //false = buka image di tab baru, true = buka image langsung ditempat
        SHOW_IMAGE_SIZE: true,     //false = jangan tampilkan size gambar, true = tampilkan size gambar
        DECIMAL_POINT: 2,          //angka dibelakang koma size gambar
        SHOW_LASTPAGE: true,       //open thread's last page
        TO_WAP_LINK: true,         //convert kaskus link to wap version (m.kaskus)
        //experimental mode
        SHOW_WHO_POSTED: false,    //false = don't show, true = show , MASIH TAHAP DEVELOPMENT
        QUICK_LINKS: false         //show quick links
    };
    var QL = new Array(
        'Computer,19',
        'Anime,26',
        'ISN,183',
        'CCPB,14',
        'Linux,65'
    );
    
    /*===========================================
      PERMALINK SINGLE POST
    *\===========================================*/
    var single_post = $('.author a.permalink');
    single_post.each(function(){
        var href = $(this).attr('href');
        href = href.replace('#post','');
        var prefix = 'http://www.kaskus.co.id/show_post/';
        href = prefix + href;
        $(this).attr('href',href).attr('target', '_blank');
        //console.log(href);
    });
    
    /*===========================================
      REDIRECT LINK REMOVER [thanks : AMZZZMA]
    *\===========================================*/
    if (window.location.href.indexOf('m.kaskus.co.id') > -1) {
        var aEls = $('#content-wrapper .entry-content a');
    } else {
        var aEls = $('.postlist .entry a');
    }
    for (var i = 0, aEl; aEl = aEls[i]; i++) {
        //console.log(aEls.href);
        aEl.href = unescape(decodeURI(aEl.href));
        aEl.href = aEl.href.replace('http://m.kaskus.co.id/redirect?url=','');
        aEl.href = aEl.href.replace('http://www.kaskus.co.id/redirect?url=','');
    }
    
    if (Settings.TO_WAP_LINK == true && window.location.href.indexOf('m.kaskus.co.id') > -1) {
        var aEls = $('#content-wrapper .entry-content a');
        for (var i = 0, aEl; aEl = aEls[i]; i++) {
            aEl.href = aEl.href.replace('http://www.kaskus.co.id/','http://m.kaskus.co.id/');
            aEl.href = aEl.href.replace('http://kaskus.co.id/','http://m.kaskus.co.id/');
            aEl.href = aEl.href.replace('http://fjb.kaskus.co.id/','http://fjb.m.kaskus.co.id/');
        }
    }
    // patch read more link on FJB
    $('a[onclick="readMore();"]').removeAttr('href');
    
    /*===========================================
      KHUSUS FJB THREAD
    *\===========================================*/
    function prevNextGen(){
        var fjbImgContainer = $('.fjb-item-image');
        var fjbPrevNextIng = fjbImgContainer.next().children('a');
        fjbPrevNextIng.each(function(){
            var elem = $(this);
            elem.attr('data', elem.attr('href'));
            elem.attr('href', 'javascript:;');
            elem.click(function(){
                $.ajax({
                    url : elem.attr('data'),
                    dataType : 'html',
                    success : function(response){
                        var imgResult = $(response).find('.fjb-item-image center').html();
                        $('.fjb-item-image center').html(imgResult);
                        var prevNext = $(response).find('.fjb-item-image').next().html();
                        $('.fjb-item-image').next().html(prevNext);
                        prevNextGen();
                    }
                })
            });
        });
    }
    prevNextGen();
    
    /*===========================================
      SHOW LAST PAGE LINK
    *\===========================================*/
    if (Settings.SHOW_LASTPAGE == true && window.location.href == 'http://m.kaskus.co.id/myforum') {
        var list = $('#content-wrapper .post-list .list-entry');
        list.each(function(){
            var b = $(this).children('a').attr('href');
            console.log(b);
            //var TID = getTID(b);
            var ID = new String(b);
            var TID = ID.split("/");
            TID = TID[2];
            console.log(TID);
            if (TID.length > 5) {
                var lastpage = 'http://m.kaskus.co.id/lastpost/' + TID;
                console.log(TID);
                lastpage = '<span><a href="' + lastpage + '"> | Last Page | </a></span>';
                $(this).children('.sub-meta')
                    .append(lastpage);
            }
        });
    }
    
    
    /*===========================================
      SHOW QUICK LINKS [draft]
    *\===========================================*/
    if (Settings.QUICK_LINKS == true) {
        var qlWrapper = '<div id="ql"></div>';
        $('#search').after(qlWrapper);
        //QL.each(function(){
            
        //}
        
        $('ql').append(QL);
    }
    
    /*===========================================
      WHO POSTED ON THREAD  
    *\===========================================*/
    if (Settings.SHOW_WHO_POSTED == true) {
        var list = $('#content-wrapper .post-list .list-entry');
        
        list.each(function(){
            var tLink = $(this).children('a').attr('href');
            var TID = getTID(tLink);
            //console.log(TID); //log thread ID
            if (TID.length > 5){
                var urlThread = "http://kaskus.co.id/misc/whoposted/"+ TID;
                
                //open whoposted on new tab :hammer:
                var who = $('<a>Who Posted</a>')
                    .attr('href', urlThread)
                    .attr('target', '_blank');
                var span = $('<span></span>').append(who);
                $(this).children('.sub-meta')
                    .append(span);
            }
            });
    }
    /*===========================================
      Origin Link Hider
    *\===========================================*/
    if (Settings.SHOW_ORIGIN_LINK == false) {
    $('span[style*="font-size:10px;color: #888;"]').hide();
    }
    
    /*===========================================
      Load Image on Click
    *\===========================================*/
    if (Settings.SHOW_IMAGE_ONCLICK == true) {
    var imgSelector = ''
        +'a[href$=".jpg"],'
        +'a[href$=".png"],'
        +'a[href$=".gif"],'
        +'a[href$=".JPG"],'
        +'a[href$=".PNG"],'
        +'a[href$=".JPEG"],'
        +'a[href$=".jpeg"],'
        +'a[href$=".GIF"],'
        +'a[href*=".jpg?"],'
        +'a[href*="gif.latex?"],'
        +'a[href*="latex.php?"],'
        +'a[href^="http://puu.sh/"]';
    var image = $(imgSelector).css({'background-color': '#333', 'color' : 'white'});
    image.each(function(){
        var temp = $(this);
        temp.attr({data : $(this).attr('href'), alt : "Click to Load Image"}).attr('href', 'javascript:void(0);');
        
        // get image size in bytes
        if (Settings.SHOW_IMAGE_SIZE == true) {
        var xhr = $.ajax({
            type : 'HEAD',
            url : $(this).attr('data'),
            success : function(){
                var size = xhr.getResponseHeader('Content-Length');
                if (size > 1048576){
                    size = size/1048576;
                    size = new String(size);
                    var charLoc = size.indexOf(".");
                    if (charLoc > -1) {
                        charLoc = parseInt(charLoc) + parseInt(Settings.DECIMAL_POINT) + 1;
                        //console.log(charLoc);
                        size = size.substr(0,charLoc) + ' MB';
                    }
                } else if (size > 1024){
                    size = size/1024;
                    size = new String(size);
                    var charLoc = size.indexOf(".");
                    if (charLoc > -1) {
                        charLoc = parseInt(charLoc) + parseInt(Settings.DECIMAL_POINT) + 1;
                        //console.log(charLoc);
                        size = size.substr(0,charLoc) + ' KB';
                    }
                } else {
                    size = size + ' Bytes';
                }
                temp.after('<span style = "font-size : 10px; color : #00f;"> ' + size + '</span>');
            }});
        }
    });
    image.click(function(){
       var link = $(this).attr('data');
        console.log(link);
       var img = $("<img />").attr('src', link);
       $(this).after(img);
       $(this).next().next().hide();
       $(this).hide();
    });
    }
    /*======================================
        Forum Activities Link
    \*======================================*/
        var quoted = $('#subnav span a').has('sup').last();
        if (quoted.children('sup').text() > 0) {
            quoted.attr('href', '/myforum/myquotedpost');
        } else {
            quoted.attr('href', '/myforum');
        }
    
    /*===========================================================
        SPOILER ENABLER 
    *\===========================================================*/
    if (window.location.href.indexOf("m.kaskus.co.id") > -1) {
    var sContent = $('div[class*="content_spoiler"]');
    sContent.hide();
    var show_all = '<a class="show-all" class="btn bnt-sm" style="margin: 0 10px;background: #ccc;color: #484848;text-decoration:none; padding:0 4px; font-size:10px: border-radius:3px;" href="javascript:void(0);" title="Show All Spoiler Inside">Show all</a>';
    var hide_all = '<a class="hide-all" class="btn bnt-sm" style="margin: 0 10px;background: #ccc;color: #484848;text-decoration:none; padding:0 4px; font-size:10px: border-radius:3px;" href="javascript:void(0);" title="Hide All Spoiler Inside">Hide all</a>';
    var show_spoiler = '&nbsp&nbsp<a class="show-spoiler" class="btn btn-sm" style="background: #ccc;color: #484848;text-decoration:none; padding:0 4px; font-size:10px; border-radius:3px;" href="javascript:void(0);" title="Show Spoiler">Show</a>';
    var hide_spoiler = '<a class="hide-spoiler" class="btn bnt-sm" style="background: #ccc;color: #484848;text-decoration:none; padding:0 4px; font-size:10px: border-radius:3px;" href="javascript:void(0);" title="Hide Spoiler">Hide</a>';
    
    $('#bbcode_div > i').after(show_spoiler, hide_spoiler, show_all, hide_all);
    $('.hide-spoiler').hide();
    $('.hide-all').hide();
    
    $('.show-spoiler').click(function(){
        var parent = $(this).parent().parent();
        $(this).hide();
        $(this).next().show();
        
        var currentSpoiler = $(parent).children('#bbcode_spoiler_content').children('#bbcode_inside_spoiler');
        currentSpoiler.show();
    });
    
    $('.hide-spoiler').click(function(){
        var parent = $(this).parent().parent();
        $(this).hide();
        $(this).prev().show();
        
        var currentSpoiler = $(parent).children('#bbcode_spoiler_content').children('#bbcode_inside_spoiler');
        currentSpoiler.hide();
    });
    
    $('.show-all').click(function(){
        sContent.show();  
        $('.show-all').hide();
        $('.show-spoiler').hide();
        $('.hide-spoiler').show();
        $('.hide-all').show();
    });
    
    $('.hide-all').click(function(){
        sContent.hide();
        $('.hide-all').hide();
        $('.hide-spoiler').hide();
        $('.show-spoiler').show();
        $('.show-all').show();
    });
    /*===========================================
      FUNCTION DECLARATION
    *\===========================================*/
    function toggle_spoiler(){
        sContent.toggle();
        $('.hide-all').toggle();
        $('.show-all').toggle();
        $('.hide-spoiler').toggle();
        $('.show-spoiler').toggle();
    }
    //get thread ID
    function getTID(a){
        var ID = new String(a);
        a = ID.split("/");
        var tID = a[2];
        return tID;
    }
    //get excluded location
    function getExclude(){
        var excluded = [
            'pm',
            'visitormessage',
            'reputation',
            'subscribe'
            ];
        var status = null;
        for (var i = 0; i < excluded.length; i++){
            if (window.location.href.indexOf('/' + excluded[i] + '/' )> -1) status = true;
        }
        if (status == true) return status;
        else return false;
    }
    //Snippet code by Idx
    function clog(x){
        if(!Settings.__DEBUG__) return;
        console && console.log && console.log(x);
    }
    
    /* Hotkey */
    window.addEventListener('keydown', function(e) {
    var keyCode = e.keyCode;
    var CSA = [e.ctrlKey, e.shiftKey, e.altKey];
    //console.log(keyCode);
    //console.log(String(CSA) + '; '+keyCode);
    
    // caseof : Shift+X
    if( e.shiftKey && keyCode == 88 ){
        toggle_spoiler()
    }
}, true);
}});