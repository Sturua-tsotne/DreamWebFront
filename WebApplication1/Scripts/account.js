$(document).ready(function () {

	$(document).keypress(function (e) {
		if (e.which === 13) {
			$('#submit').trigger("click")
			$('#login').trigger("click")
			$('#sendmail').trigger("click")
			$('#change').trigger("click")
		}
	});
	function change() {
		window.location.href = '/Account/Registered';
	}
	function goToProfile() {
		window.location.href = '/User/Dreams';
	}


	//რეგისტრაცია
	$('#submit').click(function () {

		var username = $('input[name=UserName]').val();
		var email = $('input[name=Email]').val();
		var password = $('input[name=Password]').val();
		var confirmPassword = $('input[name=ConfirmPassword').val();

		var atpos = email.indexOf('@');
		var dotpos = email.lastIndexOf(".");

		if ($.trim($('input[name=UserName]').val()) === '' || $.trim($('input[name=Email]').val()) === '' || $.trim($('input[name=Password]').val()) === '' || $.trim($('input[name=ConfirmPassword').val()) === '') {
			$('#RegistrationMess').html('');
			$('#RegistrationMess').html('შეავსე ყველა ველი');

		}
		else if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= email.length) {
			$('#RegistrationMess').html('');
			$('#RegistrationMess').html('ელ.ფოსტა არასწორია, გთხოვთ შეიყვანოთ სწორად');
			email = $('input[name=Email]').val('');
		}
		else if (password.length < 6) {
			$('#RegistrationMess').html('');
			$('#RegistrationMess').html('პაროლი უნდა შეიცავდეს მინიმუმ 6 სიმბოლოს');
			password = $('input[name=Password]').val('');
			confirmPassword = $('input[name=ConfirmPassword').val('');
		}
		else if (password !== confirmPassword) {
			$('#RegistrationMess').html('');
			$('#RegistrationMess').html('პაროლები არ ემთხვევა ერთმანეთს');
			password = $('input[name=Password]').val('');
			confirmPassword = $('input[name=ConfirmPassword').val('');
		}
		else {
			$.ajax({
				url: '/Account/Registration',
				method: 'POST',
				data: { 'UserName': username, 'Email': email, 'Password': password, 'ConfirmPassword': confirmPassword, 'isFbUser': false },
				success: function (response) {
					if (response === 1) {
						$('#RegistrationMess').html('');
						$('#RegistrationMess').html('შეავსე ყველა ველი');
					}
					else if (response === 2) {
						$('#RegistrationMess').html('');
						$('#RegistrationMess').html('პაროლი უნდა შეიცავდეს მინიმუმ 6 სიმბოლოს');
						password = $('input[name=Password]').val('');
						confirmPassword = $('input[name=ConfirmPassword').val('');
					}
					else if (response === 3) {
						$('#RegistrationMess').html('');
						$('#RegistrationMess').html('პაროლები არ ემთხვევა ერთმანეთს');
						password = $('input[name=Password]').val('');
						confirmPassword = $('input[name=ConfirmPassword').val('');
					}
					else if (response === 4) {
						$('#RegistrationMess').html('');
						$('#RegistrationMess').html('ელ.ფოსტა არასწორია, გთხოვთ შეიყვანოთ სწორად');
						email = $('input[name=Email]').val('');
					}
					else if (response === 5) {
						$('#RegistrationMess').html('');
						$('#RegistrationMess').html('მომხმარებელი ასეთი ელ.ფოსტით უკვე რეგისტრირებულია');
						email = $('input[name=Email]').val('');
					}
					else if (response === 6) {
						$('#RegistrationMess').html('');
						$('#RegistrationMess').html('მომხმარებლის სახელი დაკავებულია');
						email = $('input[name=UserName]').val('');
					}
					else {
						$('#RegistrationMess').html('');
						$('#RegistrationMess').html('თქვენ წარმატებით დარეგისტრირდით');
						setTimeout(change, 5000);
					}
				}
			});
		}
	});
	//ავტორიზაცია
	$('#login').click(function () {

		var email = $('#email').val();
		var password = $('#password').val();

		if ($.trim($('#email').val()) === '' || $.trim($('#password').val()) === '') {
			$('#LoginMess').html('');
			$('#LoginMess').html('შეავსე ორივე ველი');
		}
		else {
			$.ajax({
				url: '/Account/SignIn',
				method: 'POST',
				data: { 'Email': email, 'Password': password },
				success: function (response) {
					if (response === 1) {
						$('#LoginMess').html('');
						$('#LoginMess').html('შეავსე ორივე ველი');
					}
					else if (response === 2) {
						$('#LoginMess').html('');
						$('#LoginMess').html('ელ.ფოსტა ან პაროლი არასწორია');
						email = $('#email').val('');
						password = $('#password').val('');
					}
					else {
						window.location.href = '/User/Dreams';
					}
				}
			});
		}
	});
	////პაროლის აღდგენა(მეილის გაგზანა)
	$('#sendmail').click(function () {
		var email = $('#ForgotEmail').val();
		if ($.trim($('#ForgotEmail').val()) === '') {
			$('#ForgotMess').html('');
			$('#ForgotMess').html('შეიყვანეთ ელ.ფოსტა');
		}
		else {
			$.ajax({
				url: '/Account/Forgot',
				method: 'POST',
				data: { 'Email': email },
				success: function (response) {
					if (response === 1) {
						$('#ForgotMess').html('');
						$('#ForgotMess').html('მომხმარებელი ასეთი ელ.ფოსტით არ არსებობს');
						email = $('#ForgotEmail').val('');
					}
					else {
						$('#ForgotMess').html('');
						$('#ForgotMess').html('თქვენს ელ.ფოსტაზე გამოიგზავნა პაროლის აღსადგენი ბმული');
					}
				}
			});
		}
	});
	//პაროლის აღდგენა(პაროლის შეცვლა)
	$('#change').click(function () {
		var newpass = $('#NewPass').val();
		var confnewpass = $('#ConfNewPass').val();
		if ($.trim($('#NewPass').val()) === '' || $.trim($('#ConfNewPass').val()) === '') {
			$('#RecoveryMess').html('');
			$('#RecoveryMess').html('შეავსე ორივე ველი');
		}
		else if (newpass.length < 6) {
			$('#RecoveryMess').html('');
			$('#RecoveryMess').html('პაროლი უნდა შეიცავდეს მინიმუმ 6 სიმბოლოს');
			newpass = $('#NewPass').val('');
			confnewpass = $('#ConfNewPass').val('');
		}
		else if (newpass !== confnewpass) {
			$('#RecoveryMess').html('');
			$('#RecoveryMess').html('პაროლები არ ემთხვევა ერთმანეთს');
			newpass = $('#NewPass').val('');
			confnewpass = $('#ConfNewPass').val('');
		}
		else {
			$.ajax({
				url: '/Account/Recovery',
				method: 'POST',
				data: { 'NewPassword': newpass, 'ConfirmNewPassword': confnewpass },
				success: function (response) {
					if (response === 1) {
						$('#RecoveryMess').html('');
						$('#RecoveryMess').html('შეავსე ორივე ველი');
					}
					else if (response === 2) {
						$('#RecoveryMess').html('');
						$('#RecoveryMess').html('პაროლი უნდა შეიცავდეს მინიმუმ 6 სიმბოლოს');
						newpass = $('#NewPass').val('');
						confnewpass = $('#ConfNewPass').val('');
					}
					else if (response === 3) {
						$('#RecoveryMess').html('');
						$('#RecoveryMess').html('პაროლები არ ემთხვევა ერთმანეთს');
						newpass = $('#NewPass').val('');
						confnewpass = $('#ConfNewPass').val('');
					}
					else {
						window.location.href = '/Account/SignIn';
					}
				}
			});
		}
	});
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
