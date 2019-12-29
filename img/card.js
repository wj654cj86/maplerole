var carddata = {
	size: { w: 116, h: 177 },
	seat: [
		{ x: 241, y: 563 },
		{ x: 363, y: 563 },
		{ x: 485, y: 563 },
		{ x: 607, y: 563 }
	]
};

var card = {
	refreg: [],
	reg: {},
	loadimg: function (callback) {
		generator(function* () {
			for (let i = 0; i < hostfile.files.length; i++) {
				let url = URL.createObjectURL(hostfile.files[i]);
				let loadimg = function (callback) {
					let img = new Image();
					img.onload = function () {
						if (typeof card.refreg[i] != 'undefined') {
							let node = card.refreg[i];
							if (node.parentNode) {
								node.parentNode.removeChild(node);
							}
						}
						card.refreg[i] = img;
						callback();
					};
					img.src = url;
				};
				yield {
					nextfunc: loadimg,
					cbfunc: function () { }
				};
			}
			card.reg = {};
			callback();
		});
	},
	style: function (x, y) {
		if (x in card.reg) {
			if (y in card.reg[x]) {
				return card.reg[x][y];
			}
		} else {
			card.reg[x] = {};
		}
		let canvas = document.createElement('canvas');
		let ctx = canvas.getContext('2d');
		canvas.setAttribute('width', carddata.size.w);
		canvas.setAttribute('height', carddata.size.h);
		ctx.drawImage(
			card.refreg[x],
			carddata.seat[y].x,
			carddata.seat[y].y,
			carddata.size.w,
			carddata.size.h,
			0,
			0,
			carddata.size.w,
			carddata.size.h
		);

		card.reg[x][y] = canvas;
		return card.reg[x][y];
	}
};