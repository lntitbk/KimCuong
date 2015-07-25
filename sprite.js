var toLoad = [
//	'assets/bg.gif',
	'assets/boom.png',
	'assets/boom2.png',
	'assets/Break00.png',
	'assets/Break01.png',
	'assets/Break02.png',
	'assets/Break03.png',
	'assets/Break04.png',
	'assets/Break05.png',
	'assets/Break06.png',
	'assets/cf.png',
	'assets/Gems00.png',
	'assets/Gems01.png',
	'assets/Gems02.png',
	'assets/Gems03.png',
	'assets/Gems04.png',
	'assets/Gems05.png',
	'assets/Gems06.png',
	'assets/help.png',
	'assets/hint.png',
	'assets/hintBrd.png',
	'assets/hinth.png',
	'assets/hs.png',
	'assets/hsnums.png',
	'assets/kc.png',
	'assets/l1.png',
	'assets/l2.png',
	'assets/l3.png',
	'assets/lightning.png',
	'assets/nomove.png',
	'assets/Number00.png',
	'assets/Number01.png',
	'assets/Number02.png',
	'assets/Number03.png',
	'assets/Number04.png',
	'assets/Number05.png',
	'assets/Number06.png',
	'assets/scoreNum.png',
	'assets/score_num.png',
	'assets/scrBrd.png',
	'assets/set.png',
	'assets/startBrd.png',
	'assets/startBtn.png',
	'assets/superGem.png',
	'assets/tab.png',
	'assets/timebar.gif'
];

/**
 * @return void
 */
