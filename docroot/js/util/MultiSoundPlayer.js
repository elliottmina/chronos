var MultiSoundPlayer = function(soundConfigs) {

	var sounds = {};
	var indexes = {};
	
	var init = function() {
		jQuery.each(soundConfigs, function(index, config) {
			sounds[config.key] = [];
			for (var i = 0; i < config.num; i++) {
				var sound = new Audio(config.path);
				sound.volume = config.volume;
				sounds[config.key].push(sound);
			}
			indexes[config.key] = 0;

		});
	};

	var incrementIndex = function(key) {
		indexes[key]++;
		if (indexes[key] == sounds[key].length)
			indexes[key] = 0;
	};

	init();

	return {
		play:function(key) {
			incrementIndex(key);
			var index = indexes[key];
			sounds[key][index].play();
		}
	}

};
