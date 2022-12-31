let mod = 'zh-Hant',
	reg = {},
	list = {
		'zh-Hant': "正體中文",
		'zh-Hans': "简体中文",
		'en': "English"
	};

async function setting(languagename) {
	if (languagename in list) {
		mod = languagename;
	} else {
		mod = 'zh-Hant';
	}
	if (!(mod in reg)) {
		reg[mod] = Object.assign({}, reg['zh-Hant'], await loadfile('json', `language/${mod}.json`));
	}
	document.querySelector('html').lang = mod;
	return reg[mod];
}

await setting('zh-Hant');

export default {
	reg,
	setting,
	get mod() { return mod; },
	set mod(m) { mod = m; }
}
