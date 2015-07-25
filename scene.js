
Crafty.scene("Preload", function () {
	var assets = ['assets/bg.gif'];
	Crafty.background('#000');
	Crafty.e("2D,DOM,Text,loadingtext").text("Loading... 1%").attr({x: 150, y: 250, w: 500});
	Crafty.load(assets, function () {
		Crafty.scene("Load");
	}, function(data) {
		console.log(data);
	}, function (data) {
		console.log("error" + data.src);
	});
	Crafty.e("2D,DOM,Text,bgate").text("BAI TAP LON DO HOA").attr({x: 90, y: 500, w: 800});
});

Crafty.scene("Load", function () {
	Crafty.background('url("assets/bg.gif")');
	var assets = toLoad, loaded = 0,
		loadText = Crafty.e("2D,DOM,Text,loadingtext").text("1%").attr({x: 150, y: 250})
			.bind("EnterFrame", function (f) {
				if (this.loaded < loaded && f.frame % 2 === 0) {
					this.loaded++;
					this.text(this.loaded + "%");
				}
			}),
		progress = function (data) {
			loaded = Math.floor(data.percent);
			console.log(data);
		};
	loadText.loaded = 0;
//	for (var i in Crafty.assets) {
//		assets.push(i);
//	}
//	assets.splice(0, 1);
	Crafty.load(assets, function () {
		makeSprites();
		Crafty.scene("Menu");
	}, progress, function (data) {
		console.log("Error" + data.src);
	});

	Crafty.e("2D,Text,DOM,loadingtext").text("Loading...")
		.attr({x: 200, y: 250})
		.bind('EnterFrame', function (frame) {
			var f = frame.frame % 40;
			if (f % 10 == 0) {
				this.text("Loading." + "...".substr(0, f / 10));
			}
		});
	Crafty.e("2D,DOM,Text,bgate").text("B-GATE CREATION NONSTOP").attr({x: 90, y: 500, w: 800});
});

Crafty.scene("Menu", function () {
	Crafty.e("2D,DOM,kc").attr({x: 16, y: 100});
	Crafty.e("2D,DOM,startBoard").attr({x: 154, y: 323});
	var btn = Crafty.e("2D,DOM,startBtn,Mouse").attr({x: 195, y: 353}),
		btnhvr = Crafty.e("2D,DOM,startBtnHover,Mouse").attr({x: 195, y: 353, alpha:0.01}),
		enterFrameHover = function () {
			this.counter += this.dir;
			if (this.counter <= 0 || this.counter >= 10) {
				this.counter = this.dir < 0 ? 0 : 10;
				this.unbind(enterFrame,enterFrameHover);
				this.binded = 0;
			}
			this.alpha = this.counter / 10;
		};
	btnhvr.counter = btnhvr.dir  = btnhvr.binded = 0;
	btnhvr.bind("Click", function () {
		Crafty.scene("Play");
	})
	.bind("MouseOut", function () {
		this.dir = -1;
		if (this.binded === 0) {
			this.bind(enterFrame,enterFrameHover);
			this.binded = 1;
		}
	})
	.bind("MouseOver", function () {
		this.dir = 1;
		if (this.binded === 0) {
			this.bind(enterFrame,enterFrameHover);
			this.binded = 1;
		}
	});
});

Crafty.scene("Play", function () {
	//TimeBar will create Table then create Jewels
	Crafty.e("2D,DOM,scoreBoard").attr({x:0,y:596});
	Crafty.e("2D,DOM,hintBoard").attr({x:310,y:596});
	score(levelDesc.score);
	var btn = Crafty.e("2D,DOM,helpBtn,Mouse").attr({x: 344, y: 628}),
		btnhvr = Crafty.e("2D,DOM,helpBtnHover,Mouse").attr({x: 344, y: 628, alpha:0.01}),
		enterFrameHover = function () {
			this.counter += this.dir;
			if (this.counter < 0 || this.counter > 10) {
				this.counter = this.dir < 0 ? 0 : 10;
				this.unbind(enterFrame, enterFrameHover);
				this.SS = 0;
			}
			this.alpha = this.counter / 10;
		};
	btnhvr.counter = btnhvr.dir  = btnhvr.binded = 0;
	btnhvr.bind("Click", function () {
		hint();
	})
	.bind("MouseOut", function () {
		this.dir = -1;
		if (this.binded === 0) {
			this.bind(enterFrame,enterFrameHover);
			this.binded = 1;
		}
	})
	.bind("MouseOver", function () {
		this.dir = 1;
		if (this.binded === 0) {
			this.bind(enterFrame,enterFrameHover);
			this.binded = 1;
		}
	});
//	window.lightningImg = Crafty.assets['assets/set.png'];
	window.lightningImg = Crafty.assets['assets/set.png'];
	createLevel();

//	window.debris = [MAX_ITEM];
//	for (var i = 0; i < MAX_ITEM; i++) {
//		debris[i] = [4];
//		for (var j = 0; j < 4; j++) {
//			debris[i][j] = Crafty.e("Debris").debris(i);
//		}
//	}
//	Crafty.e("DMng").attr({counter: 0}).bind(enterFrame, function () {
//		this.counter++;
//		if (this.counter > 500) {
//			this.counter = 0;
//			for (var i = 0, j; i < MAX_ITEM; i++) {
//				for (j = debris[i].length - 1; j > 3; j--) {
//					if (!debris[i][j].isUsing) {
//						debris[i][j].destroy();
//						debris[i].splice(j, 1);
//					}
//				}
//			}
//		}
//	});
});


console.log("Loaded scene.js");