
var X = 4, Y = 27;
var firstGem = 0, enterFrame = "EnterFrame", isMouseReleased = false,
	lockInput = false, gemAnimator = "GemAnimator", detachChoser = false;

Crafty.c("Table", {
	init: function() {
		this.addComponent("2D,DOM,table");
		this.x = 600;
		this.y = -12;
		this.rotation = 60;
		this.origin("center");
		var delta = 20;
		var transform = function () {
			this.x -= delta;
			this.rotation -= delta / 10;
			delta -= 0.3;
			if (this.x < 0) {
				this.x = 0;
				this.rotation = 0;
				this.unbind(enterFrame, transform).timebarStart();
				Crafty.e("FallManager").fallManager(jewelsEnt);
			}
		}
		this.bind(enterFrame, transform);
	}
});

Crafty.c("Number", {
	dir:0,
	lifeTime:0,
	init:function(){
		this.addComponent("2D,DOM");
	},
	number: function(number, gem, x, y) {
		return this.addComponent("num" + gem + number)
		.attr({x:x, y:y})
		.bind(enterFrame, function() {
			this.y -= 3;
			this.lifeTime++;
			if (this.lifeTime > 30) {
				this.destroy();
			}
		});
	}
});

Crafty.c("Jewel", {
	speed:50,
	__Y:0,
	init: function() {
		this.addComponent("2D,DOM,Mouse,SpriteAnimation")
			.bind("MouseDown", function() {
				if (hintEnt.playing) {
					hintEnt.end();
				}
				var t = this;
				isMouseReleased = false;
				if (lockInput || t == firstGem || t.changed !== 0 || t.falling || (firstGem !== 0 && firstGem.falling)) return;
				if (firstGem === 0) {
					firstGem = t;
					chose1Ent.withGem(t.stt < MAX_ITEM ? t.stop().animate("selfSpin", 12, -1) : t);
				} else if ((t.i !== firstGem.i || t.j !== firstGem.j) &&  firstGem.changed === 0 &&
					((Math.abs(t.i - firstGem.i) === 1 && t.j === firstGem.j) ||
						(Math.abs(t.j - firstGem.j) === 1 && t.i === firstGem.i))) {
					if (t.stt === MAX_ITEM || firstGem.stt === MAX_ITEM) {
						this.superGem();
					} else {
						chose2Ent.withGem(t);
						t._exchange(firstGem, t);
						t._gemAnimator = Crafty.e(gemAnimator).gemAnimator(t, firstGem);
					}
					if (firstGem.stt < MAX_ITEM) {
						firstGem.reset();
					}
					if (t.stt < MAX_ITEM) {
						t.reset();
					}
					firstGem = 0;
					lockInput = true;
				} else {
					if (firstGem.stt < MAX_ITEM) {
						firstGem.reset();
					}
					if (t.stt < MAX_ITEM) {
						t.reset();
					}
					firstGem.detach(chose1Ent);
					firstGem = t;
					chose1Ent.withGem(t.stt < MAX_ITEM ? t.stop().animate("selfSpin", 12, -1) : t);
				}
			})
			.bind("MouseOver", function () {
				var t = this;
				if (lockInput || isMouseReleased || t.changed !== 0 ||
					firstGem === 0 || firstGem.changed !== 0 || firstGem.falling || t.falling) return;
				if ((t.i !== firstGem.i || t.j !== firstGem.j) &&
					((Math.abs(t.i - firstGem.i) === 1 && t.j === firstGem.j) ||
						(Math.abs(t.j - firstGem.j) === 1 && t.i === firstGem.i))) {
					if (t.stt === MAX_ITEM || firstGem.stt === MAX_ITEM) {
						this.superGem();
					} else {
						chose2Ent.withGem(t);
						t._exchange(firstGem, t);
						t._gemAnimator = Crafty.e(gemAnimator).gemAnimator(t, firstGem);
					}
					if (firstGem.stt < MAX_ITEM)
						firstGem.reset();
					if (t.stt < MAX_ITEM)
						t.reset();
					firstGem = 0;
					lockInput = true;
				} else {
					firstGem = 0;
				}
			})
			.bind("MouseUp", function () {
				isMouseReleased = true;
			})
			.changed = 0;
	},
	jewel: function(jewels, stt, i, j, timeWait) {
		var t = this;
		t._jewels = jewels;
		t.i = i;
		t.j = j;
		t.stt = stt;
		t.__Y = Y + i*67;
		t._timewait = timeWait;
//		t.speed = 40;

		return t.addComponent("gem" + t.stt)
			.attr({x:X + j * 67, y: -(MAX_RC - i)*67})
//			.bind(enterFrame,this._fallEnterFrame)
			.animate("supGem", 0, 0, 7)
			.animate("selfSpin", 0, 0, 9);
	},
	toSuperGem: function () {
		return this.removeComponent("gem" + this.stt)
			.addComponent("supergem")
			.animate("supGem", 18, -1)
			.attr({stt:MAX_ITEM});
	},
	resetGem: function() {
		var t = this.removeComponent("gem" + this.stt, false);
		t.stt = Math.floor(Math.random()*6.999);
		t.__Y = Y + t.i*67;
		t.alpha = 1;
		return this.addComponent("gem" + t.stt);
	},
	superGem: function () {
		if (chose1Ent._parent) chose1Ent._parent.detach(chose1Ent);
		if (chose2Ent._parent) chose2Ent._parent.detach(chose2Ent);
		chose1Ent.alpha = 0.001;
		chose2Ent.alpha = 0.001;


		var list = [], i, j, currGem, src;
		if (firstGem.stt === MAX_ITEM) {
			currGem = this.stt;
			src = firstGem;
			list.push(this);
		} else {
			currGem = firstGem.stt;
			src = this;
			list.push(firstGem);
		}
		for (i = 0; i < MAX_RC; i++) {
			for (j = MAX_RC - 1; j >= 0; j--) {
				if (this._jewels[i][j].stt === currGem) {
					list.push(this._jewels[i][j]);
				}
			}
		}
		for (i = 1; i < list.length; i++) {
			if (list[0][0] === list[i][0]) {
				list.splice(i, 1);
				break;
			}
		}
		Crafty.e(gemAnimator).startLightning(src, list);
	},
	_exchangeEnterFrame: function () {
		var t = this;
		if (t.changed === 0) {
			t.changed = {};
			if (t.x < X + t.j * 67 - 5) {
				t.changed.x = 5;
			} else if (t.x > X + t.j * 67 + 5) {
				t.changed.x = -5;
			}
			if (t.y < Y + t.i * 67 - 5) {
				t.changed.y = 5;
			} else if (t.y > Y + t.i * 67 + 5) {
				t.changed.y = -5;
			}
		} else {
			if (t.changed.x) {
				t.x += t.changed.x;
				if (Math.abs(t.x - X - t.j * 67) < 3) {
					t.x = X + t.j * 67;
					t.unbind(enterFrame, t._exchangeEnterFrame);
					t.changed = 0;
					if (detachChoser) {
						if (chose1Ent._parent) chose1Ent._parent.detach(chose1Ent);
						if (chose2Ent._parent) chose2Ent._parent.detach(chose2Ent);
						chose1Ent.alpha = 0.001;
						chose2Ent.alpha = 0.001;
						detachChoser = false;
					}
					if (t._gemAnimator !== udef) {
						t._gemAnimator.startCheck();
					}
				}
			} else {
				t.y += t.changed.y;
				if (Math.abs(t.y - Y - t.i * 67) < 3) {
					t.y = Y + t.i * 67;
					t.unbind(enterFrame, t._exchangeEnterFrame);
					t.changed = 0;
					if (detachChoser) {
						if (chose1Ent._parent) chose1Ent._parent.detach(chose1Ent);
						if (chose2Ent._parent) chose2Ent._parent.detach(chose2Ent);
						chose1Ent.alpha = 0.001;
						chose2Ent.alpha = 0.001;
						detachChoser = false;
					}
					if (t._gemAnimator !== udef) {
						t._gemAnimator.startCheck();
					}
				}
			}
		}
	},
	_fallEnterFrame: function() {
		this._timewait--;
		if (this._timewait > 0) return false;
		this.speed += 2;
		this.y += this.speed;
		if (this.y > this.__Y) {
			this.y = this.__Y;
			this.speed = 5;
			this.falling = false;
			this./*unbind(enterFrame, this._fallEnterFrame).*/_timewait = 0;
			return true;
		}
		return false;
	},
//	_fallAtStartEnterFrame: function () {
//		this.speed += 2;
//		this.y += this.speed;
//		if (this.y > this.__Y) {
//			this.y = this.__Y;
//			this.speed = 3;
//			this.unbind(enterFrame, this._fallAtStartEnterFrame);
//		}
//	},
//	_markFalling: function(isFalling) {
//		var inc, jewels = this._jewels, i, j;
//		for (j = this.j; j >= 0 && jewels[this.i][j].stt === this.stt; j--) {
//			for (i = this.i; i >= 0; i--) {
//				jewels[i][j].falling = isFalling;
//			}
//		}
//		for (j = this.j + 1; j < MAX_RC && jewels[this.i][j].stt === this.stt; j++) {
//			for (i = this.i; i >= 0; i--) {
//				jewels[i][j].falling = isFalling;
//			}
//		}
//	},
	_exchange: function (gem1, gem2) {
		gem1._exchangeOnly(gem1, gem2);
		gem1.bind(enterFrame, gem1._exchangeEnterFrame).changed = 0;
		gem2.bind(enterFrame, gem2._exchangeEnterFrame).changed = 0;
	},
	_exchangeOnly: function (gem1, gem2) {
		var temp = gem1._jewels[gem1.i][gem1.j];
		gem1._jewels[gem1.i][gem1.j] = gem1._jewels[gem2.i][gem2.j];
		gem1._jewels[gem2.i][gem2.j] = temp;
		temp = gem1.i;
		gem1.i = gem2.i;
		gem2.i = temp;
		temp = gem1.j;
		gem1.j = gem2.j;
		gem2.j = temp;
	},
	absolutePosition: function() {
		return this.attr({x:X + this.j * 67, y: Y + this.i*67, alpha:1});
	},
	log: function() {
		console.log("i = " + this.i + ";j = " + this.j + ";stt = " + this.stt);
	}
});

