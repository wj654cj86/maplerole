import card from './img/card.js';
let root = document.documentElement;
let linelen = 8,
	line = 8,
	id = [],
	addr = [],
	ref = [],
	len = 0,
	hismaxlen = 0,
	w = 0,
	h = 0;
function setseat(i) {
	ref[id[i]].main.style.left = addr[i].left + 'px';
	ref[id[i]].main.style.top = addr[i].top + 'px';
}
function getclickpoint(event, element) {
	return {
		x: event.clientX - element.offsetLeft + root.scrollLeft + document.body.scrollLeft,
		y: event.clientY - element.offsetTop + root.scrollTop + document.body.scrollTop
	};
}
async function loadroleimg() {
	ref.forEach(v => v.main.remove());

	linelen = Number(cardlinelen.value);
	if (isNaN(linelen)) linelen = 8;
	linelen = Math.floor(linelen);
	if (linelen < 1) linelen = 1;
	if (linelen > 20) linelen = 20;

	await card.loadroleimg();

	let cnt = 0;
	line = Math.ceil(hostfile.files.length * 4 / linelen);
	id = [];
	addr = [];
	for (let i = 0; i < line; i++) {
		for (let j = 0; j < linelen; j++) {
			id[cnt] = cnt;
			addr[cnt] = { left: j * card.data.size.w, top: i * card.data.size.h };
			cnt++;
		}
	}
	hismaxlen = len = cnt;

	cnt = 0;
	ref = [];
	w = linelen * card.data.size.w;
	h = line * card.data.size.h;
	layout.style.width = w + 'px';
	layout.style.height = h + 'px';
	for (let i = 0; i < hostfile.files.length; i++) {
		for (let j = 0; j < 4; j++) {
			ref[cnt] = card.style(i, j);
			setseat(cnt);
			layout.append(ref[cnt].main);
			cnt++;
		}
	}
	for (; cnt < len; cnt++) {
		ref[cnt] = card.newnullstyle();
		setseat(cnt);
		layout.append(ref[cnt].main);
	}

	layout.onmousedown = event => {
		let mp = getclickpoint(event, layout);
		let nowid = -1;
		for (let i = 0; i < len; i++) {
			let cp = { x: addr[i].left, y: addr[i].top };
			if (mp.x >= cp.x
				&& mp.x < cp.x + card.data.size.w
				&& mp.y >= cp.y
				&& mp.y < cp.y + card.data.size.h) {
				nowid = i;
				break;
			}
		}
		if (nowid == -1) return;
		let dp = { x: mp.x - addr[nowid].left, y: mp.y - addr[nowid].top };
		ref[id[nowid]].main.classList.add('move');
		window.onmousemove = event => {
			let mp = getclickpoint(event, layout);
			let sp = { x: mp.x - dp.x, y: mp.y - dp.y };
			for (let i = 0; i < len; i++) {
				if (i == nowid) continue;
				let cp = { x: addr[i].left, y: addr[i].top };
				if (sp.x >= cp.x - card.data.size.w / 2
					&& sp.x < cp.x + card.data.size.w / 2
					&& sp.y >= cp.y - card.data.size.h / 2
					&& sp.y < cp.y + card.data.size.h / 2) {
					let tmp = id[nowid];
					if (movemod[0].checked) {
						if (i < nowid) {
							for (let j = nowid; j > i; j--) {
								id[j] = id[j - 1];
								setseat(j);
							}
						} else {
							for (let j = nowid; j < i; j++) {
								id[j] = id[j + 1];
								setseat(j);
							}
						}
					} else {
						id[nowid] = id[i];
						setseat(nowid);
					}
					id[i] = tmp;
					nowid = i;
					break;
				}
			}
			ref[id[nowid]].main.style.left = mp.x - dp.x + 'px';
			ref[id[nowid]].main.style.top = mp.y - dp.y + 'px';
		}
		window.onmouseup = () => {
			ref[id[nowid]].main.classList.remove('move');
			setseat(nowid);
			window.onmousemove = () => { };
			window.onmouseup = () => { };
		};
	};
}
function idreplace(newid) {
	for (let i = 0; i < len; i++) {
		id[i] = newid[i];
		setseat(i);
	}
}
function sort() {
	let used = [];
	let unused = [];
	for (let i = 0; i < len; i++) {
		if (ref[id[i]].use) {
			used.push(id[i]);
		} else {
			unused.push(id[i]);
		}
	}
	idreplace(used.concat(unused));
}
function delunknown() {
	ref.forEach(v => v.jobname == 'card' && v.cross.click());
}
function forwardlab() {
	let unused = [];
	let other = [];
	let lab = [];
	for (let i = 0; i < len; i++) {
		if (ref[id[i]].use) {
			if (ref[id[i]].islab()) {
				lab.push(id[i]);
			} else {
				other.push(id[i]);
			}
		} else {
			unused.push(id[i]);
		}
	}
	idreplace(lab.concat(other).concat(unused));
}
function backwardlab() {
	let unused = [];
	let other = [];
	let lab = [];
	for (let i = 0; i < len; i++) {
		if (ref[id[i]].use) {
			if (ref[id[i]].islab()) {
				lab.push(id[i]);
			} else {
				other.push(id[i]);
			}
		} else {
			unused.push(id[i]);
		}
	}
	idreplace(other.concat(lab).concat(unused));
}
function linedec() {
	let lineuse = false;
	for (let i = len - linelen; i < len; i++) {
		if (ref[id[i]].use) {
			lineuse = true;
			break;
		}
	}
	if (!lineuse) {
		for (let i = len - linelen; i < len; i++) {
			ref[id[i]].main.remove();
		}
		line--;
		len -= linelen;
		h = line * card.data.size.h;
		layout.style.height = h + 'px';
	}
}
function lineinc() {
	if (len < hismaxlen) {
		line++;
		len += linelen;
		h = line * card.data.size.h;
		layout.style.height = h + 'px';
		for (let i = len - linelen; i < len; i++) {
			ref[id[i]] = card.newnullstyle();
			setseat(i);
			layout.append(ref[id[i]].main);
		}
	} else {
		let cnt = len;
		let i = line;
		line++;
		for (let j = 0; j < linelen; j++) {
			id[cnt] = cnt;
			addr[cnt] = { left: j * card.data.size.w, top: i * card.data.size.h };
			cnt++;
		}
		cnt = len;
		len += linelen;
		hismaxlen = len;
		h = line * card.data.size.h;
		layout.style.height = h + 'px';
		for (; cnt < len; cnt++) {
			ref[cnt] = card.newnullstyle();
			setseat(cnt);
			layout.append(ref[cnt].main);
		}
	}
}

