// ==UserScript==
// @name            Kaskus User Post Viewer
// @namespace       zackad's script
// @version         0.4
// @description     Read Full Post from Kaskus Profile
// @grant           GM_addStyle
// @include         http://www.kaskus.co.id/profile/viewallposts/*
// @include			http://www.kaskus.co.id/viewallposts/*
// @require         http://code.jquery.com/jquery-1.10.1.min.js
// @copyright       2015, zackad
// ==/UserScript==
/*
	CHANGELOG
		v0.4
		- debug mode
		v0.3
		- all post from thread
		V0.2
		- tested with scratchpad
*/
$(document).ready(function(){
	var __DEBUG__ = 0;
	var style = ''
		+ '<style type="text/css">'
		+ '.batas {margin-top: 0px !important; margin-bottom: 0px !important;}'
		+ '</style>'
		;
	$('head').append(style);
	var pItems = $('.entry-content');
	pItems.each(function(){
		var postID = $(this).find('a');
		var currentItem = $(this);
		postID = postID.attr('href');
		postID = postID.replace('post', 'show_post');
		var title = $(this).find('h4');
		clog(title);
		clog(postID);
		var ajaxURL = 'http://www.kaskus.co.id'+postID;
		clog(ajaxURL);
		$.ajax(ajaxURL).
			done(function(response){
				currentItem.text('');
				currentItem.append(title);
				currentItem.text('');
				currentItem.append(title);
				currentItem.append('<hr class="batas">');
				var hasil = $(response).find('.entry').html();
				currentItem.append(hasil);
			}); 
	})
	
	function clog(x){
		if(__DEBUG__ == 0) return;
		console.log(x);
	}
});
