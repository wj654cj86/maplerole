var carddata = {
	size: { w: 116, h: 177 },
	spacing: 122,
	seat: {
		'1024x768': { x: 70, y: 563 },
		'1280x720': { x: 198, y: 539 },
		'1366x768': { x: 241, y: 563 },
		'1920x1080': { x: 518, y: 719 }
	},
	angle: [5, 3, 2, 1, 1]
};

var card = {
	refreg: [],
	reg: {},
	nullcard: {},
	maskcard: {},
	crossicon: {},
	setcardangle: function (ctx, arr) {
		let u8arr = new Uint8ClampedArray(arr);
		let imageData = new ImageData(u8arr, 1, 1);
		for (let i = 0; i < carddata.angle.length; i++) {
			for (let j = 0; j < carddata.angle[i]; j++) {
				ctx.putImageData(imageData, i, j);
				ctx.putImageData(imageData, carddata.size.w - 1 - i, carddata.size.h - 1 - j);
				ctx.putImageData(imageData, i, carddata.size.h - 1 - j);
				ctx.putImageData(imageData, carddata.size.w - 1 - i, j);
			}
		}
	},
	initial: function (callback) {
		generator(function* () {
			yield {
				nextfunc: loadimg,
				argsfront: ['img/null.png'],
				cbfunc: function (img) {
					let canvas = document.createElement('canvas');
					let ctx = canvas.getContext('2d');
					canvas.setAttribute('width', carddata.size.w);
					canvas.setAttribute('height', carddata.size.h);
					ctx.drawImage(img, 0, 0);
					card.setcardangle(ctx, [0, 0, 0, 0]);
					card.nullcard = canvas;
				}
			};
			yield {
				nextfunc: loadimg,
				argsfront: ['img/card.png'],
				cbfunc: function (img) {
					let canvas = document.createElement('canvas');
					let ctx = canvas.getContext('2d');
					canvas.setAttribute('width', carddata.size.w);
					canvas.setAttribute('height', carddata.size.h);
					ctx.drawImage(
						img,
						25,
						150,
						carddata.size.w - 25 - 5,
						carddata.size.h - 150 - 5,
						25,
						150,
						carddata.size.w - 25 - 5,
						carddata.size.h - 150 - 5
					);
					card.setcardangle(ctx, [0, 0, 0, 0]);
					card.maskcard = canvas;
				}
			};
			yield {
				nextfunc: loadimg,
				argsfront: ['img/cross.svg'],
				cbfunc: function (img) {
					card.crossicon = img;
				}
			};
			card.crossicon.style.left = carddata.size.w - 20 + 'px';
			card.crossicon.style.top = '0px';
			callback();
		});
	},
	newnullcard: function () {
		let canvas = document.createElement('canvas');
		let ctx = canvas.getContext('2d');
		canvas.setAttribute('width', carddata.size.w);
		canvas.setAttribute('height', carddata.size.h);
		ctx.drawImage(card.nullcard, 0, 0);
		return canvas;
	},
	newmaskcard: function () {
		let canvas = document.createElement('canvas');
		let ctx = canvas.getContext('2d');
		canvas.setAttribute('width', carddata.size.w);
		canvas.setAttribute('height', carddata.size.h);
		ctx.drawImage(card.maskcard, 0, 0);
		return canvas;
	},
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
			carddata.seat[imgsize].x + carddata.spacing * y,
			carddata.seat[imgsize].y,
			carddata.size.w,
			carddata.size.h,
			0,
			0,
			carddata.size.w,
			carddata.size.h
		);
		card.setcardangle(ctx, [0, 0, 0, 0]);
		card.reg[x][y] = canvas;
		return card.reg[x][y];
	}
};