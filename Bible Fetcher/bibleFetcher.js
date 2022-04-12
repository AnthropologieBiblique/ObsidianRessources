<%* 

let regexBible = new RegExp(`Bible\/[^\/]+\/[^\/]+.md$`);

bible = (await tp.system.suggester((item) => "📖 "+item.basename, app.vault.getMarkdownFiles().filter(file => file.path.match(regexBible)), false, "📖 Choisir la bible à citer")).basename;

let regexBook = new RegExp(`Bible\/${bible}\/Livres\/[^\/]+\/[^\/]+`);

book = (await tp.system.suggester((item) => "📜 "+item.basename, app.vault.getMarkdownFiles().filter(file => file.path.match(regexBook)), false, "📜 Choisir le livre à citer"));

let regexVerse = new RegExp(`###### ([0-9]{0,3}[^ ]{0,2})[\r?\n](.{0,70})`,'g');

let bookText = String(await app.vault.read(book));

let verseInit = (await tp.system.suggester((item) => item[1]+" "+item[2]+" ...", [...bookText.matchAll(regexVerse)],false,"🎬 Choisir le verset de début"))[1];

let verseEnd = (await tp.system.suggester((item) => item[1]+" "+item[2]+" ...", [...bookText.matchAll(regexVerse)].filter(item => Number(item[1])>=Number(verseInit)),false,"🏁 Choisir le verset de fin"))[1];

let visible = (await tp.system.suggester(["✏️ Référence texte","👁 Encart visible"],[false, true],false,"Référence texte ou encart visible ?"));

if (!visible){
	var style = (await tp.system.suggester(["⚓️ Référence standardisée","🌍 Référence propre"],["standard", "local"],false,"Référence standardisée ou référence propre ?"));
} else {
	var style = "standard";
}

if (style == "standard"){
	var bookName = book.basename.replace(/^[^\ ]+\ /g,'');
} else {
	var bookName = [...bookText.matchAll(/aliases : [\r?\n]-\ (.+)/g)][0][1];
}

if (visible){
	bang = '!';
} else {
	bang = '';
}

if (verseInit == undefined || verseInit == null) {
	return;
} else if (verseInit == verseEnd) {
	return bang+"[["+book.basename+"#"+verseInit+"|"+bookName+","+verseInit+"]] ";
} else {
	return bang+"[["+book.basename+"#"+verseInit+"|"+bookName+","+verseInit+"]]"+bang+"[["+book.basename+"#"+verseEnd+"|"+"-"+verseEnd+"]] ";
}

%>