Crafty.c("GemAnimator", {
	explosedDone: true,
	list: null,
	breakGem:[],
	init:function() {},
	gemAnimator:function(jew1, jew2) {
		this.jew1 = jew1;
		this.jew2 = jew2;
		return this;
	},
	startCheck:function startCheck() {
		this.jew1._gemAnimator = udef;
		this.jew2._gemAnimator = udef;
		var list = [];
		checkRowAndColumn(this.jew1._jewels, this.jew1, list);
		checkRowAndColumn(this.jew1._jewels, this.jew2, list);
		if (list.length > 2) {
			if (chose1Ent._parent) chose1Ent._parent.detach(chose1Ent);
			if (chose2Ent._parent) chose2Ent._parent.detach(chose2Ent);
			chose1Ent.alpha = 0.001;
			chose2Ent.alpha = 0.001;
			this._collectGems(list);
		} else {
			lockInput = false;
			this.jew1.unbind(enterFrame,this.jew1._exchangeEnterFrame).absolutePosition().changed = 0;
			this.jew2.unbind(enterFrame,this.jew2._exchangeEnterFrame).absolutePosition().changed = 0;
			this.jew1._exchange(this.jew1,this.jew2);
			detachChoser = true;
			this.destroy();
		}
	},
	startLightning: function (source, listTargets) {
		this.lightning = Crafty.e("Lightning").lightning(source, listTargets, this);
		(this.list = listTargets.concat()).push(source);
		this.jew1 = source;
	},
	_collectGems: function (list) {
		this.list = list;
		var listBreak = [];
		collectGems(list);
		var gemLight, explMng = Crafty.e("ExplosionManager");
		for (var i = 0; i < list.length; i++) {
			gemLight = list[i];
			gemLight.falling = true;
			if (gemLight.lighting) {
				findExploseGem(gemLight, listBreak, explMng);
			}
		}
		if (listBreak.length !== 0) {
			explMng.explosionManager(this, listBreak);
		} else {
			explMng.destroy();
		}
		if (listBreak.length) {
			for (var i = 0; i < list.length; i++) {
				if (containsGem(listBreak, list[i])) {
					list.splice(i, 1);
					i--;
				}
			}
			this.breakGem = listBreak;
		}
		this.bind(enterFrame, this._fadeGem);
	},
	_fadeGem:function() {
		var gem = 0;
		for (var k = 0; k < this.list.length; k++) {
			gem = this.list[k];
			gem.alpha -= 0.12;
			if (gem.alpha <= 0) {
				gem.alpha = 0;
				gem = 0;
			}
		}
		if (0 === gem && this.explosedDone) {
			this.unbind(enterFrame, this._fadeGem);
			this.list = this.list.concat(this.breakGem);
			this.breakGem = [];
			this._getAllFallGems();
		}
	},
	_getAllFallGems: function() {
		var list = this.list,
			gem = list[0],
			faller,
			jewels = gem._jewels,
			maxi = 0,
			fallList = [],
			maxf = [0,0,0,0,0,0,0,0];
		for (var i, j = 0; j < list.length; j++) {
			gem = list[j];
			gem.reset();
			maxf[gem.j]++;
			maxi = maxi < gem.i ? gem.i : maxi;
			for (i = gem.i - 1; i >= 0; i--) {
				faller = jewels[i][gem.j];
				maxi = maxi < faller.i ? faller.i : maxi;
				addToList(fallList, faller);
				gem._exchangeOnly(gem, faller);
			}
		}
		for (i = 0; i < list.length; i++) {
			list[i].resetGem().y = -(maxf[list[i].j] - list[i].i) * 67;
		}
		for (i = 0; i < fallList.length; i++) {
			fallList[i].__Y = Y + fallList[i].i*67;
			addToList(list, fallList[i]);
		}

		for (i = 0; i < list.length; i++) {
			list[i]._timewait = (maxi - list[i].i)*3;
			list[i].falling = true;
		}

		this.bind(enterFrame,this._fallGemsEnterFrame);
	},
	_fallGemsEnterFrame: function() {
		var done = true;
		for (var i = 0; i < this.list.length; i++) {
			done = this.list[i]._fallEnterFrame() && done;
		}
		if (done) {
			this.unbind(enterFrame, this._fallGemsEnterFrame);
			var list = [], jewels = this.jew1._jewels;
			checkAllRowsAndColumns(jewels,list);
			if (list.length > 2) {
				this._collectGems(list);
			} else if (levelDesc.isLevelUp()) {
				levelDesc.nextLevel(jewels);
				Crafty.e("NextLeveler");
				this.destroy();
			} else {
				lockInput = false;
				levelDesc.combo = 0;
				if (!checkMove(jewels)) {
					Crafty.e("GameOverer");
				}
				this.destroy();
			}
		}
	}
});

