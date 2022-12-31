import language from '../language/language.js';
let root = document.documentElement;
let refreg = [],
	reg = {},
	tmp = {},
	damage = {}, damagemaskurl = '',
	name = {}, namemaskurl = '',
	data = {
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
function setcardangle(ctx, arr) {
	let u8arr = new Uint8ClampedArray(arr);
	let imageData = new ImageData(u8arr, 1, 1);
	for (let i = 0; i < data.angle.length; i++) {
		for (let j = 0; j < data.angle[i]; j++) {
			ctx.putImageData(imageData, i, j);
			ctx.putImageData(imageData, data.size.w - 1 - i, data.size.h - 1 - j);
			ctx.putImageData(imageData, i, data.size.h - 1 - j);
			ctx.putImageData(imageData, data.size.w - 1 - i, j);
		}
	}
}
let arrsum = arr => arr.reduce((acc, v) => acc + Number(v), 0);
let arraverage = arr => arr.length != 0 ? (arrsum(arr) / arr.length) : 0;
function arrsd(arr) {
	let sum = 0;
	let average = arraverage(arr);
	let len = arr.length;
	for (let i = 0; i < len; i++) {
		let k = arr[i] - average;
		sum += k * k;
	}
	return Math.sqrt(sum / len);
}
function findjob(canvas) {
	let ctx = canvas.getContext('2d');
	let canvasjob = ctx.getImageData(15, 152, 6, 12);
	let sdarr = [];
	for (let i = 0; i < data.jobname.length; i++) {
		let refcanvas = tmp[data.jobname[i]];
		let refctx = refcanvas.getContext('2d');
		let refjob = refctx.getImageData(15, 152, 6, 12);
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
	if (minnum < 50)
		return data.jobname[sdarr.indexOf(minnum)];
	else
		return 'card';
}

let tmppromise = {};
for (let i = 0; i < data.name.length; i++) {
	tmppromise[data.name[i]] = loadimg('img/card/' + data.name[i] + '.png');
}
for (let i = 0; i < data.jobname.length; i++) {
	tmppromise[data.jobname[i]] = loadimg('img/card/' + data.jobname[i] + '.png');
}
for (let key in tmppromise) {
	let img = await tmppromise[key];
	let canvas = document.createElement('canvas');
	let ctx = canvas.getContext('2d');
	canvas.width = data.size.w;
	canvas.height = data.size.h;
	ctx.drawImage(img, 0, 0);
	setcardangle(ctx, [0, 0, 0, 0]);
	tmp[key] = canvas;
}
let gap = Math.floor((data.size.w - 20 * 5) / 4) + 20;
root.style.setProperty('--cross-x', gap * 4 + 'px');
root.style.setProperty('--download-x', gap * 3 + 'px');
root.style.setProperty('--jobchange-x', gap * 2 + 'px');
root.style.setProperty('--damagebt-x', gap + 'px');
root.style.setProperty('--namebt-x', 0 + 'px');

damage = document.createElement('canvas');
let damagectx = damage.getContext('2d');
damage.width = data.size.w;
damage.height = data.size.h;
damagectx.drawImage(
	tmp['card'],
	0,
	130,
	data.size.w,
	17,
	0,
	130,
	data.size.w,
	17,
);
damage.toBlob(function (blob) {
	damagemaskurl = URL.createObjectURL(blob);
});

name = document.createElement('canvas');
let namectx = name.getContext('2d');
name.width = data.size.w;
name.height = data.size.h;
namectx.drawImage(
	tmp['card'],
	0,
	147,
	data.size.w,
	data.size.h - 147 - 10,
	0,
	147,
	data.size.w,
	data.size.h - 147 - 10,
);
name.toBlob(function (blob) {
	namemaskurl = URL.createObjectURL(blob);
});

async function loadroleimg() {
	let refregpromise = []
	for (let i = 0; i < hostfile.files.length; i++) {
		let url = URL.createObjectURL(hostfile.files[i]);
		refregpromise[i] = loadimg(url);
	}
	for (let i = 0; i < hostfile.files.length; i++) {
		let img = await refregpromise[i];
		if (refreg[i] !== undefined) {
			refreg[i].remove();
		}
		refreg[i] = img;
	}
	reg = {};
}
function style(x, y) {
	if (x in reg) {
		if (y in reg[x]) {
			return reg[x][y];
		}
	} else {
		reg[x] = {};
	}
	let ref = {};
	ref.use = true;
	let spanmain = document.createElement('span');
	ref.main = spanmain;
	let nullcard = new Image();
	nullcard.className = 'null';
	nullcard.src = 'img/card/null.png';
	ref.nullcard = nullcard;
	spanmain.append(nullcard);

	let span = document.createElement('span');
	ref.span = span;

	let canvas = document.createElement('canvas');
	ref.card = canvas;
	let ctx = canvas.getContext('2d');
	canvas.width = data.size.w;
	canvas.height = data.size.h;
	let imgsize = refreg[x].naturalWidth + 'x' + refreg[x].naturalHeight;
	ctx.drawImage(
		refreg[x],
		data.seat[imgsize].x + data.spacing * y,
		data.seat[imgsize].y,
		data.size.w,
		data.size.h,
		0,
		0,
		data.size.w,
		data.size.h
	);
	setcardangle(ctx, [0, 0, 0, 0]);
	canvas.style.zIndex = 3;
	span.append(canvas);

	let button = document.createElement('span');
	button.className = 'button';
	ref.button = button;
	span.append(button);

	let cross = new Image();
	cross.className = 'cross';
	cross.src = 'img/cross.svg';
	cross.title = language.reg[language.mod].cross;
	ref.cross = cross;
	cross.onclick = function () {
		span.style.opacity = 0;
		ref.use = false;
	};
	button.append(cross);

	let download = new Image();
	download.className = 'download';
	download.src = 'img/download.svg';
	download.title = language.reg[language.mod].download;
	ref.download = download;
	download.onclick = function () {
		let canvas = document.createElement('canvas');
		let ctx = canvas.getContext('2d');
		canvas.width = data.size.w;
		canvas.height = data.size.h;
		let cardimg;
		if (ref.use) {
			cardimg = ref.card;
		} else {
			cardimg = ref.nullcard;
		}
		ctx.drawImage(cardimg, 0, 0);
		if (ref.use) {
			if (ref.namemask) {
				ctx.drawImage(name, 0, 0);
				ctx.drawImage(ref.jobicon, 14, 151);
			}
			if (ref.jobname != 'lab' && ref.damagemask) {
				ctx.drawImage(damage, 0, 0);
			}
		}
		canvas.toBlob(function (blob) {
			let url = URL.createObjectURL(blob);
			startDownload(url, 'role.png');
		});
	};
	button.append(download);

	ref.damagemask = false;
	let damage = new Image();
	damage.className = 'damage';
	damage.src = damagemaskurl;
	ref.damage = damage;
	span.append(damage);

	let damagebt = new Image();
	damagebt.className = 'damagebt';
	damagebt.src = 'img/maskdamage.svg';
	damagebt.title = language.reg[language.mod].maskdamage;
	ref.damagebt = damagebt;
	damagebt.onclick = function () {
		if (ref.damage) {
			if (ref.damagemask) {
				ref.damage.style.zIndex = 2;
				ref.damagemask = false;
				ref.damagebt.src = 'img/maskdamage.svg';
				ref.damagebt.title = language.reg[language.mod].maskdamage;
			} else {
				if (ref.jobname != 'lab')
					ref.damage.style.zIndex = 5;
				ref.damagemask = true;
				ref.damagebt.src = 'img/showdamage.svg';
				ref.damagebt.title = language.reg[language.mod].showdamage;
			}
		}
	};
	button.append(damagebt);

	ref.namemask = false;
	let name = new Image();
	name.className = 'name';
	name.src = namemaskurl;
	ref.name = name;
	span.append(name);

	let namebt = new Image();
	namebt.className = 'namebt';
	namebt.src = 'img/maskname.svg';
	namebt.title = language.reg[language.mod].maskname;
	ref.namebt = namebt;
	namebt.onclick = function () {
		if (ref.name) {
			if (ref.namemask) {
				ref.name.style.zIndex = 2;
				ref.jobicon.style.zIndex = 2;
				ref.namemask = false;
				ref.namebt.src = 'img/maskname.svg';
				ref.namebt.title = language.reg[language.mod].maskname;
			} else {
				ref.name.style.zIndex = 4;
				ref.jobicon.style.zIndex = 5;
				ref.namemask = true;
				ref.namebt.src = 'img/showname.svg';
				ref.namebt.title = language.reg[language.mod].showname;
			}
		}
	};
	button.append(namebt);

	ref.jobname = 'card';
	let jobicon = new Image();
	jobicon.className = 'jobicon';
	ref.jobicon = jobicon;

	let jobchange = new Image();
	jobchange.className = 'jobchange';
	jobchange.title = language.reg[language.mod].jobchange;
	ref.jobchange = jobchange;
	jobchange.oncontextmenu = function () {
		return false;
	};
	let changejob = function (jobname) {
		ref.jobname = jobname;
		jobicon.src = 'img/minicon/' + jobname + '.png';
		jobchange.src = 'img/icon/' + jobname + '.png';
	};
	jobchange.onmousedown = function (event) {
		let i;
		switch (event.button) {
			case 0:
				i = data.jobname.indexOf(ref.jobname);
				i++;
				if (i >= data.jobname.length) i = 0;
				changejob(data.jobname[i]);
				if (ref.jobname != 'lab' && ref.damagemask) {
					damage.style.zIndex = 4;
				} else {
					damage.style.zIndex = 2;
				}
				break;
			case 2:
				changejob('card');
				if (ref.jobname != 'lab' && ref.damagemask) {
					damage.style.zIndex = 4;
				} else {
					damage.style.zIndex = 2;
				}
				break;
			default:
				break;
		}
	};
	changejob(findjob(canvas));
	button.append(jobchange);
	span.append(jobicon);
	spanmain.append(span);
	reg[x][y] = ref;
	return reg[x][y];
}
function newnullstyle() {
	let ref = {};
	ref.use = false;
	let spanmain = document.createElement('span');
	ref.main = spanmain;
	let nullcard = new Image();
	nullcard.className = 'null';
	nullcard.src = 'img/card/null.png';
	ref.nullcard = nullcard;
	spanmain.append(nullcard);
	return ref;
}
export default {
	damage,
	name,
	data,
	loadroleimg,
	style,
	newnullstyle
};
