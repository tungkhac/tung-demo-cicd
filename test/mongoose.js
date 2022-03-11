// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.set("debug", true);
mongoose.set("useCreateIndex", true);
mongoose.set("useNewUrlParser", true);

module.exports = mongoose;
