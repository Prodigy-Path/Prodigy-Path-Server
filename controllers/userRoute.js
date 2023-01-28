const User = require('../models/User');



async function signUp(req, res, next){
  try{
    const data = req.body;
    const newUser = await User.create(data);
    res.status(201).send(newUser);
    console.log(newUser);
  }catch(e){
    next(e.message);
  }
}

module.exports = { signUp };