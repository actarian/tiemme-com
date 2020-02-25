import { CoreModule, Module } from 'rxcomp';
import { FormModule } from 'rxcomp-form';
import AgentsComponent from './agents/agents.component';
import AppComponent from './app.component';
import AppearDirective from './appear/appear.directive';
import ClickOutsideDirective from './click-outside/click-outside.directive';
import ClubForgotComponent from './club/club-forgot.component';
import ClubModalComponent from './club/club-modal.component';
import ClubPasswordRecoveryComponent from './club/club-password-recovery.component';
import ClubPasswordEditComponent from './club/club-password-edit.component';
import ClubProfileComponent from './club/club-profile.component';
import ClubSigninComponent from './club/club-signin.component';
import ClubSignupComponent from './club/club-signup.component';
import ClubComponent from './club/club.component';
import DropdownItemDirective from './dropdown/dropdown-item.directive';
import DropdownDirective from './dropdown/dropdown.directive';
import ControlCheckboxComponent from './forms/control-checkbox.component';
import ControlCustomSelectComponent from './forms/control-custom-select.component';
import ControlEmailComponent from './forms/control-email.component';
import ControlFileComponent from './forms/control-file.component';
import ControlPasswordComponent from './forms/control-password.component';
import ControlSelectComponent from './forms/control-select.component';
import ControlTextComponent from './forms/control-text.component';
import ControlTextareaComponent from './forms/control-textarea.component';
import ErrorsComponent from './forms/errors.component';
import TestComponent from './forms/test.component';
// import ValueDirective from './forms/value.directive';
import HeaderComponent from './header/header.component';
import HtmlPipe from './html/html.pipe';
import LazyDirective from './lazy/lazy.directive';
import MainMenuComponent from './main-menu/main-menu.component';
import MediaLibraryComponent from './media-library/media-library';
import ModalOutletComponent from './modal/modal-outlet.component';
import NaturalFormContactComponent from './natural-form/natural-form-contact.component';
import NaturalFormControlComponent from './natural-form/natural-form-control.component';
import NaturalFormNewsletterComponent from './natural-form/natural-form-newsletter.component';
import NaturalFormSearchComponent from './natural-form/natural-form-search.component';
import NaturalFormSignupComponent from './natural-form/natural-form-signup.component';
import NaturalFormComponent from './natural-form/natural-form.component';
import PriceListComponent from './price-list/price-list';
import RegisterOrLoginComponent from './register-or-login/register-or-login.component';
import RequestInfoCommercialComponent from './request-info-commercial/request-info-commercial.component';
import ReservedAreaComponent from './reserved-area/reserved-area.component';
import FileSizePipe from './size/size.pipe';
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
		AgentsComponent,
		AppearDirective,
		ClickOutsideDirective,
		ClubComponent,
		ClubForgotComponent,
		ClubModalComponent,
		ClubPasswordRecoveryComponent,
		ClubPasswordEditComponent,
		ClubProfileComponent,
		ClubSigninComponent,
		ClubSignupComponent,
		ControlCheckboxComponent,
		ControlCustomSelectComponent,
		ControlEmailComponent,
		ControlFileComponent,
		ControlPasswordComponent,
		ControlSelectComponent,
		ControlTextComponent,
		ControlTextareaComponent,
		DropdownDirective,
		DropdownItemDirective,
		ErrorsComponent,
		FileSizePipe,
		HtmlPipe,
		HeaderComponent,
		LazyDirective,
		MainMenuComponent,
		MediaLibraryComponent,
		ModalOutletComponent,
		PriceListComponent,
		NaturalFormComponent,
		NaturalFormSearchComponent,
		NaturalFormContactComponent,
		NaturalFormControlComponent,
		NaturalFormNewsletterComponent,
		NaturalFormSignupComponent,
		RequestInfoCommercialComponent,
		RegisterOrLoginComponent,
		ReservedAreaComponent,
		SwiperDirective,
		SwiperListingDirective,
		SwiperSlidesDirective,
		TestComponent,
		// ValueDirective,
		VideoComponent,
		WorkWithUsComponent,
		YoutubeComponent,
		ZoomableDirective,
	],
	bootstrap: AppComponent,
};
