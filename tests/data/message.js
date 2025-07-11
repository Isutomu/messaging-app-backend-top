// Local Modules
const { userLogin, friendUserLogin1 } = require("./user");

module.exports.messages = [
  {
    sender: userLogin.username,
    receiver: friendUserLogin1.username,
    message: "hi! I'm a message 1!",
  },
  {
    sender: friendUserLogin1.username,
    receiver: userLogin.username,
    message: "hi! I'm a message 2!",
  },
  {
    sender: userLogin.username,
    receiver: friendUserLogin1.username,
    message: "hi! I'm a message 3!",
  },
  {
    sender: userLogin.username,
    receiver: friendUserLogin1.username,
    message: "hi! I'm a message 4!",
  },
];
