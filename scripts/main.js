'use strict';

function similarSlider(selector, items) {
	$(selector).slick({
		dots: false,
		arrows: true,
		infinite: true,
		slidesToShow: items,
		slidesToScroll: 1
	});
}

function centerSlider(selector) {
	$(selector).slick({
		dots: false,
		arrows: true,
		infinite: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		centerMode: true
	});
}

function additionTabs(index) {
	$('.addition-tabs li').removeClass('active').eq(index).addClass('active');
	$('.addition-content .products_slider').removeClass('active').eq(index).addClass('active');

	$('.addition-content .products_slider').each(function () {
		var $this = $(this);

		$this.slick('unslick');
		similarSlider($this, 5);
	});
}

function mainTabs(index) {
	$('.information-tabs li').removeClass('active').eq(index).addClass('active');
	$('.information-content .content').removeClass('active').eq(index).addClass('active');

	$('.article-slider').slick('unslick');
	centerSlider('.article-slider');

	if ($('.information-content .content').eq(index).find('.review-item').length) {
		$('.review-item').each(function () {
			var cur_height = $(this).find('.review-text').height();
			if (cur_height > 65) {
				$(this).find('.review-text').addClass('overflow').append('<a href="#" class="details full-text">Читать полностью</a>');
			}
		});
	}
}

function reviewTabs(index) {
	$('.review-tabs li').removeClass('active').eq(index).addClass('active');
	$('.reviews .review').removeClass('active').eq(index).addClass('active');
}

/**
* Cut text script
* (Add to  div class "cut-text" width data-attr "data-cut"(length letters to show) )
*/
function cutText() {
	var filler = '...';
	var filler_length = filler.length;
	$('.cut-text').each(function () {
		var value = $(this).data('cut') - filler_length;
		var text = $.trim($(this).text());
		if (text.length > value && value > 0) {
			var newText = text.substring(0, value) + filler;
			$(this).text(newText);
		}
	});
};

$(document).on('click', '.full-text', function (e) {
	e.preventDefault();
	$(this).hide();
	$(this).closest('.review-text').removeClass('overflow');
});

$(document).ready(function () {
	cutText();

	// init formstyler for custom selects
	$('.el-select').styler();
	$('.car-select').styler();
	$('.wh-select').styler();
	// /init formstyler for custom selects

	// init all sliders on page
	similarSlider('.products_slider', 5);
	similarSlider('.reviewed_slider', 6);
	centerSlider('.article-slider');
	// /init all sliders on page

	// call functions for tabs functionality
	additionTabs(0);
	mainTabs(0);
	reviewTabs(0);
	// /call functions for tabs functionality

	// init RateYou plugin for rating stars
	$('.stars').each(function () {
		var initRate = $(this).attr('data-rating');
		var readOnly = $(this).attr('data-readonly');

		$(this).rateYo({
			starWidth: "11px",
			spacing: "10px",
			ratedFill: "#ffdc2c",
			normalFill: "#c6c6c6",
			readOnly: readOnly,
			rating: initRate
		});
	});
	// /init RateYou plugin for rating stars

	// click events for all tabs 
	$('.addition-tabs a').click(function (e) {
		e.preventDefault();
		var index = $(this).closest('li').index();
		additionTabs(index);
	});

	$('.information-tabs a').click(function (e) {
		e.preventDefault();
		var index = $(this).closest('li').index();
		mainTabs(index);
	});

	$('.review-tabs a').click(function (e) {
		e.preventDefault();
		var index = $(this).closest('li').index();
		reviewTabs(index);
	});

	$('.card-img .gallery a').click(function (e) {
		e.preventDefault();
		var pic = $(this).attr('data-img');
		var video = $(this).attr('data-video');
		$('.card-img li').removeClass('active');
		$(this).closest('li').addClass('active');

		$('.card-img .pic').empty();

		if (pic && pic !== undefined) {
			$('.card-img .pic').addClass('js-zoom').append('<a href="' + pic + '" data-fancybox=""><img src="' + pic + '" alt="" /></a>');
		} else if (video && video !== undefined) {
			$('.card-img .pic').removeClass('js-zoom').append('<iframe src="' + video + '"></iframe>');
		}
	});
	// click events for all tabs 

	// init zoom image plugin
	$('.card-img .js-zoom').zoom();
	$('.card-img .js-zoom').click(function (e) {
		e.preventDefault();
		var href = $(this).find('a').attr('href');
		$.fancybox.open({ src: href });
	});
	// /init zoom iimage plugin

	// click event to call ajax for loading more data
	$('.js-more').on('click', function (e) {
		e.preventDefault();
		var url = $(this).attr('data-url');
		if ($(this).closest('.js-wrapper').length) {
			var wrap = $(this).closest('.js-wrapper');
			var value = $(this).closest('.js-wrapper').html();
		} else {
			var wrap = $(this).prev('.js-wrapper');
			var value = $(this).prev('.js-wrapper').html();
		}

		$(this).remove();

		$.ajax({
			url: url,
			data: value,
			method: 'GET',
			success: function success(data) {
				if (data) {
					wrap.append(data.toString());

					if (data.find('.review-item').length) {
						$('.review-item').each(function () {
							var cur_height = $(this).find('.review-text').height();
							if (cur_height > 65) {
								$(this).find('.review-text').addClass('overflow').append('<a href="#" class="details full-text">Читать полностью</a>');
							}
						});
					}
				}
			}
		});
	});
	// /click event to call ajax for loading more data

	// custom select in header	
	$('.phone-select .arr').click(function (e) {
		e.preventDefault();
		$('.phone-select').addClass('active');
		return false;
	});
	// /custom select in header	

	// reload slider on change select event
	$('select.change_slider').change(function (e) {
		var value = $(this).val();

		$.ajax({
			url: changeSliderURL,
			data: value,
			method: 'POST',
			success: function success(data) {
				if (data) {
					$('.products_slider').slick('unslick');
					$('.products_slider').empty().append(data.toString());

					similarSlider('.products_slider', 5);
				}
			}
		});
	});
	// reload slider on change select event

	// custom icon for iframe video
	$('.video-link').click(function (e) {
		e.preventDefault();

		$(this).closest('.video').find('iframe')[0].src += "?autoplay=1";
		$(this).hide();
	});
	// /custom icon for iframe video
});

jQuery(document).click(function (event) {
	if ($(event.target).closest(".phone-select").length) return;
	jQuery(".phone-select").removeClass("active");

	event.stopPropagation();
});

$(window).load(function () {});

$(window).resize(function () {});