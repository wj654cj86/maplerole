var geturl = url2array();
var role = {
	line: 8,
	id: [],
	addr: [],
	nullref: [],
	ref: [],
	refuse: [],
	len: 0,
	w: 0,
	h: 0
};

role.loadimg = function () {
	generator(function* () {
		for (let i = 0; i < role.len; i++) {
			let node = role.nullref[i];
			if (node.parentNode) {
				node.parentNode.removeChild(node);
			}
			node = role.ref[i];
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
				role.nullref[cnt] = copyxml(card.nullcard).getElementsByTagName('img')[0];
				role.nullref[cnt].style.left = role.addr[cnt].left + 'px';
				role.nullref[cnt].style.top = role.addr[cnt].top + 'px';
				layout.appendChild(role.nullref[cnt]);
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
					role.ref[role.id[nowid]].style.opacity = 0;
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
				role.ref[cnt] = span;
				role.ref[cnt].style.left = role.addr[cnt].left + 'px';
				role.ref[cnt].style.top = role.addr[cnt].top + 'px';
				layout.appendChild(role.ref[cnt]);
				role.refuse[cnt] = true;
				cnt++;
			}
		}
		for (; cnt < role.len; cnt++) {
			role.ref[cnt] = new Image();
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
						if (movemod[0].checked) {
							if (i < nowid) {
								let tmp = role.id[nowid];
								for (let j = nowid; j > i; j--) {
									role.id[j] = role.id[j - 1];
									role.ref[role.id[j]].style.left = role.addr[j].left + 'px';
									role.ref[role.id[j]].style.top = role.addr[j].top + 'px';
								}
								role.id[i] = tmp;
								nowid = i;
							} else {
								let tmp = role.id[nowid];
								for (let j = nowid; j < i; j++) {
									role.id[j] = role.id[j + 1];
									role.ref[role.id[j]].style.left = role.addr[j].left + 'px';
									role.ref[role.id[j]].style.top = role.addr[j].top + 'px';
								}
								role.id[i] = tmp;
								nowid = i;
							}
						} else {
							let tmp = role.id[nowid];
							role.id[nowid] = role.id[i];
							role.id[i] = tmp;
							role.ref[role.id[nowid]].style.left = role.addr[nowid].left + 'px';
							role.ref[role.id[nowid]].style.top = role.addr[nowid].top + 'px';
							nowid = i;
						}
						break;
					}
				}
				role.ref[role.id[nowid]].style.left = mp.x - dp.x + 'px';
				role.ref[role.id[nowid]].style.top = mp.y - dp.y + 'px';
			}
			window.onmouseup = function () {
				role.ref[role.id[nowid]].style.left = role.addr[nowid].left + 'px';
				role.ref[role.id[nowid]].style.top = role.addr[nowid].top + 'px';
				role.ref[role.id[nowid]].style.transition = 'all 300ms';
				role.ref[role.id[nowid]].style.zIndex = 3;
				layout.onmousemove = function () { };
				window.onmouseup = function () { };
			};
		};
	});
};
role.download = function () {
	if (role.len == 0) return;
	let canvas = document.createElement('canvas');
	let ctx = canvas.getContext('2d');
	canvas.setAttribute('width', role.w);
	canvas.setAttribute('height', role.h);
	for (let i = 0; i < role.len; i++) {
		ctx.drawImage(
			card.nullcard,
			role.addr[i].left,
			role.addr[i].top,
			carddata.size.w,
			carddata.size.h
		);
	}
	for (let i = 0; i < role.len; i++) {
		if (role.refuse[role.id[i]]) {
			ctx.drawImage(
				role.ref[role.id[i]].getElementsByTagName('canvas')[0],
				role.addr[i].left,
				role.addr[i].top,
				carddata.size.w,
				carddata.size.h
			);
		}
	}
	canvas.toBlob(function (blob) {
		let url = URL.createObjectURL(blob);
		let name = downloadname.value;
		if (name == '') name = 'card.png';
		if (name.indexOf('.png') == -1) name += '.png';
		startDownload(url, name);
	}, 'image/png');
};
role.sort = function () {
	for (let i = 0; i < role.len; i++) {
		if (role.refuse[role.id[i]] == false) {
			if ((function () {
				for (let j = i; j < role.len; j++) {
					if (role.refuse[role.id[j]]) {
						return false;
					}
				}
				return true;
			})()) {
				return;
			}
			let tmp = role.id[i];
			for (let j = i; j < role.len - 1; j++) {
				role.id[j] = role.id[j + 1];
				role.ref[role.id[j]].style.left = role.addr[j].left + 'px';
				role.ref[role.id[j]].style.top = role.addr[j].top + 'px';
			}
			let k = role.len - 1;
			role.id[k] = tmp;
			role.ref[role.id[k]].style.left = role.addr[k].left + 'px';
			role.ref[role.id[k]].style.top = role.addr[k].top + 'px';
			i--;
		}
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
				downloadnamespan.innerHTML = data.downloadname;
				downloadbtn.value = data.download;
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
		downloadbtn.onclick = role.download;
		sortcard.onclick = role.sort;
	});
};