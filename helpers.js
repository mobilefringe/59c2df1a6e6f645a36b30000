function init(e){
    $('<div class="modal-backdrop custom_backdrop"><img src="//kodekloud.s3.amazonaws.com/sites/554a79236e6f64713f000000/69e8cd982124dc73de1f5a67a627ee75/loading.gif" class="" alt=""></div>').appendTo(document.body);
    $('.open_menu').click(function(e){
        e.preventDefault();
        $('body').addClass('no_scroll');
        $('.mobile_menu_container').addClass('active_menu')
    });
    $('#close_menu').click(function(e){
        e.preventDefault();
        $('body').removeClass('no_scroll');
        $('.mobile_menu_container').removeClass('active_menu');
        $('.sub_menu.hidden_now').css('display', "none")
        $('.plus_icon').show();
        $('.minus_icon.menu_icon').hide()
    });
    
    $('.submenu_expander').click(function(e){
		e.preventDefault()
		if ($(this).hasClass('open') == false){
        	$('.open').next().slideToggle();
        	$('.open').find('img').toggle();
        	$('.open').toggleClass('open')
		}
		$(this).next().slideToggle();
		$(this).find('img').toggle();
		$(this).toggleClass('open')
	})
	
	$('html').click(function() {
        $('body').removeClass('no_scroll');
        $('.mobile_menu_container').removeClass('active_menu')
        $('.sub_menu.hidden_now').css('display', "none")
        $('.plus_icon').show()
        $('.minus_icon.menu_icon').hide()
    });
    
    $('.mobile_menu_container, .open_menu').click(function(event){
        event.stopPropagation();
    });
    
    $('#option_selector').change(function(){
        window.location = $(this).val();
    });
    
    //dynamically changing copyright year
    var current_year = moment().year();
    $("#current_year").text(current_year);
}

function getInsidePageBanner() {
    //Set dynamic page banners
    var banner_repo = getRepoDetailsByName("Inside Page Banner");
    if (banner_repo) {
        var banner_image = banner_repo.images[0].image_url;
        if (banner_image) {
            $(".main_banner").css({ "background-image": "url(" + banner_image + ") center center no-repeat" });
        }
    }
}

function show_content(){
    var scrolled = 0;
    $('.yield').fadeIn();
    $(".modal-backdrop").remove();
    var d = new Date();
    var n = d.getDay();
    var today_hours = getTodaysHours();
    renderHomeHours('#home_hours_container', '#home_hours_template', today_hours)
    $.each( getPropertyHours(), function(i,v){
        if(v.is_closed == true){
            var hours_day = new Date(v.holiday_date + "T05:00:00Z")
            if(hours_day.setHours(0, 0, 0, 0) == d.setHours(0, 0, 0, 0)){
                $('.hours_today').text("Closed Today")
            }
        }
        if(v.is_holiday == true){
            var hours_day = new Date(v.holiday_date + "T05:00:00Z")
            if(hours_day.setHours(0, 0, 0, 0) == d.setHours(0, 0, 0, 0)){
                console.log(v)
                var open_time = new Date (v.open_time);
                var close_time = new Date (v.close_time);
                v.open_time = convert_hour(open_time);
                v.close_time = convert_hour(close_time);
                v.h = v.open_time+ " - " + v.close_time;
                $('#hours_home').text(v.h)
            }
        }
    })
    
    var events = getEventsList();
    var news_exist = false;
    var contests_exist = false;
    $.each(events, function(i, v){
        if(($.inArray("news", v.tags) != -1) && showOnWeb(v)){
            news_exist = true;
        }
        if(($.inArray("contests", v.tags) != -1) && showOnWeb(v)){
            contests_exist = true;
        }
    })
    if (news_exist == false){
        $('.news_link').hide()
        $('option.news_link').remove()
        $('.plan_visit').css('width', '33.33333%')
    }
    if (contests_exist == false){
        $('.contest_link').hide()
        $('option.contest_link').remove()
        $('.spec_offer').css('width', '50%')
    }
    
    $('#stores_container').scroll(function(){
        if( $(this).scrollTop() == 0){
            $('#store_scroll_up').css('display', 'none')
        }
        else{
            $('#store_scroll_up').css('display', 'block')
        }
        if($('#stores_container')[0].scrollHeight == ($('#stores_container').scrollTop() + $('#stores_container').height()) ){
            $('#store_scroll_down').css('display', 'none')
        }
        else{
            $('#store_scroll_down').css('display', 'block')
        }
    })
    
    $('#stores_container').hover(
        function() {
            $('body').addClass("no_scroll");
        }, function() {
            $('body').removeClass( "no_scroll" );
        }
    );
    
    $('#store_scroll_down').click(function(e){
        e.preventDefault();
        scrolled = scrolled + 320;
        $('#stores_container').animate({scrollTop:  scrolled});
    })
    
    $('#store_scroll_up').click(function(e){
        e.preventDefault();
        scrolled = scrolled - 320;
        $('#stores_container').animate({scrollTop:  scrolled});
    })
    renderHomeHours('#home_hours_container3', '#home_hours_template3', getTodaysHours())
}