Crafty.c("ExplosionManager", {
	gemAnimator:null,
	exploseList:null,
	countBounce:0,
	init: function() {
		this.nuclear = [];
	},
	explosionManager: function(gemAnim, exploseList) {
		gemAnim.explosedDone = false;
		this.list = [];
		this.gemAnimator = gemAnim;
		this.exploseList = exploseList;
		var jewels = exploseList[0]._jewels, added = [8], curr;
		for (var k = 0; k < exploseList.length; k++) {
			curr = exploseList[k];
			if (!added[curr.j]) {
				for (var i = 0; i < curr.i; i++) {
					this.list.push(jewels[i][curr.j]);
				}
				added[curr.j] = true;
			}
		}
//		logEvery(this.list);
		this.bind(enterFrame, this._bounceUpGemsEnterFrame);
		for (var i = 0; i < this.nuclear.length; i++) {
			instantScore(this.nuclear[i].stt, exploseList.length/4 + i,
				this.nuclear[i].i, this.nuclear[i].j);
		}
	},
	makeExplose: function(gem) {
		var x = gem.x, y = gem.y;
		this.nuclear.push(gem);
		Crafty.e("Explosion").attr({x:x-46, y:y-46});
		Crafty.e("TwinkleDust").attr({x:x, y:y});
	},
	/**
	 * làm các viên kim cương bên trên bật lên vài pixel
	 * @private
	 */
	_bounceUpGemsEnterFrame: function() {
		this.countBounce++;
		if (this.countBounce <= 10) {
			for (var i = 0 ; i < this.list.length; i++) {
				this.list[i].y -= 2;
			}
		} else {
			this.gemAnimator.explosedDone = true;
			this.destroy();
		}
	}
});

