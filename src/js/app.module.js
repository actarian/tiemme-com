import { CoreModule, Module } from 'rxcomp';
import { FormModule } from 'rxcomp-form';
import AppComponent from './app.component';
import AppearDirective from './appear/appear.directive';
import ClickOutsideDirective from './click-outside/click-outside.directive';
import DropdownDirective from './dropdown/dropdown.directive';
import ControlCheckboxComponent from './forms/control-checkbox.component';
import ControlCustomSelectComponent from './forms/control-custom-select.component';
import ControlEmailComponent from './forms/control-email.component';
import ControlFileComponent from './forms/control-file.component';
import ControlSelectComponent from './forms/control-select.component';
import ControlTextComponent from './forms/control-text.component';
import ControlTextareaComponent from './forms/control-textarea.component';
import ErrorsComponent from './forms/errors.component';
// import ValueDirective from './forms/value.directive';
import HeaderComponent from './header/header.component';
import LazyDirective from './lazy/lazy.directive';
import ProductMenuComponent from './product-menu/product-menu.component';
// import SpritesComponent from './sprites/sprites.component';
import SrcDirective from './src/src.directive';
import SwiperListingDirective from './swiper/swiper-listing.directive';
import SwiperSlidesDirective from './swiper/swiper-slides.directive';
import SwiperDirective from './swiper/swiper.directive';
import VideoComponent from './video/video.component';
import WorkWithUsComponent from './work-with-us/work-with-us.component';
import YoutubeComponent from './youtube/youtube.component';
import ZoomableDirective from './zoomable/zoomable.directive';

export default class AppModule extends Module {}

AppModule.meta = {
	imports: [
		CoreModule,
		FormModule,
	],
	declarations: [
		AppearDirective,
		ClickOutsideDirective,
		ControlCheckboxComponent,
		ControlCustomSelectComponent,
		ControlEmailComponent,
		ControlFileComponent,
		ControlSelectComponent,
		ControlTextComponent,
		ControlTextareaComponent,
		DropdownDirective,
		ErrorsComponent,
		HeaderComponent,
		LazyDirective,
		ProductMenuComponent,
		// SpritesComponent,
		SrcDirective,
		SwiperDirective,
		SwiperListingDirective,
		SwiperSlidesDirective,
		// ValueDirective,
		VideoComponent,
		WorkWithUsComponent,
		YoutubeComponent,
		ZoomableDirective,
	],
	bootstrap: AppComponent,
};
