const admin = require('firebase-admin');

const authenticationToken = async (req, res, next) => {
  try {
    const { authtoken } = req.headers;
    console.log(authtoken);
    if (authtoken) {
      const authUser = await admin.Auth().verifyIdToken(authtoken);
      console.log(authUser);
      req.uid = authUser.uid;
      next();
    } else {
      res.status(401).send('Unauthorized');
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
};