Crafty.c("Light", {
	init:function() {
		this.addComponent("2D,DOM,SpriteAnimation,gemlighteff")
			.animate("lighting", 0,0,11)
			.animate("lighting", 35, -1);
	}
});

Crafty.c("Explosion", {
	init:function () {
		this.addComponent("2D,DOM,boom1,SpriteAnimation")
			.animate("exboom", 0, 0, 6)
			.animate("exboom", 5)
			.bind("AnimationEnd", function() {
				this.destroy();
			});
	}
});

Crafty.c("TwinkleDust", {
	init:function() {
		this.addComponent("2D,DOM,twinkleDust,SpriteAnimation")
			.animate("dust", 0, 0, 7)
			.animate("dust", 7)
			.bind("AnimationEnd", function() {this.destroy();});
	}
})

Crafty.c("Debris", {
	init: function () {
		var dx = (this[0] % 2 === 0 ? -7 : 3) + Math.random() * 4
		this.addComponent("2D,DOM")
			.attr({
				x: -gwidth,
				y: -gheight,
				z: 100,
				isUsing: false,
				dx: dx
			});
	},
	debris: function (type) {
		return this.addComponent("break" + type + this[0] % 4)
			.origin('center');
	},
	start: function(gem) {
		this.dy = Math.random() * 6 - 15;
		this.attr({x:gem.x + Math.random() * 35, y:gem.y + Math.random() * 35})
			.bind(enterFrame, this._enterFrame)
			.isUsing = true;
		return this;
	},
	_enterFrame: function() {
		this.x += this.dx;
		this.y += this.dy;
		this.dy += 1;
		this.rotation += 10;

		if (this.x < -50 || this.x > gwidth + 50 || this.y > gheight + 50) {
			this.unbind(enterFrame, this._enterFrame)
				.isUsing = false;
		}
	}
});