function show_cat_stores(){
    $('.show_cat_stores').click(function(e){
        $('.main_row .col-md-6').addClass('full_width')
        var visible_row = 0
        var cat_id = $(this).attr('data-id');
        $('.active_cat').removeClass('active_cat');
        $(this).addClass('active_cat');
        var rows = $('.cats_row');
        rows.hide();
        $('#no_promo_in_category').hide();
        $('.store_initial').hide();
        $('#cat_name_header').text($(this).text());
        $('#cat_name_header').css('display', 'block');
        $.each(rows, function(i, val){
            var cat_array = val.getAttribute('data-cat').split(',');
            if ($.inArray(cat_id, cat_array) >= 0){
                $(val).show();
                visible_row++;
            }
        });
        if(visible_row == 0){
            $('#no_promo_in_category').show();
        }
        
        e.preventDefault();
    });
    $('.show_all_stores').click(function(e){
        $('.main_row .col-md-6').removeClass('full_width')
        $('#no_promo_in_category').hide();
        $('.active_cat').removeClass('active_cat');
        $(this).addClass('active_cat');
        var rows = $('.cats_row');
        rows.show();
        $.each($('.store_initial'), function(i, val){
           if ($(val).text().length > 0){
               $(val).show();
           } 
        });
        $('#cat_name_header').hide();
        e.preventDefault();
    });
    
}

function show_pin(param){
	store_id = $(param).attr('store_id');
	if($("#"+store_id).is(":visible")){
		$("."+store_id).hide();				
		$("#"+store_id).hide();
		$("#no_pin_"+store_id).show();
		$("#show_pin_"+store_id).hide();
		$("#m_no_pin_"+store_id).show();
		$("#m_show_pin_"+store_id).hide();
	}else{
		$(".marker").hide();
		$("#"+store_id).show();
		$("#"+store_id).click();
		$("#no_pin_"+store_id).hide();
		$("#show_pin_"+store_id).show();
		$("#m_no_pin_"+store_id).hide();
		$("#m_show_pin_"+store_id).show();
	}
	$('.stores_table').hide()
	
	return false;
}
function drop_pin(id, map){

    var coords = map.get_coords(id);
    var height = parseInt(coords["height"])
    var width = parseInt(coords["width"])
    var x_offset = (parseInt(width) / 2);
    var y_offset = (parseInt(height) /2);
    
    map.setMarks([{ xy: [coords["x"] - 15 + x_offset, coords["y"] - 55 + y_offset],
              attrs: {
                        src:  '//codecloud.cdn.speedyrails.net/sites/57f7f01f6e6f647835890000/image/png/1463000912000/pin2.png'     // image for marker
                      }
        }
        ])
        // map.setViewBox(id);
        map.selectRegion(id);
}
    
function get_day(id){
    switch(id) {
        case 0:
            return ("Sun");
            break;
        case 1:
            return ("Mon");
            break;
        case 2:
            return ("Tue");
            break;
        case 3:
            return ("Wed");
            break;
        case 4:
            return ("Thu");
            break;
        case 5:
            return ("Fri");
            break;
        case 6:
            return ("Sat");
            break;
    }
}


