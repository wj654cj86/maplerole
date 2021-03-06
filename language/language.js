var language = (() => {
	let mod = 'zh-Hant',
		reg = {},
		list = {
			'zh-Hant': "正體中文",
			'zh-Hans': "简体中文",
			'en': "English"
		};
	function initial() {
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
				resolve(reg[mod]);
			});
		});
	}
	function modrt() {
		return mod;
	}
	return {
		reg: reg,
		initial: initial,
		setting: setting,
		modrt: modrt
	}
})();