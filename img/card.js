import language from '../language/language.js';
let reg = [],
	tmp = {},
	damagepng = '',
	namepng = '',
	data = {
		size: { w: 116, h: 177 },
		spacing: 122,
		seat: {
			'1024x768': { x: 73, y: 548, m: 1 },
			'1280x720': { x: 201, y: 524, m: 1 },
			'1366x768': { x: 244, y: 548, m: 1 },
			'1920x1080': { x: 343, y: 771, m: 1.407 }
		},
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
			'xenon'
		],
		labname: [
			'lab',
			'mobile',
			'expedition'
		]
	};
data.allname = data.jobname.concat(data.labname);
function setcardangle(ctx) {
	let w = data.size.w,
		h = data.size.h,
		r = 10;
	ctx.beginPath();
	ctx.moveTo(w - r, 0); ctx.quadraticCurveTo(w, 0, w, r);
	ctx.lineTo(w, h - r); ctx.quadraticCurveTo(w, h, w - r, h);
	ctx.lineTo(r, h); ctx.quadraticCurveTo(0, h, 0, h - r);
	ctx.lineTo(0, r); ctx.quadraticCurveTo(0, 0, r, 0);
	ctx.closePath();
	ctx.clip();
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
	let job = ctx.getImageData(15, 152, 6, 12);
	let sdarr = [];
	for (let i = 0; i < data.allname.length; i++) {
		let canvas2 = tmp[data.allname[i]];
		let ctx2 = canvas2.getContext('2d');
		let job2 = ctx2.getImageData(15, 152, 6, 12);
		let d = [];
		for (let j = 0; j < job2.data.length; j += 4) {
			d[j] = job.data[j] - job2.data[j];
			d[j + 1] = job.data[j + 1] - job2.data[j + 1];
			d[j + 2] = job.data[j + 2] - job2.data[j + 2];
			d[j + 3] = (d[j] + d[j + 1] + d[j + 2]) / 3;
		}
		sdarr[i] = Math.round(arrsd(d));
	}
	let minnum = Math.min(...sdarr);
	if (minnum < 50)
		return data.allname[sdarr.indexOf(minnum)];
	else
		return 'card';
}

function createcard(classname) {
	let canvas = document.createElement('canvas');
	if (classname !== undefined) canvas.classList.add(classname);
	canvas.width = data.size.w;
	canvas.height = data.size.h;
	return canvas;
}

let tmppromise = Object.fromEntries(data.name.concat(data.allname).map(v => [v, loadimg(`img/card/${v}.png`)]));
for (let [key] of Object.entries(tmppromise)) {
	let img = await tmppromise[key];
	let canvas = tmp[key] = createcard();
	let ctx = canvas.getContext('2d');
	setcardangle(ctx);
	ctx.drawImage(img, 0, 0);
}

let gap = Math.floor((data.size.w - 20 * 5) / 4) + 20;
document.querySelector('style').innerHTML += ['cross', 'download', 'jobchange', 'damagebt', 'namebt']
	.map((v, i) => `#layout .${v}{left:${gap * (4 - i)}px;}`).join('\n');

function createmaskurl(x, y, w, h) {
	let canvas = createcard();
	canvas.getContext('2d').drawImage(tmp.card, x, y, w, h, x, y, w, h);
	return canvas2url(canvas);
}

damagepng = await createmaskurl(3, 130, data.size.w - 6, 17);
namepng = await createmaskurl(3, 147, data.size.w - 6, data.size.h - 147 - 10);

async function loadroleimg() {
	reg.forEach(v => v.remove());
	reg = await Array.from(hostfile.files).promiseMap(v => loadimg(blob2url(v)));
}

function creatediv(classname) {
	let div = document.createElement('div');
	if (classname !== undefined) div.classList.add(classname);
	return div;
}

function createimg(classname, src, title) {
	let img = new Image();
	if (classname !== undefined) img.classList.add(classname);
	if (src !== undefined) img.src = src;
	if (title !== undefined) img.title = title;
	return img;
}

