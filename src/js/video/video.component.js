import { Component, getContext } from 'rxcomp';
import { takeUntil } from 'rxjs/operators';
import GtmService from '../gtm/gtm.service';
import SwiperDirective from '../swiper/swiper.directive';

export default class VideoComponent extends Component {

	get playing() {
		return this.playing_;
	}

	set playing(playing) {
		if (this.playing_ !== playing) {
			this.playing_ = playing;
			this.pushChanges();
		}
	}

	onInit() {
		this.item = {};
		const { node, parentInstance } = getContext(this);
		this.video = node.querySelector('video');
		this.progress = node.querySelector('.icon--play-progress path');
		if (parentInstance instanceof SwiperDirective) {
			parentInstance.events$.pipe(
				takeUntil(this.unsubscribe$)
			).subscribe(event => this.pause());
		}
		this.addListeners();
	}

	onDestroy() {
		this.removeListeners();
	}

	addListeners() {
		const video = this.video;
		if (video) {
			this.onPlay = this.onPlay.bind(this);
			this.onPause = this.onPause.bind(this);
			this.onEnded = this.onEnded.bind(this);
			this.onTimeUpdate = this.onTimeUpdate.bind(this);
			video.addEventListener('play', this.onPlay);
			video.addEventListener('pause', this.onPause);
			video.addEventListener('ended', this.onEnded);
			video.addEventListener('timeupdate', this.onTimeUpdate);
		}
	}

	removeListeners() {
		const video = this.video;
		if (video) {
			video.removeEventListener('play', this.onPlay);
			video.removeEventListener('pause', this.onPause);
			video.removeEventListener('ended', this.onEnded);
			video.removeEventListener('timeupdate', this.onTimeUpdate);
		}
	}

	togglePlay() {
		console.log('VideoComponent.togglePlay')
		const video = this.video;
		if (video) {
			if (video.paused) {
				this.play();
			} else {
				this.pause();
			}
		}
	}

	play() {
		const video = this.video;
		video.muted = false;
		video.play();
	}

	pause() {
		const video = this.video;
		video.muted = true;
		video.pause();
	}

	onPlay() {
		this.playing = true;
		GtmService.push({
			event: 'video play',
			video_name: this.video.src
		});
	}

	onPause() {
		this.playing = false;
	}

	onEnded() {
		this.playing = false;
	}

	onTimeUpdate() {
		this.progress.style.strokeDashoffset = this.video.currentTime / this.video.duration;
	}

}

VideoComponent.meta = {
	selector: '[video]',
	inputs: ['item'],
	/*
	template: `
	<div class="media">
		<transclude></transclude>
	</div>
	<div class="overlay" (click)="togglePlay($event)"></div>
	<div class="btn--play" [class]="{ playing: playing }">
		<svg class="icon icon--play-progress-background"><use xlink:href="#play-progress"></use></svg>
		<svg class="icon icon--play-progress" viewBox="0 0 196 196">
			<path xmlns="http://www.w3.org/2000/svg" stroke-width="2px" stroke-dasharray="1" stroke-dashoffset="1" pathLength="1" stroke-linecap="square" d="M195.5,98c0,53.8-43.7,97.5-97.5,97.5S0.5,151.8,0.5,98S44.2,0.5,98,0.5S195.5,44.2,195.5,98z"/>
		</svg>
		<svg class="icon icon--play" *if="!playing"><use xlink:href="#play"></use></svg>
		<svg class="icon icon--play" *if="playing"><use xlink:href="#pause"></use></svg>
	</div><div class="btn--pinterest" (click)="onPin()" *if="onPin">
	<svg class="icon icon--pinterest"><use xlink:href="#pinterest"></use></svg>
	</div>
	<div class="btn--wishlist" [class]="{ active: wishlistActive, activated: wishlistActivated, deactivated: wishlistDeactivated }" (click)="onClickWishlist($event)">
		<svg class="icon icon--wishlist" *if="!wishlistActive"><use xlink:href="#wishlist"></use></svg>
		<svg class="icon icon--wishlist" *if="wishlistActive"><use xlink:href="#wishlist-added"></use></svg>
	</div>
	<div class="btn--zoom" (click)="onClickZoom($event)">
		<svg class="icon icon--zoom"><use xlink:href="#zoom"></use></svg>
	</div>`
	*/
}