let maskalldamage = () => ref.forEach(v => v.use && !v.damagemask && v.damagebt.click());
let showalldamage = () => ref.forEach(v => v.use && v.damagemask && v.damagebt.click());
let maskallname = () => ref.forEach(v => v.use && !v.namemask && v.namebt.click());
let showallname = () => ref.forEach(v => v.use && v.namemask && v.namebt.click());
let maskallicon = () => layout.classList.add('maskallicon');
let showallicon = () => layout.classList.remove('maskallicon');

function mergeimg() {
	let canvas = document.createElement('canvas');
	if (len == 0) return canvas;
	let ctx = canvas.getContext('2d');
	canvas.width = w;
	canvas.height = h;
	ctx.fillStyle = "#456";
	ctx.fillRect(0, 0, w, h);
	for (let i = 0; i < len; i++) {
		ctx.drawImage(
			ref[id[i]].tocanvas(),
			addr[i].left,
			addr[i].top
		);
	}
	return canvas;
}

let downloadallpng = () => canvas2url(mergeimg()).then(url => startDownload(url, 'roleall.png'));
let downloadalljpg = () => canvas2jpgurl(mergeimg(), Number(jpgquality.value)).then(url => startDownload(url, 'roleall.jpg'));

export default {
	loadroleimg,
	maskalldamage,
	showalldamage,
	maskallname,
	showallname,
	sort,
	delunknown,
	forwardlab,
	backwardlab,
	linedec,
	lineinc,
	maskallicon,
	showallicon,
	downloadallpng,
	downloadalljpg
};
