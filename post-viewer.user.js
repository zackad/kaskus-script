// ==UserScript==
// @name			Kaskus User Post Viewer
// @namespace		zackad's script
// @version			0.9
// @description		Read Full Post from Kaskus Profile
// @grant			GM_addStyle
// @include			http://www.kaskus.co.id/profile/viewallposts/*
// @include			http://www.kaskus.co.id/viewallposts/*
// @include			http://www.kaskus.co.id/myforum/mypost
// @include			http://www.kaskus.co.id/myforum/myquotedpost
// @require			http://code.jquery.com/jquery-1.10.1.min.js
// @copyright		2015-2016, zackad
// ==/UserScript==
/*
	CHANGELOG
		v0.9
		- hothey to expand/minimize entry content with SHIFT + Z
		v0.8
		- expand/minimize entry-content
		v0.7
		- add myquotedpost page
		v0.6
		- add mypost page
		v0.5
		- autload image
		v0.4
		- debug mode
		v0.3
		- all post from thread
		V0.2
		- tested with scratchpad
*/
$(document).ready(function(){
	var __DEBUG__ = 1;
	var style = ''
		+ '<style type="text/css">'
		+ '.batas {margin-top: 0px !important; margin-bottom: 0px !important;}'
		+ 'img {max-width: 100% !important; height: auto !important;}'
		+ '.limit {max-height: 100px; overflow-y: hidden;}'
		+ '.expand, .minimize {color: orange;}'
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
				unloadImage = $('img[src="http://s.kaskus.id/banner/1x1.gif"]');
				unloadImage.each(function(){
					var source = $(this).attr('data-src');
					$(this).attr('src', source);
				});
				if(currentItem.height() > 100){
					currentItem.addClass('limit');
					currentItem.find('h4').prepend('<a href="javascript:void(0);" class="expand">Expand - </a>');
				}
			}); 
	});
		
	$('.entry-content').on('click', '.expand', function(){
		$(this).parent().parent().removeClass('limit');
		$(this).removeClass('expand').addClass('minimize');
		$(this).text('Minimize - ');
	});
	
	$('.entry-content').on('click', '.minimize', function(){
		$(this).parent().parent().addClass('limit');
		$(this).addClass('expand').removeClass('minimize');
		$(this).text('Expand - ');
	});
	
	function clog(x){
		if(__DEBUG__ == 0) return;
		console.log(x);
	}
	
	function toggleEntry(){
		if($('.expand').length == 0){
			$('.minimize').click();
		}else{
			$('.expand').click();
		}
	}
	/* Hotkey */
    window.addEventListener('keydown', function(e) {
    var keyCode = e.keyCode;
    var CSA = [e.ctrlKey, e.shiftKey, e.altKey];
    clog(keyCode);
    clog(String(CSA) + '; '+keyCode);
    
    // caseof : Shift+Z
    if( e.shiftKey && keyCode == 90 ){
        toggleEntry();
    }
	}, true);
});