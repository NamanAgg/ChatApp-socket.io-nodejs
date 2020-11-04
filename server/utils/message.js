const moment = require('moment');

function generateMessage(from,text){
  return{
    from,
    text,
    createdAt:moment.valueOf()
  };
};
module.exports.generateMessage=generateMessage;

let generateLocationMessage = (from, lat, lng) => {
  return {
    from,
    url: `https://www.google.com/maps?q=${lat}, ${lng}`,
    createdAt: moment().valueOf()
  }
}

module.exports.generateLocationMessage=generateLocationMessage;
