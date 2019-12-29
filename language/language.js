var languagelist = {
	'zh-Hant': "正體中文",
	'zh-Hans': "简体中文",
	'en': "English"
};

var language = {
	reg: {},
	initial: function (languagename, callback) {
		generator(function* () {
			if (!(languagename in languagelist)) {
				languagename = 'zh-Hant';
			}
			let languagefilepath = 'language/' + languagename + '.json';
			yield {
				nextfunc: openfile,
				argsfront: [languagefilepath],
				cbfunc: function (str) {
					language.reg = JSON.parse(str);
				}
			};
			callback();
		});
	}
}