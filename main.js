var geturl = url2array();
var role = {
	line: 8,
	id: [],
	addr: [],
	ref: [],
	len: 0,
	w: 0,
	h: 0,
	damage: false,
	name: false,
	merge: false
};
role.setseat = function (i) {
	role.ref[role.id[i]].main.style.left = role.addr[i].left + 'px';
	role.ref[role.id[i]].main.style.top = role.addr[i].top + 'px';
};
role.loadimg = function () {
	generator(function* () {
		if (role.merge) {
			role.cancelmergeimg();
		}
		if (role.damage) {
			role.showdamage();
		}
		if (role.name) {
			role.showname();
		}
		for (let i = 0; i < role.len; i++) {
			let node = role.ref[i].main;
			if (node.parentNode) {
				node.parentNode.removeChild(node);
			}
		}

		role.line = Number(cardlinelen.value);
		if (typeof role.line != 'number') role.line = 8;
		role.line = Math.floor(role.line);
		if (role.line < 1) role.line = 1;
		if (role.line > 20) role.line = 20;

		yield {
			nextfunc: card.loadimg,
			cbfunc: function () { }
		};

		let cnt = 0;
		let line = Math.ceil(hostfile.files.length * 4 / role.line);
		role.id = [];
		role.addr = [];
		role.nullref = [];
		for (let i = 0; i < line; i++) {
			for (let j = 0; j < role.line; j++) {
				role.id[cnt] = cnt;
				role.addr[cnt] = { left: j * carddata.size.w, top: i * carddata.size.h };
				cnt++;
			}
		}
		role.len = cnt;

		cnt = 0;
		role.ref = [];
		role.w = role.line * carddata.size.w;
		role.h = line * carddata.size.h;
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

role.maskdamage = function () {
	for (let i = 0; i < role.len; i++) {
		if (role.ref[i].damage) {
			if (role.ref[i].jobname != 'lab')
				role.ref[i].damage.style.zIndex = 5;
			role.ref[i].damagemask = true;
		}
	}
	role.damage = true;
	if (role.merge) {
		role.mergeimg();
	}
	maskdamage.onclick = role.showdamage;
	maskdamage.value = language.reg[language.mod].showdamage;
};
role.showdamage = function () {
	for (let i = 0; i < role.len; i++) {
		if (role.ref[i].damage) {
			role.ref[i].damage.style.zIndex = 2;
			role.ref[i].damagemask = false;
		}
	}
	role.damage = false;
	if (role.merge) {
		role.mergeimg();
	}
	maskdamage.onclick = role.maskdamage;
	maskdamage.value = language.reg[language.mod].maskdamage;
};

role.maskname = function () {
	for (let i = 0; i < role.len; i++) {
		if (role.ref[i].name) {
			role.ref[i].name.style.zIndex = 4;
			role.ref[i].jobicon.style.zIndex = 6;
			role.ref[i].namemask = true;
		}
	}
	role.name = true;
	if (role.merge) {
		role.mergeimg();
	}
	maskname.onclick = role.showname;
	maskname.value = language.reg[language.mod].showname;
};
role.showname = function () {
	for (let i = 0; i < role.len; i++) {
		if (role.ref[i].name) {
			role.ref[i].name.style.zIndex = 2;
			role.ref[i].jobicon.style.zIndex = 2;
			role.ref[i].namemask = false;
		}
	}
	role.name = false;
	if (role.merge) {
		role.mergeimg();
	}
	maskname.onclick = role.maskname;
	maskname.value = language.reg[language.mod].maskname;
};
role.mergeimg = function () {
	if (role.len == 0) return;
	let ctx = mergeimg.getContext('2d');
	mergeimg.setAttribute('width', role.w);
	mergeimg.setAttribute('height', role.h);
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
			if (role.name) {
				ctx.drawImage(
					ref.name,
					role.addr[i].left,
					role.addr[i].top
				);
				ctx.drawImage(
					ref.jobicon,
					role.addr[i].left + 14,
					role.addr[i].top + 151
				);
			}
			if (ref.jobname != 'lab' && role.damage) {
				ctx.drawImage(
					ref.damage,
					role.addr[i].left,
					role.addr[i].top
				);
			}
		}
	}
	mergeimg.style.zIndex = 10;
	mergeimg.style.opacity = 1;
	role.merge = true;
	mergeimgbtn.onclick = role.cancelmergeimg;
	mergeimgbtn.value = language.reg[language.mod].cancelmergeimg;
};
role.cancelmergeimg = function () {
	mergeimg.setAttribute('width', 0);
	mergeimg.setAttribute('height', 0);
	mergeimg.style.zIndex = 0;
	mergeimg.style.opacity = 0;
	role.merge = false;
	mergeimgbtn.onclick = role.mergeimg;
	mergeimgbtn.value = language.reg[language.mod].mergeimg;
}
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
				maskdamage.value = data.maskdamage;
				maskname.value = data.maskname;
				sortcard.value = data.sortcard;
				mergeimgbtn.value = data.mergeimg;
				cardlinelenspan.innerHTML = data.cardlinelen;
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
		maskdamage.onclick = role.maskdamage;
		maskname.onclick = role.maskname;
		sortcard.onclick = role.sort;
		mergeimgbtn.onclick = role.mergeimg;
	});
};