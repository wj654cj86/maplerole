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
	data.angle.forEach((v, i) => range_nl(0, v).forEach(j => {
		ctx.putImageData(imageData, i, j);
		ctx.putImageData(imageData, data.size.w - 1 - i, data.size.h - 1 - j);
		ctx.putImageData(imageData, i, data.size.h - 1 - j);
		ctx.putImageData(imageData, data.size.w - 1 - i, j);
	}));
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

function createcard() {
	let canvas = document.createElement('canvas');
	canvas.width = data.size.w;
	canvas.height = data.size.h;
	return canvas;
}

let tmppromise = {};
data.name.forEach(v => tmppromise[v] = loadimg(`img/card/${v}.png`));
data.jobname.forEach(v => tmppromise[v] = loadimg(`img/card/${v}.png`));
for (let [key] of tmppromise.entries()) {
	let img = await tmppromise[key];
	let canvas = tmp[key] = createcard();
	let ctx = canvas.getContext('2d');
	ctx.drawImage(img, 0, 0);
	setcardangle(ctx, [0, 0, 0, 0]);
}
let gap = Math.floor((data.size.w - 20 * 5) / 4) + 20;
root.style.setProperty('--cross-x', gap * 4 + 'px');
root.style.setProperty('--download-x', gap * 3 + 'px');
root.style.setProperty('--jobchange-x', gap * 2 + 'px');
root.style.setProperty('--damagebt-x', gap + 'px');
root.style.setProperty('--namebt-x', 0 + 'px');

damage = createcard();
let damagectx = damage.getContext('2d');
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
damage.toBlob(blob => damagemaskurl = URL.createObjectURL(blob));

name = createcard();
let namectx = name.getContext('2d');
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
name.toBlob(blob => namemaskurl = URL.createObjectURL(blob));

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
	if (x in reg) {
		if (y in reg[x]) {
			return reg[x][y];
		}
	} else {
		reg[x] = {};
	}
	let lang = language.reg[language.mod];
	let ref = {};
	ref.use = true;
	let main = ref.main = creatediv('main');
	let nullcard = ref.nullcard = createimg('null', 'img/card/null.png');
	main.append(nullcard);

	let role = ref.role = creatediv('role');
	let canvas = ref.card = createcard();
	canvas.classList.add('card');
	let ctx = canvas.getContext('2d');
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
	role.append(canvas);

	let button = ref.button = creatediv('button');
	main.append(button);

	let cross = ref.cross = createimg('cross', 'img/cross.svg', lang.cross);
	cross.onclick = () => {
		ref.use = false;
		role.classList.add('mask');
		button.classList.add('mask');
	};
	button.append(cross);

	ref.tocanvas = () => {
		let canvas = createcard();
		let ctx = canvas.getContext('2d');
		if (ref.use) {
			ctx.drawImage(ref.card, 0, 0);
			if (ref.namemask) {
				ctx.drawImage(name, 0, 0);
				ctx.drawImage(ref.jobicon, 14, 151);
			}
			if (ref.jobname != 'lab' && ref.damagemask) {
				ctx.drawImage(damage, 0, 0);
			}
		} else {
			ctx.drawImage(ref.nullcard, 0, 0);
		}
		return canvas;
	};
	let download = ref.download = createimg('download', 'img/download.svg', lang.download);
	download.onclick = () => ref.tocanvas().toBlob(blob => startDownload(URL.createObjectURL(blob), 'role.png'));
	button.append(download);

	ref.damagemask = false;
	let damage = ref.damage = createimg('damage', damagemaskurl);
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

	ref.namemask = false;
	let name = ref.name = createimg('name', namemaskurl);
	role.append(name);
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

	ref.jobname = 'card';
	let jobicon = ref.jobicon = createimg('jobicon');
	let jobchange = ref.jobchange = createimg('jobchange', undefined, lang.jobchange);
	jobchange.oncontextmenu = () => false;
	let changejob = jobname => {
		ref.jobname = jobname;
		jobicon.src = `img/minicon/${jobname}.png`;
		jobchange.src = `img/icon/${jobname}.png`;
		if (ref.jobname == 'lab') {
			damage.classList.add('lab');
		} else {
			damage.classList.remove('lab');
		}
	};
	jobchange.onmousedown = event => {
		let i;
		switch (event.button) {
			case 0:
				i = data.jobname.indexOf(ref.jobname);
				i++;
				if (i >= data.jobname.length) i = 0;
				changejob(data.jobname[i]);
				break;
			case 2:
				changejob('card');
				break;
			default:
				break;
		}
	};
	changejob(findjob(canvas));
	button.append(jobchange);
	role.append(jobicon);
	main.append(role);
	reg[x][y] = ref;
	return reg[x][y];
}
function newnullstyle() {
	let ref = {};
	ref.use = false;
	let main = ref.main = creatediv('main');
	let nullcard = ref.nullcard = createimg('null', 'img/card/null.png');
	ref.tocanvas = () => {
		let canvas = createcard();
		let ctx = canvas.getContext('2d');
		ctx.drawImage(ref.nullcard, 0, 0);
		return canvas;
	};
	main.append(nullcard);
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
