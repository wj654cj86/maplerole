var root = document.documentElement;
var geturl = url2array();
var role = (function () {
	let linelen = 8,
		line = 8,
		id = [],
		addr = [],
		ref = [],
		len = 0,
		hismaxlen = 0,
		w = 0,
		h = 0,
		download = document.createElement('canvas');
	function setseat(i) {
		ref[id[i]].main.style.left = addr[i].left + 'px';
		ref[id[i]].main.style.top = addr[i].top + 'px';
	}
	function loadroleimg() {
		generator(function* () {
			for (let i = 0; i < len; i++) {
				let node = ref[i].main;
				if (node.parentNode) {
					node.parentNode.removeChild(node);
				}
			}

			linelen = Number(cardlinelen.value);
			if (typeof linelen != 'number') linelen = 8;
			linelen = Math.floor(linelen);
			if (linelen < 1) linelen = 1;
			if (linelen > 20) linelen = 20;

			yield {
				nextfunc: card.loadroleimg,
				cbfunc: function () { }
			};

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
					layout.appendChild(ref[cnt].main);
					cnt++;
				}
			}
			for (; cnt < len; cnt++) {
				ref[cnt] = card.newnullstyle();
				setseat(cnt);
				layout.appendChild(ref[cnt].main);
			}

			layout.onmousedown = function (event) {
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
				ref[id[nowid]].main.style.transition = 'all 0s';
				ref[id[nowid]].main.style.zIndex = 10;
				window.onmousemove = function (event) {
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
				window.onmouseup = function () {
					setseat(nowid);
					ref[id[nowid]].main.style.transition = 'all 300ms';
					ref[id[nowid]].main.style.zIndex = 3;
					window.onmousemove = function () { };
					window.onmouseup = function () { };
				};
			};
		});
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
		for (let i = 0; i < len; i++) {
			if (ref[id[i]].jobname == 'card') {
				ref[id[i]].cross.click();
			}
		}
	}
	function forwardlab() {
		let unused = [];
		let other = [];
		let lab = [];
		for (let i = 0; i < len; i++) {
			if (ref[id[i]].use) {
				if (ref[id[i]].jobname == 'lab') {
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
				if (ref[id[i]].jobname == 'lab') {
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
				let node = ref[id[i]].main;
				if (node.parentNode) {
					node.parentNode.removeChild(node);
				}
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
				layout.appendChild(ref[id[i]].main);
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
				layout.appendChild(ref[cnt].main);
			}
		}
	}
	function maskalldamage() {
		for (let i = 0; i < len; i++) {
			if (ref[i].damage && !ref[i].damagemask) {
				ref[i].damagebt.click();
			}
		}
	}
	function showalldamage() {
		for (let i = 0; i < len; i++) {
			if (ref[i].damage && ref[i].damagemask) {
				ref[i].damagebt.click();
			}
		}
	}
	function maskallname() {
		for (let i = 0; i < len; i++) {
			if (ref[i].name && !ref[i].namemask) {
				ref[i].namebt.click();
			}
		}
	}
	function showallname() {
		for (let i = 0; i < len; i++) {
			if (ref[i].name && ref[i].namemask) {
				ref[i].namebt.click();
			}
		}
	}
	function mergeimg(canvas) {
		if (len == 0) return;
		let ctx = canvas.getContext('2d');
		canvas.setAttribute('width', w);
		canvas.setAttribute('height', h);
		ctx.fillStyle = "#444";
		ctx.fillRect(0, 0, w, h);
		for (let i = 0; i < len; i++) {
			let r = ref[id[i]];
			let cardimg;
			if (r.use) {
				cardimg = r.card;
			} else {
				cardimg = r.nullcard;
			}
			ctx.drawImage(
				cardimg,
				addr[i].left,
				addr[i].top
			);
			if (r.use) {
				if (r.namemask) {
					ctx.drawImage(
						card.name,
						addr[i].left,
						addr[i].top
					);
					ctx.drawImage(
						r.jobicon,
						addr[i].left + 14,
						addr[i].top + 151
					);
				}
				if (r.jobname != 'lab' && r.damagemask) {
					ctx.drawImage(
						card.damage,
						addr[i].left,
						addr[i].top
					);
				}
			}
		}
	}
	function downloadallpng() {
		mergeimg(download);
		download.toBlob(function (blob) {
			let url = URL.createObjectURL(blob);
			startDownload(url, 'roleall.png');
		});
	}
	function downloadalljpg() {
		mergeimg(download);
		download.toBlob(function (blob) {
			let url = URL.createObjectURL(blob);
			startDownload(url, 'roleall.jpg');
		}, 'image/jpeg', Number(jpgquality.value));
	}
	return {
		loadroleimg: loadroleimg,
		maskalldamage: maskalldamage,
		showalldamage: showalldamage,
		maskallname: maskallname,
		showallname: showallname,
		sort: sort,
		delunknown: delunknown,
		forwardlab: forwardlab,
		backwardlab: backwardlab,
		linedec: linedec,
		lineinc: lineinc,
		downloadallpng: downloadallpng,
		downloadalljpg: downloadalljpg
	};
})();

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
				delunknown.value = data.delunknown;
				forwardlab.value = data.forwardlab;
				backwardlab.value = data.backwardlab;
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
		loadbtn.onclick = role.loadroleimg;
		maskalldamage.onclick = role.maskalldamage;
		showalldamage.onclick = role.showalldamage;
		maskallname.onclick = role.maskallname;
		showallname.onclick = role.showallname;
		sortcard.onclick = role.sort;
		delunknown.onclick = role.delunknown;
		forwardlab.onclick = role.forwardlab;
		backwardlab.onclick = role.backwardlab;
		cardlinedec.onclick = role.linedec;
		cardlineinc.onclick = role.lineinc;
		downloadallpng.onclick = role.downloadallpng;
		downloadalljpg.onclick = role.downloadalljpg;
	});
};