function makeSprites() {
	Crafty.sprite(536, 608, 'assets/bg.gif', {
		bg: [0, 0]
	});
//Crafty.sprite(800, 600, 'assets/demo_Gameplay.png', {
//	bg1: [0, 0]
//});
	Crafty.sprite(160, 160, 'assets/boom.png', {
		boom1: [0, 0]
	});
	Crafty.sprite(50, 50, 'assets/boom2.png', {
		boom2: [0, 0]
	});
	Crafty.sprite(25, 25, 'assets/Break00.png', {
		break00: [0, 0],
		break01: [1, 0],
		break02: [2, 0],
		break03: [3, 0]
	});
	Crafty.sprite(25, 25, 'assets/Break01.png', {
		break10: [0, 0],
		break11: [1, 0],
		break12: [2, 0],
		break13: [3, 0]
	});
	Crafty.sprite(25, 25, 'assets/Break02.png', {
		break20: [0, 0],
		break21: [1, 0],
		break22: [2, 0],
		break23: [3, 0]
	});
	Crafty.sprite(25, 25, 'assets/Break03.png', {
		break30: [0, 0],
		break31: [1, 0],
		break32: [2, 0],
		break33: [3, 0]
	});
	Crafty.sprite(25, 25, 'assets/Break04.png', {
		break40: [0, 0],
		break41: [1, 0],
		break42: [2, 0],
		break43: [3, 0]
	});
	Crafty.sprite(25, 25, 'assets/Break05.png', {
		break50: [0, 0],
		break51: [1, 0],
		break52: [2, 0],
		break53: [3, 0]
	});
	Crafty.sprite(25, 25, 'assets/Break06.png', {
		break60: [0, 0],
		break61: [1, 0],
		break62: [2, 0],
		break63: [3, 0]
	});
	Crafty.sprite(68, 68, 'assets/cf.png', {
		chosen: [0, 0]
	});
	Crafty.sprite(60, 60, 'assets/Gems00.png', {
		gem0: [0, 0]
	});
	Crafty.sprite(60, 60, 'assets/Gems01.png', {
		gem1: [0, 0]
	});
	Crafty.sprite(60, 60, 'assets/Gems02.png', {
		gem2: [0, 0]
	});
	Crafty.sprite(60, 60, 'assets/Gems03.png', {
		gem3: [0, 0]
	});
	Crafty.sprite(60, 60, 'assets/Gems04.png', {
		gem4: [0, 0]
	});
	Crafty.sprite(60, 60, 'assets/Gems05.png', {
		gem5: [0, 0]
	});
	Crafty.sprite(60, 60, 'assets/Gems06.png', {
		gem6: [0, 0]
	});
	Crafty.sprite(121, 121, 'assets/help.png', {
		helpBtn: [0, 0],
		helpBtnHover: [1, 0]
	});
	Crafty.sprite(120, 119, 'assets/hint.png', {
		hint: [0, 0]
	});
	Crafty.sprite(34, 34, 'assets/hinth.png', {
		hinth: [0, 0]
	});
	Crafty.sprite(185, 189, 'assets/hintBrd.png', {
		hintBoard: [0, 0]
	});
	Crafty.sprite(236, 40, 'assets/hs.png', {
		hisco: [0, 0]
	});
	Crafty.sprite(30, 39, 'assets/hsnums.png', {
		hisconums0: [0, 0],
		hisconums1: [1, 0],
		hisconums2: [2, 0],
		hisconums3: [3, 0],
		hisconums4: [4, 0],
		hisconums5: [5, 0],
		hisconums6: [6, 0],
		hisconums7: [7, 0],
		hisconums8: [8, 0],
		hisconums9: [9, 0]
	});
	Crafty.sprite(707, 180, 'assets/kc.png', {
		kc: [0, 0]
	});
	Crafty.sprite(102, 102, 'assets/l1.png', {//12
		gemlighteff: [0, 0]
	});
	Crafty.sprite(56, 58, 'assets/l2.png', {
		twinkleDust: [0, 0]
	});
	Crafty.sprite(200, 200, 'assets/l3.png', {
		lighteff: [0, 0]
	});
	Crafty.sprite(70, 500, 'assets/lightning.png', {
		lightning: [0, 0]
	});
	Crafty.sprite(366, 188, 'assets/nomove.png', {
		nomove: [0, 0]
	});
	Crafty.sprite(29, 38, 'assets/Number00.png', {
		num00: [0, 0],
		num01: [1, 0],
		num02: [2, 0],
		num03: [3, 0],
		num04: [4, 0],
		num05: [5, 0],
		num06: [6, 0],
		num07: [7, 0],
		num08: [8, 0],
		num09: [9, 0]
	});
	Crafty.sprite(29, 38, 'assets/Number01.png', {
		num10: [0, 0],
		num11: [1, 0],
		num12: [2, 0],
		num13: [3, 0],
		num14: [4, 0],
		num15: [5, 0],
		num16: [6, 0],
		num17: [7, 0],
		num18: [8, 0],
		num19: [9, 0]
	});
	Crafty.sprite(29, 38, 'assets/Number02.png', {
		num20: [0, 0],
		num21: [1, 0],
		num22: [2, 0],
		num23: [3, 0],
		num24: [4, 0],
		num25: [5, 0],
		num26: [6, 0],
		num27: [7, 0],
		num28: [8, 0],
		num29: [9, 0]
	});
	Crafty.sprite(29, 38, 'assets/Number03.png', {
		num30: [0, 0],
		num31: [1, 0],
		num32: [2, 0],
		num33: [3, 0],
		num34: [4, 0],
		num35: [5, 0],
		num36: [6, 0],
		num37: [7, 0],
		num38: [8, 0],
		num39: [9, 0]
	});
	Crafty.sprite(29, 38, 'assets/Number04.png', {
		num40: [0, 0],
		num41: [1, 0],
		num42: [2, 0],
		num43: [3, 0],
		num44: [4, 0],
		num45: [5, 0],
		num46: [6, 0],
		num47: [7, 0],
		num48: [8, 0],
		num49: [9, 0]
	});
	Crafty.sprite(29, 38, 'assets/Number05.png', {
		num50: [0, 0],
		num51: [1, 0],
		num52: [2, 0],
		num53: [3, 0],
		num54: [4, 0],
		num55: [5, 0],
		num56: [6, 0],
		num57: [7, 0],
		num58: [8, 0],
		num59: [9, 0]
	});
	Crafty.sprite(29, 38, 'assets/Number06.png', {
		num60: [0, 0],
		num61: [1, 0],
		num62: [2, 0],
		num63: [3, 0],
		num64: [4, 0],
		num65: [5, 0],
		num66: [6, 0],
		num67: [7, 0],
		num68: [8, 0],
		num69: [9, 0]
	});
	Crafty.sprite(321, 199, 'assets/scrBrd.png', {
		scoreBoard: [0, 0]
	});
	Crafty.sprite(23, 28, 'assets/scoreNum.png', {
		scoreNum0: [0, 0],
		scoreNum1: [1, 0],
		scoreNum2: [2, 0],
		scoreNum3: [3, 0],
		scoreNum4: [4, 0],
		scoreNum5: [5, 0],
		scoreNum6: [6, 0],
		scoreNum7: [7, 0],
		scoreNum8: [8, 0],
		scoreNum9: [9, 0]
	});
	Crafty.sprite(30, 50, 'assets/set.png', {
		set: [0, 0]
	});
	Crafty.sprite(228, 219, 'assets/startBrd.png', {
		startBoard: [0, 0]
	});
	Crafty.sprite(151, 151, 'assets/startBtn.png', {
		startBtn: [0, 0],
		startBtnHover: [1, 0]
	});
	Crafty.sprite(60, 60, 'assets/superGem.png', {
		supergem: [0, 0]
	});
	Crafty.sprite(638, 608, 'assets/tab.png', {
		table: [0, 0]
	});
	Crafty.sprite(490, 27, 'assets/timebar.gif', {
		timebar: [0, 0]
	});
}
console.log("Loaded sprite.js");
