import { CoreModule, Module } from 'rxcomp';
import AppComponent from './app.component';
import AppearDirective from './appear/appear.directive';
import DropdownDirective from './dropdown/dropdown.directive';
import HeaderComponent from './header/header.component';
import LazyDirective from './lazy/lazy.directive';
import ProductMenuComponent from './product-menu/product-menu.component';
import SpritesComponent from './sprites/sprites.component';
import SrcDirective from './src/src.directive';
import SwiperSlidesDirective from './swiper/swiper-slides.directive';
import SwiperDirective from './swiper/swiper.directive';

export default class AppModule extends Module {}

AppModule.meta = {
	imports: [
		CoreModule
	],
	declarations: [
		AppearDirective,
		DropdownDirective,
		HeaderComponent,
		LazyDirective,
		ProductMenuComponent,
		SpritesComponent,
		SrcDirective,
		SwiperDirective,
		SwiperSlidesDirective,
	],
	bootstrap: AppComponent,
};