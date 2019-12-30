var languagelist = {
	'zh-Hant': "正體中文",
	'zh-Hans': "简体中文",
	'en': "English"
};

var language = {
	mod: 'zh-Hant',
	reg: {},
	initial: function (callback) {
		language.setting('zh-Hant', callback);
	},
	setting: function (languagename, callback) {
		generator(function* () {
			if (languagename in languagelist) {
				language.mod = languagename;
			} else {
				language.mod = 'zh-Hant';
			}
			let languagefilepath = 'language/' + language.mod + '.json';
			yield {
				nextfunc: openfile,
				argsfront: [languagefilepath],
				cbfunc: function (str) {
					language.reg[language.mod] = {};
					Object.assign(language.reg[language.mod], language.reg['zh-Hant'], JSON.parse(str));
				}
			};
			callback(language.reg[language.mod]);
		});
	}
}