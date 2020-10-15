var root = document.documentElement;
var geturl = url2array();
var role = {
	linelen: 8,
	line: 8,
	id: [],
	addr: [],
	ref: [],
	len: 0,
	hismaxlen: 0,
	w: 0,
	h: 0,
	damage: false,
	name: false,
	download: document.createElement('canvas')
};
role.setseat = function (i) {
	role.ref[role.id[i]].main.style.left = role.addr[i].left + 'px';
	role.ref[role.id[i]].main.style.top = role.addr[i].top + 'px';
};
role.unlock = function (i) {
	if (typeof i != 'number') {
		for (let i = 0; i < role.len; i++) {
			if (role.ref[role.id[i]].use) {
				role.ref[role.id[i]].button.style.zIndex = 0;
			}
		}
	} else {
		if (role.ref[role.id[i]].use) {
			role.ref[role.id[i]].button.style.zIndex = 0;
		}
	}
};
role.loadimg = function () {
	generator(function* () {
		for (let i = 0; i < role.len; i++) {
			let node = role.ref[i].main;
			if (node.parentNode) {
				node.parentNode.removeChild(node);
			}
		}

		role.linelen = Number(cardlinelen.value);
		if (typeof role.linelen != 'number') role.linelen = 8;
		role.linelen = Math.floor(role.linelen);
		if (role.linelen < 1) role.linelen = 1;
		if (role.linelen > 20) role.linelen = 20;

		yield {
			nextfunc: card.loadimg,
			cbfunc: function () { }
		};

		let cnt = 0;
		role.line = Math.ceil(hostfile.files.length * 4 / role.linelen);
		role.id = [];
		role.addr = [];
		role.nullref = [];
		for (let i = 0; i < role.line; i++) {
			for (let j = 0; j < role.linelen; j++) {
				role.id[cnt] = cnt;
				role.addr[cnt] = { left: j * carddata.size.w, top: i * carddata.size.h };
				cnt++;
			}
		}
		role.hismaxlen = role.len = cnt;

		cnt = 0;
		role.ref = [];
		role.w = role.linelen * carddata.size.w;
		role.h = role.line * carddata.size.h;
		layout.style.width = role.w + 'px';
		layout.style.height = role.h + 'px';
		for (let i = 0; i < hostfile.files.length; i++) {
			for (let j = 0; j < 4; j++) {
				let ref = card.style(i, j);
				role.ref[cnt] = ref;
				role.setseat(cnt);
				layout.appendChild(role.ref[cnt].main);
				cnt++;
			}
		}
		for (; cnt < role.len; cnt++) {
			let ref = card.newnullstyle();
			role.ref[cnt] = ref;
			role.setseat(cnt);
			layout.appendChild(role.ref[cnt].main);
		}

		layout.onmousedown = function (event) {
			let mp = getclickpoint(event, layout);
			let nowid = -1;
			role.unlock();
			for (let i = 0; i < role.len; i++) {
				let cp = { x: role.addr[i].left, y: role.addr[i].top };
				if (mp.x >= cp.x
					&& mp.x < cp.x + carddata.size.w
					&& mp.y >= cp.y
					&& mp.y < cp.y + carddata.size.h) {
					nowid = i;
					break;
				}
			}
			if (nowid == -1) return;
			if (role.ref[role.id[nowid]].use == true) role.ref[role.id[nowid]].button.style.zIndex = 4;
			let dp = { x: mp.x - role.addr[nowid].left, y: mp.y - role.addr[nowid].top };
			role.ref[role.id[nowid]].main.style.transition = 'all 0s';
			role.ref[role.id[nowid]].main.style.zIndex = 10;
			window.onmousemove = function (event) {
				let mp = getclickpoint(event, layout);
				let sp = { x: mp.x - dp.x, y: mp.y - dp.y };
				for (let i = 0; i < role.len; i++) {
					if (i == nowid) continue;
					let cp = { x: role.addr[i].left, y: role.addr[i].top };
					if (sp.x >= cp.x - carddata.size.w / 2
						&& sp.x < cp.x + carddata.size.w / 2
						&& sp.y >= cp.y - carddata.size.h / 2
						&& sp.y < cp.y + carddata.size.h / 2) {
						let tmp = role.id[nowid];
						if (movemod[0].checked) {
							if (i < nowid) {
								for (let j = nowid; j > i; j--) {
									role.id[j] = role.id[j - 1];
									role.setseat(j);
								}
							} else {
								for (let j = nowid; j < i; j++) {
									role.id[j] = role.id[j + 1];
									role.setseat(j);
								}
							}
						} else {
							role.id[nowid] = role.id[i];
							role.setseat(nowid);
						}
						role.id[i] = tmp;
						nowid = i;
						break;
					}
				}
				role.ref[role.id[nowid]].main.style.left = mp.x - dp.x + 'px';
				role.ref[role.id[nowid]].main.style.top = mp.y - dp.y + 'px';
			}
			window.onmouseup = function () {
				role.setseat(nowid);
				role.ref[role.id[nowid]].main.style.transition = 'all 300ms';
				role.ref[role.id[nowid]].main.style.zIndex = 3;
				window.onmousemove = function () { };
				window.onmouseup = function () { };
			};
		};
	});
};
role.sort = function () {
	let used = [];
	let unused = [];
	for (let i = 0; i < role.len; i++) {
		if (role.ref[role.id[i]].use) {
			used.push(role.id[i]);
		} else {
			unused.push(role.id[i]);
		}
	}
	role.id = used.concat(unused);
	for (let i = 0; i < role.len; i++) {
		role.setseat(i);
	}
};

