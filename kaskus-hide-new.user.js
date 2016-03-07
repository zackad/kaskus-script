// ==UserScript==
// @name        Kaskus Hide New
// @namespace   zackad's script
// @description Hide Unnecessary Notification
// @include     http://www.kaskus.co.id/*
// @version     1.2
// @grant       none
// @author      zackad
// ==/UserScript==
var css = '#after-login > a.notice-new::after,'
+ '.site-header .dropdown-menu .notice-updated::after,'
+ '.site-header .dropdown-menu .notice-new::after,'
+ '.navbar-nav.main-menu li#kk-gadget::after,'
+ '.navbar-nav.main-menu li#kk-news::after{'
+ 'display: none;'
+ '}'
;
var style = document.createElement('style');
var t = document.createTextNode(css);
style.appendChild(t);
document.head.appendChild(style);
(function () {
  var a = document.querySelector('.site-header .dropdown-menu > ul.list-unstyled > li.open');
  var b = a.children;
  a.classList.remove('open');
  b[1].style.display = 'none';
}())
