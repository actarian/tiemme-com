/**
 * @license tiemme-com v1.0.0
 * (c) 2020 Luca Zampetti <lzampetti@gmail.com>
 * License: MIT
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('rxcomp'), require('rxjs/operators'), require('rxjs')) :
  typeof define === 'function' && define.amd ? define('main', ['rxcomp', 'rxjs/operators', 'rxjs'], factory) :
  (global = global || self, factory(global.rxcomp, global.rxjs.operators, global.rxjs));
}(this, (function (rxcomp, operators, rxjs) { 'use strict';

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }

  var DROPDOWN_ID = 1000000;

  var DropdownDirective =
  /*#__PURE__*/
  function (_Component) {
    _inheritsLoose(DropdownDirective, _Component);

    function DropdownDirective() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = DropdownDirective.prototype;

    _proto.onInit = function onInit() {
      var _this = this;

      var _getContext = rxcomp.getContext(this),
          node = _getContext.node; // const consumer = attributes.hasDropdownConsumer !== undefined ? scope.$eval(attributes.hasDropdownConsumer) : null;


      var trigger = node.getAttribute('dropdown-target');
      this.trigger = trigger ? node.querySelector(trigger) : node;
      this.opened = null;
      var uid = node.getAttribute('dropdown-id');
      this.uid = uid ? uid : DROPDOWN_ID++; // console.log(this.uid);

      /*
      scope.$on('onCloseDropdown', closeDropdown);
      scope.$on('onNavigateOut', closeDropdown);
      scope.$on('onNavigationTransitionIn', closeDropdown);
      */

      this.onClick = this.onClick.bind(this);
      this.onDocumentClick = this.onDocumentClick.bind(this);
      this.openDropdown = this.openDropdown.bind(this);
      this.closeDropdown = this.closeDropdown.bind(this);
      this.addListeners();
      DropdownDirective.dropdown$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (dropdown) {
        if (_this.uid === dropdown) {
          node.classList.add('opened');
        } else {
          node.classList.remove('opened');
        }

        _this.pushChanges();
      });
    };

    _proto.onClick = function onClick(event) {
      var _getContext2 = rxcomp.getContext(this),
          node = _getContext2.node;

      if (this.opened === null) {
        this.openDropdown();
      } else if (this.trigger !== node) {
        this.closeDropdown();
      }
    };

    _proto.onDocumentClick = function onDocumentClick(event) {
      var _getContext3 = rxcomp.getContext(this),
          node = _getContext3.node;

      var clickedInside = node === event.target || node.contains(event.target);

      if (!clickedInside) {
        this.closeDropdown();
      }
    } // scope.$watch('hasDropdown', onShowHide);
    ;

    _proto.openDropdown = function openDropdown() {
      if (this.opened === null) {
        this.opened = true;
        this.addDocumentListeners();
        DropdownDirective.dropdown$.next(this.uid);
        this.dropdown.next(this.uid);
      }
    };

    _proto.closeDropdown = function closeDropdown() {
      if (this.opened !== null) {
        this.removeDocumentListeners(); // this.$timeout(() => {

        this.opened = null;

        if (DropdownDirective.dropdown$.getValue() === this.uid) {
          DropdownDirective.dropdown$.next(null);
          this.dropdown.next(null);
        } // });

      }
    };

    _proto.addListeners = function addListeners() {
      this.trigger.addEventListener('click', this.onClick);
    };

    _proto.addDocumentListeners = function addDocumentListeners() {
      document.addEventListener('click', this.onDocumentClick);
    };

    _proto.removeListeners = function removeListeners() {
      this.trigger.removeEventListener('click', this.onClick);
    };

    _proto.removeDocumentListeners = function removeDocumentListeners() {
      document.removeEventListener('click', this.onDocumentClick);
    };

    _proto.onDestroy = function onDestroy() {
      this.removeListeners();
      this.removeDocumentListeners();
    };

    return DropdownDirective;
  }(rxcomp.Component);
  DropdownDirective.meta = {
    selector: '[(dropdown)]',
    outputs: ['dropdown']
  };
  DropdownDirective.dropdown$ = new rxjs.BehaviorSubject(null);

  var AppComponent =
  /*#__PURE__*/
  function (_Component) {
    _inheritsLoose(AppComponent, _Component);

    function AppComponent() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = AppComponent.prototype;

    _proto.onInit = function onInit() {
      var _this = this;

      var context = rxcomp.getContext(this);
      console.log('context', context);
      this.items = new Array(100).fill(true).map(function (x, i) {
        var id = i + 1;
        var title = "Title " + id;
        var image = "https://source.unsplash.com/random/700x700?sig=" + id;
        return {
          id: id,
          title: title,
          image: image
        };
      });
      DropdownDirective.dropdown$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (dropdown) {
        return _this.dropdownId = dropdown;
      });
    };

    _proto.onDropdown = function onDropdown(dropdown) {
      console.log('AppComponent', dropdown);
    } // onView() { const context = getContext(this); }
    // onChanges() {}
    // onDestroy() {}
    ;

    return AppComponent;
  }(rxcomp.Component);
  AppComponent.meta = {
    selector: '[app-component]'
  };

  var IntersectionService =
  /*#__PURE__*/
  function () {
    function IntersectionService() {}

    IntersectionService.observer = function observer() {
      var _this = this;

      if (!this.observer_) {
        this.readySubject_ = new rxjs.BehaviorSubject(false);
        this.observerSubject_ = new rxjs.Subject();
        this.observer_ = new IntersectionObserver(function (entries) {
          _this.observerSubject_.next(entries);
        });
      }

      return this.observer_;
    };

    IntersectionService.intersection$ = function intersection$(node) {
      if ('IntersectionObserver' in window) {
        var observer = this.observer();
        observer.observe(node);
        return this.observerSubject_.pipe( // tap(entries => console.log(entries.length)),
        operators.map(function (entries) {
          return entries.find(function (entry) {
            return entry.target === node;
          });
        }), // tap(entry => console.log('IntersectionService.intersection$', entry)),
        operators.filter(function (entry) {
          return entry !== undefined && entry.isIntersecting;
        }), // entry.intersectionRatio > 0
        operators.first(), operators.finalize(function () {
          return observer.unobserve(node);
        }));
      } else {
        return rxjs.of({
          target: node
        });
      }
    };

    return IntersectionService;
  }();

  var AppearDirective =
  /*#__PURE__*/
  function (_Directive) {
    _inheritsLoose(AppearDirective, _Directive);

    function AppearDirective() {
      return _Directive.apply(this, arguments) || this;
    }

    var _proto = AppearDirective.prototype;

    _proto.onChanges = function onChanges() {
      if (!this.appeared) {
        this.appeared = true;

        var _getContext = rxcomp.getContext(this),
            node = _getContext.node;

        IntersectionService.intersection$(node).pipe(operators.takeUntil(this.unsubscribe$), operators.first()).subscribe(function (src) {
          node.classList.add('appeared');
        });
      }
    };

    return AppearDirective;
  }(rxcomp.Directive);
  AppearDirective.meta = {
    selector: '[appear]'
  };

  var HeaderComponent =
  /*#__PURE__*/
  function (_Component) {
    _inheritsLoose(HeaderComponent, _Component);

    function HeaderComponent() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = HeaderComponent.prototype;

    _proto.onInit = function onInit() {
      this.menu = null;
      this.dropdownId = null;
      /*
      DropdownDirective.dropdown$.pipe(
      	takeUntil(this.unsubscribe$)
      ).subscribe(dropdown => this.dropdownId = dropdown);
      */
    };

    _proto.toggleMenu = function toggleMenu($event) {
      this.menu = this.menu !== $event ? $event : null;
      this.pushChanges();
    };

    _proto.onDropdown = function onDropdown($event) {
      // console.log('HeaderComponent.onDropdown', $event);
      this.dropdownId = $event;
      this.pushChanges();
    };

    return HeaderComponent;
  }(rxcomp.Component);
  HeaderComponent.meta = {
    selector: 'header'
  };

  var ImageService =
  /*#__PURE__*/
  function () {
    function ImageService() {}

    ImageService.worker = function worker() {
      if (!this.worker_) {
        this.worker_ = new Worker('./js/workers/image.service.worker.js');
      }

      return this.worker_;
    };

    ImageService.load$ = function load$(src) {
      if ('Worker' in window) {
        var worker = this.worker();
        worker.postMessage(src);
        return rxjs.fromEvent(worker, 'message').pipe( // tap(event => console.log(src, event.data.src)),
        operators.filter(function (event) {
          return event.data.src === src;
        }), operators.map(function (event) {
          var url = URL.createObjectURL(event.data.blob); // URL.revokeObjectURL(url);

          return url;
        }), operators.first(), operators.finalize(function (url) {
          URL.revokeObjectURL(url);
        }));
      } else {
        return rxjs.of(src);
      }
    };

    return ImageService;
  }();

  var LazyDirective =
  /*#__PURE__*/
  function (_Directive) {
    _inheritsLoose(LazyDirective, _Directive);

    function LazyDirective() {
      return _Directive.apply(this, arguments) || this;
    }

    var _proto = LazyDirective.prototype;

    /*
    onInit() {
    	const { node } = getContext(this);
    	console.log('LazyDirective.onInit', node);
    	node.classList.add('init');
    }
    */
    _proto.onChanges = function onChanges() {
      var _this = this;

      if (!this.lazyed) {
        this.lazyed = true;

        var _getContext = rxcomp.getContext(this),
            node = _getContext.node;

        IntersectionService.intersection$(node).pipe(operators.takeUntil(this.unsubscribe$), operators.first(), // tap(() => console.log('LazyDirective.intersection', node)),
        operators.switchMap(function () {
          return ImageService.load$(_this.lazy);
        })).subscribe(function (src) {
          // console.log('src', src);
          node.setAttribute('src', src);
          node.classList.add('lazyed');
        });
      }
    };

    return LazyDirective;
  }(rxcomp.Directive);
  LazyDirective.meta = {
    selector: '[[lazy]],[lazy]',
    inputs: ['lazy']
  };

  var ProductMenuComponent =
  /*#__PURE__*/
  function (_Component) {
    _inheritsLoose(ProductMenuComponent, _Component);

    function ProductMenuComponent() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = ProductMenuComponent.prototype;

    _proto.onInit = function onInit() {
      this.dropdownId = null; // console.log('ProductMenuComponent', this.dropdownId);
    };

    _proto.onDropdown = function onDropdown($event) {
      // console.log('ProductMenuComponent.onDropdown', $event);
      this.dropdownId = $event;
      this.pushChanges();
    };

    return ProductMenuComponent;
  }(rxcomp.Component);
  ProductMenuComponent.meta = {
    selector: '[product-menu]'
  };

  var SpritesComponent =
  /*#__PURE__*/
  function (_Component) {
    _inheritsLoose(SpritesComponent, _Component);

    function SpritesComponent() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = SpritesComponent.prototype;

    _proto.onInit = function onInit() {
      console.log('SpritesComponent');
    };

    return SpritesComponent;
  }(rxcomp.Component);
  SpritesComponent.meta = {
    selector: '[sprites]',
    template:
    /* html */
    "\n\t<svg width=\"0\" height=\"0\" class=\"hidden\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" aria-hidden=\"true\">\n\t\t<symbol viewBox=\"0 0 98 98\" id=\"bim\">\n\t\t\t<path d=\"M.9 86.8h14.2V46.4s.1-4.8 4.1-6.7l27.9-12.9V11.2l-41.3 19c-1.4.7-2.4 1.5-3.2 2.4-.4.5-.8 1.1-1 1.7-.6 1.2-.8 2.4-.8 3.3-.1.8 0 1.3 0 1.3v47.9h.1zm62.9-54V17.2l-13-6h-.1v75.6h13.1zm16.7 8.1v-16l-13.1-6v67.9h13.1zm16.6-2s.1-.5 0-1.3c-.1-.9-.3-2.1-.8-3.3-.3-.6-.6-1.1-1-1.7-.7-.9-1.8-1.8-3.2-2.4L84 26.5v60.2h13.1V38.9z\"></path>\n\t\t</symbol>\n\t\t<symbol viewBox=\"0 0 8 5\" id=\"caret-down\">\n\t\t\t<path d=\"M0 0h8L4 5 0 0z\" fill-rule=\"evenodd\" clip-rule=\"evenodd\"></path>\n\t\t</symbol>\n\t\t<symbol viewBox=\"0 0 24 24\" id=\"languages\">\n\t\t\t<path d=\"M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm10 12c0 .685-.07 1.354-.202 2h-3.853a21.373 21.373 0 0 0 0-4h3.853c.132.646.202 1.315.202 2zm-.841-4h-3.5c-.383-1.96-1.052-3.751-1.948-5.278A10.048 10.048 0 0 1 21.159 8zm-5.554 0H13V2.342c1.215 1.46 2.117 3.41 2.605 5.658zM11 2.342V8H8.395C8.883 5.752 9.785 3.802 11 2.342zM11 10v4H8.07a18.32 18.32 0 0 1 0-4H11zm0 6v5.658c-1.215-1.46-2.117-3.41-2.605-5.658H11zm2 5.658V16h2.605c-.488 2.248-1.39 4.198-2.605 5.658zM13 14v-4h2.93a18.32 18.32 0 0 1 0 4H13zM8.289 2.722C7.393 4.249 6.724 6.04 6.341 8h-3.5a10.048 10.048 0 0 1 5.448-5.278zM2.202 10h3.853a21.373 21.373 0 0 0 0 4H2.202a9.983 9.983 0 0 1 0-4zm.639 6h3.5c.383 1.96 1.052 3.751 1.948 5.278A10.048 10.048 0 0 1 2.841 16zm12.87 5.278c.896-1.527 1.565-3.318 1.948-5.278h3.5a10.048 10.048 0 0 1-5.448 5.278z\"></path>\n\t\t</symbol>\n\t\t<symbol viewBox=\"0 0 355 60\" id=\"logo\">\n\t\t\t<path fill=\"#008d39\" d=\"M316.2 48.6h12.1v8.5h-12.1z\"></path>\n\t\t\t<path fill=\"#fff\" d=\"M328.3 48.6h12.1v8.5h-12.1z\"></path>\n\t\t\t<path fill=\"#dc1417\" d=\"M340.4 48.6h12.1v8.5h-12.1z\"></path>\n\t\t\t<path d=\"M94.4 54.5c.3.5.7.9 1.2 1.2.5.3 1 .4 1.6.4.6 0 1.1-.1 1.6-.4.5-.3.9-.7 1.1-1.2.3-.5.4-1 .4-1.6s-.1-1.1-.4-1.6c-.3-.5-.7-.9-1.2-1.2-.5-.3-1-.4-1.6-.4-.6 0-1.1.1-1.6.4-.5.3-.9.7-1.2 1.2-.3.5-.4 1.1-.4 1.6.1.5.2 1.1.5 1.6m-1-3.8c.4-.7.9-1.2 1.6-1.6.7-.4 1.4-.6 2.2-.6.8 0 1.5.2 2.2.6.7.4 1.2.9 1.6 1.6.4.7.6 1.4.6 2.2 0 .8-.2 1.5-.6 2.2-.4.7-.9 1.2-1.6 1.6-.7.4-1.4.6-2.2.6-.8 0-1.5-.2-2.2-.6-.7-.4-1.2-.9-1.6-1.6-.4-.7-.6-1.4-.6-2.2 0-.8.2-1.6.6-2.2m14.9 1.7c.3-.3.4-.7.4-1.1 0-.3-.1-.5-.2-.7-.1-.2-.3-.4-.5-.6-.2-.2-.6-.2-.9-.2h-1.3V53h1.2c.6-.2 1.1-.3 1.3-.6m1 4.7l-2-3.2h-1.6V57h-1.1v-8.5h2.3c.6 0 1.1.1 1.6.3.5.2.8.5 1.1.9.3.4.4.9.4 1.4 0 .5-.1 1-.3 1.5-.2.4-.6.8-1.1 1l2.2 3.4h-1.5zm4.1-8.5h1.1v8.5h-1.1zm10.3 8.3c-.6.2-1.1.3-1.5.3-.9 0-1.7-.2-2.4-.5-.7-.4-1.2-.9-1.6-1.5-.4-.6-.6-1.4-.6-2.2 0-.9.2-1.7.6-2.4.4-.7.9-1.2 1.6-1.6.7-.4 1.4-.5 2.2-.5.5 0 .9.1 1.4.2.4.1.8.3 1.1.5l-.4 1.1c-.3-.1-.6-.3-1-.4-.4-.1-.7-.2-1-.2-.7 0-1.2.1-1.8.4-.5.3-.9.6-1.2 1.1-.3.5-.4 1.1-.4 1.7 0 .6.1 1.2.4 1.6.3.5.7.9 1.2 1.1.5.3 1.1.4 1.7.4.3 0 .6 0 .9-.1.3-.1.5-.1.7-.3V54h-1.7v-1.1h2.9v3.5c-.1.2-.5.4-1.1.5m4.6-8.3h1.1v8.5h-1.1zm12.2 0v8.8l-6.3-6.4v6.1h-1.1v-8.8l6.3 6.4v-6.1zm7.6 5.3l-1.2-3.1-1.3 3.1h2.5zm.4 1h-3.3l-.9 2.2h-1.1l3.7-8.9h.1l3.7 8.9h-1.3l-.9-2.2zm6-6.3V56h4.4v1.1h-5.5v-8.5zm12.3 0h1.1v8.5h-1.1zm9.6 0v1.1h-2.3v7.4h-1.2v-7.4h-2.2v-1.1zm6.1 5.3l-1.2-3.1-1.3 3.1h2.5zm.4 1h-3.3l-.9 2.2h-1.1l3.7-8.9h.1l3.7 8.9h-1.3l-.9-2.2zm6-6.3V56h4.3v1.1h-5.5v-8.5zm7.1 0h1.1v8.5H196zm8.8 5.3l-1.2-3.1-1.3 3.1h2.5zm.3 1h-3.3l-.9 2.2h-1.1l3.7-8.9h.1l3.7 8.9H206l-.9-2.2zm12.3-6.3v8.8l-6.3-6.4.1 6.1H210v-8.8h.1l6.2 6.4v-6.1zm13.7 0v1.1h-2.3v7.4h-1.2v-7.4h-2.2v-1.1zm6.4 3.8c.3-.3.4-.7.4-1.1 0-.3-.1-.5-.2-.7-.1-.2-.3-.4-.5-.6-.2-.2-.6-.2-.9-.2H235V53h1.2c.6-.2 1.1-.3 1.3-.6m1 4.7l-2-3.2H235V57h-1.1v-8.5h2.3c.6 0 1.1.1 1.6.3.5.2.8.5 1.1.9.3.4.4.9.4 1.4 0 .5-.1 1-.3 1.5-.2.4-.6.8-1.1 1l2.2 3.4h-1.6zm8.6-3.2l-1.2-3.1-1.3 3.1h2.5zm.4 1h-3.3l-.9 2.2h-1.1l3.7-8.9h.1l3.7 8.9h-1.3l-.9-2.2zm7.4 1.1c.6 0 1.2-.1 1.7-.4.5-.2.9-.6 1.2-1.1.3-.5.4-1 .4-1.7s-.1-1.2-.4-1.7c-.3-.5-.7-.8-1.2-1.1-.5-.2-1-.4-1.6-.4h-1.5V56h1.4zm-2.6-7.4h2.3c1.1 0 1.9.2 2.6.6.7.4 1.2 1 1.5 1.6.3.7.5 1.4.5 2.1 0 .8-.2 1.6-.6 2.2-.4.6-.9 1.1-1.5 1.5-.6.3-1.3.5-2.1.5h-2.8v-8.5zm15.7 0v1.1h-4.4v2.6h3.9v1.1h-3.9V56h4.5v1.1h-5.7v-8.5zm11.6-.3v8.8h-1.1v-5.5l-3.1 4.4h-.1l-3.1-4.3v5.4h-1.1v-8.8l4.3 5.9 4.2-5.9zm7.6 5.6l-1.2-3.1-1.3 3.1h2.5zm.4 1h-3.3l-.9 2.2h-1.1l3.7-8.9h.1l3.7 8.9h-1.3l-.9-2.2zm8.6-2.5c.3-.3.4-.7.4-1.1 0-.3-.1-.5-.2-.7-.1-.2-.3-.4-.5-.6-.2-.2-.6-.2-.9-.2h-1.3V53h1.2c.6-.2 1-.3 1.3-.6m1 4.7l-2-3.2h-1.6V57h-1.1v-8.5h2.3c.6 0 1.1.1 1.6.3.5.2.8.5 1.1.9.3.4.4.9.4 1.4 0 .5-.1 1-.3 1.5-.2.4-.6.8-1.1 1l2.2 3.4h-1.5zm5.2-4.7l.2-.2 3.5-3.6h1.5l-3.6 3.6 3.8 4.9h-1.5l-3.1-4.1-.7.6v3.5h-1.2v-8.5h1.2V52z\"\n\t\t\tfill=\"#19255b\"></path>\n\t\t\t<path d=\"M43.5 57.1c-2 0-3.9-.3-5.7-1.3-2.5-1.3-4-3.4-4.7-6.1-.2-.9-.3-1.7-.3-2.7V27.6c0-.7 0-1.4-.2-2-.6-1.9-1.9-3-3.8-3.5-.5-.1-1.1-.2-1.7-.2H2.7V2.6h27.1c3.4 0 6.5 1.3 9 3.7 1.6 1.6 2.6 3.5 3.2 5.7.4 1.6.6 3.2.6 4.8v29.8c-.1.6.2 1 1 1.1-.1 3.1-.1 6.3-.1 9.4\"\n\t\t\tfill=\"#dc1417\"></path>\n\t\t\t<path d=\"M43.5 57.1v-9.4c.1 0 .3 0 .4-.1.3-.1.5-.4.5-.7V16.7c0-2.3.4-4.6 1.4-6.7 1.3-3 3.6-5.1 6.6-6.3 1.4-.6 2.9-.9 4.4-1h27.4V22h-24c-1.5 0-2.9.4-4.1 1.4-1 .8-1.6 1.9-1.7 3.1-.1.5-.1 1-.1 1.5v19.2c0 1.4-.3 2.7-.8 3.9-1.4 3.2-3.9 5.1-7.3 5.7-.9.2-1.8.3-2.7.3m63.8-47.5H94.1c-.8 0-1.2-.4-1.2-1.1V3.7c0-.7.4-1.1 1.2-1.1h35.1c.8 0 1.2.4 1.2 1.1v4.8c0 .7-.4 1.1-1.2 1.1H116v29.3c0 .7-.5 1.1-1.2 1.1h-6.3c-.7 0-1.2-.4-1.2-1.1V9.6zm40.2 29.3c0 .7-.5 1.1-1.2 1.1H140c-.8 0-1.2-.4-1.2-1.1V3.7c0-.7.4-1.1 1.2-1.1h6.3c.7 0 1.2.4 1.2 1.1v35.2zm43.6-36.3c.7 0 1.2.4 1.2 1.1v4.8c0 .7-.4 1.1-1.2 1.1h-26.5v8.1h22.3c.7 0 1.2.4 1.2 1.1v4.6c0 .7-.5 1.1-1.2 1.1h-22.3V33h26.5c.7 0 1.2.4 1.2 1.1v4.8c0 .7-.4 1.1-1.2 1.1h-34c-.8 0-1.2-.4-1.2-1.1V3.7c0-.7.4-1.1 1.2-1.1h34zm22.2 0c.9 0 1.4.3 1.7 1.1l10.3 27.7 10.2-27.7c.3-.7.7-1.1 1.7-1.1h11.6c.8 0 1.2.4 1.2 1.1v35.2c0 .7-.4 1.1-1.2 1.1h-6.3c-.7 0-1.2-.4-1.2-1.1V9.8L230.2 39c-.2.7-.7 1.1-1.7 1.1h-7.1c-1 0-1.4-.3-1.7-1.1l-11-29.3v29.2c0 .7-.4 1.1-1.2 1.1h-5.7c-.8 0-1.2-.4-1.2-1.1V3.7c0-.7.4-1.1 1.2-1.1h11.5zm57.7 0c.9 0 1.4.3 1.7 1.1L283 31.4l10.2-27.7c.3-.7.7-1.1 1.7-1.1h11.6c.8 0 1.2.4 1.2 1.1v35.2c0 .7-.4 1.1-1.2 1.1h-6.3c-.7 0-1.2-.4-1.2-1.1V9.8L287.9 39c-.2.7-.7 1.1-1.7 1.1h-7.1c-1 0-1.4-.3-1.7-1.1l-11-29.3v29.2c0 .7-.4 1.1-1.2 1.1h-5.7c-.8 0-1.2-.4-1.2-1.1V3.7c0-.7.4-1.1 1.2-1.1H271zm80.2 0c.7 0 1.2.4 1.2 1.1v4.8c0 .7-.4 1.1-1.2 1.1h-26.5v8.1H347c.7 0 1.2.4 1.2 1.1v4.6c0 .7-.5 1.1-1.2 1.1h-22.3V33h26.5c.7 0 1.2.4 1.2 1.1v4.8c0 .7-.4 1.1-1.2 1.1h-34c-.8 0-1.2-.4-1.2-1.1V3.7c0-.7.4-1.1 1.2-1.1h34z\"\n\t\t\tfill=\"#19255b\"></path>\n\t\t</symbol>\n\t\t<symbol viewBox=\"0 0 96 96\" id=\"radiant\">\n\t\t\t<path d=\"M68.2 51.6H34.1c-2 0-3.6-1.6-3.6-3.6s1.6-3.6 3.6-3.6h34.1c9.4 0 17.1-7.6 17.1-17.1 0-9.4-7.6-17.1-17.1-17.1H10.7v13.5h57.5c2 0 3.6 1.6 3.6 3.6s-1.6 3.6-3.6 3.6H34.1C24.6 30.9 17 38.6 17 48s7.6 17.1 17.1 17.1h34.1c2 0 3.6 1.6 3.6 3.6s-1.6 3.6-3.6 3.6H10.7v13.5h57.5c9.4 0 17.1-7.6 17.1-17.1 0-9.5-7.7-17.1-17.1-17.1\"></path>\n\t\t</symbol>\n\t\t<symbol viewBox=\"0 0 96 96\" id=\"thermo\">\n\t\t\t<path d=\"M67.3 48c0-.8.6-1.4 1.4-1.4s1.4.6 1.4 1.4c0 .8-.6 1.4-1.4 1.4s-1.4-.6-1.4-1.4M62 54.9v30.9h13.3V54.9c1.8-1.7 2.9-4.2 2.9-6.9s-1.1-5.1-2.9-6.9V16.9a6.7 6.7 0 0 0-13.4 0v24.3c-1.8 1.7-2.9 4.2-2.9 6.9s1.2 5 3 6.8M48 31.5c.8 0 1.4.6 1.4 1.4 0 .8-.6 1.4-1.4 1.4-.8 0-1.4-.6-1.4-1.4s.6-1.4 1.4-1.4m-6.7 8.3v46h13.3v-46c1.8-1.7 2.9-4.2 2.9-6.9s-1.1-5.1-2.9-6.9v-9.2a6.7 6.7 0 0 0-13.4 0V26c-1.8 1.7-2.9 4.2-2.9 6.9.1 2.7 1.2 5.1 3 6.9m-15.4 23c0-.8.6-1.4 1.4-1.4s1.4.6 1.4 1.4c0 .8-.6 1.4-1.4 1.4s-1.4-.7-1.4-1.4m-5.3 6.8v16.2H34V69.6c1.8-1.7 2.9-4.2 2.9-6.9s-1.1-5.1-2.9-6.9V16.9a6.7 6.7 0 0 0-13.4 0V56c-1.8 1.7-2.9 4.2-2.9 6.9 0 2.6 1.1 5 2.9 6.7\"></path>\n\t\t</symbol>\n\t\t<symbol viewBox=\"0 0 96 96\" id=\"tiemme-lab\">\n\t\t\t<path d=\"M48 51.9c-2 0-3.6-1.6-3.6-3.6s1.6-3.6 3.6-3.6 3.6 1.6 3.6 3.6-1.6 3.6-3.6 3.6m31.1 5.6c-.2-.1-.4-.3-.6-.4L65 49.8c0-.5.1-1 .1-1.5s0-1-.1-1.5l13.1-7.1c.1-.1.2-.1.4-.2.1-.1.2-.1.4-.2h.1c2.9-1.9 4-5.8 2.3-8.9-1.8-3.3-5.9-4.5-9.1-2.7L58.7 35c-1.2-.9-2.4-1.7-3.8-2.3V17c0-3.7-3-6.8-6.8-6.8-3.7 0-6.8 3-6.8 6.8v15.6c-1.4.6-2.7 1.4-3.8 2.3L24 27.6c-3.3-1.8-7.4-.6-9.1 2.7-1.7 3.1-.7 7 2.3 8.9h.1c.1.1.2.1.4.2.1.1.2.1.4.2L31 46.8c0 .5-.1 1-.1 1.5s0 1 .1 1.5l-13.5 7.3c-.2.1-.4.2-.6.4-2.8 1.9-3.8 5.7-2.1 8.8 1.8 3.3 5.9 4.5 9.1 2.7l13.5-7.3c1.2.9 2.4 1.7 3.8 2.3v15.1c0 3.7 3 6.8 6.8 6.8 3.7 0 6.8-3 6.8-6.8V64c1.4-.6 2.7-1.4 3.8-2.3L72.1 69c3.3 1.8 7.4.6 9.1-2.7 1.7-3.1.7-6.9-2.1-8.8\"></path>\n\t\t</symbol>\n\t\t<symbol viewBox=\"0 0 96 96\" id=\"valves\">\n\t\t\t<path d=\"M48 72.6c-7.5 0-13.5-6.1-13.5-13.5 0-2.6.8-5.1 2.1-7.2l.2-.3.1-.1 11.2-17 11.2 17c1.4 2.2 2.3 4.7 2.3 7.5-.1 7.5-6.1 13.6-13.6 13.6m22.4-27.9l-.2-.4c0-.1-.1-.1-.1-.2L48 10.3 25.9 44.1c0 .1-.1.1-.1.2l-.3.4c-2.7 4.2-4.2 9.1-4.2 14.4 0 14.7 11.9 26.7 26.7 26.7s26.7-11.9 26.7-26.7c0-5.3-1.6-10.3-4.3-14.4\"></path>\n\t\t</symbol>\n\t\t<symbol viewBox=\"0 0 96 96\" id=\"taps\">\n\t\t\t<path d=\"M85.7 73.4c-.1-.1-.1-.1-.1-.2L79 63l-6.6 10.2v.1l-.1.1c-.8 1.3-1.3 2.7-1.3 4.3 0 4.4 3.6 8 8 8s8-3.6 8-8c0-1.6-.5-3.1-1.3-4.3zm8.1-15.5c-1.6-7.7-8.5-13.6-16.8-13.6H19.4c-2 0-3.6-1.6-3.6-3.6s1.6-3.6 3.6-3.6h34.3c9.5 0 17.1-7.7 17.1-17.1v-9.8H57.2V20c0 2-1.6 3.6-3.6 3.6H19.4c-9.5 0-17.1 7.7-17.1 17.1 0 9.5 7.7 17.1 17.1 17.1H77l16.8.1z\"></path>\n\t\t</symbol>\n\t\t<symbol viewBox=\"0 0 8 12\" id=\"caret-right\">\n\t\t\t<path d=\"M0 12V0l8 6-8 6z\" fill-rule=\"evenodd\" clip-rule=\"evenodd\"></path>\n\t\t</symbol>\n\t\t<symbol viewBox=\"0 0 8 17\" id=\"facebook\">\n\t\t\t<path d=\"M5.2 16.7H1.9V8.5H.2V5.7h1.7V4c0-2.3 1-3.7 3.7-3.7h2.3v2.8H6.4c-1.1 0-1.1.4-1.1 1.1v1.4h2.6l-.4 2.9H5.2v8.2z\" fill-rule=\"evenodd\" clip-rule=\"evenodd\"></path>\n\t\t</symbol>\n\t\t<symbol viewBox=\"0 0 23 17\" id=\"youtube\">\n\t\t\t<path d=\"M11.5.5s-4.8 0-8 .2c-.9 0-1.7.4-2.3 1-.5.6-.8 1.4-.9 2.2C.2 5.2.1 6.4.1 7.6v1.7c0 1.2.1 2.5.2 3.7.1.8.4 1.6.9 2.3.7.6 1.6 1 2.5 1 1.8.2 7.8.2 7.8.2s4.8 0 8-.2c.9 0 1.7-.4 2.3-1 .5-.7.8-1.4.9-2.3.1-1.2.2-2.5.2-3.7V7.6c0-1.2-.1-2.5-.2-3.7-.1-.8-.4-1.6-.9-2.3-.6-.6-1.4-1-2.3-1-3.2-.1-8-.1-8-.1m-2.4 11l6.2-3.2-6.2-3.2v6.4z\"\n\t\t\tfill-rule=\"evenodd\" clip-rule=\"evenodd\"></path>\n\t\t</symbol>\n\t\t<symbol viewBox=\"0 0 18 17\" id=\"linkedin\">\n\t\t\t<path d=\"M4.3 16.7V5.6H.6v11.1h3.7zM2.5 4.1c1.1-.1 1.9-1 1.8-2S3.3.2 2.3.3C1.3.4.5 1.2.5 2.2c0 1 .8 1.9 1.9 1.9h.1zm3.9 12.6H10v-6.2c0-.3 0-.6.1-.9.3-.8 1-1.3 1.9-1.3 1.3 0 1.9 1 1.9 2.5v5.9h3.7v-6.3c0-3.4-1.8-5-4.2-5-1.4-.1-2.7.7-3.4 1.8V5.6H6.4v11.1z\"\n\t\t\tfill-rule=\"evenodd\" clip-rule=\"evenodd\"></path>\n\t\t</symbol>\n\t\t<symbol viewBox=\"0 0 20 20\" id=\"websolute\">\n\t\t\t<path d=\"M20 10c0 5.5-4.5 10-10 10S0 15.5 0 10 4.5 0 10 0s10 4.5 10 10m-10 2.3c.5.5 1.3.8 2.1.8s1.5-.3 2.1-.8c.5-.5.8-1.2.8-2V7.5h-1.7v2.8c0 .3-.1.6-.4.8-.1.1-.3.2-.4.3-.2.1-.3.1-.5.1s-.3 0-.5-.1c-.1-.1-.3-.2-.4-.3-.2-.2-.4-.5-.4-.8V7.6H9.2v2.8c0 .3-.1.6-.4.9-.2.2-.5.4-.8.4-.3 0-.7-.1-.9-.3-.2-.2-.4-.5-.3-.8V7.5H5v2.8c0 .7.3 1.5.8 2 .6.5 1.3.8 2.1.8.8.1 1.6-.2 2.1-.8z\"\n\t\t\tfill-rule=\"evenodd\" clip-rule=\"evenodd\"></path>\n\t\t</symbol>\n\t\t<symbol viewBox=\"0 0 21 23\" id=\"search\">\n\t\t\t<path d=\"M20.6 20.3l-4.9-5.2c1.2-1.7 1.8-3.7 1.8-5.7 0-5.2-3.9-9.4-8.7-9.4S0 4.2 0 9.4s3.7 7.8 6.3 8.4c1.8.4 3.9.6 7.1-.7l5.1 5.4c.5.6 1.4.6 2 .1l.1-.1c.5-.6.5-1.6 0-2.2zM15 9.4c-.2 3.5-3.2 6.1-6.7 5.8S2.2 12 2.5 8.5c.2-3.3 3-5.8 6.3-5.8 3.5.1 6.3 3.1 6.2 6.7z\"\n\t\t\tfill-rule=\"evenodd\" clip-rule=\"evenodd\"></path>\n\t\t</symbol>\n\t\t<symbol viewBox=\"0 0 24 24\" id=\"result-indicator\">\n\t\t\t<path d=\"M11 21.883l-6.235-7.527-.765.644 7.521 9 7.479-9-.764-.645-6.236 7.529v-21.884h-1v21.883z\"/>\n\t\t</symbol>\n\t\t<symbol viewBox=\"0 0 18 18\" id=\"bullet\">\n\t\t\t<path d=\"M9 2c3.9 0 7 3.1 7 7s-3.1 7-7 7-7-3.1-7-7 3.1-7 7-7m0-2C4 0 0 4 0 9s4 9 9 9 9-4 9-9-4-9-9-9z\" opacity=\".15\" fill=\"#17265a\"></path>\n\t\t\t<circle cx=\"9\" cy=\"9\" r=\"4\" fill=\"#17265a\"></circle>\n\t\t</symbol>\n\t</svg>\n\t"
  };

  var SrcDirective =
  /*#__PURE__*/
  function (_Component) {
    _inheritsLoose(SrcDirective, _Component);

    function SrcDirective() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = SrcDirective.prototype;

    _proto.onChanges = function onChanges(changes) {
      var _getContext = rxcomp.getContext(this),
          node = _getContext.node;

      node.setAttribute('src', this.src);
    };

    return SrcDirective;
  }(rxcomp.Component);
  SrcDirective.meta = {
    selector: '[[src]]',
    inputs: ['src']
  };

  var SwiperDirective =
  /*#__PURE__*/
  function (_Component) {
    _inheritsLoose(SwiperDirective, _Component);

    function SwiperDirective() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = SwiperDirective.prototype;

    _proto.onInit = function onInit() {
      this.options = {
        slidesPerView: 'auto',
        spaceBetween: 0,
        centeredSlides: true,
        speed: 600,
        autoplay: {
          delay: 5000
        },
        keyboardControl: true,
        mousewheelControl: false,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        keyboard: {
          enabled: true,
          onlyInViewport: true
        }
      };
      this.init_();
    };

    _proto.onChanges = function onChanges() {
      this.swiperInitOrUpdate_();
    };

    _proto.onDestroy = function onDestroy() {
      this.removeListeners_();
      this.swiperDestroy_();
    };

    _proto.onBeforePrint = function onBeforePrint() {
      this.swiperDestroy_();
    };

    _proto.slideToIndex = function slideToIndex(index) {
      // console.log('SwiperDirective.slideToIndex', index);
      if (this.swiper) {
        this.swiper.slideTo(index);
      }
    };

    _proto.init_ = function init_() {
      var _this = this;

      this.events$ = new rxjs.Subject();

      if (this.enabled) {
        var _getContext = rxcomp.getContext(this),
            node = _getContext.node;

        TweenMax.set(node, {
          opacity: 0
        });
        this.index = 0;
        var on = this.options.on || {};

        on.slideChange = function () {
          var swiper = _this.swiper;
          _this.index = swiper.activeIndex;

          _this.events$.next(_this.index);

          _this.pushChanges();
        };

        this.options.on = on;
        this.addListeners_();
      }
    };

    _proto.addListeners_ = function addListeners_() {
      this.onBeforePrint = this.onBeforePrint.bind(this);
      window.addEventListener('beforeprint', this.onBeforePrint);
      /*
      scope.$on('onResize', ($scope) => {
      	this.onResize(scope, element, attributes);
      });
      */
    };

    _proto.removeListeners_ = function removeListeners_() {
      window.removeEventListener('beforeprint', this.onBeforePrint);
    };

    _proto.swiperInitOrUpdate_ = function swiperInitOrUpdate_() {
      if (this.enabled) {
        var _getContext2 = rxcomp.getContext(this),
            node = _getContext2.node;

        if (this.swiper) {
          this.swiper.update();
        } else {
          var swiper;
          var on = this.options.on || (this.options.on = {});
          var callback = on.init;

          if (!on.init || !on.init.swiperDirectiveInit) {
            on.init = function () {
              var _this2 = this;

              TweenMax.to(node, 0.4, {
                opacity: 1,
                ease: Power2.easeOut
              });
              setTimeout(function () {
                if (typeof callback === 'function') {
                  callback.apply(_this2, [swiper, element, scope]);
                }
              }, 1);
            };

            on.init.swiperDirectiveInit = true;
          }

          TweenMax.set(node, {
            opacity: 1
          });
          swiper = new Swiper(node, this.options);
          this.swiper = swiper;
          this.swiper._opening = true;
          node.classList.add('swiper-init');
        }
      }
    };

    _proto.swiperDestroy_ = function swiperDestroy_() {
      if (this.swiper) {
        this.swiper.destroy();
      }
    };

    _createClass(SwiperDirective, [{
      key: "enabled",
      get: function get() {
        return !window.matchMedia('print').matches;
      }
    }]);

    return SwiperDirective;
  }(rxcomp.Component);
  SwiperDirective.meta = {
    selector: '[swiper]',
    inputs: ['consumer']
  };

  var SwiperListingDirective =
  /*#__PURE__*/
  function (_SwiperDirective) {
    _inheritsLoose(SwiperListingDirective, _SwiperDirective);

    function SwiperListingDirective() {
      return _SwiperDirective.apply(this, arguments) || this;
    }

    var _proto = SwiperListingDirective.prototype;

    _proto.onInit = function onInit() {
      this.options = {
        slidesPerView: 'auto',
        spaceBetween: 30,
        speed: 600,
        keyboardControl: true,
        mousewheelControl: false,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        keyboard: {
          enabled: true,
          onlyInViewport: true
        }
      };
      this.init_();
      console.log('SwiperListingDirective.onInit');
    };

    return SwiperListingDirective;
  }(SwiperDirective);
  SwiperListingDirective.meta = {
    selector: '[swiper-listing]'
  };

  var SwiperSlidesDirective =
  /*#__PURE__*/
  function (_SwiperDirective) {
    _inheritsLoose(SwiperSlidesDirective, _SwiperDirective);

    function SwiperSlidesDirective() {
      return _SwiperDirective.apply(this, arguments) || this;
    }

    var _proto = SwiperSlidesDirective.prototype;

    _proto.onInit = function onInit() {
      this.options = {
        slidesPerView: 3,
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
        onSlideClick: function onSlideClick(swiper) {// angular.element(swiper.clickedSlide).scope().clicked(angular.element(swiper.clickedSlide).scope().$index);
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        keyboard: {
          enabled: true,
          onlyInViewport: true
        }
      };
      this.init_();
    };

    return SwiperSlidesDirective;
  }(SwiperDirective);
  SwiperSlidesDirective.meta = {
    selector: '[swiper-slides]'
  };

  function push_(event) {
    var dataLayer = window.dataLayer || [];
    dataLayer.push(event);
    console.log('GtmService.dataLayer', event);
  }

  var GtmService =
  /*#__PURE__*/
  function () {
    function GtmService() {}

    GtmService.push = function push(event) {
      return push_(event);
    };

    return GtmService;
  }();

  var VideoComponent =
  /*#__PURE__*/
  function (_Component) {
    _inheritsLoose(VideoComponent, _Component);

    function VideoComponent() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = VideoComponent.prototype;

    _proto.onInit = function onInit() {
      var _this = this;

      this.item = {};

      var _getContext = rxcomp.getContext(this),
          node = _getContext.node,
          parentInstance = _getContext.parentInstance;

      this.video = node.querySelector('video');
      this.progress = node.querySelector('.icon--play-progress path');

      if (parentInstance instanceof SwiperDirective) {
        console.log(parentInstance);
        parentInstance.events$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (event) {
          return _this.pause();
        });
      }

      this.addListeners();
    };

    _proto.onDestroy = function onDestroy() {
      this.removeListeners();
    };

    _proto.addListeners = function addListeners() {
      var video = this.video;

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
    };

    _proto.removeListeners = function removeListeners() {
      var video = this.video;

      if (video) {
        video.removeEventListener('play', this.onPlay);
        video.removeEventListener('pause', this.onPause);
        video.removeEventListener('ended', this.onEnded);
        video.removeEventListener('timeupdate', this.onTimeUpdate);
      }
    };

    _proto.togglePlay = function togglePlay() {
      console.log('VideoComponent.togglePlay');
      var video = this.video;

      if (video) {
        if (video.paused) {
          this.play();
        } else {
          this.pause();
        }
      }
    };

    _proto.play = function play() {
      var video = this.video;
      video.muted = false;
      video.play();
    };

    _proto.pause = function pause() {
      var video = this.video;
      video.muted = true;
      video.pause();
    };

    _proto.onPlay = function onPlay() {
      this.playing = true;
      GtmService.push({
        event: 'video play',
        video_name: this.video.src
      });
    };

    _proto.onPause = function onPause() {
      this.playing = false;
    };

    _proto.onEnded = function onEnded() {
      this.playing = false;
    };

    _proto.onTimeUpdate = function onTimeUpdate() {
      this.progress.style.strokeDashoffset = this.video.currentTime / this.video.duration;
    };

    _createClass(VideoComponent, [{
      key: "playing",
      get: function get() {
        return this.playing_;
      },
      set: function set(playing) {
        if (this.playing_ !== playing) {
          this.playing_ = playing;
          this.pushChanges();
        }
      }
    }]);

    return VideoComponent;
  }(rxcomp.Component);
  VideoComponent.meta = {
    selector: '[video]',
    inputs: ['item']
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

  };

  var AppModule =
  /*#__PURE__*/
  function (_Module) {
    _inheritsLoose(AppModule, _Module);

    function AppModule() {
      return _Module.apply(this, arguments) || this;
    }

    return AppModule;
  }(rxcomp.Module);
  AppModule.meta = {
    imports: [rxcomp.CoreModule],
    declarations: [AppearDirective, DropdownDirective, HeaderComponent, LazyDirective, ProductMenuComponent, SpritesComponent, SrcDirective, SwiperDirective, SwiperListingDirective, SwiperSlidesDirective, VideoComponent],
    bootstrap: AppComponent
  };

  rxcomp.Browser.bootstrap(AppModule);

})));
