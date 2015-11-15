// ==UserScript==
// @name            Kaskus User Post Viewer
// @namespace       zackad's script
// @version         0.1
// @description     Read Full Post from Kaskus Profile
// @grant           GM_addStyle
// @include         http://www.kaskus.co.id/profile/viewallposts/*
// @require         http://code.jquery.com/jquery-1.10.1.min.js
// @copyright       2015, zackad
// ==/UserScript==

$.ajax('http://www.kaskus.co.id/show_post/56469f8954c07a8d0f8b456b/2765/-')
  .done(function(hasil){
    $('.group-meta').text('');
    var akhir = $(hasil).find('.entry').html();
    $('.group-meta').append(akhir);
  });