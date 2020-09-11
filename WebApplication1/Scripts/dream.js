$(document).ready(function () {

	function goToProfile() {
		window.location.href = '/User/Dreams';
	}


    $("#category_select").click(function () {
        $("#mapforadd").addClass('hide');
        $("#category_tags").toggleClass('hide ');
        var categ = $('.opacity');
        if (categ.css('opacity') === '0.1') {
            categ.css({
                'opacity': '1',
            });
        }
        else //We know the opacity is not 0.1 lets make it 0.1
        {
            categ.css({
                'opacity': '0.1',
            });
        }
    });

   

    $("#addmap").click(function () {
        $("#mapforadd").toggleClass('hide');
    });

	$('img').click(function () {
		if (!$(this).hasClass("search_img") && !$(this).hasClass("search_cat_img")) {
			$(this).toggleClass('active');
		}
	});
    $("#category_close").click(function () {
        $('.opacity').animate({ opacity: 1 });
        $("#category_tags").addClass('hide');
    });
    $("#addmap_close").click(function () {
        $("#mapforadd").addClass('hide');
    });

    $("#mapForDetailsBtn").click(function () {
        $("#mapForDetails").toggleClass('hide');
    });

    $("#details_map_close_btn").click(function () {
        $("#mapForDetails").addClass('hide');
    });

    $(window).click(function (event) {
        //if (event.target.id != "addmap") {
        //        $('#mapforadd').addClass('hide');
        //}
        //if (event.target.id != "mapForDetailsBtn") {
        //    $("#mapForDetails").addClass('hide');
        //}
        $('.opacity').animate({ opacity: 1 });
        $("#category_tags").addClass('hide');
    });
	$('img').click(function (event) {
		if (!$(this).hasClass("search_img") && !$(this).hasClass("search_cat_img")) {
			event.stopPropagation();
		}
	});
    $('.close_btn').click(function (event) {
        event.stopPropagation();
    });
    $('#category_select').click(function (event) {
        event.stopPropagation();
    });

    $("#editmap").click(function () {
        $("#mapforedit").toggleClass('hide');
    });

    $("#editmap_close").click(function () {
        $("#mapforedit").addClass('hide');
    });

   
    $(".userMapsBtn").click(function () {
        $("#mapForUserDreams").toggleClass('hide');
    });

    $("#user_map_close_btn").click(function () {
        $("#mapForUserDreams").addClass('hide');
    });

    $('#adddreams').click(function () {
        var isPublic;
        if (document.getElementById("sector").checked === true) {
            isPublic = true;
        }
        else if (document.getElementById("sector").checked === false) {
            isPublic = false;
        }
        var lang = $("#lang option:selected").val();
        var lat = pos.lat;
        var lng = pos.lng;
        var title = $.trim($('#title').val());
        var description = CKEDITOR.instances.description.getData();
        var date = $('#date').val();
        var tags = [];
        var arr = $('.tag > a');
        for (var i = 0; i < arr.length; i++) {        
            tags.push( $(arr[i]).html());
        }
       
        var categoriesId = [];
        var cats = $('.category > img');
        for (var i = 0; i < cats.length; i++) {
            if ($(cats[i]).hasClass('active')) {
                var cat_Id = $(cats[i]).siblings().children('.cat-Id').html();
                categoriesId.push(cat_Id);
            }
        }
   

        if ($.trim($('#title').val()) === '') {
            $('#dreammess').html('');
            $('#dreammess').html('მიუთითეთ სიზმირს დასახელება');
        }
        else if (description.trim() === '') {
            $('#dreammess').html('');
            $('#dreammess').html('დაამატეთ სიზმრის აღწერა');
        }
        else if ($.trim($('#date').val()) === '') {
            $('#dreammess').html('');
            $('#dreammess').html('მიუთითეთ სიზმრის თარიღი');
        }
        else if (tags.length === 0) {
            $('#dreammess').html('');
            $('#dreammess').html('დაამატეთ ჰეშთეგი');
        }
        else if (categoriesId.length === 0) {
            $('#dreammess').html('');
            $('#dreammess').html('აირჩიეთ კატეგორია');
        }
        else {
            $.ajax({
                url:'/Dreams/AddDreams',
                method: 'POST',
                data: { 'Title': title, 'Description': description, 'Long': lng, 'Lat': lat, 'Lang': lang, 'isPublic': isPublic, 'CreateDate': date, 'Categories': categoriesId, 'Tags': tags },
                success: function (response) {
                    if (response == true) {
                        $('#dreammess').html('');
                        $('#dreammess').html('სიზმარი წარმატებით დაემატა');
                        setTimeout(goToProfile, 5000);
                    }
                    else {
                        $('#dreammess').html('');
                        for (var ind in response) {
                            if (response[ind].length != 0)
                            {
                                $('#dreammess').append('<br>'+ response[ind][0]);
                            }
                        }
                    }
                }
            });
        }
    });

    $('#editdreams').click(function () {
        var isPublic;
        if (document.getElementById("sectorForEdit").checked === true) {
            isPublic = true;
        }
        else if (document.getElementById("sectorForEdit").checked === false) {
            isPublic = false;
        }
        var id = $(this).attr('data-id');
        var lang = $("#langForEdit option:selected").val();
        var lat = pos.lat;
        var lng = pos.lng;
        var title = $.trim($('#titleForEdit').val());
        var description = CKEDITOR.instances.descriptionForEdit.getData();
        var date = $('#dateForEdit').val();
        var tags = [];
        var arr = $('.tag > a');
        for (var i = 0; i < arr.length; i++) {
            tags.push($(arr[i]).html());
        }

        var categoriesId = [];
        var cats = $('.category > img');
        for (var i = 0; i < cats.length; i++) {
            if ($(cats[i]).hasClass('active')) {
                var cat_Id = $(cats[i]).siblings().children('.cat-Id').html();
                categoriesId.push(cat_Id);
            }
        }

        if ($.trim($('#titleForEdit').val()) === '') {
            $('#editdreammess').html('');
            $('#editdreammess').html('მიუთითეთ სიზმირს დასახელება');
        }
        else if (description.trim() === '') {
            $('#editdreammess').html('');
            $('#editdreammess').html('დაამატეთ სიზმრის აღწერა');
        }
        else if ($.trim($('#dateForEdit').val()) === '') {
            $('#editdreammess').html('');
            $('#editdreammess').html('მიუთითეთ სიზმრის თარიღი');
        }
        else if (tags.length === 0) {
            $('#editdreammess').html('');
            $('#editdreammess').html('დაამატეთ ჰეშთეგი');
        }
        else if (categoriesId.length === 0) {
            $('#editdreammess').html('');
            $('#editdreammess').html('აირჩიეთ კატეგორია');
        }
        else {
            $.ajax({
                url: '/Dreams/Edit',
                method: 'POST',
                data: { 'Id': id, 'Title': title, 'Description': description, 'Long': lng, 'Lat': lat, 'isPublic': isPublic, 'Lang': lang, 'CreateDate': date, 'Categories': categoriesId, 'Tags': tags },
                success: function (response) {
                    if (response == true) {
                        $('#editdreammess').html('');
                        $('#editdreammess').html('სიზმარი წარმატებით შეიცვალა');
                        setTimeout(goToProfile, 5000);
                    }
                    else {
                        $('#editdreammess').html('');
                        for (var ind in response) {
                            if (response[ind].length != 0) {
                                $('#editdreammess').append('<br>' + response[ind][0]);
                            }
                        }
                    }
                }

            });
        }
    });

});




//add hashtags
function myFunction(t, e) {
    if (e.keyCode === 13 || e.keyCode === 32) {
        if (t.value !== 0 && t.value.trim()!=="") {
            var x = document.createElement('div');
            x.setAttribute('class', 'tag');
            var z = document.createElement('div');
            z.setAttribute('class', 'close');
            var y = document.createElement('a');
            z.innerHTML = "x";
            y.setAttribute('href', "#");
            y.setAttribute('id', "link_tag");
            y.innerHTML = "#" + t.value.trim();
            x.appendChild(y);
            x.appendChild(z);
            document.getElementById("myList").appendChild(x);
            t.value = t.defaultValue;
            $(z).click(function () {
                $(x).remove();
            });

        }
    }
};







