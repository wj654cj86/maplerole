var languagelist = {
	'zh-Hant': "正體中文",
	'zh-Hans': "简体中文",
	'en': "English"
};

var language = {
	mod: 'zh-Hant',
	reg: {},
	initial: function (languagename, callback) {
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
					language.reg[language.mod] = JSON.parse(str);
				}
			};
			callback(language.reg[language.mod]);
		});
	}
}