role.linedec = function () {
	let lineuse = false;
	for (let i = role.len - role.linelen; i < role.len; i++) {
		if (role.ref[role.id[i]].use) {
			lineuse = true;
			break;
		}
	}
	if (!lineuse) {
		for (let i = role.len - role.linelen; i < role.len; i++) {
			let node = role.ref[role.id[i]].main;
			if (node.parentNode) {
				node.parentNode.removeChild(node);
			}
		}
		role.line--;
		role.len -= role.linelen;
		role.h = role.line * carddata.size.h;
		layout.style.height = role.h + 'px';
	}
};
role.lineinc = function () {
	if (role.len < role.hismaxlen) {
		role.line++;
		role.len += role.linelen;
		role.h = role.line * carddata.size.h;
		layout.style.height = role.h + 'px';
		for (let i = role.len - role.linelen; i < role.len; i++) {
			let ref = card.newnullstyle();
			role.ref[role.id[i]] = ref;
			role.setseat(i);
			layout.appendChild(role.ref[role.id[i]].main);
		}
	} else {
		let cnt = role.len;
		let i = role.line;
		role.line++;
		for (let j = 0; j < role.linelen; j++) {
			role.id[cnt] = cnt;
			role.addr[cnt] = { left: j * carddata.size.w, top: i * carddata.size.h };
			cnt++;
		}
		cnt = role.len;
		role.len += role.linelen;
		role.hismaxlen = role.len;
		role.h = role.line * carddata.size.h;
		layout.style.height = role.h + 'px';
		for (; cnt < role.len; cnt++) {
			let ref = card.newnullstyle();
			role.ref[cnt] = ref;
			role.setseat(cnt);
			layout.appendChild(role.ref[cnt].main);
		}
	}
};

role.maskalldamage = function () {
	for (let i = 0; i < role.len; i++) {
		if (role.ref[i].damage && !role.ref[i].damagemask) {
			role.ref[i].damagebt.click();
		}
	}
};
role.showalldamage = function () {
	for (let i = 0; i < role.len; i++) {
		if (role.ref[i].damage && role.ref[i].damagemask) {
			role.ref[i].damagebt.click();
		}
	}
};

