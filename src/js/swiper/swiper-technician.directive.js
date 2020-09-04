import SwiperDirective from './swiper.directive';

export default class SwiperTechnicianDirective extends SwiperDirective {
	onInit() {
		this.options = {
			slidesPerView: 1,
			spaceBetween: 80,
			speed: 600,
			autoplay: {
				delay: 5000,
				disableOnInteraction: true,
			},
			keyboardControl: true,
			mousewheelControl: false,
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
			},
			keyboard: {
				enabled: true,
				onlyInViewport: true,
			},
		};
		this.init_();
		// console.log('SwiperTechnicianDirective.onInit');
	}
}

SwiperTechnicianDirective.meta = {
	selector: '[swiper-technician]'
};
