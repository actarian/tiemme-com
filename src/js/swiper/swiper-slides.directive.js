import SwiperDirective from './swiper.directive';

const SWIPER_SLIDES_OPTIONS = {
	slidesPerView: 1,
	spaceBetween: 0,
	centeredSlides: true,
	loop: false,
	loopAdditionalSlides: 100,
	speed: 600,
	/*
	autoplay: {
		delay: 5000,
	},
	*/
	keyboardControl: true,
	mousewheelControl: false,
	onSlideClick: function(swiper) {
		// angular.element(swiper.clickedSlide).scope().clicked(angular.element(swiper.clickedSlide).scope().$index);
	},
	pagination: {
		el: '.swiper-pagination',
		clickable: true,
	},
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
	keyboard: {
		enabled: true,
		onlyInViewport: true,
	},
};

export default class SwiperSlidesDirective extends SwiperDirective {

	onInit() {
		this.options = SWIPER_SLIDES_OPTIONS;
		this.init_();
	}

}

SwiperSlidesDirective.meta = {
	selector: '[swiper-slides]'
};
