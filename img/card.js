var carddata = {
	size: { w: 116, h: 177 },
	seat: {
		'1024x768': [
			{ x: 70, y: 563 },
			{ x: 192, y: 563 },
			{ x: 314, y: 563 },
			{ x: 436, y: 563 }
		],
		'1280x720': [
			{ x: 198, y: 539 },
			{ x: 320, y: 539 },
			{ x: 442, y: 539 },
			{ x: 564, y: 539 }
		],
		'1366x768': [
			{ x: 241, y: 563 },
			{ x: 363, y: 563 },
			{ x: 485, y: 563 },
			{ x: 607, y: 563 }
		],
		'1920x1080': [
			{ x: 518, y: 719 },
			{ x: 640, y: 719 },
			{ x: 762, y: 719 },
			{ x: 884, y: 719 }
		]
	}
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
		let imgsize = card.refreg[x].naturalWidth + 'x' + card.refreg[x].naturalHeight;
		ctx.drawImage(
			card.refreg[x],
			carddata.seat[imgsize][y].x,
			carddata.seat[imgsize][y].y,
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