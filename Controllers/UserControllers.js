import { db } from "../ConnectDB/ConnectDB.js"
import jwt from 'jsonwebtoken'

export const Register = (req, res) => {
    const { name, email, pwd, city } = req.body

    const sql = "SELECT * FROM users WHERE email = ?"

    db.query(sql, [email], (err, data) => {
        if (err) res.json(err)
        else {
            if (data.length) res.json(`User is already registered`)
            else {
                const sql2 = "INSERT INTO users (`name`, `email`, `password`, `city`) VALUE (?)"

                const values = [name, email, pwd, city]

                db.query(sql2, [values], (err, data2) => {
                    if (err) res.json(err)
                    else res.json(`User registered successfully`)
                })
            }
        }
    })

}


export const Login = (req, res) => {
    const { email, pwd } = req.body

    const sqll = "SELECT * FROM users WHERE email = ?"

    db.query(sqll, [email], (err, data) => {
        if (err) res.status(500).json(err)
        else {
            if (data.length) {
                if (data[0].password === pwd) {

                    const token = jwt.sign({ id: data[0].id }, "jsk", { expiresIn: "24h" })

                    res.cookie('token', token).json({ LoggedIn: true, Msg: "Logged In Successfully", Token: token, LoggedUser: data })

                }
                else res.json("Incorrect Password")
            }
            else res.json("No Record Found")
        }
    })


}


export const Logout = (req, res) => res.clearCookie('token').json('User Logged Out')

export const FollowUser = (req, res) => {
    const { usertofollow } = req.params

    const sql = "SELECT * FROM users AS u JOIN relationships AS r ON(u.id = r.followinguserid) WHERE followeruserid = ? AND followinguserid = ?"

    db.query(sql, [req.user, usertofollow], (err, data) => {
        if (err) res.json(err)
        else {
            if (data.length) {
                const delsql = "DELETE FROM relationships WHERE followinguserid = ?"

                db.query(delsql, [usertofollow], (er, result) => {
                    if (er) res.json(er)
                    else res.json({ Msg: `Unfollowed user ${data[0].name}` })
                })
            }
            else {
                const addsql = "INSERT INTO relationships (`followeruserid`, `followinguserid`) VALUES (?, ?)"
                db.query(addsql, [req.user, usertofollow], (errr, dtt) => {
                    if (errr) res.json(errr)
                    else res.json({ Msg: `Followed user` })
                })
            }
        }

    })
}

export const getFollowers = (req, res) => {
    const { targetuserid } = req.params

    const checkfollowsql = "SELECT * FROM relationships AS r JOIN users AS u ON(u.id = r.followinguserid) WHERE followeruserid = ? AND  followinguserid = ?"

    db.query(checkfollowsql, [req.user, targetuserid], (er, result) => {
        if (er) res.json(er)
        else {
            if (result.length) {

                const sql = "SELECT u.name AS username, r.followeruserid AS followerids FROM relationships AS r JOIN users as u ON(u.id = r.followinguserid) WHERE followinguserid = ?"

                db.query(sql, [targetuserid], (err, data) => {
                    if (err) res.json(err)
                    else {
                        if (data.length) res.json({ Msg: `${data[0].username} has ${data.length} followers`, FollowerIDs: data.map((ele) => ele.followerids) })
                        else res.json(`User doesn't have any followers yet`)
                    }
                })

            }
            else {
                const q = "SELECT * FROM users WHERE id = ?"
                db.query(q, [targetuserid], (errr, dtt) => {
                    if (errr) res.json(errr)
                    else res.json(`Follow ${dtt[0].name} to view ${dtt[0].name}'s  followers`)

                })
            }
        }
    })

}

export const UploadProfilePic = (req, res) => {
    const { userid } = req.params
    const file = req.file

    if (userid != req.user) res.json(`Invalid request`)
    else {

        const sql = "UPDATE users SET ProfilePic = ? WHERE id = ?"

        db.query(sql, [`http://localhost:8700/Images/${file.filename}`, userid], (err, result) => {
            if (err) res.json(err)
            else res.json(`DP updated`)

        })
    }
}


