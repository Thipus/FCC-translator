'use strict';

const Translator = require('../components/translator.js');
const translateStuff=new Translator();

//american-to-british
//british-to-american

module.exports = function (app) {
  
  app.route('/api/translate')
    .post((req, res) => {
      
      const textEntry=req.body.text;
      const localEntry=req.body.locale;
      
      res.send(translateStuff.resolveAll(textEntry,localEntry));
    });
};
