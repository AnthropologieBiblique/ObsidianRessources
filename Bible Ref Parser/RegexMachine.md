<%* 

function connector(symbol){
    return "\\s?"+symbol+"\\s?"
}

function orRegex(regex1,regex2){
    return "("+regex1+"|"+regex2+")"
}

function opRegex(regex){
    return "("+regex+")?"
}

function namedRegex(name,regex){
    return "(?<"+name+">"+regex+")"
}

function verse(number){
    let name = "VERSE"+number
    return namedRegex(name,"\\d{1,4}[a-z]?")
}

function chapter(number){
    let name = "CHAPTER"+number
    return namedRegex(name,"\\d{1,4}[a-z]?")
}

function chapterSimple(number,c2v){
    let chapterNumber = number
    let verseNumber = number+"1"
    let name = "CHAPTER_SIMPLE"+number
    let regex = chapter(chapterNumber)+connector(c2v)+verse(verseNumber)
    return namedRegex(name,regex)
}

function chapterRange(number,c2v,cr){
    let init = number+"1"
    let end = parseInt(init)+1
    let name = "CHAPTER_RANGE"+number
    let regex = chapterSimple(init,c2v)+connector(cr)+chapterSimple(end.toString(),c2v)
    return namedRegex(name,regex)
}

function verseRange(number,vr){
    let init = number+"1"
    let end = parseInt(init)+1
    let name = "VERSE_RANGE"+number
    let regex = verse(init)+connector(vr)+verse(end)
    return namedRegex(name,regex)
}

function verseBlock(number,iterations,v2v){
    let start = number+"1"
    let name = "VERSE_BLOCK"+number
    let regex = verse(start)
    for (let i = 0; i < iterations; i++) {
        inumber = parseInt(start)+i+1
        regex += opRegex(connector(v2v)+verse(inumber.toString()))
    }
    return namedRegex(name,regex)
}

function chapterBlock(number,c2v,v2v,vr){
    let verseRangeNumber = number+"1"
    let verseBlockNumber = parseInt(verseRangeNumber)+1
    let name = "CHAPTER_BLOCK"+number
    let regex = chapter(number)+connector(c2v)+orRegex(verseRange(verseRangeNumber,connector(vr)),verseBlock(verseBlockNumber.toString(),8,connector(v2v)))
    return namedRegex(name,regex)
}

function bookBlock(book, connectors){
    let start = "1"
    let name = "BOOK_BLOCK"
    let regex1 = book+connectors.b2c
    let regex2 = chapterRange(1,connectors.c2v,connectors.vr)
    let regex3 = chapterBlock(2,connectors.c2v,connectors.v2v,connectors.vr)
    let regex = regex1+orRegex(regex2,regex3)
    let bookRegex = namedRegex(name,regex)
    return new RegExp(bookRegex)
}

let connectors = {b2c:" ", c2c:";",c2v:",",v2v:"\\.",cr:"-",vr:"-"};
let test = chapterRange("1",",","-")
let test2 = verseRange("11","-")
let test3 = verseBlock("11",8,"\\.")
let test4 = chapterBlock("1",",","\\.","-")
let book = bookBlock("Jn",connectors)
console.log(book)

%>