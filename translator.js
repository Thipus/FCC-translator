const { text } = require('body-parser');
const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

//american-to-british
//british-to-american

class Translator {
    resolveAll(textEntry,localEntry){
        let translationResult
        
        if(textEntry==""){
            return ({ error: 'No text to translate' });
        }
        if(!textEntry || !localEntry){

            return ({error: 'Required field(s) missing'});
        }
        if(localEntry!="american-to-british" && localEntry!="british-to-american"){
            return ({ error: 'Invalid value for locale field' });
        }

        if (localEntry=="american-to-british"){
            translationResult=this.getTranslateAtoB(textEntry);
        }else{
            translationResult=this.getTranslateBtoA(textEntry);
        }
        console.log(translationResult)
        console.log(textEntry)

        if (translationResult==textEntry){
            
            return ({text:textEntry,translation: "Everything looks good to me!" });
        }else{
            return({text:textEntry,translation:translationResult})
        }
    }

    getTranslateAtoB(textEntry){
        var textEntryCorrected=textEntry.toLowerCase();
        var translated;
             
        Object.entries(americanOnly)
        .map(([key, value]) => {
            if (new RegExp(`${key} `, "gi").test(textEntryCorrected) ||
                new RegExp(`${key}[^A-Za-z]`, "gi").test(textEntryCorrected) ||
                new RegExp(`${key}$`, "gi").test(textEntryCorrected)) {

                    translated = textEntry.replace(new RegExp(key, "gi"), `<span class="highlight">${value}</span>`) || textEntry;
            }
        });
        translated=translated||textEntry;

        Object.entries(americanToBritishSpelling)
        .map(([key, value]) => {
            if (new RegExp(`${key} `, "gi").test(textEntryCorrected) ||
                new RegExp(`${key}[^A-Za-z]`, "gi").test(textEntryCorrected) ||
                new RegExp(`${key}$`, "gi").test(textEntryCorrected)) {

                    translated = textEntry.replace(new RegExp(key, "gi"), `<span class="highlight">${value}</span>`) || textEntry;
            }
        });
        translated=translated||textEntry;

        Object.entries(americanToBritishTitles) 
            .map(([key, value]) => {
                if (textEntryCorrected.includes(key)) {
                    translated = textEntry.replace(new RegExp(key, "gi"), `<span class="highlight">${this.capitalizeFirstLetter(value)}</span>`) || textEntry;
                }
            })
            translated=translated||textEntry;

        const changeTime = textEntryCorrected.match(/(([0-9]|0[0-9]|1[0-9]|2[0-3])(:)([0-5][0-9]))/g);
        if (changeTime) {
            changeTime.map(time => {
                translated = translated.replace(time, `<span class="highlight">${time.replace(':', '.')}</span>`) || textEntry;
            })
        }
        translated=translated||textEntry;

        return translated || textEntry;

    }

    getTranslateBtoA(textEntry){
        var textEntryCorrected=textEntry.toLowerCase();
        var translated;
             
        Object.entries(britishOnly)
        .map(([key, value]) => {
            if (new RegExp(`${key} `, "gi").test(textEntryCorrected) ||
                new RegExp(`${key}[^A-Za-z]`, "gi").test(textEntryCorrected) ||
                new RegExp(`${key}$`, "gi").test(textEntryCorrected)) {

                    translated = textEntry.replace(new RegExp(key, "gi"), `<span class="highlight">${value}</span>`) || textEntry;
            }
        });
        translated=translated||textEntry;

        Object.entries(this.InvertObject(americanToBritishSpelling))
        .map(([key, value]) => {
            if (new RegExp(`${key} `, "gi").test(textEntryCorrected) ||
                new RegExp(`${key}[^A-Za-z]`, "gi").test(textEntryCorrected) ||
                new RegExp(`${key}$`, "gi").test(textEntryCorrected)) {

                    translated = textEntry.replace(new RegExp(key, "gi"), `<span class="highlight">${value}</span>`) || textEntry;
            }
        });
        translated=translated||textEntry;

        Object.entries(this.InvertObject(americanToBritishTitles)) 
            .map(([key, value]) => {
                if (textEntryCorrected.includes(key)) {
                    translated = textEntry.replace(new RegExp(key, "gi"), `<span class="highlight">${this.capitalizeFirstLetter(value)}</span>`) || textEntry;
                }
            })
            translated=translated||textEntry;

        const changeTime = textEntryCorrected.match(/(([0-9]|0[0-9]|1[0-9]|2[0-3])(.)([0-5][0-9]))/g);
        if (changeTime) {
            changeTime.map(time => {
                translated = translated.replace(time, `<span class="highlight">${time.replace('.', ':')}</span>`) || textEntry;
            })
        }
        translated=translated||textEntry;

        return translated || textEntry;


    }

    capitalizeFirstLetter(word) {
        return word[0].toUpperCase() + word.slice(1);
    }

    InvertObject(obj) {
        return Object.entries(obj).reduce((acc, [key, value]) => (acc[value] = key, acc), {})
    }

}

module.exports = Translator;