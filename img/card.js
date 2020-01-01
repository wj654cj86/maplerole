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
		'mobile'
	]
};

var card = {
	refreg: [],
	reg: {},
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

			yield {
				nextfunc: loadimg,
				argsfront: ['img/download.svg'],
				cbfunc: function (img) {
					card.downloadicon = img;
				}
			};
			card.downloadicon.style.left = carddata.size.w - 45 + 'px';
			card.downloadicon.style.top = '0px';
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
		let cross = copyxml(card.crossicon).getElementsByTagName('img')[0];
		ref.cross = cross;
		cross.style.zIndex = 7;
		cross.onclick = function () {
			span.style.opacity = 0;
			ref.use = false;
		};
		cross.onmouseenter = function () {
			cross.style.opacity = 1;
		};
		cross.onmouseout = function () {
			cross.style.opacity = 0.3;
		}
		span.appendChild(cross);

		let download = copyxml(card.downloadicon).getElementsByTagName('img')[0];
		ref.download = download;
		download.style.zIndex = 7;
		download.onclick = function () {
			let canvas = document.createElement('canvas');
			let ctx = canvas.getContext('2d');
			canvas.setAttribute('width', carddata.size.w);
			canvas.setAttribute('height', carddata.size.h);
			let cardimg;
			if (ref.use) {
				cardimg = ref.card;
			} else {
				cardimg = card.nullcard;
			}
			ctx.drawImage(cardimg, 0, 0);
			if (ref.use) {
				if (ref.namemask) {
					ctx.drawImage(ref.name, 0, 0);
					ctx.drawImage(ref.jobicon, 14, 151);
				}
				if (ref.jobname != 'labss' && ref.damagemask) {
					ctx.drawImage(ref.damage, 0, 0);
				}
			}
			canvas.toBlob(function (blob) {
				let url = URL.createObjectURL(blob);
				startDownload(url, 'role.png');
			});
		};
		download.onmouseenter = function () {
			download.style.opacity = 1;
		};
		download.onmouseout = function () {
			download.style.opacity = 0.3;
		}
		span.appendChild(download);

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

		ref.damagemask = false;
		let damage = document.createElement('canvas');
		ref.damage = damage;
		let damagectx = damage.getContext('2d');
		damage.setAttribute('width', carddata.size.w);
		damage.setAttribute('height', carddata.size.h);
		damagectx.drawImage(
			card.cardcard,
			10,
			130,
			carddata.size.w - 10 - 10,
			17,
			10,
			130,
			carddata.size.w - 10 - 10,
			17,
		);
		damage.style.zIndex = 2;
		span.appendChild(damage);

		let canvasjob = ctx.getImageData(15, 152, 10, 12);

		ref.namemask = false;
		let name = document.createElement('canvas');
		ref.name = name;
		let namectx = name.getContext('2d');
		name.setAttribute('width', carddata.size.w);
		name.setAttribute('height', carddata.size.h);
		namectx.drawImage(
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
					if (ref.jobname != 'labss' && ref.damagemask) {
						damage.style.zIndex = 5;
					} else {
						damage.style.zIndex = 2;
					}
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
					damage.style.zIndex = 5;
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
				namectx.drawImage(
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
		name.style.zIndex = 2;
		span.appendChild(name);

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