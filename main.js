import language from './language/language.js';
import role from './role.js';
let geturl = url2obj();

if (geturl.fbclid !== undefined) {
	delete geturl.fbclid;
	obj2url(geturl);
}

let data = await language.setting(geturl.lang);
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
maskallicon.value = data.maskallicon;
showallicon.value = data.showallicon;
downloadallpng.value = data.downloadallpng;
downloadalljpg.value = data.downloadalljpg;
movemodespan.innerHTML = data.movemode;
sortmovespan.innerHTML = data.sortmove;
swapmovespan.innerHTML = data.swapmove;

layout.ondragstart = () => false;

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
maskallicon.onclick = role.maskallicon;
showallicon.onclick = role.showallicon;
downloadallpng.onclick = role.downloadallpng;
downloadalljpg.onclick = role.downloadalljpg;