role.maskallname = function () {
	for (let i = 0; i < role.len; i++) {
		if (role.ref[i].name && !role.ref[i].namemask) {
			role.ref[i].namebt.click();
		}
	}
};
role.showallname = function () {
	for (let i = 0; i < role.len; i++) {
		if (role.ref[i].name && role.ref[i].namemask) {
			role.ref[i].namebt.click();
		}
	}
};

role.mergeimg = function (canvas) {
	if (role.len == 0) return;
	let ctx = canvas.getContext('2d');
	canvas.setAttribute('width', role.w);
	canvas.setAttribute('height', role.h);
	ctx.fillStyle = "#444";
	ctx.fillRect(0, 0, role.w, role.h);
	for (let i = 0; i < role.len; i++) {
		let ref = role.ref[role.id[i]];
		let cardimg;
		if (ref.use) {
			cardimg = ref.card;
		} else {
			cardimg = ref.nullcard;
		}
		ctx.drawImage(
			cardimg,
			role.addr[i].left,
			role.addr[i].top
		);
		if (ref.use) {
			if (ref.namemask) {
				ctx.drawImage(
					card.name,
					role.addr[i].left,
					role.addr[i].top
				);
				ctx.drawImage(
					ref.jobicon,
					role.addr[i].left + 14,
					role.addr[i].top + 151
				);
			}
			if (ref.jobname != 'lab' && ref.damagemask) {
				ctx.drawImage(
					card.damage,
					role.addr[i].left,
					role.addr[i].top
				);
			}
		}
	}
};
role.downloadallpng = function () {
	role.mergeimg(role.download);
	role.download.toBlob(function (blob) {
		let url = URL.createObjectURL(blob);
		startDownload(url, 'roleall.png');
	});
};
role.downloadalljpg = function () {
	role.mergeimg(role.download);
	role.download.toBlob(function (blob) {
		let url = URL.createObjectURL(blob);
		startDownload(url, 'roleall.jpg');
	}, 'image/jpeg', Number(jpgquality.value));
};

window.onload = function () {
	generator(function* () {
		if (typeof geturl['fbclid'] != 'undefined') {
			delete geturl['fbclid'];
			array2url(geturl);
		}
		yield {
			nextfunc: language.initial,
			cbfunc: function () { }
		};
		yield {
			nextfunc: language.setting,
			argsfront: [geturl['lang']],
			cbfunc: function (data) {
				document.getElementsByTagName('html')[0].lang = language.mod;
				document.title = data.title;
				loadbtn.value = data.loadfile;
				maskalldamage.value = data.maskalldamage;
				showalldamage.value = data.showalldamage;
				maskallname.value = data.maskallname;
				showallname.value = data.showallname;
				sortcard.value = data.sortcard;
				unlock.value = data.unlock;
				cardlinelenspan.innerHTML = data.cardlinelen;
				jpgqualityspan.innerHTML = data.jpgquality;
				cardlinedec.value = data.cardlinedec;
				cardlineinc.value = data.cardlineinc;
				downloadallpng.value = data.downloadallpng;
				downloadalljpg.value = data.downloadalljpg;
				movemodespan.innerHTML = data.movemode;
				sortmovespan.innerHTML = data.sortmove;
				swapmovespan.innerHTML = data.swapmove;
			}
		};
		yield {
			nextfunc: card.initial,
			cbfunc: function () { }
		};

		layout.ondragstart = function () {
			return false;
		};
		loadbtn.onclick = role.loadimg;
		maskalldamage.onclick = role.maskalldamage;
		showalldamage.onclick = role.showalldamage;
		maskallname.onclick = role.maskallname;
		showallname.onclick = role.showallname;
		sortcard.onclick = role.sort;
		unlock.onclick = function () { role.unlock() };
		cardlinedec.onclick = role.linedec;
		cardlineinc.onclick = role.lineinc;
		downloadallpng.onclick = role.downloadallpng;
		downloadalljpg.onclick = role.downloadalljpg;
	});
};