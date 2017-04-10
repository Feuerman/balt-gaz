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

		$('<span/>').appendTo(this.nav.prevBtn);
		$('<span/>').appendTo(this.nav.nextBtn);

		this.elements.each(function(index, item) {
			$(item).attr('data-slide-id', index);
		});

		this.elements.filter('[data-slide-id="0"]').addClass('current');


		this.navTitle(this.currentSlide);
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
		var _this = this;
		var videoUrl = this.elements.filter('[data-slide-id=' + id + ']').attr('data-video-url');

		this.nav.prevBtn.prop('disabled', true);
		this.nav.nextBtn.prop('disabled', true);

		this.elements.animate({
			opacity: 0
		}, 300);

		this.elements.filter('[data-slide-id=' + id + ']').css('display', 'flex');

		this.elements.filter('[data-slide-id=' + id + ']').animate({
			opacity: 1
		}, 500, function() {
			_this.nav.prevBtn.prop('disabled', false);
			_this.nav.nextBtn.prop('disabled', false);
		});
		
		this.video.setAttribute('src', videoUrl);
		this.video.play();	

		this.navTitle(id);
	};

	Slider.prototype.navTitle = function(id) {
		var prevID = (id === 0) ? this.elements.length - 1 : id - 1,
			nextID = (id === this.elements.length - 1) ? 0 : id + 1;

		var prevTitle = this.elements.filter('[data-slide-id=' + prevID + ']').find('.title').text(),
			nextTitle = this.elements.filter('[data-slide-id=' + nextID + ']').find('.title').text();

		this.nav.prevBtn.find('span').text(prevTitle);
		this.nav.nextBtn.find('span').text(nextTitle);
	};

	var sliderItems = $('.top-slider__content');

	if(sliderItems.lenght) {
		var topSlider = new Slider({
			elements: sliderItems,
			video: document.getElementById('service-video'),
			navPrev: $('.top-slider__nav .left'),
			navNext: $('.top-slider__nav .right')
		});	
	}	
	
	$('[data-fancybox]').fancybox({
		image : {
			// protect: true
		}
	});

	$('.callback-form').on('submit', function(e) {
		e.preventDefault();
		var _this = $(this),
			errorForm = $('<div/>', {
				class: 'form-error',
				text: 'Заполнены не все поля'
			}),
			requiredFields = _this.find('input[data-input-required]');

		requiredFields.each(function(index, item) {
			var value = $(item).val();
			if(!value) {
				$(item).addClass('error');
				if (!_this.find('.form-error').length) {
					errorForm.appendTo(_this);
				}		
			}
		});

		if (_this.find('.error')) return;

		_this.submit();
	});

	$('.calculator-form').on('submit', function(e) {
		e.preventDefault();
		$.fancybox.open({
			src: '#order-modal'
		});
	});	

	$('.dropdown-item__title').on('click', function(e) {
		e.preventDefault();

		var container = $(this).parents('.dropdown');
		var existActive = $(this).parents('.dropdown-item').hasClass('active');

		if(existActive) {
			$(this).parents('.dropdown-item').toggleClass('active');
			return;
		}
		container.find('.dropdown-item').removeClass('active');
		$(this).parents('.dropdown-item').addClass('active');
	});

	$('.custom-input').styler();
});