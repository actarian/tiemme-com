/**
 * @license tiemme-com v1.0.0
 * (c) 2020 Luca Zampetti <lzampetti@gmail.com>
 * License: MIT
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('rxcomp'), require('rxcomp-form'), require('rxjs/operators'), require('rxjs')) :
  typeof define === 'function' && define.amd ? define('main', ['rxcomp', 'rxcomp-form', 'rxjs/operators', 'rxjs'], factory) :
  (global = global || self, factory(global.rxcomp, global['rxcomp-form'], global.rxjs.operators, global.rxjs));
}(this, (function (rxcomp, rxcompForm, operators, rxjs) { 'use strict';

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

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }

  var FilterMode = {
    SELECT: 'select',
    AND: 'and',
    OR: 'or'
  };

  var FilterItem =
  /*#__PURE__*/
  function () {
    function FilterItem(filter) {
      this.change$ = new rxjs.BehaviorSubject();
      this.mode = FilterMode.SELECT;
      this.filter = 'Filter';
      this.placeholder = 'Select';
      this.values = [];
      this.options = [];

      if (filter) {
        Object.assign(this, filter);
      }

      if (filter.mode === FilterMode.SELECT) {
        filter.options.unshift({
          label: filter.placeholder,
          value: undefined
        });
      }
    }

    var _proto = FilterItem.prototype;

    _proto.filter = function filter(item, value) {
      return item.options.indexOf(value) !== -1;
    };

    _proto.match = function match(item) {
      var _this = this;

      var match;

      if (this.mode === FilterMode.OR) {
        match = this.values.length ? false : true;
        this.values.forEach(function (value) {
          match = match || _this.filter(item, value);
        });
      } else {
        match = true;
        this.values.forEach(function (value) {
          match = match && _this.filter(item, value);
        });
      }

      return match;
    };

    _proto.getLabel = function getLabel() {
      if (this.mode === FilterMode.SELECT) {
        return this.placeholder || this.label;
      } else {
        return this.label;
      }
    };

    _proto.has = function has(item) {
      return this.values.indexOf(item.value) !== -1;
    };

    _proto.set = function set(item) {
      if (this.mode === FilterMode.SELECT) {
        this.values = [];
      }

      var index = this.values.indexOf(item.value);

      if (index === -1) {
        if (item.value !== undefined) {
          this.values.push(item.value);
        }
      }

      if (this.mode === FilterMode.SELECT) {
        this.placeholder = item.label;
      } // console.log('FilterItem.set', item);


      this.change$.next();
    };

    _proto.remove = function remove(item) {
      var index = this.values.indexOf(item.value);

      if (index !== -1) {
        this.values.splice(index, 1);
      }

      if (this.mode === FilterMode.SELECT) {
        var first = this.options[0];
        this.placeholder = first.label;
      } // console.log('FilterItem.remove', item);


      this.change$.next();
    };

    _proto.toggle = function toggle(item) {
      if (this.has(item)) {
        this.remove(item);
      } else {
        this.set(item);
      }
    };

    return FilterItem;
  }();

  var LocationService =
  /*#__PURE__*/
  function () {
    function LocationService() {}

    LocationService.get = function get(key) {
      var params = new URLSearchParams(window.location.search); // console.log('LocationService.get', params);

      return params.get(key);
    };

    LocationService.set = function set(keyOrValue, value) {
      var params = new URLSearchParams(window.location.search);

      if (typeof keyOrValue === 'string') {
        params.set(keyOrValue, value);
      } else {
        params.set(keyOrValue, '');
      }

      this.replace(params); // console.log('LocationService.set', params, keyOrValue, value);
    };

    LocationService.replace = function replace(params) {
      if (window.history && window.history.pushState) {
        var title = document.title;
        var url = window.location.href.split('?')[0] + "?" + params.toString();
        window.history.pushState(params.toString(), title, url);
      }
    };

    LocationService.deserialize = function deserialize(key) {
      var encoded = this.get('params');
      return this.decode(key, encoded);
    };

    LocationService.serialize = function serialize(keyOrValue, value) {
      var params = this.deserialize();
      var encoded = this.encode(keyOrValue, value, params);
      this.set('params', encoded);
    };

    LocationService.decode = function decode(key, encoded) {
      var decoded = null;

      if (encoded) {
        var json = window.atob(encoded);
        decoded = JSON.parse(json);
      }

      if (key && decoded) {
        decoded = decoded[key];
      }

      return decoded || null;
    };

    LocationService.encode = function encode(keyOrValue, value, params) {
      params = params || {};
      var encoded = null;

      if (typeof keyOrValue === 'string') {
        params[keyOrValue] = value;
      } else {
        params = keyOrValue;
      }

      var json = JSON.stringify(params);
      encoded = window.btoa(json);
      return encoded;
    };

    return LocationService;
  }();

  var FilterService =
  /*#__PURE__*/
  function () {
    function FilterService(options, initialParams, callback) {
      var filters = {};

      if (options) {
        Object.keys(options).forEach(function (key) {
          var filter = new FilterItem(options[key]);

          if (typeof callback === 'function') {
            callback(key, filter);
          }

          filters[key] = filter;
        });
      }

      this.filters = filters;
      this.deserialize(this.filters, initialParams);
    }

    var _proto = FilterService.prototype;

    _proto.getParamsCount = function getParamsCount(params) {
      if (params) {
        var paramsCount = Object.keys(params).reduce(function (p, c, i) {
          var values = params[c];
          return p + (values ? values.length : 0);
        }, 0);
        return paramsCount;
      } else {
        return 0;
      }
    };

    _proto.deserialize = function deserialize(filters, initialParams) {
      var params;

      if (initialParams && this.getParamsCount(initialParams)) {
        params = initialParams;
      }

      var locationParams = LocationService.deserialize('filters');

      if (locationParams && this.getParamsCount(locationParams)) {
        params = locationParams;
      }

      if (params) {
        Object.keys(filters).forEach(function (key) {
          filters[key].values = params[key] || [];
        });
      }

      return filters;
    };

    _proto.serialize = function serialize(filters) {
      var params = {};
      var any = false;
      Object.keys(filters).forEach(function (x) {
        var filter = filters[x];

        if (filter.value !== null) {
          params[x] = filter.values;
          any = true;
        }
      });

      if (!any) {
        params = null;
      } // console.log('ReferenceCtrl.serialize', params);


      LocationService.serialize('filters', params);
      return params;
    };

    _proto.items$ = function items$(items) {
      var _this = this;

      var filters = this.filters;
      var changes = Object.keys(filters).map(function (key) {
        return filters[key].change$;
      });
      return rxjs.merge.apply(void 0, changes).pipe( // tap(() => console.log(filters)),
      operators.tap(function () {
        return _this.serialize(filters);
      }), operators.map(function () {
        return _this.filterItems(items);
      }));
    };

    _proto.filterItems = function filterItems(items, skipFilter) {
      var _this2 = this;

      var filters = Object.keys(this.filters).map(function (x) {
        return _this2.filters[x];
      }).filter(function (x) {
        return x.value !== null;
      });
      items = items.filter(function (item) {
        var has = true;
        filters.forEach(function (filter) {
          if (filter !== skipFilter) {
            has = has && filter.match(item);
          }
        });
        return has;
      });
      return items;
    };

    _proto.updateFilterStates = function updateFilterStates(filters, items) {
      var _this3 = this;

      Object.keys(filters).forEach(function (x) {
        var filter = filters[x];

        var _this3$filterItems = _this3.filterItems(items, filter),
            filteredItems = _this3$filterItems.filteredItems;

        filter.options.forEach(function (option) {
          var has = false;

          if (option.value) {
            var i = 0;

            while (i < filteredItems.length && !has) {
              var item = filteredItems[i];
              has = filter.filter(item, option.value);
              i++;
            }
          } else {
            has = true;
          }

          option.disabled = !has;
        });
      });
    };

    return FilterService;
  }();

  var AgentsComponent =
  /*#__PURE__*/
  function (_Component) {
    _inheritsLoose(AgentsComponent, _Component);

    function AgentsComponent() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = AgentsComponent.prototype;

    _proto.onInit = function onInit() {
      var _this = this;

      var items = window.agents || [];
      var filters = window.filters || {};
      var initialParams = window.params || {};
      filters.countries.mode = FilterMode.SELECT;
      filters.regions.mode = FilterMode.SELECT;
      filters.provinces.mode = FilterMode.SELECT;
      filters.categories.mode = FilterMode.SELECT;
      var filterService = new FilterService(filters, initialParams, function (key, filter) {
        switch (key) {
          case 'countries':
            filter.filter = function (item, value) {
              return item.country === value;
            };

            break;

          case 'regions':
            filter.filter = function (item, value) {
              return item.regions && item.regions.indexOf(value) !== -1;
            };

            break;

          case 'provinces':
            filter.filter = function (item, value) {
              return item.provinces && item.provinces.indexOf(value) !== -1;
            };

            break;

          case 'categories':
            filter.filter = function (item, value) {
              return item.categories && item.categories.indexOf(value) !== -1;
            };

            break;

          default:
            filter.filter = function (item, value) {
              return true;
            };

        }
      });
      filterService.items$(items).pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (items) {
        _this.items = items;

        _this.pushChanges();
        /*
        setTimeout(() => {
        	this.items = items;
        	this.pushChanges();
        }, 50);
        */
        // console.log('AgentsComponent.items', items.length);

      });
      this.filterService = filterService;
      this.filters = filterService.filters;
    };

    _proto.hasCategory = function hasCategory(item, id) {
      return item.categories && item.categories.indexOf(id) !== -1;
    }
    /*
    collect() {
    	let provinces = [];
    	items.forEach(x => {
    		if (x.provinces) {
    			x.provinces.forEach(province => {
    				if (provinces.indexOf(province) === -1) {
    					provinces.push(province);
    				}
    			})
    		}
    	});
    	provinces = provinces.sort().map(x => {
    		return {
    			value: x,
    			label: x,
    		}
    	});
    	console.log(JSON.stringify(provinces));
    }
    */
    ;

    return AgentsComponent;
  }(rxcomp.Component);
  AgentsComponent.meta = {
    selector: '[agents]'
  };

  var UserService =
  /*#__PURE__*/
  function () {
    function UserService() {}

    UserService.setUser = function setUser(user) {
      this.user$.next(user);
    };

    return UserService;
  }();
  UserService.user$ = new rxjs.BehaviorSubject(null);

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

      var _getContext = rxcomp.getContext(this),
          node = _getContext.node;

      node.classList.remove('hidden'); // console.log('context', context);

      UserService.user$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (user) {
        console.log('AppComponent.user$', user);
        _this.user = user;

        _this.pushChanges();
      });
    };

    _proto.onDropped = function onDropped(id) {
      console.log('AppComponent.onDropped', id);
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

    _proto.onInit = function onInit() {
      var _getContext = rxcomp.getContext(this),
          node = _getContext.node;

      node.classList.add('appear');
    };

    _proto.onChanges = function onChanges() {
      if (!this.appeared) {
        this.appeared = true;

        var _getContext2 = rxcomp.getContext(this),
            node = _getContext2.node;

        IntersectionService.intersection$(node).pipe(operators.first(), operators.takeUntil(this.unsubscribe$)).subscribe(function (src) {
          node.classList.add('appeared');
        });
      }
    };

    return AppearDirective;
  }(rxcomp.Directive);
  AppearDirective.meta = {
    selector: '[appear]'
  };

  var ClickOutsideDirective =
  /*#__PURE__*/
  function (_Directive) {
    _inheritsLoose(ClickOutsideDirective, _Directive);

    function ClickOutsideDirective() {
      return _Directive.apply(this, arguments) || this;
    }

    var _proto = ClickOutsideDirective.prototype;

    _proto.onInit = function onInit() {
      var _this = this;

      this.initialFocus = false;

      var _getContext = rxcomp.getContext(this),
          module = _getContext.module,
          node = _getContext.node,
          parentInstance = _getContext.parentInstance,
          selector = _getContext.selector;

      var event$ = this.event$ = rxjs.fromEvent(document, 'click').pipe(operators.filter(function (event) {
        var target = event.target; // console.log('ClickOutsideDirective.onClick', this.element.nativeElement, target, this.element.nativeElement.contains(target));
        // const documentContained: boolean = Boolean(document.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_CONTAINED_BY);
        // console.log(target, documentContained);

        var clickedInside = node.contains(target) || !document.contains(target);

        if (!clickedInside) {
          if (_this.initialFocus) {
            _this.initialFocus = false;
            return true;
          }
        } else {
          _this.initialFocus = true;
        }
      }), operators.shareReplay(1));
      var expression = node.getAttribute("(clickOutside)");

      if (expression) {
        var outputFunction = module.makeFunction(expression, ['$event']);
        event$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (event) {
          module.resolve(outputFunction, parentInstance, event);
        });
      } else {
        parentInstance.clickOutside$ = event$;
      }
    };

    return ClickOutsideDirective;
  }(rxcomp.Directive);
  ClickOutsideDirective.meta = {
    selector: "[(clickOutside)]"
  };

  var HttpService =
  /*#__PURE__*/
  function () {
    function HttpService() {}

    HttpService.http$ = function http$(method, url, data) {
      var methods = ['POST', 'PUT', 'PATCH'];
      return rxjs.from(fetch(url, {
        method: method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: methods.indexOf(method) !== -1 ? JSON.stringify(data) : undefined
      }).then(function (response) {
        return response.json();
      }).catch(function (error) {
        return console.log('postData$', error);
      }));
    };

    HttpService.get$ = function get$(url, data) {
      var query = this.query(data);
      return this.http$('GET', "" + url + query);
    };

    HttpService.delete$ = function delete$(url) {
      return this.http$('DELETE', url);
    };

    HttpService.post$ = function post$(url, data) {
      return this.http$('POST', url, data);
    };

    HttpService.put$ = function put$(url, data) {
      return this.http$('PUT', url, data);
    };

    HttpService.patch$ = function patch$(url, data) {
      return this.http$('PATCH', url, data);
    };

    HttpService.query = function query(data) {
      return ''; // todo
    };

    return HttpService;
  }();

  var ClubForgotComponent =
  /*#__PURE__*/
  function (_Component) {
    _inheritsLoose(ClubForgotComponent, _Component);

    function ClubForgotComponent() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = ClubForgotComponent.prototype;

    _proto.onInit = function onInit() {
      var _this = this;

      this.http = HttpService;
      this.submitted = false;
      var form = new rxcompForm.FormGroup({
        email: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator(), rxcompForm.Validators.EmailValidator()]),
        checkRequest: window.antiforgery,
        checkField: ''
      });
      var controls = form.controls;
      this.controls = controls;
      form.changes$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (changes) {
        // console.log('ClubForgotComponent.form.changes$', changes, form.valid);
        _this.pushChanges();
      });
      this.form = form;
    };

    _proto.test = function test() {
      this.form.patch({
        email: 'jhonappleseed@gmail.com',
        checkRequest: window.antiforgery,
        checkField: ''
      });
    };

    _proto.reset = function reset() {
      this.form.reset();
    };

    _proto.onSubmit = function onSubmit() {
      var _this2 = this;

      // console.log('ClubForgotComponent.onSubmit', 'form.valid', valid);
      if (this.form.valid) {
        // console.log('ClubForgotComponent.onSubmit', this.form.value);
        this.form.submitted = true;
        this.http.post$('/WS/wsUsers.asmx/Login', this.form.value).subscribe(function (response) {
          console.log('ClubForgotComponent.onSubmit', response);

          _this2.sent.next(true);

          _this2.submitted = true; // this.form.reset();
        });
      } else {
        this.form.touched = true;
      }
    };

    _proto.onLogin = function onLogin() {
      this.login.next();
    };

    _proto.onRegister = function onRegister() {
      this.register.next();
    };

    return ClubForgotComponent;
  }(rxcomp.Component);
  ClubForgotComponent.meta = {
    selector: '[club-forgot]',
    outputs: ['sent', 'login', 'register']
  };

  var ModalEvent = function ModalEvent(data) {
    this.data = data;
  };
  var ModalResolveEvent =
  /*#__PURE__*/
  function (_ModalEvent) {
    _inheritsLoose(ModalResolveEvent, _ModalEvent);

    function ModalResolveEvent() {
      return _ModalEvent.apply(this, arguments) || this;
    }

    return ModalResolveEvent;
  }(ModalEvent);
  var ModalRejectEvent =
  /*#__PURE__*/
  function (_ModalEvent2) {
    _inheritsLoose(ModalRejectEvent, _ModalEvent2);

    function ModalRejectEvent() {
      return _ModalEvent2.apply(this, arguments) || this;
    }

    return ModalRejectEvent;
  }(ModalEvent);

  var ModalService =
  /*#__PURE__*/
  function () {
    function ModalService() {}

    ModalService.open$ = function open$(modal) {
      var _this = this;

      return this.getTemplate$(modal.src).pipe(operators.map(function (template) {
        return {
          node: _this.getNode(template),
          data: modal.data,
          modal: modal
        };
      }), operators.tap(function (node) {
        return _this.modal$.next(node);
      }), operators.switchMap(function (node) {
        return _this.events$;
      }));
    };

    ModalService.load$ = function load$(modal) {};

    ModalService.getTemplate$ = function getTemplate$(url) {
      return rxjs.from(fetch(url).then(function (response) {
        return response.text();
      }));
    };

    ModalService.getNode = function getNode(template) {
      var div = document.createElement("div");
      div.innerHTML = template;
      var node = div.firstElementChild;
      return node;
    };

    ModalService.reject = function reject(data) {
      this.modal$.next(null);
      this.events$.next(new ModalRejectEvent(data));
    };

    ModalService.resolve = function resolve(data) {
      this.modal$.next(null);
      this.events$.next(new ModalResolveEvent(data));
    };

    return ModalService;
  }();
  ModalService.modal$ = new rxjs.Subject();
  ModalService.events$ = new rxjs.Subject();

  var ModalOutletComponent =
  /*#__PURE__*/
  function (_Component) {
    _inheritsLoose(ModalOutletComponent, _Component);

    function ModalOutletComponent() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = ModalOutletComponent.prototype;

    _proto.onInit = function onInit() {
      var _this = this;

      var _getContext = rxcomp.getContext(this),
          node = _getContext.node;

      this.modalNode = node.querySelector('.modal-outlet__modal');
      ModalService.modal$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (modal) {
        _this.modal = modal;
      });
    };

    _proto.onRegister = function onRegister(event) {
      // console.log('ModalComponent.onRegister');
      this.pushChanges();
    };

    _proto.onLogin = function onLogin(event) {
      // console.log('ModalComponent.onLogin');
      this.pushChanges();
    };

    _proto.reject = function reject(event) {
      ModalService.reject();
    };

    _createClass(ModalOutletComponent, [{
      key: "modal",
      get: function get() {
        return this.modal_;
      },
      set: function set(modal) {
        // console.log('ModalOutletComponent set modal', modal, this);
        var _getContext2 = rxcomp.getContext(this),
            module = _getContext2.module;

        if (this.modal_ && this.modal_.node) {
          module.remove(this.modal_.node, this);
          this.modalNode.removeChild(this.modal_.node);
        }

        if (modal && modal.node) {
          this.modal_ = modal;
          this.modalNode.appendChild(modal.node);
          var instances = module.compile(modal.node);
        }

        this.modal_ = modal;
        this.pushChanges();
      }
    }]);

    return ModalOutletComponent;
  }(rxcomp.Component);
  ModalOutletComponent.meta = {
    selector: '[modal-outlet]',
    template:
    /* html */
    "\n\t<div class=\"modal-outlet__container\" [class]=\"{ active: modal }\">\n\t\t<div class=\"modal-outlet__background\" (click)=\"reject($event)\"></div>\n\t\t<div class=\"modal-outlet__modal\"></div>\n\t</div>\n\t"
  };

  var ClubComponent =
  /*#__PURE__*/
  function (_Component) {
    _inheritsLoose(ClubComponent, _Component);

    function ClubComponent() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = ClubComponent.prototype;

    _proto.onInit = function onInit() {
      this.views = {
        SIGN_IN: 1,
        SIGN_UP: 2,
        FORGOTTEN: 3
      };
      this.view = this.views.SIGN_IN;
    };

    _proto.onForgot = function onForgot(event) {
      // console.log('ClubComponent.onForgot');
      this.view = this.views.FORGOTTEN;
      this.pushChanges();
    };

    _proto.onLogin = function onLogin(event) {
      // console.log('ClubComponent.onLogin');
      this.view = this.views.SIGN_IN;
      this.pushChanges();
    };

    _proto.onRegister = function onRegister(event) {
      // console.log('ClubComponent.onRegister');
      this.view = this.views.SIGN_UP;
      this.pushChanges();
    };

    _proto.onSignIn = function onSignIn(user) {
      console.log('ClubComponent.onSignIn', user);
      UserService.setUser(user);
      window.location.href = this.club; // nav to profile
    };

    _proto.onSignUp = function onSignUp(user) {
      console.log('ClubComponent.onSignUp', user);
      UserService.setUser(user);
      window.location.href = this.club; // nav to profile
    };

    _proto.onForgottenSent = function onForgottenSent(email) {
      /*
      console.log('ClubComponent.onForgottenSent', email);
      this.view = this.views.SIGN_IN;
      this.pushChanges();
      */
    };

    return ClubComponent;
  }(rxcomp.Component);
  ClubComponent.meta = {
    selector: '[club]',
    inputs: ['club']
  };

  var ClubModalComponent =
  /*#__PURE__*/
  function (_ClubComponent) {
    _inheritsLoose(ClubModalComponent, _ClubComponent);

    function ClubModalComponent() {
      return _ClubComponent.apply(this, arguments) || this;
    }

    var _proto = ClubModalComponent.prototype;

    _proto.onInit = function onInit() {
      _ClubComponent.prototype.onInit.call(this);

      var _getContext = rxcomp.getContext(this),
          parentInstance = _getContext.parentInstance;

      if (parentInstance instanceof ModalOutletComponent) {
        var data = parentInstance.modal.data;
        this.view = data.view; // console.log('ClubModalComponent.onInit', data);
      }
    };

    _proto.onSignIn = function onSignIn(user) {
      // console.log('ClubModalComponent.onSignIn', user);
      ModalService.resolve(user);
    };

    _proto.onSignUp = function onSignUp(user) {
      // console.log('ClubModalComponent.onSignUp', user);
      ModalService.resolve(user);
    }
    /*
    onDestroy() {
    	console.log('ClubModalComponent.onDestroy');
    }
    */
    ;

    _proto.close = function close() {
      ModalService.reject();
    };

    return ClubModalComponent;
  }(ClubComponent);
  ClubModalComponent.meta = {
    selector: '[club-modal]'
  };

  var ClubProfileComponent =
  /*#__PURE__*/
  function (_Component) {
    _inheritsLoose(ClubProfileComponent, _Component);

    function ClubProfileComponent() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = ClubProfileComponent.prototype;

    _proto.onInit = function onInit() {
      var _this = this;

      this.http = HttpService;
      var data = window.data || {
        roles: [],
        countries: [],
        provinces: []
      };
      var form = new rxcompForm.FormGroup({
        firstName: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        lastName: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        company: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        role: null,
        country: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        province: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        address: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        zipCode: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        city: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        telephone: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        fax: null,
        email: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator(), rxcompForm.Validators.EmailValidator()]),
        // username: new FormControl(null, [Validators.RequiredValidator()]),
        // password: new FormControl(null, [Validators.RequiredValidator()]),
        // passwordConfirm: new FormControl(null, [Validators.RequiredValidator(), this.MatchValidator('password')]),
        // privacy: new FormControl(null, Validators.RequiredTrueValidator()),
        newsletter: null,
        checkRequest: window.antiforgery,
        checkField: ''
      });
      var controls = form.controls;
      controls.role.options = data.roles;
      controls.country.options = data.countries;
      controls.province.options = [];
      this.controls = controls;
      form.changes$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (changes) {
        // console.log('ClubProfileComponent.form.changes$', changes, form.valid);
        _this.countryId = changes.country;

        _this.pushChanges();
      });
      this.data = data;
      this.form = form;
      this.test();
    };

    _proto.test = function test() {
      this.form.patch({
        firstName: 'Jhon',
        lastName: 'Appleseed',
        company: 'Websolute',
        role: this.controls.role.options[0].id,
        country: this.controls.country.options[0].id,
        address: 'Strada della Campanara',
        zipCode: '15',
        city: 'Pesaro',
        telephone: '00390721411112',
        email: 'jhonappleseed@gmail.com',
        // username: 'username',
        // password: 'password',
        // passwordConfirm: 'password',
        // privacy: true,
        checkRequest: window.antiforgery,
        checkField: ''
      });
    };

    _proto.MatchValidator = function MatchValidator(fieldName) {
      var _this2 = this;

      return new rxcompForm.FormValidator(function (value) {
        var field = _this2.form ? _this2.form.get(fieldName) : null;

        if (!value || !field) {
          return null;
        }

        return value !== field.value ? {
          match: {
            value: value,
            match: field.value
          }
        } : null;
      });
    };

    _proto.reset = function reset() {
      this.form.reset();
    };

    _proto.onSubmit = function onSubmit() {
      var _this3 = this;

      // console.log('ClubProfileComponent.onSubmit', 'form.valid', valid);
      if (this.form.valid) {
        // console.log('ClubProfileComponent.onSubmit', this.form.value);
        this.form.submitted = true;
        this.http.post$('/WS/wsUsers.asmx/Update', {
          data: this.form.value
        }).subscribe(function (response) {
          console.log('ClubProfileComponent.onSubmit', response);

          _this3.update.next(_this3.form.value); // change to response!!!
          // this.form.reset();

        });
      } else {
        this.form.touched = true;
      }
    };

    _createClass(ClubProfileComponent, [{
      key: "countryId",
      set: function set(countryId) {
        if (this.countryId_ !== countryId) {
          console.log('ClubProfileComponent.set countryId', countryId);
          this.countryId_ = countryId;
          var provinces = this.data.provinces.filter(function (province) {
            return String(province.idstato) === String(countryId);
          });
          this.controls.province.options = provinces;
          this.controls.province.hidden = provinces.length === 0;
          this.controls.province.value = null;
        }
      }
    }]);

    return ClubProfileComponent;
  }(rxcomp.Component);
  ClubProfileComponent.meta = {
    selector: '[club-profile]',
    outputs: ['update']
  };

  var ClubSigninComponent =
  /*#__PURE__*/
  function (_Component) {
    _inheritsLoose(ClubSigninComponent, _Component);

    function ClubSigninComponent() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = ClubSigninComponent.prototype;

    _proto.onInit = function onInit() {
      var _this = this;

      this.http = HttpService;
      var form = new rxcompForm.FormGroup({
        username: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        password: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        checkRequest: window.antiforgery,
        checkField: ''
      });
      var controls = form.controls;
      this.controls = controls;
      form.changes$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (changes) {
        // console.log('ClubSigninComponent.form.changes$', changes, form.valid);
        _this.pushChanges();
      });
      this.form = form;
    };

    _proto.test = function test() {
      this.form.patch({
        username: 'username',
        password: 'password',
        checkRequest: window.antiforgery,
        checkField: ''
      });
    };

    _proto.reset = function reset() {
      this.form.reset();
    };

    _proto.onSubmit = function onSubmit() {
      var _this2 = this;

      // console.log('ClubSigninComponent.onSubmit', 'form.valid', valid);
      if (this.form.valid) {
        // console.log('ClubSigninComponent.onSubmit', this.form.value);
        this.form.submitted = true; // this.http.post$('/WS/wsUsers.asmx/Login', this.form.value)

        rxjs.of(this.form.value).subscribe(function (response) {
          console.log('ClubSigninComponent.onSubmit', response);

          _this2.signIn.next(_this2.form.value); // change to response!!!
          // this.form.reset();

        });
      } else {
        this.form.touched = true;
      }
    };

    _proto.onForgot = function onForgot() {
      this.forgot.next();
    };

    _proto.onRegister = function onRegister() {
      this.register.next();
    };

    return ClubSigninComponent;
  }(rxcomp.Component);
  ClubSigninComponent.meta = {
    selector: '[club-signin]',
    outputs: ['signIn', 'forgot', 'register']
  };

  var ClubSignupComponent =
  /*#__PURE__*/
  function (_Component) {
    _inheritsLoose(ClubSignupComponent, _Component);

    function ClubSignupComponent() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = ClubSignupComponent.prototype;

    _proto.onInit = function onInit() {
      var _this = this;

      this.http = HttpService;
      var data = window.data || {
        roles: [],
        countries: [],
        provinces: []
      };
      var form = new rxcompForm.FormGroup({
        firstName: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        lastName: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        company: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        role: null,
        country: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        province: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        address: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        zipCode: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        city: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        telephone: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        fax: null,
        email: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator(), rxcompForm.Validators.EmailValidator()]),
        username: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator()]),
        password: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator()]),
        passwordConfirm: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator(), this.MatchValidator('password')]),
        privacy: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredTrueValidator()),
        newsletter: null,
        checkRequest: window.antiforgery,
        checkField: ''
      });
      var controls = form.controls;
      controls.role.options = data.roles;
      controls.country.options = data.countries;
      controls.province.options = [];
      this.controls = controls;
      form.changes$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (changes) {
        // console.log('ClubSignupComponent.form.changes$', changes, form.valid);
        _this.countryId = changes.country;

        _this.pushChanges();
      });
      this.data = data;
      this.form = form;
    };

    _proto.test = function test() {
      this.form.patch({
        firstName: 'Jhon',
        lastName: 'Appleseed',
        company: 'Websolute',
        role: this.controls.role.options[0].id,
        country: this.controls.country.options[0].id,
        address: 'Strada della Campanara',
        zipCode: '15',
        city: 'Pesaro',
        telephone: '00390721411112',
        email: 'jhonappleseed@gmail.com',
        username: 'username',
        password: 'password',
        passwordConfirm: 'password',
        privacy: true,
        checkRequest: window.antiforgery,
        checkField: ''
      });
    };

    _proto.MatchValidator = function MatchValidator(fieldName) {
      var _this2 = this;

      return new rxcompForm.FormValidator(function (value) {
        var field = _this2.form ? _this2.form.get(fieldName) : null;

        if (!value || !field) {
          return null;
        }

        return value !== field.value ? {
          match: {
            value: value,
            match: field.value
          }
        } : null;
      });
    };

    _proto.reset = function reset() {
      this.form.reset();
    };

    _proto.onSubmit = function onSubmit() {
      var _this3 = this;

      // console.log('ClubSignupComponent.onSubmit', 'form.valid', valid);
      if (this.form.valid) {
        // console.log('ClubSignupComponent.onSubmit', this.form.value);
        this.form.submitted = true;
        this.http.post$('/WS/wsUsers.asmx/Register', {
          data: this.form.value
        }).subscribe(function (response) {
          console.log('ClubSignupComponent.onSubmit', response);

          _this3.signUp.next(_this3.form.value); // change to response!!!
          // this.form.reset();

        });
      } else {
        this.form.touched = true;
      }
    };

    _proto.onLogin = function onLogin() {
      this.login.next();
    };

    _createClass(ClubSignupComponent, [{
      key: "countryId",
      set: function set(countryId) {
        if (this.countryId_ !== countryId) {
          console.log('ClubSignupComponent.set countryId', countryId);
          this.countryId_ = countryId;
          var provinces = this.data.provinces.filter(function (province) {
            return String(province.idstato) === String(countryId);
          });
          this.controls.province.options = provinces;
          this.controls.province.hidden = provinces.length === 0;
          this.controls.province.value = null;
        }
      }
    }]);

    return ClubSignupComponent;
  }(rxcomp.Component);
  ClubSignupComponent.meta = {
    selector: '[club-signup]',
    outputs: ['signUp', 'login']
  };

  var DROPDOWN_ID = 1000000;

  var DropdownDirective =
  /*#__PURE__*/
  function (_Directive) {
    _inheritsLoose(DropdownDirective, _Directive);

    function DropdownDirective() {
      return _Directive.apply(this, arguments) || this;
    }

    var _proto = DropdownDirective.prototype;

    _proto.onInit = function onInit() {
      var _this = this;

      var _getContext = rxcomp.getContext(this),
          node = _getContext.node;

      var trigger = node.getAttribute('dropdown-trigger');
      this.trigger = trigger ? node.querySelector(trigger) : node;
      this.opened = null;
      this.onClick = this.onClick.bind(this);
      this.onDocumentClick = this.onDocumentClick.bind(this);
      this.openDropdown = this.openDropdown.bind(this);
      this.closeDropdown = this.closeDropdown.bind(this);
      this.addListeners();
      DropdownDirective.dropdown$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (id) {
        // console.log('DropdownDirective', id, this['dropdown-item']);
        if (_this.id === id) {
          node.classList.add('dropped');
        } else {
          node.classList.remove('dropped');
        }
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
    };

    _proto.openDropdown = function openDropdown() {
      if (this.opened === null) {
        this.opened = true;
        this.addDocumentListeners();
        DropdownDirective.dropdown$.next(this.id);
        this.dropped.next(this.id);
      }
    };

    _proto.closeDropdown = function closeDropdown() {
      if (this.opened !== null) {
        this.removeDocumentListeners();
        this.opened = null;

        if (DropdownDirective.dropdown$.getValue() === this.id) {
          DropdownDirective.dropdown$.next(null);
          this.dropped.next(null);
        }
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

    DropdownDirective.nextId = function nextId() {
      return DROPDOWN_ID++;
    };

    _createClass(DropdownDirective, [{
      key: "id",
      get: function get() {
        return this.dropdown || this.id_ || (this.id_ = DropdownDirective.nextId());
      }
    }]);

    return DropdownDirective;
  }(rxcomp.Directive);
  DropdownDirective.meta = {
    selector: '[dropdown]',
    inputs: ['dropdown', 'dropdown-trigger'],
    outputs: ['dropped']
  };
  DropdownDirective.dropdown$ = new rxjs.BehaviorSubject(null);

  var DropdownItemDirective =
  /*#__PURE__*/
  function (_Directive) {
    _inheritsLoose(DropdownItemDirective, _Directive);

    function DropdownItemDirective() {
      return _Directive.apply(this, arguments) || this;
    }

    var _proto = DropdownItemDirective.prototype;

    _proto.onInit = function onInit() {
      var _this = this;

      var _getContext = rxcomp.getContext(this),
          node = _getContext.node;

      node.classList.add('dropdown-item');
      DropdownDirective.dropdown$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (id) {
        // console.log('DropdownItemDirective', id, this['dropdown-item']);
        if (_this.id === id) {
          node.classList.add('dropped');
        } else {
          node.classList.remove('dropped');
        }
      });
    };

    _createClass(DropdownItemDirective, [{
      key: "id",
      get: function get() {
        return this['dropdown-item'];
      }
    }]);

    return DropdownItemDirective;
  }(rxcomp.Directive);
  DropdownItemDirective.meta = {
    selector: '[dropdown-item], [[dropdown-item]]',
    inputs: ['dropdown-item']
  };

  var ControlComponent =
  /*#__PURE__*/
  function (_Component) {
    _inheritsLoose(ControlComponent, _Component);

    function ControlComponent() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = ControlComponent.prototype;

    _proto.onChanges = function onChanges() {
      var _getContext = rxcomp.getContext(this),
          node = _getContext.node;

      var control = this.control;
      rxcompForm.FormAttributes.forEach(function (x) {
        if (control[x]) {
          node.classList.add(x);
        } else {
          node.classList.remove(x);
        }
      });
    };

    return ControlComponent;
  }(rxcomp.Component);
  ControlComponent.meta = {
    selector: '[control]',
    inputs: ['control']
  };

  var ControlCheckboxComponent =
  /*#__PURE__*/
  function (_ControlComponent) {
    _inheritsLoose(ControlCheckboxComponent, _ControlComponent);

    function ControlCheckboxComponent() {
      return _ControlComponent.apply(this, arguments) || this;
    }

    var _proto = ControlCheckboxComponent.prototype;

    _proto.onInit = function onInit() {
      this.label = 'label';
    };

    return ControlCheckboxComponent;
  }(ControlComponent);
  ControlCheckboxComponent.meta = {
    selector: '[control-checkbox]',
    inputs: ['control', 'label'],
    template:
    /* html */
    "\n\t\t<div class=\"group--form--checkbox\" [class]=\"{ required: control.validators.length }\">\n\t\t\t<input type=\"checkbox\" class=\"control--checkbox\" [formControl]=\"control\" [value]=\"true\"/>\n\t\t\t<label><span [innerHTML]=\"label | html\"></span></label>\n\t\t\t<span class=\"required__badge\">required</span>\n\t\t</div>\n\t\t<errors-component [control]=\"control\"></errors-component>\n\t"
  };

  var ControlCustomSelectComponent =
  /*#__PURE__*/
  function (_ControlComponent) {
    _inheritsLoose(ControlCustomSelectComponent, _ControlComponent);

    function ControlCustomSelectComponent() {
      return _ControlComponent.apply(this, arguments) || this;
    }

    var _proto = ControlCustomSelectComponent.prototype;

    _proto.onInit = function onInit() {
      this.label = 'label';
      this.labels = window.labels || {};
      this.dropped = false;
      this.dropdownId = DropdownDirective.nextId();
      this.keyboard$().pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (key) {// console.log(key);
      });
    };

    _proto.keyboard$ = function keyboard$() {
      var _this = this;

      var r = /\w/;
      return rxjs.fromEvent(document, 'keydown').pipe(operators.filter(function (event) {
        return _this.dropped && event.key.match(r);
      }), // tap(event => console.log(event)),
      operators.map(function (event) {
        return event.key.toLowerCase();
      }), operators.tap(function (key) {
        _this.scrollToKey(key);
      }));
    };

    _proto.scrollToKey = function scrollToKey(key) {
      var items = this.control.options || [];
      var index = -1;

      for (var i = 0; i < items.length; i++) {
        var x = items[i];

        if (x.name.toLowerCase().substr(0, 1) === key) {
          index = i;
          break;
        }
      }

      if (index !== -1) {
        var _getContext = rxcomp.getContext(this),
            node = _getContext.node;

        var dropdown = node.querySelector('.dropdown');
        var navDropdown = node.querySelector('.nav--dropdown');
        var item = navDropdown.children[index];
        dropdown.scroll(0, item.offsetTop);
      }
    };

    _proto.setOption = function setOption(item) {
      this.control.value = item.id;
    };

    _proto.onDropped = function onDropped(id) {// console.log('ControlCustomSelectComponent.onDropped', id);
    };

    _proto.getLabel = function getLabel() {
      var value = this.control.value;
      var items = this.control.options || [];
      var item = items.find(function (x) {
        return x.id === value || x.name === value;
      });

      if (item) {
        return item.name;
      } else {
        return this.labels.select;
      }
    };

    _proto.onDropped = function onDropped($event) {
      // console.log($event);
      this.dropped = $event === this.dropdownId;
    }
    /*
    onClick(event) {
    	const { node } = getContext(this);
    	node.querySelector('.dropdown').classList.add('dropped');
    }
    */

    /*
    onClickOutside(event) {
    	const { node } = getContext(this);
    	node.querySelector('.dropdown').classList.remove('dropped');
    }
    */
    ;

    return ControlCustomSelectComponent;
  }(ControlComponent);
  ControlCustomSelectComponent.meta = {
    selector: '[control-custom-select]',
    inputs: ['control', 'label'],
    template:
    /* html */
    "\n\t\t<div class=\"group--form--select\" [class]=\"{ required: control.validators.length }\" [dropdown]=\"dropdownId\" (dropped)=\"onDropped($event)\">\n\t\t\t<label [innerHTML]=\"label\"></label>\n\t\t\t<span class=\"control--select\" [innerHTML]=\"getLabel()\"></span>\n\t\t\t<svg class=\"icon icon--caret-down\"><use xlink:href=\"#caret-down\"></use></svg>\n\t\t\t<span class=\"required__badge\">required</span>\n\t\t</div>\n\t\t<errors-component [control]=\"control\"></errors-component>\n\t\t<div class=\"dropdown\" [dropdown-item]=\"dropdownId\">\n\t\t\t<div class=\"category\" [innerHTML]=\"label\"></div>\n\t\t\t<ul class=\"nav--dropdown\">\n\t\t\t\t<li *for=\"let item of control.options\" (click)=\"setOption(item)\"><span [innerHTML]=\"item.name\"></span></li>\n\t\t\t</ul>\n\t\t</div>\n\t"
    /*  (click)="onClick($event)" (clickOutside)="onClickOutside($event)" */

    /*  <!-- <div class="dropdown" [class]="{ dropped: dropped }"> --> */

  };

  var ControlEmailComponent =
  /*#__PURE__*/
  function (_ControlComponent) {
    _inheritsLoose(ControlEmailComponent, _ControlComponent);

    function ControlEmailComponent() {
      return _ControlComponent.apply(this, arguments) || this;
    }

    var _proto = ControlEmailComponent.prototype;

    _proto.onInit = function onInit() {
      this.label = 'label';
    };

    return ControlEmailComponent;
  }(ControlComponent);
  ControlEmailComponent.meta = {
    selector: '[control-email]',
    inputs: ['control', 'label'],
    template:
    /* html */
    "\n\t\t<div class=\"group--form\" [class]=\"{ required: control.validators.length }\">\n\t\t\t<label [innerHTML]=\"label\"></label>\n\t\t\t<input type=\"text\" class=\"control--text\" [formControl]=\"control\" [placeholder]=\"label\" required email />\n\t\t\t<span class=\"required__badge\">required</span>\n\t\t</div>\n\t\t<errors-component [control]=\"control\"></errors-component>\n\t"
  };

  var ControlFileComponent =
  /*#__PURE__*/
  function (_ControlComponent) {
    _inheritsLoose(ControlFileComponent, _ControlComponent);

    function ControlFileComponent() {
      return _ControlComponent.apply(this, arguments) || this;
    }

    var _proto = ControlFileComponent.prototype;

    _proto.onInit = function onInit() {
      this.label = 'label';
      this.labels = window.labels || {};
      this.required = false;
      this.onReaderComplete = this.onReaderComplete.bind(this);
    };

    _proto.onInputDidChange = function onInputDidChange(event) {
      var input = event.target;
      var file = input.files[0];
      this.file = {
        name: file.name,
        lastModified: file.lastModified,
        lastModifiedDate: file.lastModifiedDate,
        size: file.size,
        type: file.type
      };
      var reader = new FileReader();
      reader.addEventListener('load', this.onReaderComplete);
      reader.readAsDataURL(file); // reader.readAsArrayBuffer() // Starts reading the contents of the specified Blob, once finished, the result attribute contains an ArrayBuffer representing the file's data.
      // reader.readAsBinaryString() // Starts reading the contents of the specified Blob, once finished, the result attribute contains the raw binary data from the file as a string.
      // reader.readAsDataURL() // Starts reading the contents of the specified Blob, once finished, the result attribute contains a data: URL representing the file's data.
      // reader.readAsText() // Starts reading the contents of the specified Blob, once finished, the result attribute contains the contents of the file as a text string. An optional encoding name can be specified.
    };

    _proto.onReaderComplete = function onReaderComplete(event) {
      var content = event.target.result;
      this.file.content = content;
      this.control.value = this.file;
      console.log('ControlFileComponent.onReaderComplete', this.file); // image/*,
    };

    return ControlFileComponent;
  }(ControlComponent);
  ControlFileComponent.meta = {
    selector: '[control-file]',
    inputs: ['control', 'label'],
    template:
    /* html */
    "\n\t\t<div class=\"group--form--file\" [class]=\"{ required: control.validators.length }\">\n\t\t\t<label for=\"file\" [innerHTML]=\"label\"></label>\n\t\t\t<span class=\"control--select\" [innerHTML]=\"labels.select_file\"></span>\n\t\t\t<svg class=\"icon icon--upload\"><use xlink:href=\"#upload\"></use></svg>\n\t\t\t<span class=\"required__badge\">required</span>\n\t\t\t<input name=\"file\" type=\"file\" accept=\".pdf,.doc,.docx,*.txt\" class=\"control--file\" (change)=\"onInputDidChange($event)\" />\n\t\t</div>\n\t\t<errors-component [control]=\"control\"></errors-component>\n\t"
  };

  var ControlPasswordComponent =
  /*#__PURE__*/
  function (_ControlComponent) {
    _inheritsLoose(ControlPasswordComponent, _ControlComponent);

    function ControlPasswordComponent() {
      return _ControlComponent.apply(this, arguments) || this;
    }

    var _proto = ControlPasswordComponent.prototype;

    _proto.onInit = function onInit() {
      this.label = 'label';
      this.required = false;
    };

    return ControlPasswordComponent;
  }(ControlComponent);
  ControlPasswordComponent.meta = {
    selector: '[control-password]',
    inputs: ['control', 'label'],
    template:
    /* html */
    "\n\t\t<div class=\"group--form\" [class]=\"{ required: control.validators.length }\">\n\t\t\t<label [innerHTML]=\"label\"></label>\n\t\t\t<input type=\"password\" class=\"control--text\" [formControl]=\"control\" [placeholder]=\"label\" />\n\t\t\t<span class=\"required__badge\">required</span>\n\t\t</div>\n\t\t<errors-component [control]=\"control\"></errors-component>\n\t"
  };

  var ControlSelectComponent =
  /*#__PURE__*/
  function (_ControlComponent) {
    _inheritsLoose(ControlSelectComponent, _ControlComponent);

    function ControlSelectComponent() {
      return _ControlComponent.apply(this, arguments) || this;
    }

    var _proto = ControlSelectComponent.prototype;

    _proto.onInit = function onInit() {
      this.label = 'label';
      this.labels = window.labels || {};
    };

    return ControlSelectComponent;
  }(ControlComponent);
  ControlSelectComponent.meta = {
    selector: '[control-select]',
    inputs: ['control', 'label'],
    template:
    /* html */
    "\n\t\t<div class=\"group--form--select\" [class]=\"{ required: control.validators.length }\">\n\t\t\t<label [innerHTML]=\"label\"></label>\n\t\t\t<select class=\"control--select\" [formControl]=\"control\" required>\n\t\t\t\t<option value=\"\">{{labels.select}}</option>\n\t\t\t\t<option [value]=\"item.id\" *for=\"let item of control.options\" [innerHTML]=\"item.name\"></option>\n\t\t\t</select>\n\t\t\t<span class=\"required__badge\">required</span>\n\t\t\t<svg class=\"icon icon--caret-down\"><use xlink:href=\"#caret-down\"></use></svg>\n\t\t</div>\n\t\t<errors-component [control]=\"control\"></errors-component>\n\t"
  };

  var ControlTextComponent =
  /*#__PURE__*/
  function (_ControlComponent) {
    _inheritsLoose(ControlTextComponent, _ControlComponent);

    function ControlTextComponent() {
      return _ControlComponent.apply(this, arguments) || this;
    }

    var _proto = ControlTextComponent.prototype;

    _proto.onInit = function onInit() {
      this.label = 'label';
      this.required = false;
    };

    return ControlTextComponent;
  }(ControlComponent);
  ControlTextComponent.meta = {
    selector: '[control-text]',
    inputs: ['control', 'label'],
    template:
    /* html */
    "\n\t\t<div class=\"group--form\" [class]=\"{ required: control.validators.length }\">\n\t\t\t<label [innerHTML]=\"label\"></label>\n\t\t\t<input type=\"text\" class=\"control--text\" [formControl]=\"control\" [placeholder]=\"label\" />\n\t\t\t<span class=\"required__badge\">required</span>\n\t\t</div>\n\t\t<errors-component [control]=\"control\"></errors-component>\n\t"
  };

  var ControlTextareaComponent =
  /*#__PURE__*/
  function (_ControlComponent) {
    _inheritsLoose(ControlTextareaComponent, _ControlComponent);

    function ControlTextareaComponent() {
      return _ControlComponent.apply(this, arguments) || this;
    }

    var _proto = ControlTextareaComponent.prototype;

    _proto.onInit = function onInit() {
      this.label = 'label';
      this.required = false;
    };

    return ControlTextareaComponent;
  }(ControlComponent);
  ControlTextareaComponent.meta = {
    selector: '[control-textarea]',
    inputs: ['control', 'label'],
    template:
    /* html */
    "\n\t\t<div class=\"group--form--textarea\" [class]=\"{ required: control.validators.length }\">\n\t\t\t<label [innerHTML]=\"label\"></label>\n\t\t\t<textarea class=\"control--text\" [formControl]=\"control\" [innerHTML]=\"label\" rows=\"4\"></textarea>\n\t\t\t<span class=\"required__badge\">required</span>\n\t\t</div>\n\t\t<errors-component [control]=\"control\"></errors-component>\n\t"
  };

  var ErrorsComponent =
  /*#__PURE__*/
  function (_ControlComponent) {
    _inheritsLoose(ErrorsComponent, _ControlComponent);

    function ErrorsComponent() {
      return _ControlComponent.apply(this, arguments) || this;
    }

    var _proto = ErrorsComponent.prototype;

    _proto.onInit = function onInit() {
      this.labels = window.labels || {};
    };

    _proto.getLabel = function getLabel(key, value) {
      var label = this.labels["error_" + key];
      return label;
    };

    return ErrorsComponent;
  }(ControlComponent);
  ErrorsComponent.meta = {
    selector: 'errors-component',
    inputs: ['control'],
    template:
    /* html */
    "\n\t<div class=\"inner\" [style]=\"{ display: control.invalid && control.touched ? 'block' : 'none' }\">\n\t\t<div class=\"error\" *for=\"let [key, value] of control.errors\">\n\t\t\t<span [innerHTML]=\"getLabel(key, value)\"></span>\n\t\t\t<!-- <span class=\"key\" [innerHTML]=\"key\"></span> <span class=\"value\" [innerHTML]=\"value | json\"></span> -->\n\t\t</div>\n\t</div>\n\t"
  };

  var STATIC = window.location.port === '41999' || window.location.host === 'actarian.github.io';
  var DEVELOPMENT = window.location.host.indexOf('localhost') === 0;
  var PRODUCTION = !DEVELOPMENT;
  var ENV = {
    STATIC: STATIC,
    DEVELOPMENT: DEVELOPMENT,
    PRODUCTION: PRODUCTION
  };

  var TestComponent =
  /*#__PURE__*/
  function (_Component) {
    _inheritsLoose(TestComponent, _Component);

    function TestComponent() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = TestComponent.prototype;

    _proto.onInit = function onInit() {
      this.env = ENV;
    };

    _proto.onTest = function onTest(event) {
      this.test.next(event);
    };

    _proto.onReset = function onReset(event) {
      this.reset.next(event);
    };

    return TestComponent;
  }(rxcomp.Component);
  TestComponent.meta = {
    selector: 'test-component',
    inputs: ['form'],
    outputs: ['test', 'reset'],
    template:
    /* html */
    "\n\t<div class=\"group--form--results\" *if=\"env.DEVELOPMENT\">\n\t\t<code [innerHTML]=\"form.value | json\"></code>\n\t\t<button type=\"button\" class=\"btn--link\" (click)=\"onTest($event)\"><span>test</span></button>\n\t\t<button type=\"button\" class=\"btn--link\" (click)=\"onReset($event)\"><span>reset</span></button>\n\t</div>\n\t"
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
      var _this = this;

      this.menu = null;
      this.submenu = null;
      UserService.user$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (user) {
        _this.user = user;

        _this.pushChanges();
      });
    };

    _proto.toggleMenu = function toggleMenu($event) {
      this.menu = this.menu !== $event ? $event : null;
      this.submenu = null;
      this.pushChanges();
    };

    _proto.onDropped = function onDropped(id) {
      console.log('HeaderComponent.onDropped', id);
      this.submenu = id;
      this.pushChanges();
    };

    return HeaderComponent;
  }(rxcomp.Component);
  HeaderComponent.meta = {
    selector: 'header'
  };

  /*
  ['quot', 'amp', 'apos', 'lt', 'gt', 'nbsp', 'iexcl', 'cent', 'pound', 'curren', 'yen', 'brvbar', 'sect', 'uml', 'copy', 'ordf', 'laquo', 'not', 'shy', 'reg', 'macr', 'deg', 'plusmn', 'sup2', 'sup3', 'acute', 'micro', 'para', 'middot', 'cedil', 'sup1', 'ordm', 'raquo', 'frac14', 'frac12', 'frac34', 'iquest', 'Agrave', 'Aacute', 'Acirc', 'Atilde', 'Auml', 'Aring', 'AElig', 'Ccedil', 'Egrave', 'Eacute', 'Ecirc', 'Euml', 'Igrave', 'Iacute', 'Icirc', 'Iuml', 'ETH', 'Ntilde', 'Ograve', 'Oacute', 'Ocirc', 'Otilde', 'Ouml', 'times', 'Oslash', 'Ugrave', 'Uacute', 'Ucirc', 'Uuml', 'Yacute', 'THORN', 'szlig', 'agrave', 'aacute', 'atilde', 'auml', 'aring', 'aelig', 'ccedil', 'egrave', 'eacute', 'ecirc', 'euml', 'igrave', 'iacute', 'icirc', 'iuml', 'eth', 'ntilde', 'ograve', 'oacute', 'ocirc', 'otilde', 'ouml', 'divide', 'oslash', 'ugrave', 'uacute', 'ucirc', 'uuml', 'yacute', 'thorn', 'yuml', 'amp', 'bull', 'deg', 'infin', 'permil', 'sdot', 'plusmn', 'dagger', 'mdash', 'not', 'micro', 'perp', 'par', 'euro', 'pound', 'yen', 'cent', 'copy', 'reg', 'trade', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega'];
  ['"', '&', ''', '<', '>', ' ', '¡', '¢', '£', '¤', '¥', '¦', '§', '¨', '©', 'ª', '«', '¬', '­', '®', '¯', '°', '±', '²', '³', '´', 'µ', '¶', '·', '¸', '¹', 'º', '»', '¼', '½', '¾', '¿', 'À', 'Á', 'Â', 'Ã', 'Ä', 'Å', 'Æ', 'Ç', 'È', 'É', 'Ê', 'Ë', 'Ì', 'Í', 'Î', 'Ï', 'Ð', 'Ñ', 'Ò', 'Ó', 'Ô', 'Õ', 'Ö', '×', 'Ø', 'Ù', 'Ú', 'Û', 'Ü', 'Ý', 'Þ', 'ß', 'à', 'á', 'ã', 'ä', 'å', 'æ', 'ç', 'è', 'é', 'ê', 'ë', 'ì', 'í', 'î', 'ï', 'ð', 'ñ', 'ò', 'ó', 'ô', 'õ', 'ö', '÷', 'ø', 'ù', 'ú', 'û', 'ü', 'ý', 'þ', 'ÿ', '&', '•', '°', '∞', '‰', '⋅', '±', '†', '—', '¬', 'µ', '⊥', '∥', '€', '£', '¥', '¢', '©', '®', '™', 'α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω', 'Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ', 'Ι', 'Κ', 'Λ', 'Μ', 'Ν', 'Ξ', 'Ο', 'Π', 'Ρ', 'Σ', 'Τ', 'Υ', 'Φ', 'Χ', 'Ψ', 'Ω'];
  */

  var HtmlPipe =
  /*#__PURE__*/
  function (_Pipe) {
    _inheritsLoose(HtmlPipe, _Pipe);

    function HtmlPipe() {
      return _Pipe.apply(this, arguments) || this;
    }

    HtmlPipe.transform = function transform(value) {
      if (value) {
        value = value.replace(/&#(\d+);/g, function (m, n) {
          return String.fromCharCode(parseInt(n));
        });
        var escapes = ['quot', 'amp', 'apos', 'lt', 'gt', 'nbsp', 'iexcl', 'cent', 'pound', 'curren', 'yen', 'brvbar', 'sect', 'uml', 'copy', 'ordf', 'laquo', 'not', 'shy', 'reg', 'macr', 'deg', 'plusmn', 'sup2', 'sup3', 'acute', 'micro', 'para', 'middot', 'cedil', 'sup1', 'ordm', 'raquo', 'frac14', 'frac12', 'frac34', 'iquest', 'Agrave', 'Aacute', 'Acirc', 'Atilde', 'Auml', 'Aring', 'AElig', 'Ccedil', 'Egrave', 'Eacute', 'Ecirc', 'Euml', 'Igrave', 'Iacute', 'Icirc', 'Iuml', 'ETH', 'Ntilde', 'Ograve', 'Oacute', 'Ocirc', 'Otilde', 'Ouml', 'times', 'Oslash', 'Ugrave', 'Uacute', 'Ucirc', 'Uuml', 'Yacute', 'THORN', 'szlig', 'agrave', 'aacute', 'atilde', 'auml', 'aring', 'aelig', 'ccedil', 'egrave', 'eacute', 'ecirc', 'euml', 'igrave', 'iacute', 'icirc', 'iuml', 'eth', 'ntilde', 'ograve', 'oacute', 'ocirc', 'otilde', 'ouml', 'divide', 'oslash', 'ugrave', 'uacute', 'ucirc', 'uuml', 'yacute', 'thorn', 'yuml', 'amp', 'bull', 'deg', 'infin', 'permil', 'sdot', 'plusmn', 'dagger', 'mdash', 'not', 'micro', 'perp', 'par', 'euro', 'pound', 'yen', 'cent', 'copy', 'reg', 'trade', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega'];
        var unescapes = ['"', '&', '\'', '<', '>', ' ', '¡', '¢', '£', '¤', '¥', '¦', '§', '¨', '©', 'ª', '«', '¬', '­', '®', '¯', '°', '±', '²', '³', '´', 'µ', '¶', '·', '¸', '¹', 'º', '»', '¼', '½', '¾', '¿', 'À', 'Á', 'Â', 'Ã', 'Ä', 'Å', 'Æ', 'Ç', 'È', 'É', 'Ê', 'Ë', 'Ì', 'Í', 'Î', 'Ï', 'Ð', 'Ñ', 'Ò', 'Ó', 'Ô', 'Õ', 'Ö', '×', 'Ø', 'Ù', 'Ú', 'Û', 'Ü', 'Ý', 'Þ', 'ß', 'à', 'á', 'ã', 'ä', 'å', 'æ', 'ç', 'è', 'é', 'ê', 'ë', 'ì', 'í', 'î', 'ï', 'ð', 'ñ', 'ò', 'ó', 'ô', 'õ', 'ö', '÷', 'ø', 'ù', 'ú', 'û', 'ü', 'ý', 'þ', 'ÿ', '&', '•', '°', '∞', '‰', '⋅', '±', '†', '—', '¬', 'µ', '⊥', '∥', '€', '£', '¥', '¢', '©', '®', '™', 'α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω', 'Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ', 'Ι', 'Κ', 'Λ', 'Μ', 'Ν', 'Ξ', 'Ο', 'Π', 'Ρ', 'Σ', 'Τ', 'Υ', 'Φ', 'Χ', 'Ψ', 'Ω'];
        var rx = new RegExp("(&" + escapes.join(';)|(&') + ";)", 'g');
        value = value.replace(rx, function () {
          for (var i = 1; i < arguments.length; i++) {
            if (arguments[i]) {
              // console.log(arguments[i], unescapes[i - 1]);
              return unescapes[i - 1];
            }
          }
        }); // console.log(value);

        return value;
      }
    };

    return HtmlPipe;
  }(rxcomp.Pipe);
  HtmlPipe.meta = {
    name: 'html'
  };

  var PATH = STATIC ? './' : '/Client/docs/';
  var UID = 0;

  var ImageService =
  /*#__PURE__*/
  function () {
    function ImageService() {}

    ImageService.worker = function worker() {
      if (!this.worker_) {
        this.worker_ = new Worker(PATH + "js/workers/image.service.worker.js");
      }

      return this.worker_;
    };

    ImageService.load$ = function load$(src) {
      if (!('Worker' in window) || this.isBlob(src) || this.isCors(src)) {
        return rxjs.of(src);
      }

      var id = ++UID;
      var worker = this.worker();
      worker.postMessage({
        src: src,
        id: id
      });
      return rxjs.fromEvent(worker, 'message').pipe(operators.filter(function (event) {
        return event.data.src === src;
      }), operators.map(function (event) {
        var url = URL.createObjectURL(event.data.blob);
        return url;
      }), operators.first(), operators.finalize(function (url) {
        worker.postMessage({
          id: id
        });
        URL.revokeObjectURL(url);
      }));
    };

    ImageService.isCors = function isCors(src) {
      return src.indexOf('//') !== -1 && src.indexOf(window.location.host) === -1;
    };

    ImageService.isBlob = function isBlob(src) {
      return src.indexOf('blob:') === 0;
    };

    return ImageService;
  }();

  var LazyCache =
  /*#__PURE__*/
  function () {
    function LazyCache() {}

    LazyCache.get = function get(src) {
      return this.cache[src];
    };

    LazyCache.set = function set(src, blob) {
      this.cache[src] = blob;
      var keys = Object.keys(this.cache);

      if (keys.length > 100) {
        this.remove(keys[0]);
      }
    };

    LazyCache.remove = function remove(src) {
      delete this.cache[src];
    };

    _createClass(LazyCache, null, [{
      key: "cache",
      get: function get() {
        if (!this.cache_) {
          this.cache_ = {};
        }

        return this.cache_;
      }
    }]);

    return LazyCache;
  }();

  var LazyDirective =
  /*#__PURE__*/
  function (_Directive) {
    _inheritsLoose(LazyDirective, _Directive);

    function LazyDirective() {
      return _Directive.apply(this, arguments) || this;
    }

    var _proto = LazyDirective.prototype;

    _proto.onInit = function onInit() {
      var _this = this;

      var _getContext = rxcomp.getContext(this),
          node = _getContext.node;

      node.classList.add('lazy');
      this.input$ = new rxjs.Subject().pipe(operators.distinctUntilChanged(), operators.switchMap(function (input) {
        var src = LazyCache.get(input);

        if (src) {
          return rxjs.of(src);
        }

        node.classList.remove('lazyed');
        return _this.lazy$(input);
      }), operators.takeUntil(this.unsubscribe$));
      this.input$.subscribe(function (src) {
        LazyCache.set(_this.lazy, src);
        node.setAttribute('src', src);
        node.classList.add('lazyed');
      });
    };

    _proto.onChanges = function onChanges() {
      this.input$.next(this.lazy);
    };

    _proto.lazy$ = function lazy$(input) {
      var _getContext2 = rxcomp.getContext(this),
          node = _getContext2.node;

      return IntersectionService.intersection$(node).pipe(operators.first(), operators.switchMap(function () {
        return ImageService.load$(input);
      }), operators.takeUntil(this.unsubscribe$));
    };

    return LazyDirective;
  }(rxcomp.Directive);
  LazyDirective.meta = {
    selector: '[lazy],[[lazy]]',
    inputs: ['lazy']
  };

  var MainMenuComponent =
  /*#__PURE__*/
  function (_Component) {
    _inheritsLoose(MainMenuComponent, _Component);

    function MainMenuComponent() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = MainMenuComponent.prototype;

    _proto.onInit = function onInit() {}
    /*
    onDropped(id) {
    	// console.log('MainMenuComponent.onDropped', id);
    }
    */
    ;

    return MainMenuComponent;
  }(rxcomp.Component);
  MainMenuComponent.meta = {
    selector: '[main-menu]'
  };

  var MediaLibraryComponent =
  /*#__PURE__*/
  function (_Component) {
    _inheritsLoose(MediaLibraryComponent, _Component);

    function MediaLibraryComponent() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = MediaLibraryComponent.prototype;

    _proto.onInit = function onInit() {
      var _this = this;

      var items = window.medias || [];
      var filters = window.filters || {};
      var initialParams = window.params || {};
      filters.departments.mode = FilterMode.OR;
      filters.languages.mode = FilterMode.OR;
      filters.categories.mode = FilterMode.OR;
      var filterService = new FilterService(filters, initialParams, function (key, filter) {
        switch (key) {
          default:
            filter.filter = function (item, value) {
              return item.features.indexOf(value) !== -1;
            };

        }
      });
      filterService.items$(items).pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (items) {
        _this.items = items;

        _this.pushChanges();
        /*
        setTimeout(() => {
        	this.items = items;
        	this.pushChanges();
        }, 50);
        */
        // console.log('MediaLibraryComponent.items', items.length);

      });
      this.filterService = filterService;
      this.filters = filterService.filters;
    };

    return MediaLibraryComponent;
  }(rxcomp.Component);
  MediaLibraryComponent.meta = {
    selector: '[media-library]'
  };

  var NaturalFormService =
  /*#__PURE__*/
  function () {
    function NaturalFormService() {}

    NaturalFormService.next = function next(form) {
      this.form = form || this.form; // setter & getter
    };

    _createClass(NaturalFormService, null, [{
      key: "values",
      get: function get() {
        var values = {};
        var form = this.form;
        Object.keys(this.form).forEach(function (key) {
          values[key] = form[key].value;
        });
        return values;
      }
    }, {
      key: "form",
      set: function set(form) {
        this.form$.next(form);
      },
      get: function get() {
        return this.form$.getValue();
      }
    }, {
      key: "phrase",
      get: function get() {
        var form = this.form;
        console.log('NaturalFormService.set phrase form', form);
        var action = form.action.options.find(function (x) {
          return x.id === form.action.value;
        });

        if (!action) {
          action = form.action.options[0];
        }

        return action.phrase;
      }
    }, {
      key: "title",
      get: function get() {
        var _this = this;

        var title = this.phrase;
        var form = this.form;
        Object.keys(form).forEach(function (key) {
          var filter = _this.form[key];
          var value = filter.value;
          var items = filter.options || [];
          var item = items.find(function (x) {
            return x.id === value || x.name === value;
          });

          if (item) {
            title = title.replace("$" + key + "$", item.name);
          } else {
            title = title.replace("$" + key + "$", filter.label);
          }
        });
        return title;
      }
    }, {
      key: "clubProfileUrl",
      get: function get() {
        return this.form.club.profileUrl;
      }
    }, {
      key: "clubModalUrl",
      get: function get() {
        return STATIC ? '/tiemme-com/club-modal.html' : this.form.club.modalUrl;
      }
    }]);

    return NaturalFormService;
  }();
  NaturalFormService.form$ = new rxjs.BehaviorSubject(window.naturalForm || {}); // !!! static

  var NaturalFormContactComponent =
  /*#__PURE__*/
  function (_Component) {
    _inheritsLoose(NaturalFormContactComponent, _Component);

    function NaturalFormContactComponent() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = NaturalFormContactComponent.prototype;

    _proto.onInit = function onInit() {
      var _this = this;

      var values = NaturalFormService.values;
      this.title = NaturalFormService.title;
      this.http = HttpService;
      this.submitted = false;
      var data = window.data || {
        roles: [],
        interests: [],
        countries: [],
        provinces: []
      };
      var form = new rxcompForm.FormGroup({
        role: new rxcompForm.FormControl(values.role, rxcompForm.Validators.RequiredValidator()),
        interests: new rxcompForm.FormControl(values.interest, rxcompForm.Validators.RequiredValidator()),
        //
        firstName: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        lastName: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        email: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator(), rxcompForm.Validators.EmailValidator()]),
        company: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        country: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        province: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        message: null,
        privacy: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredTrueValidator()),
        newsletter: values.newsletter === 2 ? true : false,
        scope: 'www.website.com',
        checkRequest: window.antiforgery,
        checkField: ''
      });
      var controls = form.controls;
      controls.role.options = data.roles;
      controls.interests.options = data.interests;
      controls.country.options = data.countries;
      controls.province.options = [];
      this.controls = controls;
      form.changes$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (changes) {
        // console.log('NaturalFormContactComponent.form.changes$', changes, form.valid);
        _this.countryId = changes.country;

        _this.pushChanges();
      });
      this.data = data;
      this.form = form;
    };

    _proto.onChanges = function onChanges(changes) {};

    _proto.test = function test() {
      this.form.patch({
        firstName: 'Jhon',
        lastName: 'Appleseed',
        email: 'jhonappleseed@gmail.com',
        company: 'Websolute',
        role: this.controls.role.options[0].id,
        interests: this.controls.interests.options[0].id,
        country: this.controls.country.options[0].id,
        privacy: true,
        checkRequest: window.antiforgery,
        checkField: ''
      });
    };

    _proto.reset = function reset() {
      this.form.reset();
    };

    _proto.onSubmit = function onSubmit() {
      var _this2 = this;

      // console.log('NaturalFormContactComponent.onSubmit', 'form.valid', valid);
      if (this.form.valid) {
        // console.log('NaturalFormContactComponent.onSubmit', this.form.value);
        this.form.submitted = true; //this.http.post$('/WS/wsUsers.asmx/Contact', { data: this.form.value })

        this.http.post$('/api/users/Contact', this.form.value).subscribe(function (response) {
          console.log('NaturalFormContactComponent.onSubmit', response);

          _this2.form.reset();

          _this2.submitted = true;
        });
      } else {
        this.form.touched = true;
      }
    };

    _proto.onBack = function onBack() {
      this.back.next();
    };

    _createClass(NaturalFormContactComponent, [{
      key: "countryId",
      set: function set(countryId) {
        if (this.countryId_ !== countryId) {
          console.log('NaturalFormContactComponent.set countryId', countryId);
          this.countryId_ = countryId;
          var provinces = this.data.provinces.filter(function (province) {
            return String(province.idstato) === String(countryId);
          });
          this.controls.province.options = provinces;
          this.controls.province.hidden = provinces.length === 0;
          this.controls.province.value = null;
        }
      }
    }]);

    return NaturalFormContactComponent;
  }(rxcomp.Component);
  NaturalFormContactComponent.meta = {
    selector: '[natural-form-contact]',
    outputs: ['back']
  };

  var NaturalFormControlComponent =
  /*#__PURE__*/
  function (_Component) {
    _inheritsLoose(NaturalFormControlComponent, _Component);

    function NaturalFormControlComponent() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = NaturalFormControlComponent.prototype;

    _proto.onInit = function onInit() {
      // console.log('NaturalFormControlComponent.onInit');
      this.label = 'label';
      this.labels = window.labels || {};
      this.dropped = false;
      this.dropdownId = DropdownDirective.nextId();
      this.keyboard$().pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (key) {// console.log(key);
      });
    };

    _proto.onChanges = function onChanges() {
      if (!this.filter.value) {
        this.filter.value = this.filter.options[0].id;
      }
    };

    _proto.keyboard$ = function keyboard$() {
      var _this = this;

      var r = /\w/;
      return rxjs.fromEvent(document, 'keydown').pipe(operators.filter(function (event) {
        return _this.dropped && event.key.match(r);
      }), // tap(event => console.log(event)),
      operators.map(function (event) {
        return event.key.toLowerCase();
      }), operators.tap(function (key) {
        _this.scrollToKey(key);
      }));
    };

    _proto.scrollToKey = function scrollToKey(key) {
      var items = this.filter.options || [];
      var index = -1;

      for (var i = 0; i < items.length; i++) {
        var x = items[i];

        if (x.name.toLowerCase().substr(0, 1) === key) {
          index = i;
          break;
        }
      }

      if (index !== -1) {
        var _getContext = rxcomp.getContext(this),
            node = _getContext.node;

        var dropdown = node.querySelector('.dropdown');
        var navDropdown = node.querySelector('.nav--dropdown');
        var item = navDropdown.children[index];
        dropdown.scroll(0, item.offsetTop);
      }
    };

    _proto.setOption = function setOption(item) {
      // console.log('setOption', item);
      this.filter.value = item.id;
      this.change.next(this.filter);
      DropdownDirective.dropdown$.next(null);
      this.pushChanges();
    };

    _proto.onDropped = function onDropped(id) {// console.log('NaturalFormControlComponent.onDropped', id);
    };

    _proto.getLabel = function getLabel() {
      var value = this.filter.value;
      var items = this.filter.options || [];
      var item = items.find(function (x) {
        return x.id === value || x.name === value;
      });

      if (item) {
        return item.name;
      } else {
        return this.labels.select;
      }
    };

    _proto.onDropped = function onDropped($event) {
      // console.log($event);
      this.dropped = $event === this.dropdownId;
    };

    return NaturalFormControlComponent;
  }(rxcomp.Component);
  NaturalFormControlComponent.meta = {
    selector: '[natural-form-control]',
    inputs: ['filter', 'label'],
    outputs: ['change'],
    template:
    /* html */
    "\n\t\t<span [dropdown]=\"dropdownId\" (dropped)=\"onDropped($event)\">\n\t\t\t<span class=\"label\" [innerHTML]=\"getLabel()\"></span>\n\t\t\t<svg class=\"icon icon--caret-right\"><use xlink:href=\"#caret-right\"></use></svg>\n\t\t</span>\n\t\t<div class=\"dropdown\" [dropdown-item]=\"dropdownId\">\n\t\t\t<div class=\"category\" [innerHTML]=\"label\"></div>\n\t\t\t<ul class=\"nav--dropdown\">\n\t\t\t\t<li *for=\"let item of filter.options\" (click)=\"setOption(item)\"><span [innerHTML]=\"item.name\"></span></li>\n\t\t\t</ul>\n\t\t</div>\n\t"
  };

  var NaturalFormNewsletterComponent =
  /*#__PURE__*/
  function (_Component) {
    _inheritsLoose(NaturalFormNewsletterComponent, _Component);

    function NaturalFormNewsletterComponent() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = NaturalFormNewsletterComponent.prototype;

    _proto.onInit = function onInit() {
      var _this = this;

      var values = NaturalFormService.values;
      this.title = NaturalFormService.title;
      this.http = HttpService;
      this.submitted = false;
      var data = window.data || {
        roles: [],
        interests: [],
        countries: [],
        provinces: []
      };
      var form = new rxcompForm.FormGroup({
        role: new rxcompForm.FormControl(values.role, rxcompForm.Validators.RequiredValidator()),
        interests: new rxcompForm.FormControl(values.interest, rxcompForm.Validators.RequiredValidator()),
        //
        firstName: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        lastName: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        email: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator(), rxcompForm.Validators.EmailValidator()]),
        company: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        privacy: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredTrueValidator()),
        newsletter: true,
        checkRequest: window.antiforgery,
        checkField: ''
      });
      var controls = form.controls;
      controls.role.options = data.roles;
      controls.interests.options = data.interests;
      this.controls = controls;
      form.changes$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (changes) {
        // console.log('NaturalFormNewsletterComponent.form.changes$', changes, form.valid);
        _this.pushChanges();
      });
      this.data = data;
      this.form = form;
    };

    _proto.test = function test() {
      this.form.patch({
        firstName: 'Jhon',
        lastName: 'Appleseed',
        email: 'jhonappleseed@gmail.com',
        company: 'Websolute',
        role: this.controls.role.options[0].id,
        interests: this.controls.interests.options[0].id,
        privacy: true,
        checkRequest: window.antiforgery,
        checkField: ''
      });
    };

    _proto.reset = function reset() {
      this.form.reset();
    };

    _proto.onSubmit = function onSubmit() {
      var _this2 = this;

      // console.log('NaturalFormNewsletterComponent.onSubmit', 'form.valid', valid);
      if (this.form.valid) {
        // console.log('NaturalFormNewsletterComponent.onSubmit', this.form.value);
        this.form.submitted = true; //this.http.post$('/WS/wsUsers.asmx/Newsletter', { data: this.form.value })

        this.http.post$('/api/users/Newsletter', this.form.value).subscribe(function (response) {
          console.log('NaturalFormNewsletterComponent.onSubmit', response);

          _this2.form.reset();

          _this2.submitted = true;
        });
      } else {
        this.form.touched = true;
      }
    };

    _proto.onBack = function onBack() {
      this.back.next();
    };

    return NaturalFormNewsletterComponent;
  }(rxcomp.Component);
  NaturalFormNewsletterComponent.meta = {
    selector: '[natural-form-newsletter]',
    outputs: ['back']
  };

  var NaturalFormSearchComponent =
  /*#__PURE__*/
  function (_Component) {
    _inheritsLoose(NaturalFormSearchComponent, _Component);

    function NaturalFormSearchComponent() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = NaturalFormSearchComponent.prototype;

    _proto.onInit = function onInit() {
      var _this = this;

      // console.log('NaturalFormSearchComponent.onInit');
      var _getContext = rxcomp.getContext(this),
          node = _getContext.node;

      node.classList.add('natural-form-search');
      NaturalFormService.form$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (form) {
        _this.naturalForm = form;
        _this.phrase = NaturalFormService.phrase;
      });
    };

    _proto.onNaturalForm = function onNaturalForm(event) {
      var form = NaturalFormService.next();
      this.change.next(form);
    };

    _proto.onClub = function onClub(event) {
      this.club.next(event);
    };

    _proto.animateUnderlines_ = function animateUnderlines_(node) {
      this.animated = true;
      var values = [].concat(node.querySelectorAll('.moodboard__underline'));
      values.forEach(function (x) {
        gsap.set(x, {
          transformOrigin: '0 50%',
          scaleX: 0
        });
      });
      var i = -1;

      var animate = function animate() {
        i++;
        i = i % values.length;
        var u = values[i];
        gsap.set(u, {
          transformOrigin: '0 50%',
          scaleX: 0
        });
        gsap.to(u, 0.50, {
          scaleX: 1,
          transformOrigin: '0 50%',
          delay: 0,
          ease: Power3.easeInOut,
          overwrite: 'all',
          onComplete: function onComplete() {
            gsap.set(u, {
              transformOrigin: '100% 50%',
              scaleX: 1
            });
            gsap.to(u, 0.50, {
              scaleX: 0,
              transformOrigin: '100% 50%',
              delay: 1.0,
              ease: Power3.easeInOut,
              overwrite: 'all',
              onComplete: function onComplete() {
                animate();
              }
            });
          }
        });
      };

      animate();
    };

    _proto.animateOff_ = function animateOff_(node) {
      if (this.animated) {
        this.animated = false; // console.log('animateOff_');
        // gsap.killAll();

        var values = [].concat(node.querySelectorAll('.moodboard__underline'));
        gsap.set(values, {
          transformOrigin: '0 50%',
          scaleX: 0
        });
        gsap.to(values, 0.50, {
          scaleX: 1,
          transformOrigin: '0 50%',
          delay: 0,
          ease: Power3.easeInOut,
          overwrite: 'all'
        });
      }
    };

    _createClass(NaturalFormSearchComponent, [{
      key: "phrase",
      set: function set(phrase) {
        var _this2 = this;

        if (this.phrase_ !== phrase) {
          this.phrase_ = phrase;

          var _getContext2 = rxcomp.getContext(this),
              node = _getContext2.node,
              module = _getContext2.module;

          var contentNode = node.querySelector('.content');

          if (this.instances_) {
            module.remove(contentNode);
          }

          var html = phrase;
          var keys = Object.keys(this.naturalForm);
          keys.forEach(function (x) {
            // console.log(x);
            html = html.replace("$" + x + "$", function () {
              var item = _this2.naturalForm[x];

              if (item.options) {
                return (
                  /* html */
                  "\n\t\t\t\t\t<span class=\"natural-form__control\" natural-form-control [filter]=\"naturalForm." + x + "\" [label]=\"naturalForm." + x + ".label\" (change)=\"onNaturalForm($event)\"></span>\n\t\t\t\t"
                );
              } else {
                return (
                  /* html */
                  "<button type=\"button\" class=\"btn--club\" (click)=\"onClub($event)\"><svg class=\"icon icon--user\"><use xlink:href=\"#user\"></use></svg> <span>Club Tiemme</span></button>"
                );
              }
            });
          }); // console.log('MoodboardSearchDirective', html);

          contentNode.innerHTML = html;
          this.instances_ = [];
          Array.from(contentNode.childNodes).forEach(function (x) {
            _this2.instances_ = _this2.instances_.concat(module.compile(x, _this2));
          });
          /*
          const hasFilter = Object.keys(scope.naturalForm).map(x => scope.naturalForm[x]).find(x => x.value !== null) !== undefined;
          if (!hasFilter) {
          	this.animateUnderlines_(node);
          }
          scope.animateOff_ = () => {
          	this.animateOff_(node);
          };
          */
        }
      }
    }]);

    return NaturalFormSearchComponent;
  }(rxcomp.Component);
  NaturalFormSearchComponent.meta = {
    selector: '[natural-form-search]',
    inputs: ['naturalForm'],
    outputs: ['change', 'club']
  };

  var NaturalFormSignupComponent =
  /*#__PURE__*/
  function (_Component) {
    _inheritsLoose(NaturalFormSignupComponent, _Component);

    function NaturalFormSignupComponent() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = NaturalFormSignupComponent.prototype;

    _proto.onInit = function onInit() {
      var _this = this;

      var values = NaturalFormService.values;
      this.title = NaturalFormService.title;
      this.http = HttpService;
      this.submitted = false;
      var data = window.data || {
        roles: [],
        countries: [],
        provinces: []
      };
      var form = new rxcompForm.FormGroup({
        role: new rxcompForm.FormControl(values.role, rxcompForm.Validators.RequiredValidator()),
        //
        firstName: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        lastName: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        company: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        country: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        province: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        address: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        zipCode: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        city: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        telephone: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        fax: null,
        email: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator(), rxcompForm.Validators.EmailValidator()]),
        username: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator()]),
        password: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator()]),
        passwordConfirm: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator(), this.MatchValidator('password')]),
        privacy: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredTrueValidator()),
        newsletter: values.newsletter === 2 ? true : false,
        checkRequest: window.antiforgery,
        checkField: ''
      });
      var controls = form.controls;
      controls.role.options = data.roles;
      controls.country.options = data.countries;
      controls.province.options = [];
      this.controls = controls;
      form.changes$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (changes) {
        // console.log('NaturalFormSignupComponent.form.changes$', changes, form.valid);
        _this.countryId = changes.country;

        _this.pushChanges();
      });
      this.data = data;
      this.form = form;
    };

    _proto.test = function test() {
      this.form.patch({
        firstName: 'Jhon',
        lastName: 'Appleseed',
        company: 'Websolute',
        role: this.controls.role.options[0].id,
        country: this.controls.country.options[0].id,
        address: 'Strada della Campanara',
        zipCode: '15',
        city: 'Pesaro',
        telephone: '00390721411112',
        email: 'jhonappleseed@gmail.com',
        username: 'username',
        password: 'password',
        passwordConfirm: 'password',
        privacy: true,
        checkRequest: window.antiforgery,
        checkField: ''
      });
    };

    _proto.MatchValidator = function MatchValidator(fieldName) {
      var _this2 = this;

      return new rxcompForm.FormValidator(function (value) {
        var field = _this2.form ? _this2.form.get(fieldName) : null;

        if (!value || !field) {
          return null;
        }

        return value !== field.value ? {
          match: {
            value: value,
            match: field.value
          }
        } : null;
      });
    };

    _proto.reset = function reset() {
      this.form.reset();
    };

    _proto.onSubmit = function onSubmit() {
      var _this3 = this;

      // console.log('NaturalFormSignupComponent.onSubmit', 'form.valid', valid);
      if (this.form.valid) {
        // console.log('NaturalFormSignupComponent.onSubmit', this.form.value);
        this.form.submitted = true;
        this.http.post$('/WS/wsUsers.asmx/Register', {
          data: this.form.value
        }).subscribe(function (response) {
          console.log('NaturalFormSignupComponent.onSubmit', response);

          _this3.signUp.next(_this3.form.value); // change to response!!!


          _this3.form.reset();

          _this3.submitted = true;
        });
      } else {
        this.form.touched = true;
      }
    };

    _proto.onBack = function onBack() {
      this.back.next();
    };

    _createClass(NaturalFormSignupComponent, [{
      key: "countryId",
      set: function set(countryId) {
        if (this.countryId_ !== countryId) {
          console.log('NaturalFormSignupComponent.set countryId', countryId);
          this.countryId_ = countryId;
          var provinces = this.data.provinces.filter(function (province) {
            return String(province.idstato) === String(countryId);
          });
          this.controls.province.options = provinces;
          this.controls.province.hidden = provinces.length === 0;
          this.controls.province.value = null;
        }
      }
    }]);

    return NaturalFormSignupComponent;
  }(rxcomp.Component);
  NaturalFormSignupComponent.meta = {
    selector: '[natural-form-signup]',
    outputs: ['signUp', 'back']
  };

  var NaturalFormComponent =
  /*#__PURE__*/
  function (_Component) {
    _inheritsLoose(NaturalFormComponent, _Component);

    function NaturalFormComponent() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = NaturalFormComponent.prototype;

    _proto.onInit = function onInit() {
      var _this = this;

      this.views = {
        NATURAL: 0,
        TECHNICAL: 1,
        COMMERCIAL: 2,
        NEWSLETTER: 3,
        CLUB: 4
      };
      this.view = this.views.NATURAL;
      UserService.user$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (user) {
        _this.user = user;

        _this.pushChanges();
      }); // console.log('NaturalFormComponent.onInit', this.naturalForm);
    };

    _proto.onClub = function onClub(event) {
      var _this2 = this;

      if (this.user) {
        window.location.href = NaturalFormService.clubProfileUrl;
      } else {
        event.preventDefault();
        var src = STATIC ? '/tiemme-com/club-modal.html' : NaturalFormService.clubModalUrl;
        ModalService.open$({
          src: src,
          data: {
            view: 1
          }
        }).pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (event) {
          // console.log('RegisterOrLoginComponent.onRegister', event);
          if (event instanceof ModalResolveEvent) {
            UserService.setUser(event.data);
            _this2.user = event.data;

            _this2.pushChanges();
          }
        });
      }
    };

    _proto.onNext = function onNext(event) {
      this.view = NaturalFormService.values.action;
      this.pushChanges();
    };

    _proto.onBack = function onBack(event) {
      this.view = this.views.NATURAL;
      this.pushChanges();
    };

    return NaturalFormComponent;
  }(rxcomp.Component);
  NaturalFormComponent.meta = {
    selector: '[natural-form]',
    outputs: ['club']
  };

  var src = STATIC ? '/tiemme-com/club-modal.html' : '/it/club-modal';

  var RegisterOrLoginComponent =
  /*#__PURE__*/
  function (_Component) {
    _inheritsLoose(RegisterOrLoginComponent, _Component);

    function RegisterOrLoginComponent() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = RegisterOrLoginComponent.prototype;

    _proto.onRegister = function onRegister(event) {
      // console.log('RegisterOrLoginComponent.onRegister');
      event.preventDefault();
      ModalService.open$({
        src: src,
        data: {
          view: 2
        }
      }).pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (event) {
        // console.log('RegisterOrLoginComponent.onRegister', event);
        if (event instanceof ModalResolveEvent) {
          UserService.setUser(event.data);
        }
      }); // this.pushChanges();
    };

    _proto.onLogin = function onLogin(event) {
      // console.log('RegisterOrLoginComponent.onLogin');
      event.preventDefault();
      ModalService.open$({
        src: src,
        data: {
          view: 1
        }
      }).pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (event) {
        // console.log('RegisterOrLoginComponent.onLogin', event);
        if (event instanceof ModalResolveEvent) {
          UserService.setUser(event.data);
        }
      }); // this.pushChanges();
    };

    return RegisterOrLoginComponent;
  }(rxcomp.Component);
  RegisterOrLoginComponent.meta = {
    selector: '[register-or-login]'
  };

  /*
  Mail
  La mail di recap presenterà i dati inseriti dall’utente e come oggetto “Richiesta Informazioni commerciali”

  Generazione Mail
  •	Romania > tiemmesystems@tiemme.com
  •	Spagna > tiemmesistemas@tiemme.com
  •	Grecia > customerservice.gr@tiemme.com
  •	Albania, Kosovo, Serbia, Montenegro, Bulgaria > infobalkans@tiemme.com
  •	Tutti gli altri > info@tiemme.com
  */

  var RequestInfoCommercialComponent =
  /*#__PURE__*/
  function (_Component) {
    _inheritsLoose(RequestInfoCommercialComponent, _Component);

    function RequestInfoCommercialComponent() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = RequestInfoCommercialComponent.prototype;

    _proto.onInit = function onInit() {
      var _this = this;

      this.http = HttpService;
      this.submitted = false;
      var data = window.data || {
        roles: [],
        interests: [],
        countries: [],
        provinces: []
      };
      var form = new rxcompForm.FormGroup({
        firstName: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        lastName: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        email: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator(), rxcompForm.Validators.EmailValidator()]),
        company: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        role: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        interests: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        country: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        province: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        message: null,
        privacy: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredTrueValidator()),
        newsletter: null,
        scope: 'www.website.com',
        checkRequest: window.antiforgery,
        checkField: ''
      });
      var controls = form.controls;
      controls.role.options = data.roles;
      controls.interests.options = data.interests;
      controls.country.options = data.countries;
      controls.province.options = [];
      this.controls = controls;
      form.changes$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (changes) {
        // console.log('RequestInfoCommercialComponent.form.changes$', changes, form.valid);
        _this.countryId = changes.country;

        _this.pushChanges();
      });
      this.data = data;
      this.form = form;
    };

    _proto.test = function test() {
      this.form.patch({
        firstName: 'Jhon',
        lastName: 'Appleseed',
        email: 'jhonappleseed@gmail.com',
        company: 'Websolute',
        role: this.controls.role.options[0].id,
        interests: this.controls.interests.options[0].id,
        country: this.controls.country.options[0].id,
        privacy: true,
        checkRequest: window.antiforgery,
        checkField: ''
      });
    };

    _proto.reset = function reset() {
      this.form.reset();
    };

    _proto.onSubmit = function onSubmit() {
      var _this2 = this;

      // console.log('RequestInfoCommercialComponent.onSubmit', 'form.valid', valid);
      if (this.form.valid) {
        // console.log('RequestInfoCommercialComponent.onSubmit', this.form.value);
        this.form.submitted = true; //this.http.post$('/WS/wsUsers.asmx/Contact', { data: this.form.value })

        this.http.post$('/api/users/Contact', this.form.value).subscribe(function (response) {
          console.log('RequestInfoCommercialComponent.onSubmit', response);

          _this2.form.reset();

          _this2.submitted = true;
        });
      } else {
        this.form.touched = true;
      }
    };

    _createClass(RequestInfoCommercialComponent, [{
      key: "countryId",
      set: function set(countryId) {
        if (this.countryId_ !== countryId) {
          console.log('RequestInfoCommercialComponent.set countryId', countryId);
          this.countryId_ = countryId;
          var provinces = this.data.provinces.filter(function (province) {
            return String(province.idstato) === String(countryId);
          });
          this.controls.province.options = provinces;
          this.controls.province.hidden = provinces.length === 0;
          this.controls.province.value = null;
        }
      }
    }]);

    return RequestInfoCommercialComponent;
  }(rxcomp.Component);
  RequestInfoCommercialComponent.meta = {
    selector: '[request-info-commercial]'
  };

  var FileSizePipe =
  /*#__PURE__*/
  function (_Pipe) {
    _inheritsLoose(FileSizePipe, _Pipe);

    function FileSizePipe() {
      return _Pipe.apply(this, arguments) || this;
    }

    FileSizePipe.transform = function transform(value, si) {
      if (si === void 0) {
        si = true;
      }

      value = parseInt(value);
      var unit = si ? 1000 : 1024;

      if (Math.abs(value) < unit) {
        return value + ' B';
      }

      var units = si ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
      var u = -1;

      do {
        value /= unit;
        ++u;
      } while (Math.abs(value) >= unit && u < units.length - 1);

      return value.toFixed(1) + " " + units[u];
    };

    return FileSizePipe;
  }(rxcomp.Pipe);
  FileSizePipe.meta = {
    name: 'fileSize'
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

        gsap.set(node, {
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

              gsap.to(node, 0.4, {
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

          gsap.set(node, {
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

      node.classList.add('video');
      this.video = node.querySelector('video');
      this.progress = node.querySelector('.icon--play-progress path');

      if (parentInstance instanceof SwiperDirective) {
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
  };

  var WorkWithUsComponent =
  /*#__PURE__*/
  function (_Component) {
    _inheritsLoose(WorkWithUsComponent, _Component);

    function WorkWithUsComponent() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = WorkWithUsComponent.prototype;

    _proto.onInit = function onInit() {
      var _this = this;

      this.http = HttpService;
      this.submitted = false;
      var data = window.data || {
        departments: []
      };
      var form = new rxcompForm.FormGroup({
        firstName: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        lastName: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        email: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator(), rxcompForm.Validators.EmailValidator()]),
        telephone: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        experience: null,
        company: new rxcompForm.FormControl(null),
        department: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        introduction: new rxcompForm.FormControl(null),
        privacy: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredTrueValidator()),
        curricula: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        checkRequest: window.antiforgery,
        checkField: ''
      });
      var controls = form.controls;
      controls.department.options = data.departments;
      this.controls = controls;
      form.changes$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (changes) {
        // console.log('WorkWithUsComponent.form.changes$', changes, form.valid);
        _this.pushChanges();
      });
      this.form = form;
    };

    _proto.test = function test() {
      this.form.patch({
        firstName: 'Jhon',
        lastName: 'Appleseed',
        email: 'jhonappleseed@gmail.com',
        telephone: '00390721411112',
        experience: false,
        company: 'Websolute',
        department: this.controls.departments.options[0].id,
        introduction: 'Hi!',
        privacy: true,
        curricula: {},
        checkRequest: window.antiforgery,
        checkField: ''
      });
    };

    _proto.reset = function reset() {
      this.form.reset();
    };

    _proto.onSubmit = function onSubmit() {
      var _this2 = this;

      // console.log('WorkWithUsComponent.onSubmit', 'form.valid', valid);
      if (this.form.valid) {
        // console.log('WorkWithUsComponent.onSubmit', this.form.value);
        this.form.submitted = true;
        this.http.post$('/WS/wsUsers.asmx/Contact', {
          data: this.form.value
        }).subscribe(function (response) {
          console.log('WorkWithUsComponent.onSubmit', response);

          _this2.form.reset();

          _this2.submitted = true;
        });
      } else {
        this.form.touched = true;
      }
    };

    return WorkWithUsComponent;
  }(rxcomp.Component);
  WorkWithUsComponent.meta = {
    selector: '[work-with-us]'
  };

  var YoutubeComponent =
  /*#__PURE__*/
  function (_Component) {
    _inheritsLoose(YoutubeComponent, _Component);

    function YoutubeComponent() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = YoutubeComponent.prototype;

    _proto.onInit = function onInit() {
      var _this = this;

      this.item = {};

      var _getContext = rxcomp.getContext(this),
          node = _getContext.node,
          parentInstance = _getContext.parentInstance;

      node.classList.add('youtube');
      this.progress = node.querySelector('.icon--play-progress path');
      this.onPlayerReady = this.onPlayerReady.bind(this);
      this.onPlayerStateChange = this.onPlayerStateChange.bind(this);
      this.onPlayerError = this.onPlayerError.bind(this);
      this.id$ = new rxjs.Subject().pipe(operators.distinctUntilChanged());

      if (parentInstance instanceof SwiperDirective) {
        parentInstance.events$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (event) {
          return _this.pause();
        });
      } // this.addListeners();

    };

    _proto.onChanges = function onChanges(changes) {
      var id = this.youtubeId; // console.log('YoutubeComponent.onChanges', id);

      this.id$.next(id);
    };

    _proto.initPlayer = function initPlayer() {
      console.log('VideoComponent.initPlayer');
      this.player$().pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (player) {
        console.log('YoutubeComponent.player$', player);
      });
      this.interval$().pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function () {});
      this.id$.next(this.youtubeId);
    };

    _proto.player$ = function player$() {
      var _this2 = this;

      var _getContext2 = rxcomp.getContext(this),
          node = _getContext2.node;

      var video = node.querySelector('.video');
      return this.id$.pipe(operators.switchMap(function (id) {
        console.log('YoutubeComponent.videoId', id);
        return YoutubeComponent.once$().pipe(operators.map(function (youtube) {
          console.log('YoutubeComponent.once$', youtube);

          _this2.destroyPlayer();

          _this2.player = new youtube.Player(video, {
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
              listType: 'user_uploads' // origin: 'https://log6i.csb.app/'

            },
            events: {
              onReady: _this2.onPlayerReady,
              onStateChange: _this2.onPlayerStateChange,
              onPlayerError: _this2.onPlayerError
            }
          });
          return _this2.player;
        }));
      }));
    };

    _proto.onPlayerReady = function onPlayerReady(event) {
      // console.log('YoutubeComponent.onPlayerReady', event);
      event.target.mute();
      event.target.playVideo();
    };

    _proto.onPlayerStateChange = function onPlayerStateChange(event) {
      // console.log('YoutubeComponent.onPlayerStateChange', event.data);
      if (event.data === 1) {
        this.playing = true;
      } else {
        this.playing = false;
      }
    };

    _proto.onPlayerError = function onPlayerError(event) {
      console.log('YoutubeComponent.onPlayerError', event);
    };

    _proto.destroyPlayer = function destroyPlayer() {
      if (this.player) {
        this.player.destroy();
      }
    };

    _proto.onDestroy = function onDestroy() {
      this.destroyPlayer();
    };

    _proto.interval$ = function interval$() {
      var _this3 = this;

      return rxjs.interval(500).pipe(operators.filter(function () {
        return _this3.playing && _this3.player;
      }), operators.tap(function () {
        _this3.progress.style.strokeDashoffset = _this3.player.getCurrentTime() / _this3.player.getDuration();
      }));
    };

    _proto.togglePlay = function togglePlay() {
      console.log('VideoComponent.togglePlay');

      if (this.playing) {
        this.pause();
      } else {
        this.play();
      }
    };

    _proto.play = function play() {
      console.log('VideoComponent.play');

      if (!this.player) {
        this.initPlayer();
      } else {
        this.player.playVideo();
      }
    };

    _proto.pause = function pause() {
      if (!this.player) {
        return;
      }

      this.player.stopVideo();
    };

    YoutubeComponent.once$ = function once$() {
      if (this.youtube$) {
        return this.youtube$;
      } else {
        this.youtube$ = new rxjs.BehaviorSubject(null).pipe(operators.filter(function (youtube) {
          return youtube !== null;
        }));
        window.onYouTubeIframeAPIReady = this.onYouTubeIframeAPIReady_.bind(this);
        var script = document.createElement('script');
        var scripts = document.querySelectorAll('script');
        var last = scripts[scripts.length - 1];
        last.parentNode.insertBefore(script, last);
        script.src = '//www.youtube.com/iframe_api';
        return this.youtube$;
      }
    };

    YoutubeComponent.onYouTubeIframeAPIReady_ = function onYouTubeIframeAPIReady_() {
      // console.log('onYouTubeIframeAPIReady');
      this.youtube$.next(window.YT);
    };

    _createClass(YoutubeComponent, [{
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
    }, {
      key: "cover",
      get: function get() {
        return this.youtubeId ? "//i.ytimg.com/vi/" + this.youtubeId + "/maxresdefault.jpg" : '';
      }
    }]);

    return YoutubeComponent;
  }(rxcomp.Component);
  YoutubeComponent.meta = {
    selector: '[youtube]',
    inputs: ['youtubeId', 'title']
  };

  var ZoomableDirective =
  /*#__PURE__*/
  function (_Directive) {
    _inheritsLoose(ZoomableDirective, _Directive);

    function ZoomableDirective() {
      return _Directive.apply(this, arguments) || this;
    }

    var _proto = ZoomableDirective.prototype;

    _proto.onInit = function onInit() {
      var _this = this;

      var _getContext = rxcomp.getContext(this),
          node = _getContext.node;

      node.classList.add('zoomable');
      var target = node.getAttribute('zoomable') !== '' ? node.querySelectorAll(node.getAttribute('zoomable')) : node;
      rxjs.fromEvent(target, 'click').pipe(operators.map(function ($event) {
        return _this.zoom = !_this.zoom;
      }), operators.takeUntil(this.unsubscribe$)).subscribe(function (zoom) {
        return console.log('ZoomableDirective', zoom);
      });
    };

    _proto.zoomIn = function zoomIn() {
      var _getContext2 = rxcomp.getContext(this),
          node = _getContext2.node;

      this.rect = node.getBoundingClientRect();
      this.parentNode = node.parentNode;
      document.querySelector('body').appendChild(node);
      gsap.set(node, {
        left: this.rect.left,
        top: this.rect.top,
        width: this.rect.width,
        height: this.rect.height,
        position: 'fixed'
      });
      node.classList.add('zoom');
      gsap.set(node, {
        position: 'fixed'
      });
      var to = {
        left: 0,
        top: 0,
        width: window.innerWidth,
        height: window.innerHeight
      };
      gsap.to(node, _objectSpread2({}, to, {
        duration: 0.7,
        ease: Power3.easeInOut,
        onComplete: function onComplete() {
          node.classList.add('zoomed');
        }
      }));
    };

    _proto.zoomOut = function zoomOut() {
      var _this2 = this;

      var _getContext3 = rxcomp.getContext(this),
          node = _getContext3.node;

      node.classList.remove('zoomed');
      var to = {
        left: this.rect.left,
        top: this.rect.top,
        width: this.rect.width,
        height: this.rect.height
      };
      gsap.to(node, _objectSpread2({}, to, {
        duration: 0.7,
        ease: Power3.easeInOut,
        onComplete: function onComplete() {
          _this2.parentNode.appendChild(node);

          gsap.set(node, {
            clearProps: 'all'
          });
          node.classList.remove('zoom');
          _this2.parentNode = null;
          _this2.rect = null;
        }
      }));
    };

    _createClass(ZoomableDirective, [{
      key: "zoom",
      get: function get() {
        return this.zoom_;
      },
      set: function set(zoom) {
        if (this.zoom_ !== zoom) {
          this.zoom_ = zoom;

          if (zoom) {
            this.zoomIn();
          } else {
            this.zoomOut();
          }
        }
      }
    }]);

    return ZoomableDirective;
  }(rxcomp.Directive);
  ZoomableDirective.meta = {
    selector: '[zoomable]'
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
    imports: [rxcomp.CoreModule, rxcompForm.FormModule],
    declarations: [AgentsComponent, AppearDirective, ClickOutsideDirective, ClubComponent, ClubForgotComponent, ClubModalComponent, ClubProfileComponent, ClubSigninComponent, ClubSignupComponent, ControlCheckboxComponent, ControlCustomSelectComponent, ControlEmailComponent, ControlFileComponent, ControlPasswordComponent, ControlSelectComponent, ControlTextComponent, ControlTextareaComponent, DropdownDirective, DropdownItemDirective, ErrorsComponent, FileSizePipe, HtmlPipe, HeaderComponent, LazyDirective, MainMenuComponent, MediaLibraryComponent, ModalOutletComponent, NaturalFormComponent, NaturalFormSearchComponent, NaturalFormContactComponent, NaturalFormControlComponent, NaturalFormNewsletterComponent, NaturalFormSignupComponent, RequestInfoCommercialComponent, RegisterOrLoginComponent, SwiperDirective, SwiperListingDirective, SwiperSlidesDirective, TestComponent, // ValueDirective,
    VideoComponent, WorkWithUsComponent, YoutubeComponent, ZoomableDirective],
    bootstrap: AppComponent
  };

  rxcomp.Browser.bootstrap(AppModule);

})));