Crafty.c("Choser", {
	init:function () {
		this.addComponent("2D,DOM,chosen").alpha = 0.0001;
	},
	withGem: function (gemEnt) {
		if (this._parent) this._parent.detach(this);
		gemEnt.attach(this.attr({x:gemEnt.x - 5,  y: gemEnt.y - 4, alpha:1}));
	}
});
Crafty.c("GameOverer", {
	init:function () {
		this.addComponent("2D,Canvas");
	}
});

Crafty.c("Lightning", {
	init:function () {
		this.requires("2D,Canvas").attr({w:gwidth,h:gheight,alpha:0.9});
		this.frame = 0;
		this.ready = true;
		this.random = new Randomer();
	},
	lightning: function(source, targets, mng) {

		if (console.profile) {
			console.profile("fall at start");
			window.startTime = Date.now();
		}
		this.animMng = mng;
		this.targets = targets;
		this.source = source;
		this.counters = [targets.length];
		this.delays = [targets.length];
		for (var i = 0; i < targets.length; i++) {
			this.counters[i] = 10;
			this.delays[i] = i;
		}
		this.canvas = document.createElement("canvas");
		this.context = this.canvas.getContext("2d");
		this.canvas.width = gwidth;
		this.canvas.height = gheight;
		this.canvas.style.zIndex = 200;

		this.unbind("Draw").bind("Draw", this._lightningDraw);
		this.bind(enterFrame, function () {
			this.x += 0.0001;
		});
	},
	_lightningDraw: function(ctx) {
		if (this.frame++ % 4 !== 0) {
			ctx.ctx.drawImage(this.context.canvas, 0, 0);
			return;
		}
		currentLightning++;
//		this.context.clearRect(0, 0, 800, 600);
//		ctx = {ctx:this.context};

		var done = true, target, stt = this.targets[0].stt;
		if (stt === MAX_ITEM) stt = 1;

		this.context.clearRect(0, 0, gwidth, gheight);
		for (var i = 0; i < this.targets.length; i++) {
			target = this.targets[i];
			this.delays[i]--;
			if (this.delays[i] < 0) {
				this.counters[i]--;
				if (this.counters[i] > 0) {
					drawLightning(this.context, this.source.x + 30, this.source.y + 30,
						target.x + this.random.nextInt(), target.y + this.random.nextInt(),
						40, stt);
					done = false;
				} else if (this.counters[i] === 0) {
					target.alpha = 0;
					if (target.lighting) {
						target.lighting = false;
						for (var i = 0; i < target._children.length; i++) {
							target._children[i].destroy();
						}
						target._children.length = 0;
					}
					makeDebris(this.targets[i]);
				}
			}
		}
		ctx.ctx.drawImage(this.canvas, 0, 0);
		if (done) {
			instantScore(stt, this.targets[0].stt === MAX_ITEM ? this.targets.length * 10 : this.targets.length / 3 + 2,
				this.source.i + 0.5, this.source.j + 0.5);
			this.animMng._getAllFallGems();
			this.destroy();
			if (console.profileEnd){
				console.log(Date.now() - startTime);
				console.profileEnd();
			}
		}
	}
});

