window.gwidth = 536;
window.gheight = 770;
window.udef = undefined;
$(function() {
	console.log("Run");
	Crafty.gameId = "kimcuong";
	Crafty.init(gwidth, gheight);
	Crafty.canvas.init();
	Crafty.background("rgb(0,0,0)");
	Crafty.scene("Preload");
});

logEvery = function (list) {
	for (var i = 0; i < list.length; i++) {
		list[i].log();
	}
}

console.log("Loaded kimcuong.js");