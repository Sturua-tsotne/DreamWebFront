﻿$(document).ready(function () {

	$(".hiddenMDB").hide();

	$('.mdb').mouseenter(function () {
		$(this).addClass("dreamDivHover");
		$(this).addClass("active");
		$(this).removeClass("category_icon");
		$(this).find(".activeMDB").hide();
		$(this).find(".hiddenMDB").show();
	})

	$('.mdb').mouseleave(function () {
		$(this).removeClass("dreamDivHover");
		$(this).removeClass("active");
		$(this).addClass("category_icon");
		$(this).find(".hiddenMDB").hide();
		$(this).find(".activeMDB").show();
	})

});

// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
	console.log('statusChangeCallback');
	console.log(response);
	// The response object is returned with a status field that lets the
	// app know the current login status of the person.
	// Full docs on the response object can be found in the documentation
	// for FB.getLoginStatus().
	if (response.status === 'connected') {
		// Logged into your app and Facebook.
		testAPI();
	}
}

// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
function checkLoginState() {
	FB.getLoginStatus(function (response) {
		statusChangeCallback(response);
	});
}

window.fbAsyncInit = function () {
	FB.init({
		appId: '809114055940664',
		cookie: true,  // enable cookies to allow the server to access 
		// the session
		xfbml: true,  // parse social plugins on this page
		version: 'v2.8' // use graph api version 2.8
	});

	// Now that we've initialized the JavaScript SDK, we call 
	// FB.getLoginStatus().  This function gets the state of the
	// person visiting this page and can return one of three states to
	// the callback you provide.  They can be:
	//
	// 1. Logged into your app ('connected')
	// 2. Logged into Facebook, but not your app ('not_authorized')
	// 3. Not logged into Facebook and can't tell if they are logged into
	//    your app or not.
	//
	// These three cases are handled in the callback function.

	FB.getLoginStatus(function (response) {
		statusChangeCallback(response);
	});

};

// Load the SDK asynchronously
(function (d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) return;
	js = d.createElement(s); js.id = id;
	js.src = "https://connect.facebook.net/en_US/sdk.js";
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

//(function (d, s, id) {
//    var js, fjs = d.getElementsByTagName(s)[0];
//    if (d.getElementById(id)) return;
//    js = d.createElement(s); js.id = id;
//    js.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.12&appId=809114055940664';
//    fjs.parentNode.insertBefore(js, fjs);
//}(document, 'script', 'facebook-jssdk'));

//Here we run a very simple test of the Graph API after login is
//successful.  See statusChangeCallback() for when this call is made.
function testAPI() {
	console.log('Welcome!  Fetching your information.... ');
	FB.api('/me?fields=name,email', function (response) {
		console.log('Successful login for: ' + response.name);
		document.getElementById('status').innerHTML =
			'Thanks for logging in, ' + response.name + '!';
		document.getElementById('status').style.color = "red";


		$.ajax({
			url: '/Account/Registration',
			method: 'POST',
			data: { 'Email': response.email, 'Username': response.name, 'IsFbUser': true },
			success: function (response) {
				//window.location.href = '/Home/Index';
				// window.location.href = '/Account/UserProfile';
				window.location.href = '/User/Dreams';
			}
		});
	});
}

function Logout() {
	FB.getLoginStatus(function (response) {
		if (response && response.status === 'connected') {
			FB.logout(function (response) {
				window.location.href = '/Account/Logout';
			});
		}
		else {
			window.location.href = '/Account/Logout';
		}
	});
}