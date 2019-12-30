//google two-factor authenticator.
const express = require("express");
const router = express.Router();
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const TFA = require("../../models/TFA");

router.post("/setup", (req, res) => {
  const { email, domainName } = req.body;
  TFA.findOne({ email }).then(TFA => {
    if (TFA) return res.status(400).json({ msg: "TFA already exists" });
  });

  const secret = speakeasy.generateSecret({
    length: 10,
    name: email,
    issuer: "My Admin App"
  });
  var url = speakeasy.otpauthURL({
    secret: secret.base32,
    label: email,
    issuer: "domain name",
    encoding: 'base32'
});
  QRCode.toDataURL(url, (err, dataURL) => {
    const newTFA = new TFA({
      secret: secret.base32,
      dataURL: dataURL,
      TFAURL: url,
      email: email
    });
    newTFA
      .save()
      .then(data => res.json(data))
      .catch(err => res.status(400).json({ msg: err }));
  });
});

// @route   GET api/TFA/setup
// @desc    Get setup TFA for the user
// @access  Private
router.get("/setup", (req, res) => {
  const email = req.body;
  TFA.findOne(email).then(TFA => {
    if (!TFA)
      return res.status(400).json({ msg: "TFA document Does not exist" });
    let token = speakeasy.totp({
      secret: TFA.secret,
      encoding: "base32"
    });
    res.json({
      token,
      TFA
    });
  });
});

// @route   DELETE api/TFA/setup
// @desc    Delete a TFA document
// @access  Private
router.delete("/setup", (req, res) => {
  const email = req.body;

  TFA.findOne(email)
    .then(TFA => TFA.remove().then(() => res.json({ success: true })))
    .catch(err => res.status(404).json({ success: false, msg: err }));
});

router.post("/verify", (req, res) => {
  const { token, email } = req.body;

  TFA.findOne(email)
    .then(TFA => {
      let isVerified = speakeasy.totp.verify({
        secret: TFA.secret,
        encoding: "base32",
        token: token
      });

      if (isVerified) {
        return res.status(200).json({
          msg: "verification successfull"
        });
      }
    })
    .catch(err =>
      res.status(403).json({
        msg:
          "Invalid Auth Code, verification failed. Please verify the system Date and Time"
      })
    );
});

module.exports = router;
