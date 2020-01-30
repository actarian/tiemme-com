/**
 * @license tiemme-com v1.0.0
 * (c) 2020 Luca Zampetti <lzampetti@gmail.com>
 * License: MIT
 */

(function (factory) {
	typeof define === 'function' && define.amd ? define('image.service.worker', factory) :
	factory();
}((function () { 'use strict';

	var controllers = {};
	self.addEventListener("message", function (event) {
	  var id = event.data.id;
	  var src = event.data.src;

	  if (id && !src) {
	    var controller = controllers[id];

	    if (controller) {
	      controller.abort();
	    }

	    return;
	  }

	  var options;

	  if (self.AbortController) {
	    var _controller = new AbortController();

	    options = {
	      signal: _controller.signal
	    };
	    controllers[id] = _controller;
	  }

	  var response = fetch(src, options).then(function (response) {
	    return response.blob();
	  }).then(function (blob) {
	    delete controllers[id];
	    self.postMessage({
	      src: src,
	      blob: blob
	    });
	  });
	});
	/*
	self.addEventListener('message', function(event) {
		// console.log(event);
		const src = event.data;
		const response = fetch(src).then(function(response) {
			return response.blob();
		}).then(function(blob) {
			// Send the image data to the UI thread!
			self.postMessage({
				src: src,
				blob: blob,
			});
		});
	});
	*/

})));
