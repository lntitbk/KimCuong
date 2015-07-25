var MAX_RC = 8, MAX_ITEM = 7,
	levelDesc = {
		level: 1, passScore: 500, basicScore: 10, lighting:0, superGem: 0,
		scoreMap: [0, 500], scoreRate: 3, decreaseRate:1.5,
		score: 0, combo: 0,
		instantScoreEnts: [],
		scoreEnts: [],
		currentLevelScore: function () {
			return (this.score - this.scoreMap[this.level - 1]) / (this.scoreMap[this.level] - this.scoreMap[this.level - 1]);
		},
		isLevelUp: function () {
			return this.score > this.passScore;
		},
		nextLevel: function (jewels) {
			this.passScore = Math.floor(this.scoreMap[this.level] * this.scoreRate);
//			this.decreaseRate /= 1.79;
			this.scoreRate = this.scoreRate - this.decreaseRate;
			this.level++;
			this.scoreMap[this.level] = this.passScore;
			this.combo = 0;
			this.basicScore += 5;
			this.lighting = 0;
			this.superGem = 0;
			for (var j, i = 0; i < MAX_RC; i++) {
				for (j = 0; j < MAX_RC; j++) {
					if (jewels[i][j].lighting) {
						this.lighting++;
					} else if (jewels[i][j].stt === MAX_ITEM) {
						this.superGem++;
					}
				}
			}
		},
		reset: function () {
			this.score = 0;
			this.passScore = 500;
			this.basicScore = 10;
			this.combo = 0;
			this.scoreRate = 3;
			this.decreaseRate = 1.5;
			this.level = 1;
			this.lighting = 0;
			this.superGem = 0;
		}
	};

var map = [
	[5, 3, 3, 6, 0, 4, 5, 0],
	[3, 1, 5, 4, 5, 4, 2, 2],
	[3, 3, 4, 3, 3, 1, 3, 4],
	[0, 3, 5, 3, 5, 5, 3, 5],
	[3, 2, 3, 0, 4, 2, 0, 2],
	[0, 6, 3, 5, 3, 5, 3, 5],
	[3, 3, 1, 3, 1, 6, 0, 1],
	[3, 3, 0, 3, 2, 6, 3, 0]
];

function createLevel() {
	Crafty.e("TimeBar");
	var jewels = [MAX_RC], item, jewelsEnt = [MAX_RC], list = [];
	for (var j, i = 0; i < MAX_RC; i++) {
		jewels[i] = [MAX_RC];
		jewelsEnt[i] = [MAX_RC];
		for (j = 0; j < MAX_RC; j++) {
			item = jewels[i][j] = {};
			item.stt = Math.floor(Math.random() * MAX_ITEM);
			item.i = i;
			item.j = j;
		}
	}
	checkAllRowsAndColumns(jewels,list);
	if (list.length > 2) {
		do {
			for (i = 0; i < list.length; i++) {
				list[i].stt = Math.floor(Math.random()*MAX_ITEM);
			}
			list = [];
			checkAllRowsAndColumns(jewels,list);
		} while (list.length !== 0);
	}
	var count = 0;
	for (i = 0; i < MAX_RC; i++) {
		for (j = MAX_RC - 1; j >= 0; j--) {
			count++;
			jewelsEnt[i][j] = Crafty.e("Jewel").jewel(jewelsEnt, jewels[i][j].stt/*map[i][j]*/, i, j, (64 - count));
		}
	}
	for (i = 0; i < levelDesc.lighting; i++) {
		makeLighting([jewelsEnt[Math.floor(Math.random()*MAX_RC)][Math.floor(Math.random()*MAX_RC)]], 0);
	}
	for (i = 0; i < levelDesc.superGem; i++) {
		makeSuperGem([jewelsEnt[Math.floor(Math.random()*MAX_RC)][Math.floor(Math.random()*MAX_RC)]], 0);
	}
//	makeSuperGem([jewelsEnt[5][5]], 0);
	window.jewelsEnt = jewelsEnt;
	Crafty.e("NewLeveler");
	window.chose1Ent = Crafty.e("Choser");
	window.chose2Ent = Crafty.e("Choser");
	window.hintEnt = Crafty.e("Hint");
}

function checkAllRowsAndColumns(jewels, list) {
	for (var j, i = 0; i < MAX_RC; i++) {
		for (j = 0; j < MAX_RC; j++) {
			checkRowAndColumn(jewels, jewels[i][j].stt, i, j, list);
		}
	}
}

