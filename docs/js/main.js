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

      // const context = getContext(this);
      // console.log('context', context);
      DropdownDirective.dropdown$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (dropdownId) {
        return _this.dropdownId = dropdownId;
      });
    };

    _proto.onDropdown = function onDropdown(dropdown) {
      console.log('AppComponent.onDropdown', dropdown);
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

  // export const FormAttributes = ['untouched', 'touched', 'pristine', 'dirty', 'pending', 'enabled', 'disabled', 'valid', 'invalid', 'submitted'];

  var ControlComponent =
  /*#__PURE__*/
  function (_Component) {
    _inheritsLoose(ControlComponent, _Component);

    function ControlComponent() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = ControlComponent.prototype;

    _proto.onChanges = function onChanges() {
      /*
      const { node } = getContext(this);
      const control = this.control;
      FormAttributes.forEach(x => {
      	if (control[x]) {
      		node.classList.add(x);
      	} else {
      		node.classList.remove(x);
      	}
      	if (control.errors.required) {
      		node.classList.add('required');
      	} else {
      		node.classList.remove('required');
      	}
      });
      */
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
    "\n\t\t<div class=\"group--form--checkbox\" [class]=\"{ required: control.validators.length }\">\n\t\t\t<label><input type=\"checkbox\" class=\"control--checkbox\" [formControl]=\"control\" [value]=\"true\"/><span [innerHTML]=\"label\"></span></label>\n\t\t\t<span class=\"required__badge\">required</span>\n\t\t</div>\n\t\t<errors-component [control]=\"control\"></errors-component>\n\t"
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
    };

    _proto.setOption = function setOption(item) {
      this.control.value = item.id;
    };

    _proto.onDropdown = function onDropdown(event) {// console.log('ControlCustomSelectComponent.onDropdown', event);
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

    _proto.onClick = function onClick(event) {
      // console.log('ControlCustomSelectComponent.onClick', event);
      this.dropped = true;
      this.pushChanges();
    };

    _proto.onClickOutside = function onClickOutside(event) {
      // console.log('ControlCustomSelectComponent.onClickOutside', event);
      this.dropped = false;
      this.pushChanges();
    };

    return ControlCustomSelectComponent;
  }(ControlComponent);
  ControlCustomSelectComponent.meta = {
    selector: '[control-custom-select]',
    inputs: ['control', 'label'],
    template:
    /* html */
    "\n\t\t<div class=\"group--form--select\" [class]=\"{ required: control.validators.length }\" (click)=\"onClick($event)\" (clickOutside)=\"onClickOutside($event)\">\n\t\t\t<label [innerHTML]=\"label\"></label>\n\t\t\t<span class=\"control--select\" [innerHTML]=\"getLabel()\"></span>\n\t\t\t<svg class=\"icon icon--caret-down\"><use xlink:href=\"#caret-down\"></use></svg>\n\t\t\t<span class=\"required__badge\">required</span>\n\t\t</div>\n\t\t<errors-component [control]=\"control\"></errors-component>\n\t\t<div class=\"dropdown\" [class]=\"{ dropped: dropped }\">\n\t\t\t<div class=\"category\" [innerHTML]=\"label\"></div>\n\t\t\t<ul class=\"nav--dropdown\">\n\t\t\t\t<li *for=\"let item of control.options\" (click)=\"setOption(item)\"><span [innerHTML]=\"item.name\"></span></li>\n\t\t\t</ul>\n\t\t</div>\n\t"
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
      this.id = null;
      /*
      DropdownDirective.dropdown$.pipe(
      	takeUntil(this.unsubscribe$)
      ).subscribe(id => {
      	this.id = id;
      	// console.log('ProductMenuComponent', this.id);
      });
      */
    }
    /*
    onDropdown(event) {
    	// console.log('ProductMenuComponent.onDropdown', event);
    	this.id = event;
    	this.pushChanges();
    }
    */
    ;

    _proto.onClick = function onClick(id) {
      // console.log('ProductMenuComponent.onClick', id);
      if (this.id !== id) {
        this.id = id;
        this.pushChanges();
      }
    };

    _proto.onClickOutside = function onClickOutside(id) {
      // console.log('ProductMenuComponent.onClickOutside', id);
      if (this.id === id) {
        this.id = null;
        this.pushChanges();
      }
    };

    _proto.isActive = function isActive(id) {
      // console.log('ProductMenuComponent.isActive', id);
      return this.id === id;
    };

    return ProductMenuComponent;
  }(rxcomp.Component);
  ProductMenuComponent.meta = {
    selector: '[product-menu]'
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
        province: null,
        message: null,
        privacy: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredTrueValidator()),
        newsletter: null,
        scope: 'www.website.com'
      });
      var controls = form.controls;
      controls.role.options = data.roles;
      controls.interests.options = data.interests;
      controls.country.options = data.countries;
      controls.province.options = [];
      this.controls = controls;
      form.changes$.pipe(takeUntil(this.unsubscribe$)).subscribe(function (changes) {
        // console.log('RequestInfoCommercialComponent.form.changes$', changes, form.valid);
        var provinces = data.provinces.filter(function (province) {
          return String(province.idstato) === String(changes.country);
        });
        controls.province.options = provinces;

        _this.pushChanges();
      }); // change to if(true) for testing

      this.form = form;
    };

    _proto.onSubmit = function onSubmit() {
      var _this2 = this;

      var valid = Object.keys(this.form.errors).length === 0; // console.log('RequestInfoCommercialComponent.onSubmit', 'form.valid', valid);

      if (valid) {
        // console.log('RequestInfoCommercialComponent.onSubmit', this.form.value);
        this.form.submitted = true;
        this.http.post$('https://www.websolute.it', this.form.value).subscribe(function (response) {
          console.log('RequestInfoCommercialComponent.onSubmit', response);

          _this2.form.reset();
        });
      } else {
        this.form.touched = true;
      }
    };

    return RequestInfoCommercialComponent;
  }(rxcomp.Component);
  RequestInfoCommercialComponent.meta = {
    selector: '[request-info-commercial]'
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
      var data = window.data || {
        interests: []
      };
      var form = new rxcompForm.FormGroup({
        firstName: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        lastName: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        email: new rxcompForm.FormControl(null, [rxcompForm.Validators.RequiredValidator(), rxcompForm.Validators.EmailValidator()]),
        telephone: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        experience: null,
        company: new rxcompForm.FormControl(null),
        interests: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator()),
        introduction: new rxcompForm.FormControl(null),
        privacy: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredTrueValidator()),
        curricula: new rxcompForm.FormControl(null, rxcompForm.Validators.RequiredValidator())
      });
      var controls = form.controls;
      controls.interests.options = data.interests;
      this.controls = controls;
      form.changes$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (changes) {
        // console.log('WorkWithUsComponent.form.changes$', changes, form.valid);
        _this.pushChanges();
      }); // change to if(true) for testing

      this.form = form;
    };

    _proto.onSubmit = function onSubmit() {
      var _this2 = this;

      var valid = Object.keys(this.form.errors).length === 0; // console.log('WorkWithUsComponent.onSubmit', 'form.valid', valid);

      if (valid) {
        // console.log('WorkWithUsComponent.onSubmit', this.form.value);
        this.form.submitted = true;
        this.http.post$('https://www.websolute.it', this.form.value).subscribe(function (response) {
          console.log('WorkWithUsComponent.onSubmit', response);

          _this2.form.reset();
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

      this.progress = node.querySelector(".icon--play-progress path");
      this.onPlayerReady = this.onPlayerReady.bind(this);
      this.onPlayerStateChange = this.onPlayerStateChange.bind(this);
      this.onPlayerError = this.onPlayerError.bind(this);
      this.id$ = new rxjs.Subject().pipe(operators.distinctUntilChanged());
      this.player$().pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (player) {
        console.log("YoutubeComponent.player$", player);
      });
      this.interval$().pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function () {});

      if (parentInstance instanceof SwiperDirective) {
        parentInstance.events$.pipe(operators.takeUntil(this.unsubscribe$)).subscribe(function (event) {
          return _this.pause();
        });
      } // this.addListeners();

    };

    _proto.onChanges = function onChanges(changes) {
      var id = this.youtube; // console.log("YoutubeComponent.onChanges", id);

      this.id$.next(id);
    };

    _proto.player$ = function player$(youtube) {
      var _this2 = this;

      var _getContext2 = rxcomp.getContext(this),
          node = _getContext2.node;

      var video = node.querySelector(".video");
      return this.id$.pipe(operators.switchMap(function (id) {
        // console.log("YoutubeComponent.videoId", id);
        return YoutubeComponent.once$().pipe(operators.map(function (youtube) {
          // console.log("YoutubeComponent.once$", youtube);
          _this2.destroyPlayer();

          _this2.player = new youtube.Player(video, {
            width: node.offsetWidth,
            height: node.offsetHeight,
            videoId: id,
            playerVars: {
              autoplay: 0,
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
              listType: "user_uploads",
              origin: "https://log6i.csb.app/"
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
      // console.log("YoutubeComponent.onPlayerReady", event);
      event.target.mute(); // event.target.playVideo();
    };

    _proto.onPlayerStateChange = function onPlayerStateChange(event) {
      // console.log("YoutubeComponent.onPlayerStateChange", event.data);
      if (event.data === 1) {
        this.playing = true;
      } else {
        this.playing = false;
      }
    };

    _proto.onPlayerError = function onPlayerError(event) {
      console.log("YoutubeComponent.onPlayerError", event);
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
      // console.log("VideoComponent.togglePlay");
      if (this.playing) {
        this.pause();
      } else {
        this.play();
      }
    };

    _proto.play = function play() {
      if (!this.player) {
        return;
      }

      this.player.playVideo();
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
        var script = document.createElement("script");
        var scripts = document.querySelectorAll("script");
        var last = scripts[scripts.length - 1];
        last.parentNode.insertBefore(script, last);
        script.src = "//www.youtube.com/iframe_api";
        return this.youtube$;
      }
    };

    YoutubeComponent.onYouTubeIframeAPIReady_ = function onYouTubeIframeAPIReady_() {
      // console.log("onYouTubeIframeAPIReady");
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
        return this.youtube ? "//i.ytimg.com/vi/" + this.youtube + "/maxresdefault.jpg" : "";
      }
    }]);

    return YoutubeComponent;
  }(rxcomp.Component);
  YoutubeComponent.meta = {
    selector: "[youtube], [[youtube]]",
    inputs: ["youtube"]
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
    declarations: [AppearDirective, ClickOutsideDirective, ControlCheckboxComponent, ControlCustomSelectComponent, ControlEmailComponent, ControlFileComponent, ControlSelectComponent, ControlTextComponent, ControlTextareaComponent, DropdownDirective, ErrorsComponent, HeaderComponent, LazyDirective, ProductMenuComponent, RequestInfoCommercialComponent, // SpritesComponent,
    SrcDirective, SwiperDirective, SwiperListingDirective, SwiperSlidesDirective, // ValueDirective,
    VideoComponent, WorkWithUsComponent, YoutubeComponent, ZoomableDirective],
    bootstrap: AppComponent
  };

  rxcomp.Browser.bootstrap(AppModule);

})));
