// ==UserScript==
// @name            Kaskus TS Tagger
// @namespace       zackad's script
// @version         0.7.2
// @description     Give TS kaskus a Tag
// @grant           GM_addStyle
// @include         https://m.kaskus.co.id/*
// @include         https://fjb.m.kaskus.co.id/*
// @include         /^https?://(www|fjb).kaskus.co.id/(thread|lastpost|post|show_post|product|group/discussion)/*/
// @require         http://code.jquery.com/jquery-1.10.1.min.js
// @copyright       2015-2017, zackad
// ==/UserScript==
/*
    CHANGELOG
        v0.7.2
        - patch include url
        - patch ajax url
        - copyright update
        - cleanup
        v0.7.1
        - cleanup
        v0.7
        - change version number to trigger auto-update
        v0.6
        - put into css instead of inline text
        v0.5
        - [bug] image not load
        v0.4
        - fjb support
        v0.3
        - tag color [thanks : ahmad13]
*/
$(document).ready(function(){
    var DEBUG = 0;
    var tID = $('#thread_id');
    tID = tID.attr('value');

    // style edit sesuai selera
    var globalStyle = ''
        +'<style type="text/css">'
        +'.thread-starter {background-color:black; color:white!important; border: sandybrown !important;}'
        +'.thread-starter .fn, .thread-starter .permalink {color:white!important}'
        +'.thread-starter-desk {border:1px solid sandybrown!important;}'
        +'.thread-starter-desk .entry-head {background-color:darkorange!important;}'
        +'.thread-starter-desk .entry-body {border-left:1px solid sandybrown!important;}'
        +'.thread-starter-desk .entry-footer {border-top:1px solid sandybrown;}'
        +'.ts:after{content: "[TS]"}'
        +'</style>'
        ;
    // silahkan edit sesuka ente
    var mTS = '<span style="color:darkorange; font-weight:bold;" class="ts"></span>';
    var dTS = '<span><b style="color:#F5981D;">Thread</b><b style="color:#1998ed;"> Starter</b></span>';
    var juragan = '<span><b style="color:#1998ed;">Juragan</b></span>';
    var tsContainer = ''
        +'<div id="ts" class="ts" style="display:none;"></div>'
        ;
    $('body').prepend(tsContainer);
    $('head').append(globalStyle);
    var host = window.location.host;
    var ajaxURL;
    if (isFJB()) {
        ajaxURL = 'https://'+host+'/product/'+ tID;
    } else {
        ajaxURL = 'https://'+host+'/thread/'+ tID;
    }

    // let's call the ajax
    if(window.location.href.indexOf('m.kaskus.co.id') > -1){
        $.ajax({
            url: ajaxURL,
            dataType: 'html',
            success: function(response){
                $('.ts').html(jQuery(response).find('.usr .fn').html());
                var a = $('.ts').text();
                clog('ts =' + a);
                var poster = $('.author .fn');
                poster.each(function(){
                    var parent = $(this).parent().parent().parent();
                    var user = $(this);
                    if ($(this).text() == a) {
                        $(parent).addClass('thread-starter');
                        $(user).after(mTS);
                    }
                });
                if (poster == a) {
                    $('.author').addClass('thread-starter');
                }
            }
        });
    }
    // desktop version
    $.ajax({
        url: ajaxURL,
        dataType: 'html',
        success: function(response){
            if (isFJB()) {
                $('.ts').html(jQuery(response).find('.seller-info .seller-detail-info .username a').html());
            } else {
                $('.ts').html(jQuery(response).find('.postlist .author .user-details .nickname').html());
            }
            var a = $('.ts').text();
            clog('ts desktop ='+ a);
            var poster = $('.postlist .author .user-details .nickname');
            poster.each(function() {
                var parent = $(this).parent().parent().parent().parent().parent();
                var user = $(this);
                var userDetail = $(this).parent().parent();
                if (user.text() == a) {
                    $(parent).addClass('thread-starter-desk');
                    $(user).append(mTS);
                    clog(userDetail);
                    if (isFJB()) {
                        dTS = juragan;
                    }
                    $(userDetail).children('.user-info').before(dTS);
                }
            });
        }
    });

    function isFJB() {
        if (window.location.host == 'fjb.kaskus.co.id' || window.location.host == 'fjb.m.kaskus.co.id') {
            return true;
        } else {
            return false;
        }
    }

    function clog(x) {
        if (!DEBUG) {
            return;
        }
        console.log(x);
    }
});
