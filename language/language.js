var language = (() => {
	let mod = 'zh-Hant',
		reg = {},
		list = {
			'zh-Hant': "正體中文",
			'zh-Hans': "简体中文",
			'en': "English"
		};
	function initial(slt) {
		if (slt !== undefined) {
			for (let key in list) {
				let lo = document.createElement("option");
				lo.value = key;
				lo.innerHTML = list[key];
				slt.append(lo);
			}
		}
		return setting('zh-Hant');
	}
	function setting(languagename) {
		return new Promise((resolve, reject) => {
			if (languagename in list) {
				mod = languagename;
			} else {
				mod = 'zh-Hant';
			}
			openfile('language/' + mod + '.json', (str) => {
				reg[mod] = {};
				Object.assign(reg[mod], reg['zh-Hant'], JSON.parse(str));
				document.getElementsByTagName('html')[0].lang = language.mod;
				resolve(reg[mod]);
			});
		});
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