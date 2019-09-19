const jwt = require('jsonwebtoken');
const secret = 'd41d8cd98f00b204e9800998ecf8427e';

const authorize = function(req, res, next) {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers['x-access-token'] ||
    req.cookies.token;

  if (!token) {
    res.status(401).send('Unauthorized: No token provided');
  } else {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        res.status(401).send('Unauthorized: Invalid token');
      } else {
        req.user = decoded.payload;
        next();
      }
    });
  }
}

module.exports = authorize;