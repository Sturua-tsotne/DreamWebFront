$(document).ready(function () {

	$('#search').click(function () {
		var categories = [];
		var tags = [];
		var langs = [];
		var texts = [];
		var startDate = (start.innerText.trim()!='')?start.innerText.split(':')[1].trim():"";
		var endDate = (end.innerText.trim() != '')?end.innerText.split(':')[1].trim():"";

		var html_cats = $(".category_search");
		for (var i = 0; i < html_cats.length; i++)
		{
			categories.push(html_cats[i].tabIndex);
		}


		var html_tags = $(".tags_search");
		for (var i = 0; i < html_tags.length; i++) {
			tags.push(html_tags[i].innerText);
		}

		var html_langs = $(".lang_search");
		for (var i = 0; i < html_langs.length; i++) {
			langs.push($(html_langs[i]).data("langId"));
		}


		var html_texts = $(".texts_search");
		for (var i = 0; i < html_texts.length; i++) {
			var subtexts = html_texts[i].innerText.trim().split(' ');
			for (var j = 0; j < subtexts.length; j++) {
				texts.push(subtexts[j]);
			}
		}



		$.ajax({
			method: "Get",
			url: "/Dreams/FilterDreamsData",
			traditional: true,
			data: {
				langs: langs,
				texts: texts,
				categories: categories,
				tags: tags,
				startDate: startDate,
				endDate: endDate
			},
			success: function (data) {
				$("#DreamsData").html(data);
				
			}
		});

		

	});	
});









		var clear_all = document.getElementById('clear_all');
		var once = document.getElementById('once');
		
		var once_lang = document.getElementById('lang');
		var search_l = document.querySelector('.search_box label');
		var search_container = document.querySelector('.search_container');


		// date container
		var date_container = document.querySelector('.date_container');

		// icons container
		var icons_container = document.querySelector('.icons_container');
		// icon button
		var icon = document.getElementById('icon_search');
		// icon input
		var icon_input = document.getElementById('icon');

		// tags container
		var tags_container = document.querySelector('.tags_container');
		// tag button
		var tag = document.getElementById('icon_tag');
		// tag input
		var tag_input = document.getElementById('tag');

		// lang container
		var lang_container = document.querySelector('.language_container');
		// lang button
		var lang = document.getElementById('searh_lang');
		// lang input
		var lang_input = document.getElementById('lang_i');

		var date = document.getElementById('date');
		var date_input = document.getElementById('date_i');

		//  menu_container
		var menu_container = document.querySelector('.menu_container');

		var start = document.getElementById('d_start');
		var end = document.getElementById('d_end');


		// inputs DOM events
		clear_all.addEventListener('click', function () {

			icons_container.innerHTML = "";
			lang_container.innerHTML = "";
			tags_container.innerHTML = "";
			search_container.innerHTML = "";
			d_start.innerHTML = "";
			d_end.innerHTML = "";

			is_empty();

			for (let i = 0; i < once.childNodes.length - 1; i++) {

				var del_once = document.querySelectorAll('#once li');
				if (del_once[i].childNodes[0].classList.length === 2) {

					if (del_once[i].children[0].classList[1] === "active") {

						del_once[i].children[0].classList.remove("active")

					}
				}

			}
			for (let i = 0; i < once_lang.childNodes.length - 1; i++) {

				var lang_once = document.querySelectorAll('#lang li');
				if (lang_once[i].childNodes[0].classList.length === 3) {

					if (lang_once[i].children[0].classList[2] === "act") {

						lang_once[i].children[0].classList.remove("act")

					}
				}

			}

		})

		icon.addEventListener('click', open_icon);
		date.addEventListener('click', open_date);
		tag.addEventListener('click', open_tag);
		lang.addEventListener('click', open_lang);
	

		
		 //icons active
		for (let i = 0; i < once.children.length; i++) {

			var category = document.querySelectorAll('#once li');
			category[i].children[0].addEventListener('click', init);

		}

		// lang active
		for (let i = 0; i < once_lang.children.length; i++) {
			var lang_cat = document.querySelectorAll('#lang li');

			lang_cat[i].children[0].addEventListener('click', lang_init);
		}


		// ========== Calendar 1 ===========
		$(function () {
			$("#datepicker").datepicker({
				firstDay: 1,
				dateFormat: "yy/mm/dd",

				onSelect: function (time) {
					
					
					var currentDate = new Date();
					var dateStr = currentDate.toISOString().split('T')[0].replace(/-/g, '');
					
					var changedTime = time.replace(/\//g, '');

					if (parseInt(changedTime) > parseInt(dateStr)) {
						time = currentDate.toISOString().split('T')[0].replace(/-/g, '/');
					}

					d_start.innerHTML = '<div class="category_wrap" id="start">Start: <div>' + time + '</div><img src="/Content/images/dream-cards/x.png" class="deleteTag del_more" /></div>'

					var startText = (start.innerText.trim() != "") ? start.innerText.split(':')[1].trim().replace(/\//g, '') : "";
					var endText = (end.innerText.trim() != "") ? end.innerText.split(':')[1].trim().replace(/\//g, '') : "";
			
					if (parseInt(startText) > parseInt(endText)) {
					
						end.innerHTML = start.innerHTML;
						end.innerHTML=end.innerHTML.replace("Start", "End");
					}

					if (d_end.innerHTML != "") {
						$("#date_i").slideUp();
						date.className = "";
					}

					delete_events();
					$(".menu_container").slideDown();


				}

			});
		});

		// ========== Calendar 2 ===========
		$(function () {
			$("#datepicker2").datepicker({
				firstDay: 1,
				dateFormat: "yy/mm/dd",

				onSelect: function (time) {

					
					var currentDate = new Date();
					var dateStr = currentDate.toISOString().split('T')[0].replace(/-/g, '');

					var changedTime = time.replace(/\//g, '');

					if (parseInt(changedTime) > parseInt(dateStr)) {
						endText = dateStr;
						time = currentDate.toISOString().split('T')[0].replace(/-/g, '/');
					}
					d_end.innerHTML = '<div class="category_wrap" id="end">End: <div>' + time + '</div><img src="/Content/images/dream-cards/x.png" class="deleteTag del_more" /></div>'

					var startText = (start.innerText.trim() != "") ? start.innerText.split(':')[1].trim().replace(/\//g, '') : "";
					var endText = (end.innerText.trim() != "") ? end.innerText.split(':')[1].trim().replace(/\//g, '') : "";

					if (parseInt(startText) > parseInt(endText)) {
						start.innerHTML = end.innerHTML;
						start.innerHTML=start.innerHTML.replace("End", "Start");
					}

					if (d_start.innerHTML != "") {
						$("#date_i").slideUp();
						date.className = "";
					}
					delete_events();
					$(".menu_container").slideDown();

				}

			});
		});

		// ========== End Calendar ===========






		//tags button click function
		$('.input_tag').keypress(function (e) {
			if (e.which === 13 || e.which === 32) {
				this.value = this.value.trim();
				if (this.value != "") {

					$("#tag").slideUp();
					$(".menu_container").slideDown();
					tag.className = "";

					tags_container.innerHTML += '<div class="category_wrap tags_search">#' + tag_input.children[0].value.replace(/</g, "&lt;") + '<img src="/Content/images/dream-cards/x.png" class="deleteTag del_more" /></div>';

					tag_input.children[0].value = "";

					delete_events();
				}
			}
		});

		$('#tag_search').keypress(function (e) {
			if (e.which === 32 && this.value == " ") {
				this.value = "";
			} else if (e.which === 13) {
				if (this.value != "" && this.value != " ") {

					search_container.innerHTML += '<div class="category_wrap texts_search">' + this.value.replace(/</g, "&lt;") + '<img src="/Content/images/dream-cards/x.png" class="deleteTag del_more" /></div>'
					this.value = "";
					$(".menu_container").slideDown();
					delete_events();


				}
			}
		})

		function open_icon() {
			if (this.className != "active") {
				this.className = "active";
				if (tag_input.style.display == "block" || lang_input.style.display == "block" || date_input.style.display == "flex") {
					tag_input.style.display = "none";
					lang_input.style.display = "none";
					date_input.style.display = "none";
					tag.className = "";
					lang.className = "";
					date.className = "";

					$("#icon").slideDown();
					icon_input.style.display = "block";

				} else {

					$("#icon").slideDown();
					icon_input.style.display = "block";


				}
			} else {

				this.className = "";
				$("#icon").slideUp();

			}
		}

		function open_date() {
			if (this.className != "active") {
				this.className = "active";
				if (tag_input.style.display == "block" || lang_input.style.display == "block" || icon_input.style.display == "block") {
					tag_input.style.display = "none";
					lang_input.style.display = "none";
					icon_input.style.display = "none";
					tag.className = "";
					lang.className = "";
					icon.className = "";

					$("#date_i").slideDown();
					date_input.style.display = "flex";

				} else {

					$("#date_i").slideDown();
					date_input.style.display = "flex";


				}
			} else {

				this.className = "";
				$("#date_i").slideUp();

			}
		}

		function open_tag() {
			if (this.className != "active") {

				this.className = "active";
				if (icon_input.style.display == "block" || lang_input.style.display == "block" || date_input.style.display == "flex") {
					icon_input.style.display = "none";
					lang_input.style.display = "none";
					date_input.style.display = "none";
					date.className = "";
					icon.className = "";
					lang.className = "";

					$("#tag").slideDown();
					tag_input.style.display = "block";

				} else {

					$("#tag").slideDown();
					tag_input.style.display = "block";
				}

			} else {

				this.className = "";
				$("#tag").slideUp();

			}
		}

		function open_lang() {

			if (this.className != "active") {

				this.className = "active";

				if (tag_input.style.display == "block" || icon_input.style.display == "block" || date_input.style.display == "flex") {

					tag_input.style.display = "none";
					icon_input.style.display = "none";
					date_input.style.display = "none";
					icon.className = "";
					tag.className = "";
					date.className = "";

					$("#lang_i").slideDown();
					lang_input.style.display = "block";

				} else {

					$("#lang_i").slideDown();
					lang_input.style.display = "block";
				}
			} else {

				this.className = "";
				$("#lang_i").slideUp();

			}
		}

		function init() {
			
			if (!$(this.parentNode.childNodes[1]).hasClass("active")) {

				this.parentNode.childNodes[1].className += " active";
				$(".menu_container").slideDown(); 
				$("#icon").slideUp();
				icon.className = "";
				icons_container.innerHTML += '<div class="category_wrap category_search" tabindex="' + this.parentNode.tabIndex + '">' + this.nextSibling.nextSibling.innerText + '<img src="/Content/images/dream-cards/x.png" class="deleteTag del_icon" /></div>';

				let del_more = document.querySelectorAll('.del_icon');

				for (let i = 0; i < del_more.length; i++) {

					del_more[i].addEventListener('click', delete_icon);

				}
			}
		}

		function lang_init() {
			if (this.classList[2] != "act") {

				this.className += " act";
				$(".menu_container").slideDown();
				$("#lang_i").slideUp();
				lang.className = "";
				
				lang_container.innerHTML += '<div class="category_wrap lang_search" data-lang-id="' + this.parentNode.childNodes[3].innerText+'">' + this.innerText + '<img src="/Content/images/dream-cards/x.png" class="deleteTag del_lang" /></div>';
				let del_more = document.querySelectorAll('.del_lang');

				for (let i = 0; i < del_more.length; i++) {
					del_more[i].addEventListener('click', delete_lang);
				}
			}
		}

		function delete_lang() {
			this.parentNode.parentNode.removeChild(this.parentNode);

			var lang_li = document.querySelectorAll('#lang li');
	
			for (var i = 0; i < lang_li.length; i++)
			{
				
				if (lang_li[i].childNodes[3].innerText == $(this.parentNode).data("langId"))
				{
					lang_li[i].childNodes[1].classList.remove("act");
				}
			}

			is_empty();
		}

		function delete_icon() {
			
			this.parentNode.parentNode.removeChild(this.parentNode);

			var oncest = document.querySelectorAll('#once li');
			
			for (var i = 0; i < oncest.length; i++)
			{
				if (oncest[i].tabIndex == this.parentNode.tabIndex)
				{
					
					oncest[i].children[0].classList.remove("active");
					break;
				}
			}

			is_empty();

		}


		function delete_more() {
			this.parentNode.parentNode.removeChild(this.parentNode);
			is_empty();
		}

		function delete_events() {

			let del_more = document.querySelectorAll('.del_more');

			for (let i = 0; i < del_more.length; i++) {

				del_more[i].addEventListener('click', delete_more);

			}

		}

		function is_empty() {

			if (start.innerHTML === "" &&
				end.innerHTML === "" &&
				icons_container.innerHTML === "" &&
				lang_container.innerHTML === "" &&
				tags_container.innerHTML === "" &&
				search_container.innerHTML === "") {

				menu_container.style.display = "none";

			}
		}



		var transform = 0;

		function slideRight() {

			if (transform < once.scrollWidth - once.clientWidth) {

				transform += 90;
				once.style.transform = "translateX(-" + transform + "px)";
			} else {
				transform = 0;
			}

		}

		function slideLeft() {
			if (transform > 0) {

				transform -= 90;
				once.style.transform = "translateX(-" + transform + "px)";
			} else {

				transform = once.scrollWidth - once.clientWidth;

			}

		}


		var transform2 = 0;

		function onRight2() {

			if (transform2 < once_lang.scrollWidth - once_lang.clientWidth) {

				transform2 += 90;
				once_lang.style.transform = "translateX(-" + transform2 + "px)";

			} else {
				transform2 = 0;

			}

		}

		function onLeft2() {

			if (transform2 > 0) {

				transform2 -= 90;
				once_lang.style.transform = "translateX(-" + transform2 + "px)";

			} else {
				transform2 = once_lang.scrollWidth - once_lang.clientWidth;
			}
		}