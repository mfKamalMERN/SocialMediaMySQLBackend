import jwt from 'jsonwebtoken'

export const VerifyToken = (req, res, next) => {
    const token = req.cookies.token
    if (!token) res.json("Missing Token")
    else {
        jwt.verify(token, "jsk", (err, decoded) => {
            if (err) res.json(err)
            else {
                req.user = decoded.id
                next()
            }
        })
    }
}