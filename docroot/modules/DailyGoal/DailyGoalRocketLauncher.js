var DailyGoalRocketLauncher = function(textController, progressBar, target) {
	
	var hours = 0;
	var targetTop;
	var rocketSize = [0.3, 0.7];
	var rocketSizeFactor = 5;
	var originTop = [-50, 50];
	var originLeft = -50;
	var durationFactor = 1800;
	var deployInterval = 200;
	var explosionBounceLeft = [-100, -20];
	var explosionBounceTop = [-50, 130];
	var explosionBounceDuration = 300;
	var destinationLeftFudge = -30;
	var intervalHandle;
	var launchSounds = [];
	var soundPlayer;

	var init = function() {
		targetTop = [-10, -10 + target.height() -10];
		originLeft -= target.offset().left;
		soundPlayer = new MultiSoundPlayer([{
			key:'launch',
			path:'modules/DailyGoal/audio/launch3.wav',
			volume:0.2,
			num:10
		},{
			key:'explosion',
			path:'modules/DailyGoal/audio/explosion.wav',
			volume:0.05,
			num:10
		},{
			key:'fill',
			path:'modules/DailyGoal/audio/fill.wav',
			volume:0.4,
			num:10
		}]);
	};

	var launch = function(delta) {
		var configs = buildConfigs(delta);
		if (configs.length == 0)
			return;

		intervalHandle = setInterval(function() {
			deploy(configs.pop());
			if (!configs.length)
				clearInterval(intervalHandle);
		}, deployInterval);
	};

	var buildConfigs = function(delta) {
		var configs = [];

		while (delta > 0) {
			var size = getSize(delta);
			delta -= size;
			configs.push(buildConfig(size));
		}

		configs.sort(configSorter);
		return configs;
	};

	var getSize = function(delta) {
		var size = rand(rocketSize);
		var size = Math.min(size, delta);
		var remainder = delta -size;
		if (remainder < rocketSize[0])
			size += remainder;
		return size;
	};

	var buildConfig = function(size) {
		return {
			size:size,
			fontSize:size*rocketSizeFactor,
			originTop:rand(originTop),
			destinationTop:rand(targetTop),
			duration:(size*durationFactor)
		};
	};

	var configSorter = function(a, b) {
		return a.duration - b.duration;
	};

	var rand = function(range) {
		var min = range[0];
		var max = range[1];
		return Math.random() * (max - min) + min;
	};

	var deploy = function(config) {	
		soundPlayer.play('launch');

		var color = 'hsl(' + rand([0, 359]) + ', 100%, 50%)';
		var rocket = jQuery('<i class="fa fa-rocket rocket"></i>')
			.appendTo(target)
			.css('font-size', config.fontSize + 'em')
			.css('left', originLeft + 'px')
			.css('top', config.originTop)
			.css('color', color);

		rocket.animate(
			{top:config.destinationTop + 'px', left:destinationLeftFudge + 'px'}, 
			config.duration, 
			'linear',
			function() {
				textController.add(config.size);
				progressBar.add(config.size);
				addExplosion(config.destinationTop, config.fontSize);
				shakeTarget();
				rocket.remove();
				soundPlayer.play('fill');
			}
		);
	};

	var shakeTarget = function() {
		if (target.hasClass('shake')) {
			target.removeClass('shake');
			target.addClass('shake2');
		} else {
			target.removeClass('shake2');
			target.addClass('shake');
		}
	};

	var addExplosion = function(top, fontSize) {
		soundPlayer.play('explosion');

		var explosion = jQuery('<i class="fa fa-hourglass"></i>')
			.appendTo(target)
			.css('font-size', fontSize + 'em')
			.css('top', top + 'px')
			.css('left', destinationLeftFudge + 'px')
			.css('transform', 'rotate(' + Math.floor(rand([0, 360])) + 'deg)');

		explosion.animate(
			{
				opacity:0, 
				left:rand(explosionBounceLeft) + 'px',
				top:rand(explosionBounceTop) + 'px',
				'font-size':'0em'
			},
			explosionBounceDuration,
			'linear',
			function() {
				explosion.remove();
			}
		);
	};

	var retract = function(delta) {
		textController.add(delta);
		progressBar.add(delta);
	};

	init();

	return {
		update:function(newHours) {
			var delta = newHours - hours;
			hours = newHours;
			if (delta > 0)
				launch(delta);
			else
				retract(delta);
		},
		reset:function() {
			hours = 0;
			clearInterval(intervalHandle);
			jQuery('.rocket').stop().remove();
			textController.reset();
			progressBar.reset();
		}
	};

};
