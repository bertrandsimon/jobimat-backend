const mongoose = require('mongoose');

const templateSchema = mongoose.Schema ({
   globalDesc: String,
   missions: Array,
   profil: Array,
   templateName: String,
})

const Template = mongoose.model('templates', templateSchema);

module.exports= Template