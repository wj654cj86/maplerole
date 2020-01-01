var carddata = {
	size: { w: 116, h: 177 },
	spacing: 122,
	seat: {
		'1024x768': { x: 70, y: 563 },
		'1280x720': { x: 198, y: 539 },
		'1366x768': { x: 241, y: 563 },
		'1920x1080': { x: 518, y: 719 }
	},
	angle: [5, 3, 2, 1, 1],
	name: [
		'null',
		'card'
	],
	jobname: [
		'warrior',
		'magician',
		'bowman',
		'thief',
		'pirate',
		'xenon',
		'labss',
		'labsss',
		'mobile'
	]
};

var card = {
	refreg: [],
	reg: {},
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
			for (let i = 0; i < carddata.name.length; i++) {
				yield {
					nextfunc: loadimg,
					argsfront: ['img/' + carddata.name[i] + '.png'],
					cbfunc: function (img) {
						let canvas = document.createElement('canvas');
						let ctx = canvas.getContext('2d');
						canvas.setAttribute('width', carddata.size.w);
						canvas.setAttribute('height', carddata.size.h);
						ctx.drawImage(img, 0, 0);
						card.setcardangle(ctx, [0, 0, 0, 0]);
						card[carddata.name[i] + 'card'] = canvas;
					}
				};
			}
			for (let i = 0; i < carddata.jobname.length; i++) {
				yield {
					nextfunc: loadimg,
					argsfront: ['img/' + carddata.jobname[i] + '.png'],
					cbfunc: function (img) {
						let canvas = document.createElement('canvas');
						let ctx = canvas.getContext('2d');
						canvas.setAttribute('width', carddata.size.w);
						canvas.setAttribute('height', carddata.size.h);
						ctx.drawImage(img, 0, 0);
						card.setcardangle(ctx, [0, 0, 0, 0]);
						card[carddata.jobname[i] + 'card'] = canvas;
					}
				};
			}
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
		let ref = {};
		ref.use = true;
		let spanmain = document.createElement('span');
		ref.main = spanmain;
		let nullcard = card.newnullcard();
		ref.nullcard = nullcard;
		nullcard.style.zIndex = 2;
		spanmain.appendChild(nullcard);

		let span = document.createElement('span');
		ref.span = span;
		let icon = copyxml(card.crossicon).getElementsByTagName('img')[0];
		ref.icon = icon;
		icon.style.zIndex = 6;
		icon.onclick = function () {
			span.style.opacity = 0;
			ref.use = false;
		};
		icon.onmouseenter = function () {
			icon.style.opacity = 1;
		};
		icon.onmouseout = function () {
			icon.style.opacity = 0.3;
		}
		span.appendChild(icon);

		let canvas = document.createElement('canvas');
		ref.card = canvas;
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
		canvas.style.zIndex = 3;
		span.appendChild(canvas);

		let canvasjob = ctx.getImageData(15, 152, 10, 12);
		let maskcard = document.createElement('canvas');
		ref.mask = maskcard;
		let maskctx = maskcard.getContext('2d');
		maskcard.setAttribute('width', carddata.size.w);
		maskcard.setAttribute('height', carddata.size.h);
		maskctx.drawImage(
			card.cardcard,
			10,
			147,
			carddata.size.w - 10 - 10,
			carddata.size.h - 147 - 10,
			10,
			147,
			carddata.size.w - 10 - 10,
			carddata.size.h - 147 - 10,
		);
		ref.jobname = 'null';
		let jobicon = document.createElement('canvas');
		ref.jobicon = jobicon;
		jobicon.setAttribute('width', 14);
		jobicon.setAttribute('height', 14);
		jobicon.style.zIndex = 2;
		jobicon.style.left = 14 + 'px';
		jobicon.style.top = 151 + 'px';
		jobicon.oncontextmenu = function () {
			return false;
		};
		jobicon.onmousedown = function (event) {
			let i;
			let ctx;
			let refcanvas;
			switch (event.button) {
				case 0:
					i = carddata.jobname.indexOf(ref.jobname);
					i++;
					if (i >= carddata.jobname.length) i = 0;
					ref.jobname = carddata.jobname[i];
					ctx = ref.jobicon.getContext('2d');
					refcanvas = card[carddata.jobname[i] + 'card'];
					ctx.drawImage(
						refcanvas,
						14,
						151,
						14,
						14,
						0,
						0,
						14,
						14
					);
					break;
				case 2:
					ref.jobname = 'null';
					ctx = ref.jobicon.getContext('2d');
					refcanvas = card.cardcard;
					ctx.drawImage(
						refcanvas,
						14,
						151,
						14,
						14,
						0,
						0,
						14,
						14
					);
					break;
				default:
					break;
			}
		};
		span.appendChild(jobicon);

		for (let i = 0; i < carddata.jobname.length; i++) {
			let refcanvas = card[carddata.jobname[i] + 'card'];
			let refctx = refcanvas.getContext('2d');
			let refjob = refctx.getImageData(15, 152, 10, 12);
			if ((function () {
				let arr = {};
				for (let j = 0; j < refjob.data.length; j += 4) {
					arr[j] = Math.abs(canvasjob.data[j] - refjob.data[j]);
					arr[j + 1] = Math.abs(canvasjob.data[j + 1] - refjob.data[j + 1]);
					arr[j + 2] = Math.abs(canvasjob.data[j + 2] - refjob.data[j + 2]);

					if (Math.abs(canvasjob.data[j] - refjob.data[j]) > 100
						|| Math.abs(canvasjob.data[j + 1] - refjob.data[j + 1]) > 100
						|| Math.abs(canvasjob.data[j + 2] - refjob.data[j + 2]) > 100) {
						return false;
					};
				}
				return true;
			})()) {
				ref.jobname = carddata.jobname[i];
				maskctx.drawImage(
					refcanvas,
					10,
					147,
					carddata.size.w - 10 - 10,
					carddata.size.h - 147 - 10,
					10,
					147,
					carddata.size.w - 10 - 10,
					carddata.size.h - 147 - 10,
				);
				break;
			}
		}
		maskcard.style.zIndex = 2;
		span.appendChild(maskcard);

		spanmain.appendChild(span);
		card.reg[x][y] = ref;
		return card.reg[x][y];
	},
	newnullstyle: function () {
		let ref = {};
		ref.use = false;
		let spanmain = document.createElement('span');
		ref.main = spanmain;
		let nullcard = card.newnullcard();
		ref.nullcard = nullcard;
		nullcard.style.zIndex = 2;
		spanmain.appendChild(nullcard);
		return ref;
	}
};