//445x22............
Crafty.c("TimeBar", {
	init: function () {
		var timeBar = this.addComponent("2D,DOM,timebar").attr({x: 48, y: 561, alpha: 0.0001, increasing: false})
			.bind("NewScore", function () {
				this.scoreWidth = Math.floor(445 * (levelDesc.currentLevelScore()));
				if (!this.increasing) {
					this.bind(enterFrame, this._increaseWidthEnterFrame);
					this.increasing = true;
					if (this.decreasing) {
						this.unbind(enterFrame, this._decreaseWidthEnterFrame).decreasing = false;
					}
				}
			})
			.bind("LostScore", function () {
				this.scoreWidth = Math.floor(445 * (levelDesc.currentLevelScore()));
				if (!this.decreasing) {
					this.bind(enterFrame, this._decreaseWidthEnterFrame);
					this.decreasing = true;
					if (this.increasing) {
						this.unbind(enterFrame, this._increaseWidthEnterFrame).increasing = false;
					}
				}
			});
		Crafty.e("Table").timebarStart = function () {
			timeBar.bind(enterFrame, timeBar._shrinkBarEnterFrame).alpha = 1;
		};
	},
	_shrinkBarEnterFrame: function () {
		this.w -= 8;
		if (this.w < 0) {
			this.trigger("Change");
			this.unbind(enterFrame, this._shrinkBarEnterFrame).w = 0;
		}
	},
	_increaseWidthEnterFrame: function () {
		if (this.w < this.scoreWidth) {
			this.w++;
		} else {
			this.unbind(enterFrame, this._increaseWidthEnterFrame).increasing = false;
		}
	},
	_decreaseWidthEnterFrame: function () {
		if (this.w > this.scoreWidth) {
			this.w--;
		} else {
			this.unbind(enterFrame, this._decreaseWidthEnterFrame).decreasing = false;
		}
	}
});

Crafty.c("NextLeveler", {
	init: function () {
		this.addComponent("2D,DOM,Text,levelText").text("Level up").attr({x:gwidth/2 - 70, w: 200, h:200})
			.bind(enterFrame, function() {
				this.y += 4;
				if (this.y > gheight / 3) {
					this.y = gheight / 3;
					this.counter++;
					this.alpha -= 0.02;
					if (this.counter > 49) {
						lockInput = false;
						Crafty.scene("Play");
						this.destroy();
					}
				}
			});
		this.counter = 0;
	}
});

Crafty.c("NewLeveler", {
	init:function(){
		this.addComponent("2D,DOM,Text,levelText").text("Level " + levelDesc.level).attr({x:gwidth/2 - 70, w: 200, h:200})
			.bind(enterFrame, function() {
				this.y += 4;
				if (this.y > gheight / 3) {
					this.y = gheight / 3;
					this.counter++;
					this.alpha -= 0.02;
					if (this.counter > 49) {
						this.destroy();
					}
				}
			});
		this.counter = 0;
	}
});

Crafty.c("FallManager", {
	init: function () {},
	fallManager: function (jewels) {
		this.jewels = jewels;
		this.counter = 64;
		this.fallingJewels = [];
		this.bind(enterFrame, function () {
			if (--this.counter >= 0) {
				var row = Math.floor(this.counter / MAX_RC), col = this.counter % MAX_RC;
				this.fallingJewels.push(this.jewels[row][col]);
			}
			var i = 0, l = this.fallingJewels.length;
			for (; i < l; i++) {
				if (fallAtStartEnterFrame(this.fallingJewels[i])) {
					this.fallingJewels.splice(i, 1);
					i--; l--;
				}
			}
			if (l === 0) {
				this.destroy();
			}
		});
	}
});

function fallAtStartEnterFrame(jewel) {
	jewel.speed += 3;
	jewel.y += jewel.speed;
	if (jewel.y > jewel.__Y) {
		jewel.y = jewel.__Y;
		jewel.speed = 5;
		return true;
	}
	return false;
}

