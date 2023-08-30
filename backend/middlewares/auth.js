const { responseStatus } = require("../constants");

const requireAuth = async (req, res, next) => {
    const token = await getAuth().verifyIdToken(req.headers.token)

    if (!token) {
        return res.status(401).json({
            status: responseStatus.unauth,
            message: "Unauthorization"
        })
    }

    req.uid = token.uid;
    next();
}

module.exports = requireAuth