function convert_hour(d){
    var h = (d.getUTCHours());
    var m = addZero(d.getUTCMinutes());
    var s = addZero(d.getUTCSeconds());
    if (h >= 12) {
        if ( h != 12) {
            h = h - 12;    
        }
        
        i = "PM"
    } else {
        i = "AM"
    }
    return h+":"+m+i;
}



function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
function get_month (id){
    var month = "";
    switch(id) {
        case 0:
            month = "Jan";
            break;
        case 1:
            month = "Feb";
            break;
        case 2:
            month = "Mar";
            break;
        case 3:
            month = "Apr";
            break;
        case 4:
            month = "May";
            break;
        case 5:
            month = "Jun";
            break;
        case 6:
            month = "Jul";
            break;
        case 7:
            month = "Aug";
            break;
        case 8:
            month = "Sep";
            break;
        case 9:
            month = "Oct";
            break;
        case 10:
            month = "Nov";
            break;
        case 11:
            month = "Dec";
            break;
            
    }
    return month;
}

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}
function sortByWebDate(a, b){
       
    var aDate = a.show_on_web_date;
    var bDate = b.show_on_web_date;

    return ((aDate > bDate) ? -1 : ((aDate < bDate) ? 1 : 0));
}

function dateToString(dateString){
    var datePart = dateString.split('T');
    var dateItem = datePart[0].split('-');
    var dateFormat = new Date(dateItem[0], dateItem[1]-1, dateItem[2]);
  
    return dateFormat.toDateString();
}

function sortByDate(a, b){
       
    var aDate = a.publish_date;
    var bDate = b.publish_date;

    return ((aDate > bDate) ? -1 : ((aDate < bDate) ? 1 : 0));
}

function load_more(num){
    var n = parseInt(num);
    for(i = n; i < n + 3; i++){
        var id = i.toString();
        $('#show_' + id ).fadeIn();
    }
    var posts = getBlogDataBySlug('carlingwood-shop-the-look').posts;
    var total_posts = posts.length;
    if(i >= total_posts){
        $('#loaded_posts').hide();
        $('#all_loaded').show();
    }
    $('#num_loaded').val(i);
}

function getAssetURL(id){
    var store_id = id;
    var store_assets = "https://carlingwood.mallmaverick.com/api/v4/carlingwood/stores/" + store_id + "/store_files.json"
    var store_front_image_url = "";    
    $.ajax({
        url: store_assets,
        dataType: 'json',
        async: false,
        success: function(data) {
            if(data.store_files.length > 0){
                store_front_image_url = data.store_files[0].url;
            }
        },
        error: function (data){
            store_front_image_url = "";
        }
    });
    
    return store_front_image_url;
}

function submit_contest(slug) {
    var contest_entry = {};
    var contest_data = {};
    contest_data.first_name = $('#first_name').val();
    contest_data.last_name = $('#last_name').val();
    contest_data.mailing_address = $('#address').val();
    contest_data.city = $('#city').val();
    contest_data.province = $('#province').val();
    contest_data.postal_code = $('#postal_code').val();
    contest_data.phone = $('#phone').val();
    contest_data.email = $('#email').val();
    contest_data.newsletter = $('#newsletter_signup').prop("checked");
    
    contest_entry.contest = contest_data;
    
    var propertyDetails = getPropertyDetails();
    var host = propertyDetails.mm_host.replace("http:", "");
    var action = host + "/contests/" + slug + "/create_js_entry"
    $.ajax({
        url : action,
        type: "POST",
        data : contest_entry,
        success: function(data){
           $('#succes_msg').show();
           $('.contest_btn').prop('disabled', false);
           $('#contest_form').trigger('reset');
        },
        error: function (data){
            alert('An error occured while processing your request. Please try again later!')
        }
    });
}
function detectIE() {
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
       // Edge (IE 12+) => return version number
       return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return false;
}