function checkRowAndColumn(jewels, stt, x, y, list) {
	var checkBackward = false, i, j;
	if (arguments.length === 3) {
		list = x;
		y = stt.j;
		x = stt.i;
		stt = stt.stt;
		checkBackward = true;
	}

	//column first
	var tempList = [jewels[x][y]];
	if (checkBackward) {
		for (i = x - 1; i >= 0; i--) {
			if (stt === jewels[i][y].stt) {
				addToList(tempList, jewels[i][y]);
			} else {
				break;
			}
		}
	}

	for (i = x + 1; i < MAX_RC; i++) {
		if (stt === jewels[i][y].stt) {
			addToList(tempList, jewels[i][y]);
		} else {
			break;
		}
	}
	if (tempList.length > 2) {
		for (i in tempList) {
			list.push(tempList[i]);
		}
	}

	//then row
	tempList = [jewels[x][y]];
	if (checkBackward) {
		for (j = y - 1; j >= 0; j--) {
			if (stt === jewels[x][j].stt) {
				addToList(tempList, jewels[x][j]);
			} else {
				break;
			}
		}
	}

	for (j = y + 1; j < MAX_RC; j++) {
		if (stt === jewels[x][j].stt) {
			addToList(tempList, jewels[x][j]);
		} else {
			break;
		}
	}
	if (tempList.length > 2) {
		for (i in tempList) {
			list.push(tempList[i]);
		}
	}
	removeDuplicateItems(list);
}

function checkMove(jewels) {
	var stt, i, j;
	for (i = 0; i < MAX_RC; i++) {
		for (j = 0; j < MAX_RC; j++) {
			stt = jewels[i][j].stt;
			if (stt === MAX_ITEM) {
				if (j < MAX_RC - 1) {
					return {i:i, j:j + 1};
				} else {
					return {i:i, j:j - 1};
				}
			}
			////////////////////////////////////////////////////////
			// Kiểm tra theo dòng
			////////////////////////////////////////////////////////
			if (j < 7 && jewels[i][j + 1].stt === stt) {
				if (j > 1 && jewels[i][j - 2].stt === stt) {
					return {i:i, j:j - 2};
				}
				if (j < 5 && jewels[i][j + 3].stt === stt) {
					return {i:i, j:j + 3};
				}

				if (j > 0) {
					if (i > 0 && jewels[i - 1][j - 1].stt === stt) {
						return {i:i - 1, j:j - 1};
					}
					if (i < 7 && jewels[i + 1][j - 1].stt === stt) {
						return {i:i + 1, j:j - 1};
					}
				}

				if (j < 6) {
					if (i > 0 && jewels[i - 1][j + 2].stt === stt) {
						return {i:i - 1, j:j + 2};
					}
					if (i < 7 && jewels[i + 1][j + 2].stt === stt) {
						return {i:i + 1, j:j + 2};
					}
				}
			}

			if (j < 6 && jewels[i][j + 2].stt === stt) {
				if (i > 0) {
					if (jewels[i - 1][j + 1].stt === stt) {
						return {i:i - 1, j:j + 1};
					}
				}
				if (i < 7) {
					if (jewels[i + 1][j + 1].stt === stt) {
						return {i:i + 1, j:j + 1};
					}
				}
			}

			////////////////////////////////////////////////////////
			// Kiểm tra theo cột
			////////////////////////////////////////////////////////
			if (i < 7 && jewels[i + 1][j].stt === stt) {
				if (i > 1 && jewels[i - 2][j].stt === stt) {
					return {i:i - 2, j:j};
				}
				if (i < 5 && jewels[i + 3][j].stt === stt) {
					return {i:i + 3, j:j};
				}

				if (i > 0) {
					if (j > 0 && jewels[i - 1][j - 1].stt === stt) {
						return {i:i - 1, j:j - 1};
					}
					if (j < 7 && jewels[i - 1][j + 1].stt === stt) {
						return {i:i - 1, j:j + 1};
					}
				}

				if (i < 6) {
					if (j > 0 && jewels[i + 2][j - 1].stt === stt) {
						return {i:i + 2, j:j - 1};
					}
					if (j < 7 && jewels[i + 2][j + 1].stt === stt) {
						return {i:i + 2, j:j + 1};
					}
				}
			}

			if (i < 6 && jewels[i + 2][j].stt === stt) {
				if (j > 0) {
					if (jewels[i + 1][j - 1].stt === stt) {
						return {i:i + 1, j:j - 1};
					}
				}
				if (j < 7) {
					if (jewels[i + 1][j + 1].stt === stt) {
						return {i:i + 1, j:j + 1};
					}
				}
			}
		}
	}


	for (i = 0; i < MAX_RC; i++) {
		for (j = 0; j < MAX_RC; j++) {
			if (jewels[i][j].stt === MAX_ITEM) {
				if (j < MAX_RC - 1) {
					return {i:i, j:j + 1};
				} else {
					return {i:i, j:j - 1};
				}
			}
		}
	}

	return false;
}

