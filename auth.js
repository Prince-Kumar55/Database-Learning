function auth(req, res, next) {
    const {token} = req.headers;
    const decodedData = jwt.verify(token, JWT_SECRET);
    if(decodedData) {
        req.userId = decodedData.id;
        next(); 
    } else {
        res.status(403).json({
        message: "incrroect credentials"
        });
        }
    }

    module.exports =  {
        auth
    };