function style(x, y) {
	let lang = language.reg[language.mod];
	let ref = {
		use: true,
		damagemask: false,
		namemask: false,
		jobname: 'card'
	};
	let main = ref.main = creatediv('main');

	let nullcard = createimg('null', 'img/card/null.png');
	main.append(nullcard);
	let role = creatediv('role');
	main.append(role);
	let button = creatediv('button');
	main.append(button);

	let card = createcard('card');
	let cardctx = card.getContext('2d');
	setcardangle(cardctx);
	let imgsize = reg[x].naturalWidth + 'x' + reg[x].naturalHeight;
	cardctx.drawImage(
		reg[x],
		data.seat[imgsize].x + Math.round(data.spacing * data.seat[imgsize].m * y),
		data.seat[imgsize].y,
		Math.round(data.size.w * data.seat[imgsize].m),
		Math.round(data.size.h * data.seat[imgsize].m),
		0,
		0,
		data.size.w,
		data.size.h
	);
	role.append(card);

	let cross = ref.cross = createimg('cross', 'img/cross.svg', lang.cross);
	cross.onclick = () => {
		ref.use = false;
		role.classList.add('mask');
		button.classList.add('mask');
	};
	button.append(cross);

	let damage = createimg('damage', damagepng);
	role.append(damage);
	let damagebt = ref.damagebt = createimg('damagebt', 'img/maskdamage.svg', lang.maskdamage);
	damagebt.onclick = () => {
		if (ref.damagemask) {
			ref.damagemask = false;
			damage.classList.remove('use');
			damagebt.src = 'img/maskdamage.svg';
			damagebt.title = lang.maskdamage;
		} else {
			ref.damagemask = true;
			damage.classList.add('use');
			damagebt.src = 'img/showdamage.svg';
			damagebt.title = lang.showdamage;
		}
	};
	button.append(damagebt);

	let name = createimg('name', namepng);
	role.append(name);
	let jobicon = createimg('jobicon');
	role.append(jobicon);
	let namebt = ref.namebt = createimg('namebt', 'img/maskname.svg', lang.maskname);
	namebt.onclick = () => {
		if (ref.namemask) {
			ref.namemask = false;
			name.classList.remove('use');
			jobicon.classList.remove('use');
			namebt.src = 'img/maskname.svg';
			namebt.title = lang.maskname;
		} else {
			ref.namemask = true;
			name.classList.add('use');
			jobicon.classList.add('use');
			namebt.src = 'img/showname.svg';
			namebt.title = lang.showname;
		}
	};
	button.append(namebt);

	let jobchange = ref.jobchange = createimg('jobchange', undefined, lang.jobchange);
	ref.islab = () => data.labname.includes(ref.jobname);
	let changejob = jobname => {
		ref.jobname = jobname;
		jobicon.src = `img/minicon/${jobname}.png`;
		jobchange.src = `img/icon/${jobname}.png`;
		if (ref.islab()) {
			damage.classList.add('lab');
		} else {
			damage.classList.remove('lab');
		}
	};
	jobchange.oncontextmenu = () => changejob('card');
	jobchange.onclick = () => {
		let i = data.allname.indexOf(ref.jobname) + 1;
		if (i >= data.allname.length) i = 0;
		changejob(data.allname[i]);
	};
	button.append(jobchange);

	ref.tocanvas = () => {
		if (ref.use) {
			let canvas = createcard();
			let ctx = canvas.getContext('2d');
			ctx.drawImage(card, 0, 0);
			if (ref.namemask) {
				ctx.drawImage(name, 0, 0);
				ctx.drawImage(jobicon, 14, 151);
			}
			if (!ref.islab() && ref.damagemask) {
				ctx.drawImage(damage, 0, 0);
			}
			return canvas;
		} else {
			return nullcard;
		}
	};
	let download = createimg('download', 'img/download.svg', lang.download);
	download.onclick = async () => startDownload(await canvas2url(ref.tocanvas()), 'role.png');
	button.append(download);

	changejob(findjob(card));
	return ref;
}
function newnullstyle() {
	let ref = { use: false };
	let main = ref.main = creatediv('main');
	let nullcard = createimg('null', 'img/card/null.png');
	main.append(nullcard);
	ref.tocanvas = () => nullcard;
	return ref;
}

export default {
	data,
	loadroleimg,
	style,
	newnullstyle
};