Crafty.c("GameOverer", {
	init:function () {
		this.addComponent("2D,DOM,nomove").attr({x:(gwidth - this.w) /2, y: 200});
		var h = this.y + this.h - 5,
			scoreLetter = Crafty.e("2D,DOM,hisco").attr({x:(gwidth - 236) / 2, y: h}),
			num = '' + levelDesc.score;
		h += scoreLetter.h;
		var x = gwidth / 2 - 15 * num.length;
		for(var i = 0; i < num.length; i++) {
			levelDesc.scoreEnts.push(
				Crafty.e("2D,DOM,hisconums" + num[i]).attr({x:x, y:h}));
			x += 30;
		}

		Crafty.e("2D,DOM,Mouse").attr({x:0, y: 0, w: gwidth, h: gheight})
			.bind("MouseDown", function () {
				levelDesc.reset();
				Crafty.scene("Menu");
			});
	}
});

Crafty.c("Hint", {
	init: function () {
		this.addComponent("2D,DOM,hinth,SpriteAnimation")
			.animate("blink", [[0,0],[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[5,0],[4,0],[3,0],[2,0],[1,0]]).attr({x:gwidth, y: gheight})
			.playing = false;
	},
	blink: function (i, j) {
		this.attr({x:X + j * 67 + 13, y: Y + i*67 - 20}).animate("blink", 20, -1).playing = true;
	},
	end: function () {
		this.reset().attr({x:gwidth, y: gheight}).playing = false;
		this.trigger("Change");
	}
});

function Randomer() {
	this.elem = [];
	for (var i = 0; i < 20; i++) {
		this.elem[i] = Math.floor(Math.random() * 10);
	}
	this.index = 0;
	this.nextInt = function () {
		return 25 + this.elem[(this.index++ % 20)];
	}
}

function distance(x1, y1, x2, y2) {
	return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
}
function drawLightning(context, x1, y1, x2, y2, displace, gemStt) {
	var mx = (x1 + x2) / 2, my = (y1 + y2) / 2,
		d = distance(x1, y1, x2, y2);
	if (d < 50) {
		if (y1 < y2) {
			var t = y1; y1 = y2; y2 = t;
			t = x1; x1 = x2; x2 = t;
		}
		var scale = d/50, angle = Math.asin((y1-y2)/d);
		if (x1 > x2) {
			angle = Math.PI / 2 + angle;
		} else {
			angle = Math.PI / 2 - angle;
		}
		x1 = -25 * scale;
		y1 = 50 * scale;
		context.translate(mx, my);
		context.rotate(angle);
		context.drawImage(lightningImg, gemStt * 30, 0, 30, 50, x1, x1, y1, y1);
		context.rotate(-angle);
		context.translate(-mx, -my);
	} else {
		var midx = mx + (Math.random() - 0.5) * displace;
		var midy = my + (Math.random() - 0.5) * displace;
		drawLightning(context, x1, y1, midx, midy, displace / 2, gemStt);
		drawLightning(context, midx, midy, x2, y2, displace / 2, gemStt);
	}
}
var currentLightning = 0;
//function drawLightning(context, x1, y1, x2, y2, stt) {
//	if (y1 < y2) {
//		var t = y1;
//		y1 = y2;
//		y2 = t;
//		t = x1;
//		x1 = x2;
//		x2 = t;
//	}
//	var mx = (x1 + x2) / 2, my = (y1 + y2) / 2,
//		d = distance(x1, y1, x2, y2);
//	var scale = d / 500, angle = Math.asin((y1 - y2) / d);
//	if (x1 > x2) {
//		angle = Math.PI / 2 + angle;
//	} else {
//		angle = Math.PI / 2 - angle;
//	}
//
//		x1 = -25 * scale;
//		y1 = 500 * scale;
//		context.translate(mx, my);
//		context.rotate(angle);
//		context.drawImage(lightningImg, stt * 70, (currentLightning % 3) * 500, 70, 500, -35*scale, -250*scale, 70*scale, 500*scale);
//		context.rotate(-angle);
//		context.translate(-mx, -my);
//}

function makeDebris(gem) {
//	var stt = gem.stt < MAX_ITEM ? gem.stt: 1, debriss = debris[stt], count = 0;
//	for (var i = 0; i < debriss.length; i++) {
//		if (!debriss[i].isUsing) {
//			debriss[i].start(gem);
//			count++;
//			if (count === 6) return;
//		}
//	}
//	for (i = count; i < 6; i++) {
//		debris[stt].push(Crafty.e("Debris").debris(stt).start(gem));
//	}
}

console.log("Loaded ent.js");

