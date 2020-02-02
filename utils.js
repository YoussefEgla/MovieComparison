function debounce(callback, timeDelay = 1000) {
	let timeOutId; // for capturing timeId

	return (...args) => {
		if (timeOutId) clearTimeout(timeOutId); //execute if timeOutId has a value
		timeOutId = setTimeout(() => {
			callback.apply(null, args);
		}, timeDelay);
	};
}