function addToList(list, item) {
	for (var k in list) {
		if (list[k].i === item.i && list[k].j === item.j) {
			return false;
		}
	}
	list.push(item);
	return true;
}

function removeDuplicateItems(list) {
	for (var i = 1, j; i < list.length; i++) {
		for (j = 0; j < i; j++) {
			if (list[i].i === list[j].i && list[i].j === list[j].j) {
				list.splice(i, 1);
				i--;
				break;
			}
		}
	}
}

function containsGem(list, item) {
	for (var i = 0;  i < list.length; i++) {
		if (list[i][0] === item[0]) {
			return true;
		}
	}
	return false;
}

function collectGems(list) {
	var mm = getMaxMin(list), i;
	if (list.length === 3) {
		instantScore(list[0].stt,1, mm.midi, mm.midj);
	} else if (list.length === 4) {
		if (list[0].i > list[1].i || list[0].j > list[1].j) {
			makeLighting(list, 0);
		} else {
			makeLighting(list, 1);
		}
		instantScore(list[0].stt, 2, mm.midi, mm.midj);
	} else if (list.length === 5) {
		if (mm.maxi - mm.mini === 4 || mm.maxj - mm.minj === 4) {
			if (list[0].i > list[1].i || list[0].j > list[1].j) {
				makeSuperGem(list,0);
			} else {
				makeSuperGem(list, 2);
			}
			instantScore(list[0].stt, 3, mm.midi, mm.midj);
		} else {
			var breakList = breakGemList(list);
			for (i = 0; i < breakList.length; i++) {
				collectGems(breakList[i]);
			}
			for (i = 0; i < breakList[0].length; i++) {
				if (containsGem(breakList[1], breakList[0][i])) {
					for (var j = 0; j < list.length; j++) {
						if (containsGem(list, breakList[0][i]) && !breakList[0][i].lighting) {
							makeLighting(list, j);
							break;
						}
					}
					break;
				}
			}
		}
	} else if (list.length === 6) {
		var breakList = breakGemList(list);
		if (breakList.length === 1) {
			if (mm.maxj - mm.minj === 5 || mm.maxi - mm.mini === 5) {
				makeSuperGem(list, 2);
				instantScore(list[0].stt, 5, mm.midi, mm.midj);
			} else {
				collectGems(list.slice(0, 3));
				collectGems(list.slice(3));
			}
		} else {
			var breakList = breakGemList(list);
			for (i = 0; i < breakList.length; i++) {
				collectGems(breakList[i]);
			}
			if (breakList[0].length + breakList[1].length === 7) {
				for (i = 0; i < breakList[0].length; i++) {
					if (containsGem(breakList[1], breakList[0][i])) {
						for (var j = 0; j < list.length; j++) {
							if (containsGem(list, breakList[0][i])) {
								makeLighting(list, j);
								break;
							}
						}
						break;
					}
				}
			}
		}
	} else if (list.length >= 7) {
		if (mm.maxj - mm.minj === list.length - 1) {
			makeSuperGem(list, 3);
			instantScore(list[0].stt, list.length - 2, mm.midi, mm.midj);
		} else {
			var gemTypeList = splitGemTypes(list), lightingList = [];
			for (var i = 0; i < list.length; i++) {
				if (list[i].lighting) lightingList.push(list[i]);
			}
			if (gemTypeList.length === 1) {
				var breakList = breakGemList(gemTypeList[0]);
				for (i = 0; i < breakList.length; i++) {
					collectGems(breakList[i]);
				}
			} else {
				for (i = 0; i < gemTypeList.length; i++) {
					collectGems(gemTypeList[i]);
				}
			}
			for (i = 0; i < list.length; i++) {
				if ((list[i].stt > MAX_ITEM - 1 || list[i].lighting) && !containsGem(lightingList, list[i])) {
					list.splice(i, 1);
				}
			}
		}
	}
}

function findExploseGem(gem, list, explosionMng) {
	var jewels = gem._jewels;
	gem.lighting = false;
	for (var i = 0; i < gem._children.length; i++) {
		gem._children[i].destroy();
	}
	gem._children.length = 0;
	explosionMng.makeExplose(gem);
	makeDebris(gem);
	for (var k = gem.i - 1; k < gem.i + 2; k++) {
		for (var l = gem.j - 1; l < gem.j+ 2; l++) {
			if (jewels[k] && jewels[k][l]) {
				addToList(list, jewels[k][l]);
				if (jewels[k][l].lighting) {
					findExploseGem(jewels[k][l], list, explosionMng);
				}
			}
		}
	}
}

