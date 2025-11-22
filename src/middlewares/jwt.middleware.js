import jwt from "jsonwebtoken";

const jwtAuth = (req, res, next) => {
    // 1. Read the token
    // console.log(token);
    // console.log(req.headers);
    const token = req.headers['authorization'];
    console.log(token);

    // 2. Check if no token, return error
    if(!token) {
        return res.status(401).send("Unauthorized");
    }

    // 3. Verify token
    try {
        const payload = jwt.verify(token, "QS0E7BxFK43MsuG5lhvsSk2XIWsi5JkH");
        console.log(payload);
        req.userId = payload.userId;
    } catch(err) {
        return res.status(401).send("Unauthorized");
    }

    // 4. If verification fails, return error

    // 5. Call next
    next();
}

export default jwtAuth;