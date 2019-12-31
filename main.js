var geturl = url2array();
var role = {
	line: 8,
	id: [],
	addr: [],
	ref: [],
	refuse: [],
	len: 0,
	w: 0,
	h: 0
};
role.setseat = function (i) {
	role.ref[role.id[i]].style.left = role.addr[i].left + 'px';
	role.ref[role.id[i]].style.top = role.addr[i].top + 'px';
};
role.loadimg = function () {
	generator(function* () {
		for (let i = 0; i < role.len; i++) {
			let node = role.ref[i];
			if (node.parentNode) {
				node.parentNode.removeChild(node);
			}
		}

		role.line = Number(cardlinelen.value);
		if (typeof role.line != 'number') role.line = 8;

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
		role.refuse = [];
		role.w = role.line * carddata.size.w;
		role.h = line * carddata.size.h;
		layout.style.width = role.w + 'px';
		layout.style.height = role.h + 'px';
		for (let i = 0; i < hostfile.files.length; i++) {
			for (let j = 0; j < 4; j++) {
				let spanmain = document.createElement('span');
				let nullcard = card.newnullcard();
				nullcard.style.zIndex = 2;
				spanmain.appendChild(nullcard);
				let span = document.createElement('span');
				let icon = copyxml(card.crossicon).getElementsByTagName('img')[0];
				icon.onclick = function () {
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
					span.style.opacity = 0;
					role.refuse[role.id[nowid]] = false;
				};
				icon.onmouseenter = function () {
					icon.style.opacity = 1;
				};
				icon.onmouseout = function () {
					icon.style.opacity = 0.3;
				}
				span.appendChild(icon);
				span.appendChild(card.style(i, j));
				spanmain.appendChild(span);
				role.ref[cnt] = spanmain;
				role.setseat(cnt);
				layout.appendChild(role.ref[cnt]);
				role.refuse[cnt] = true;
				cnt++;
			}
		}
		for (; cnt < role.len; cnt++) {
			let spanmain = document.createElement('span');
			let nullcard = card.newnullcard();
			nullcard.style.zIndex = 2;
			spanmain.appendChild(nullcard);
			role.ref[cnt] = spanmain;
			role.setseat(cnt);
			layout.appendChild(role.ref[cnt]);
			role.refuse[cnt] = false;
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
			role.ref[role.id[nowid]].style.transition = 'all 0s';
			role.ref[role.id[nowid]].style.zIndex = 10;
			layout.onmousemove = function (event) {
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
				role.ref[role.id[nowid]].style.left = mp.x - dp.x + 'px';
				role.ref[role.id[nowid]].style.top = mp.y - dp.y + 'px';
			}
			window.onmouseup = function () {
				role.setseat(nowid);
				role.ref[role.id[nowid]].style.transition = 'all 300ms';
				role.ref[role.id[nowid]].style.zIndex = 3;
				layout.onmousemove = function () { };
				window.onmouseup = function () { };
			};
		};
	});
};
role.mergeimg = function () {
	if (role.len == 0) return;
	let ctx = mergeimg.getContext('2d');
	mergeimg.setAttribute('width', role.w);
	mergeimg.setAttribute('height', role.h);
	ctx.fillStyle = "#444";
	ctx.fillRect(0, 0, role.w, role.h);
	for (let i = 0; i < role.len; i++) {
		let cardimg;
		if (role.refuse[role.id[i]]) {
			cardimg = role.ref[role.id[i]].getElementsByTagName('canvas')[1];
		} else {
			cardimg = card.nullcard;
		}
		ctx.drawImage(
			cardimg,
			role.addr[i].left,
			role.addr[i].top,
			carddata.size.w,
			carddata.size.h
		);

	}
	mergeimg.style.zIndex = 10;
	mergeimg.style.opacity = 1;
	mergeimgbtn.onclick = role.cancelmergeimg;
	mergeimgbtn.value = language.reg[language.mod].cancelmergeimg;
};
role.cancelmergeimg = function () {
	mergeimg.setAttribute('width', 0);
	mergeimg.setAttribute('height', 0);
	mergeimg.style.zIndex = 0;
	mergeimg.style.opacity = 0;
	mergeimgbtn.onclick = role.mergeimg;
	mergeimgbtn.value = language.reg[language.mod].mergeimg;
}
role.sort = function () {
	let used = [];
	let unused = [];
	for (let i = 0; i < role.len; i++) {
		if (role.refuse[role.id[i]]) {
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
				mergeimgbtn.value = data.mergeimg;
				cardlinelenspan.innerHTML = data.cardlinelen;
				movemodespan.innerHTML = data.movemode;
				sortmovespan.innerHTML = data.sortmove;
				swapmovespan.innerHTML = data.swapmove;
				sortcard.value = data.sortcard;
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
		sortcard.onclick = role.sort;
		mergeimgbtn.onclick = role.mergeimg;
	});
};