function splitGemTypes(list) {
	var res = [];
	res.length = 0;
	for (var i = 0; i < list.length; i++) {
		if (res[list[i].stt] !== udef) {
			res[list[i].stt].push(list[i]);
		} else {
			res[list[i].stt] = [list[i]];
		}
	}

	for (i = 0; i < res.length; i++) {
		if (res[i] === udef) {
			res.splice(i, 1);
			i--;
		}
	}

	return res;
}

function breakGemList (list) {
	var list2 = [], result = [[], [], [], [], [], [], [], []];

	for (var i = 0; i < list.length; i++) {
		result[list[i].i].push(list[i]);
	}
	for (i = 0; i < result.length; i++) {
		if (result[i].length > 3) {
			breakInlineGems(result[i], list2);
		} else if (result[i].length === 3) {
			list2.push(result[i]);
		}
	}

	result = [[], [], [], [], [], [], [], []];
	for (var i = 0; i < list.length; i++) {
		result[list[i].j].push(list[i]);
	}
	for (i = 0; i < result.length; i++) {
		if (result[i].length > 3) {
			breakInlineGems(result[i], list2);
		} else if (result[i].length === 3) {
			list2.push(result[i]);
		}
	}
	return list2;
}

function breakInlineGems(list, result) {
	var temp = [], added = false;
	for (var i = 0; i < list.length; i++) {
		if (temp[list[i].stt] === udef) {
			temp[list[i].stt] = [list[i]];
		} else {
			temp[list[i].stt].push(list[i]);
		}
	}
	for (i in temp) {
		if (temp[i].length > 2) {
			result.push(temp[i]);
			added = true;
		}
	}
	return added;
}

function removeGem(list, gem) {
	for (var i = 0; i < list.length; i++){
		if (gem.i === list[i].i && gem.j === list[i].j) {
			list.splice(i, 1);
			return true;
		}
	}
	return false;
}

function makeLighting (list, i) {
	var ret = list[i];
	if (ret.lighting) {
		return;
	}
	ret.lighting = true;
	ret.falling = false;
	ret.attach(Crafty.e("Light").attr({x:ret.x - 25, y:ret.y - 25}));
	list.splice(i,1)[0];
}

function makeSuperGem (list, i) {
	if (list[i].lighting) {
		return;
	}
	list[i].toSuperGem().falling = false;
	list.splice(i,1)[0];
}

function concat(dest, source) {
	for (var i in source) {
		dest.push(source[i]);
	}
}

function getMaxMin(list) {
	var result = {maxi:0,mini:9,maxj:0,minj:9,midi:0,midj:0};
	for (var i = 0; i < list.length; i++) {
		if (result.mini > list[i].i) {
			result.mini = list[i].i;
		}
		if (result.minj > list[i].j) {
			result.minj = list[i].j;
		}
		if (result.maxi < list[i].i) {
			result.maxi = list[i].i;
		}
		if (result.maxj < list[i].j) {
			result.maxj = list[i].j;
		}
	}
	result.midi = (result.maxi + result.mini + 1) / 2;
	result.midj = (result.maxj + result.minj + 1) / 2;
	return result;
}

function hint() {
	if (hintEnt.playing) return;
	var move = checkMove(jewelsEnt);
	hintEnt.blink(move.i, move.j);
	if (levelDesc.score >= levelDesc.basicScore) {
		levelDesc.score -= levelDesc.basicScore;
	}
}

function score(num) {
	for (var i in levelDesc.scoreEnts) {
		levelDesc.scoreEnts[i].destroy();
	}
	levelDesc.scoreEnts = [];
	Crafty.trigger("NewScore");
	num += '';
	var x = 165 - 11 * num.length;
	for(var i = 0; i < num.length; i++) {
		levelDesc.scoreEnts.push(
			Crafty.e("2D,DOM,scoreNum" + num[i]).attr({x:x, y:677}));
		x += 22;
	}
}

function instantScore(gem, ratio, i, j) {
	var num = Math.round(levelDesc.basicScore * (ratio + levelDesc.combo));
	levelDesc.combo++;
	levelDesc.score += num;
	score(levelDesc.score);
	num += '';
	var x = X + j * 67 - num.length * 14.5, y = Y + i*67 - 20;
	for(var i = 0; i < num.length; i++) {
		Crafty.e("Number").number(num[i], gem, x, y);
		x += 29;
	}
}

function testBreak() {
	var list = [{i:1, j:2, stt:2}, {i:1, j:3, stt:2}, {i:1, j:4, stt:2}, {i:1, j:5, stt:2},
				{i:2, j:4, stt:3}, {i:3, j:4, stt:3}, {i:4, j:4, stt:3}];
	console.log(breakGemList(list));
}

console.log("Loaded logic.js");