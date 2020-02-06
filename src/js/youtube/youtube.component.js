import { Component, getContext } from 'rxcomp';
import { BehaviorSubject, interval, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import SwiperDirective from '../swiper/swiper.directive';

export default class YoutubeComponent extends Component {

	get playing() {
		return this.playing_;
	}

	set playing(playing) {
		if (this.playing_ !== playing) {
			this.playing_ = playing;
			this.pushChanges();
		}
	}

	get cover() {
		return this.youtubeId ? `//i.ytimg.com/vi/${this.youtubeId}/maxresdefault.jpg` : '';
	}

	onInit() {
		this.item = {};
		const { node, parentInstance } = getContext(this);
		this.progress = node.querySelector('.icon--play-progress path');
		this.onPlayerReady = this.onPlayerReady.bind(this);
		this.onPlayerStateChange = this.onPlayerStateChange.bind(this);
		this.onPlayerError = this.onPlayerError.bind(this);
		this.id$ = new Subject().pipe(distinctUntilChanged());
		if (parentInstance instanceof SwiperDirective) {
			parentInstance.events$.pipe(
				takeUntil(this.unsubscribe$)
			).subscribe(event => this.pause());
		}
		// this.addListeners();
	}

	onChanges(changes) {
		const id = this.youtubeId;
		// console.log('YoutubeComponent.onChanges', id);
		this.id$.next(id);
	}

	initPlayer() {
		console.log('VideoComponent.initPlayer');
		this.player$().pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(player => {
			console.log('YoutubeComponent.player$', player);
		});
		this.interval$().pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(() => {});
		this.id$.next(this.youtubeId);
	}

	player$() {
		const { node } = getContext(this);
		const video = node.querySelector('.video');
		return this.id$.pipe(
			switchMap(id => {
				console.log('YoutubeComponent.videoId', id);
				return YoutubeComponent.once$().pipe(
					map(youtube => {
						console.log('YoutubeComponent.once$', youtube);
						this.destroyPlayer();
						this.player = new youtube.Player(video, {
							width: node.offsetWidth,
							height: node.offsetHeight,
							videoId: id,
							playerVars: {
								autoplay: 1,
								controls: 0,
								disablekb: 1,
								enablejsapi: 1,
								fs: 0,
								loop: 1,
								modestbranding: 1,
								playsinline: 1,
								rel: 0,
								showinfo: 0,
								iv_load_policy: 3,
								listType: 'user_uploads',
								// origin: 'https://log6i.csb.app/'
							},
							events: {
								onReady: this.onPlayerReady,
								onStateChange: this.onPlayerStateChange,
								onPlayerError: this.onPlayerError
							}
						});
						return this.player;
					})
				);
			})
		);
	}

	onPlayerReady(event) {
		// console.log('YoutubeComponent.onPlayerReady', event);
		event.target.mute();
		event.target.playVideo();
	}

	onPlayerStateChange(event) {
		// console.log('YoutubeComponent.onPlayerStateChange', event.data);
		if (event.data === 1) {
			this.playing = true;
		} else {
			this.playing = false;
		}
	}

	onPlayerError(event) {
		console.log('YoutubeComponent.onPlayerError', event);
	}

	destroyPlayer() {
		if (this.player) {
			this.player.destroy();
		}
	}

	onDestroy() {
		this.destroyPlayer();
	}

	interval$() {
		return interval(500).pipe(
			filter(() => this.playing && this.player),
			tap(() => {
				this.progress.style.strokeDashoffset =
					this.player.getCurrentTime() / this.player.getDuration();
			})
		);
	}

	togglePlay() {
		console.log('VideoComponent.togglePlay');
		if (this.playing) {
			this.pause();
		} else {
			this.play();
		}
	}

	play() {
		console.log('VideoComponent.play');
		if (!this.player) {
			this.initPlayer();
		} else {
			this.player.playVideo();
		}
	}

	pause() {
		if (!this.player) {
			return;
		}
		this.player.stopVideo();
	}

	static once$() {
		if (this.youtube$) {
			return this.youtube$;
		} else {
			this.youtube$ = new BehaviorSubject(null).pipe(
				filter(youtube => youtube !== null)
			);
			window.onYouTubeIframeAPIReady = this.onYouTubeIframeAPIReady_.bind(this);
			const script = document.createElement('script');
			const scripts = document.querySelectorAll('script');
			const last = scripts[scripts.length - 1];
			last.parentNode.insertBefore(script, last);
			script.src = '//www.youtube.com/iframe_api';
			return this.youtube$;
		}
	}

	static onYouTubeIframeAPIReady_() {
		// console.log('onYouTubeIframeAPIReady');
		this.youtube$.next(window.YT);
	}
}

YoutubeComponent.meta = {
	selector: '[youtube]',
	inputs: ['youtubeId', 'title']
};
