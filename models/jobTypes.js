const mongoose = require('mongoose');

const jobTypesSchema = mongoose.Schema ({
   typeName:String,
})

const JobTypes = mongoose.model('jobTypes', jobTypesSchema);

module.exports= JobTypes