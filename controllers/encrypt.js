const ursa = require('ursa');
const User = require('../models/User');

/**
 * GET /account
 * Profile page.
 */
exports.getEncryptionPage = (req, res) => {
  res.render('encrypt', {
    title: 'Encrypt a file'
  });
};

exports.postFile = (req, res, next) => {
  var keynick = req.body.keynick || '';
  var infile = req.file;

  if (!keynick.length)
    
  if (!infile)
    return req.flash('errors', { msg: 'Please upload a file to encrypt.' });

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }

    var key = undefined;
    for (var existingKey of user.keys)
      if (existingKey.nick === keynick)
        key = existingKey

    if (!key)
      return req.flash('errors', { msg: 'Please select and/or generate a key before encrypting files.' });

    var pub = ursa.createPublicKey(key.pubkey, 'base64');

    var outbuff = pub.encrypt(infile.buffer);

    res.set({"Content-Disposition":"attachment; filename=\"encrypted_" + infile.originalname + "\""});
    res.send(outbuff);
  });
};