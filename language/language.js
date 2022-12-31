let language = (() => {
	let mod = 'zh-Hant',
		reg = {},
		list = {
			'zh-Hant': "正體中文",
			'zh-Hans': "简体中文",
			'en': "English"
		};
	async function initial(slt) {
		if (slt !== undefined) {
			for (let key in list) {
				let lo = document.createElement("option");
				lo.value = key;
				lo.innerHTML = list[key];
				slt.append(lo);
			}
		}
		await setting('zh-Hant');
	}
	async function setting(languagename) {
		if (languagename in list) {
			mod = languagename;
		} else {
			mod = 'zh-Hant';
		}
		if (!(mod in reg)) {
			reg[mod] = Object.assign({}, reg['zh-Hant'], await loadfile('json', `language/${mod}.json`));
		}
		document.querySelector('html').lang = language.mod;
		return reg[mod];
	}
	return {
		reg: reg,
		initial: initial,
		setting: setting,
		get mod() {
			return mod;
		},
		set mod(m) {
			mod = m;
		}
	}
})();