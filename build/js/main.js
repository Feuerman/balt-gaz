$(document).ready(function () {

	function Slider(props) {
		this.elements = props.elements;
		this.video = props.video;
		this.nav = {
			prevBtn: props.navPrev,
			nextBtn: props.navNext
		}
		this.currentSlide = 0;
		this.slideCount = this.elements.length;
		this.init();
	};

	Slider.prototype.init = function() {
		var _this = this;		

		this.elements.each(function(index, item) {
			$(item).attr('data-slide-id', index);
		});

		this.elements.filter('[data-slide-id="0"]').addClass('current');
		
		this.video.play();

		$(this.nav.prevBtn).on('click', function() {
			(_this.currentSlide === 0) ? _this.currentSlide = _this.slideCount - 1 : _this.currentSlide -= 1;
			_this.slide(_this.currentSlide); 
		});
		$(this.nav.nextBtn).on('click', function() {
			(_this.currentSlide === _this.slideCount - 1) ? _this.currentSlide = 0 : _this.currentSlide += 1;
			_this.slide(_this.currentSlide); 
		});
	};

	Slider.prototype.slide = function(id) {
		var videoUrl = this.elements.filter('[data-slide-id=' + id + ']').attr('data-video-url');

		this.elements.animate({
			opacity: 0,
			height: 0
		}, 1000);

		this.elements.filter('[data-slide-id=' + id + ']').css('display', 'flex');

		this.elements.filter('[data-slide-id=' + id + ']').animate({
			opacity: 1,
			height: '100%'
		}, 1000);

		this.video.setAttribute('src', videoUrl);
		this.video.play();
	};

	var sliderItems = $('.top-slider__content');

	var topSlider = new Slider({
		elements: sliderItems,
		video: document.getElementById('service-video'),
		navPrev: $('.top-slider__nav .left'),
		navNext: $('.top-slider__nav .right')
	});
	
	var productsSlider = $('.js-slider-products');
	productsSlider.each(function(index, item) {
		$(item).owlCarousel({
			dots: false,
			loop: true,
			onChanged: customPager,
			margin: 20,
			nav: false,
			responsive:{
				0: {
					items: 1,
					loop: false,
				},
				480:{
					items:2,
					loop: false,
				},
				767:{
					items:3
				},
				850:{
					items:3
				},
				1300:{
					items:4
				},
				1500:{
					items:5
				},
				1750: {
					items:6
				}
			},
		});
	});	
	
	function customPager(event) {
		var items  = event.item.count;
		var item = event.item.index;
		var size = event.page.size;
		$(this.$element[0]).parents('section').eq(0).find('.custom-dots__current').text(item + size);
		$(this.$element[0]).parents('section').eq(0).find('.custom-dots__count').text(items);
	}

	function handlerActiveSlides(initIndex, count) {
		var slides = journalSlider.find('.owl-item');
		var classIndex = 1;
		slides.removeClass (function (index, className) {
			return (className.match (/(^|\s)journal-active-\S+/g) || []).join(' ');
		});
		slides.each(function (index, item) {
			if ($(item).hasClass('active')) {
				$(item).addClass('journal-active-' + classIndex);
				classIndex++;
			}
		});
	}

	var topMenuLink = $('.top-menu__link'),
		subMenuFadeIn,
		subMenuFadeOut;
	

	$(topMenuLink).on({
		mouseleave: function (e) {
			clearTimeout(subMenuFadeIn);
			subMenuFadeOut = setTimeout(function() {
				$('.header-menu-sub').removeClass('active');
			}, 300);	
		},
		mouseenter: function (e) {			
			var existSub = $(e.target).data('sub-menu');
			subMenuFadeIn = setTimeout(function() {
				if (existSub) {
					$(e.target).siblings('.header-menu-sub').addClass('active');
				} else {
					$('.header-menu-sub').removeClass('active');
				}
			}, 300);
			
		}
	});
	
	$('.page-wrapper').on('click', '.js-modal', function(event) {
		event.preventDefault();

		var timeout = 0;
		if ($(event.target).hasClass('js-modal-inMenu')) {
			$('.overlay-block').trigger('click');
			timeout = 500;
		}

		var self = $(this)
		setTimeout(function() {
			$.fancybox.open([
				{
					href: self.data('fancybox-href'),
					type: 'inline',
					padding: 0,
					afterShow: function() {
						$('.modal-close, .button').click(function(event) {
							$.fancybox.close();
						});
						var href = this.href;
						if(href === "#js-modal-journal") {
							var journalpopupSlider = $(href).find('.js-slider-journalpopup');
							journalpopupSlider.slick({
								slidesToShow: 1,
								arrows: true,
								asNavFor: journalpopupThumbsSlider,
								infinite: false
							});

							var journalpopupThumbsSlider = $(href).find('.js-slider-journalpopup-thumbs');
							journalpopupThumbsSlider.slick({
								slidesToShow: 7,
								asNavFor: journalpopupSlider,
								dots: false,
								focusOnSelect: true,
								centerMode: true,
								arrows: false,
								infinite: false,
								responsive: [
									{
										breakpoint: 1600,
										settings: {
											slidesToShow: 6
										}
									},
									{
										breakpoint: 1199,
										settings: {
											slidesToShow: 5
										}
									},
									{
										breakpoint: 767,
										settings: {
											slidesToShow: 3
										}
									}
								]
							});

							journalpopupSlider.on('beforeChange', function(slick, currentSlide, nextSlide) {
								setTimeout(function () {
									var currentSlideIndex;

									currentSlideIndex = currentSlide.currentSlide;
									journalpopupThumbsSlider.slick('slickGoTo', currentSlideIndex);
									// $('.range-journal').attr('value', currentSlideIndex);
								}, 100);

							});							
							// var range = $('<input />', {
							// 	type: 'range',
							// 	class: 'range-journal',
							// 	min: '1',
							// 	max: journalpopupSlider.slick("getSlick").slideCount,
							// 	value: '1'
							// });
							// range.appendTo($(href));
						}
					}
				}
			]);
		}, timeout);
	});
});