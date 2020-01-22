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
