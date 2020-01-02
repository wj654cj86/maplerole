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
		'lab',
		'mobile'
	]
};

var card = {
	refreg: [],
	reg: {},
	card: {},
	icon: {},
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
	findjob: function (canvas) {
		let ctx = canvas.getContext('2d');
		let canvasjob = ctx.getImageData(15, 152, 10, 12);
		let sdarr = [];
		for (let i = 0; i < carddata.jobname.length; i++) {
			let refcanvas = card.card[carddata.jobname[i]];
			let refctx = refcanvas.getContext('2d');
			let refjob = refctx.getImageData(15, 152, 10, 12);
			let differencearr = [];
			for (let j = 0; j < refjob.data.length; j += 4) {
				differencearr[j] = canvasjob.data[j] - refjob.data[j];
				differencearr[j + 1] = canvasjob.data[j + 1] - refjob.data[j + 1];
				differencearr[j + 2] = canvasjob.data[j + 2] - refjob.data[j + 2];
				differencearr[j + 3] = (differencearr[j] + differencearr[j + 1] + differencearr[j + 2]) / 3;
			}
			sdarr[i] = Math.round(arrsd(differencearr));
		}
		let minnum = Math.min(...sdarr);
		if (minnum < 30)
			return carddata.jobname[sdarr.indexOf(minnum)];
		else
			return 'card';
	},
	initial: function (callback) {
		generator(function* () {
			for (let i = 0; i < carddata.name.length; i++) {
				yield {
					nextfunc: loadimg,
					argsfront: ['img/card/' + carddata.name[i] + '.png'],
					cbfunc: function (img) {
						let canvas = document.createElement('canvas');
						let ctx = canvas.getContext('2d');
						canvas.setAttribute('width', carddata.size.w);
						canvas.setAttribute('height', carddata.size.h);
						ctx.drawImage(img, 0, 0);
						card.setcardangle(ctx, [0, 0, 0, 0]);
						card.card[carddata.name[i]] = canvas;
					}
				};
			}
			for (let i = 0; i < carddata.jobname.length; i++) {
				yield {
					nextfunc: loadimg,
					argsfront: ['img/card/' + carddata.jobname[i] + '.png'],
					cbfunc: function (img) {
						let canvas = document.createElement('canvas');
						let ctx = canvas.getContext('2d');
						canvas.setAttribute('width', carddata.size.w);
						canvas.setAttribute('height', carddata.size.h);
						ctx.drawImage(img, 0, 0);
						card.setcardangle(ctx, [0, 0, 0, 0]);
						card.card[carddata.jobname[i]] = canvas;
					}
				};
			}
			for (let i = 0; i < carddata.name.length; i++) {
				yield {
					nextfunc: loadimg,
					argsfront: ['img/icon/' + carddata.name[i] + '.png'],
					cbfunc: function (img) {
						let canvas = document.createElement('canvas');
						let ctx = canvas.getContext('2d');
						canvas.setAttribute('width', carddata.size.w);
						canvas.setAttribute('height', carddata.size.h);
						ctx.drawImage(img, 0, 0);
						card.setcardangle(ctx, [0, 0, 0, 0]);
						card.icon[carddata.name[i]] = canvas;
					}
				};
			}
			for (let i = 0; i < carddata.jobname.length; i++) {
				yield {
					nextfunc: loadimg,
					argsfront: ['img/icon/' + carddata.jobname[i] + '.png'],
					cbfunc: function (img) {
						let canvas = document.createElement('canvas');
						let ctx = canvas.getContext('2d');
						canvas.setAttribute('width', 20);
						canvas.setAttribute('height', 20);
						ctx.drawImage(img, 0, 0);
						card.icon[carddata.jobname[i]] = canvas;
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

			let damage = document.createElement('canvas');
			let damagectx = damage.getContext('2d');
			damage.setAttribute('width', carddata.size.w);
			damage.setAttribute('height', carddata.size.h);
			damagectx.drawImage(
				card.card['card'],
				10,
				130,
				carddata.size.w - 10 - 10,
				17,
				10,
				130,
				carddata.size.w - 10 - 10,
				17,
			);
			damage.toBlob(function (blob) {
				card.damagemaskurl = URL.createObjectURL(blob);
			});

			let name = document.createElement('canvas');
			let namectx = name.getContext('2d');
			name.setAttribute('width', carddata.size.w);
			name.setAttribute('height', carddata.size.h);
			namectx.drawImage(
				card.card['card'],
				10,
				147,
				carddata.size.w - 10 - 10,
				carddata.size.h - 147 - 10,
				10,
				147,
				carddata.size.w - 10 - 10,
				carddata.size.h - 147 - 10,
			);
			name.toBlob(function (blob) {
				card.namemaskurl = URL.createObjectURL(blob);
			});

			callback();
		});
	},
	newnullcard: function () {
		let canvas = document.createElement('canvas');
		let ctx = canvas.getContext('2d');
		canvas.setAttribute('width', carddata.size.w);
		canvas.setAttribute('height', carddata.size.h);
		ctx.drawImage(card.card['null'], 0, 0);
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
				cardimg = card.card['null'];
			}
			ctx.drawImage(cardimg, 0, 0);
			if (ref.use) {
				if (ref.namemask) {
					ctx.drawImage(ref.name, 0, 0);
					ctx.drawImage(ref.jobicon, 14, 151);
				}
				if (ref.jobname != 'lab' && ref.damagemask) {
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
		let damage = new Image();
		damage.src = card.damagemaskurl;
		ref.damage = damage;
		damage.style.zIndex = 2;
		damage.style.opacity = 1;
		span.appendChild(damage);

		ref.namemask = false;
		let name = new Image();
		name.src = card.namemaskurl;
		ref.name = name;
		name.style.zIndex = 2;
		name.style.opacity = 1;
		span.appendChild(name);

		ref.jobname = 'card';
		let jobicon = document.createElement('canvas');
		ref.jobicon = jobicon;
		let jobiconctx = jobicon.getContext('2d');
		jobicon.setAttribute('width', 14);
		jobicon.setAttribute('height', 14);
		jobicon.style.zIndex = 2;
		jobicon.style.left = 14 + 'px';
		jobicon.style.top = 151 + 'px';

		let jobchange = new Image();
		ref.jobchange = jobchange;
		jobchange.style.zIndex = 7;
		jobchange.style.left = carddata.size.w - 70 + 'px';
		jobchange.style.top = '0px';
		jobchange.style.transition = 'all 300ms';

		jobchange.oncontextmenu = function () {
			return false;
		};
		jobchange.onmouseenter = function () {
			jobchange.style.opacity = 1;
		};
		jobchange.onmouseout = function () {
			jobchange.style.opacity = 0.3;
		}
		let changejob = function (jobname) {
			ref.jobname = jobname;
			jobiconctx.drawImage(
				card.card[jobname],
				14,
				151,
				14,
				14,
				0,
				0,
				14,
				14
			);
			jobchange.src = 'img/icon/' + jobname + '.png';
		};
		jobchange.onmousedown = function (event) {
			let i;
			switch (event.button) {
				case 0:
					i = carddata.jobname.indexOf(ref.jobname);
					i++;
					if (i >= carddata.jobname.length) i = 0;
					changejob(carddata.jobname[i]);
					if (ref.jobname != 'lab' && ref.damagemask) {
						damage.style.zIndex = 5;
					} else {
						damage.style.zIndex = 2;
					}
					break;
				case 2:
					changejob('card');
					if (ref.jobname != 'lab' && ref.damagemask) {
						damage.style.zIndex = 5;
					} else {
						damage.style.zIndex = 2;
					}
					break;
				default:
					break;
			}
		};
		changejob(card.findjob(canvas));

		span.appendChild(jobchange);
		span.appendChild(jobicon);

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