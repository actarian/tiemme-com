/**
 * @license tiemme-com v1.0.0
 * (c) 2020 Luca Zampetti <lzampetti@gmail.com>
 * License: MIT
 */

(function (factory) {
	typeof define === 'function' && define.amd ? define('image.service.worker', factory) :
	factory();
}((function () { 'use strict';

	self.addEventListener('message', function (event) {
	  // console.log(event);
	  var src = event.data;
	  var response = fetch(src).then(function (response) {
	    return response.blob();
	  }).then(function (blob) {
	    // Send the image data to the UI thread!
	    self.postMessage({
	      src: src,
	      blob: blob
	    });
	  });
	});
	/*
	self.addEventListener('message', async (event) => {
		console.log(event);
		const src = event.data;
		const response = await fetch(src);
		const blob = await response.blob();
		// Send the image data to the UI thread!
		self.postMessage({
			src: src,
			blob: blob,
		});
	});
	*/

})));
