import { db } from "../ConnectDB/ConnectDB.js"

export const CreatePost = (req, res) => {
    const { description } = req.body
    const file = req.file

    const sql = "INSERT INTO posts (`owner`, `desc`, `img`) VALUE (?)"

    const values = [req.user, description, `http://localhost:8700/Public/Images/${file.filename}`]

    db.query(sql, [values], (err, data) => {
        if (err) res.json(err)
        else res.json({ Msg: `Post Created` })
    })

}


export const LikePost = (req, res) => {
    const { postid } = req.params

    const sql = "SELECT * FROM likes WHERE postid = ? AND likedby = ?"

    const values = [postid, req.user]

    db.query(sql, values, (err, result) => {
        if (err) res.json(err)
        else {

            if (result.length > 0) {
                const sqldelete = "DELETE FROM likes WHERE `postid` = ? AND `likedby` = ?"

                db.query(sqldelete, values, (err, data) => {
                    if (err) res.json(err)
                    else res.json({ Msg: "Post Unliked" })
                })
            }

            else {
                const sqlinsert = "INSERT INTO likes (`postid`, `likedby`) VALUES (?, ?)"
                db.query(sqlinsert, values, (err, dt) => {
                    if (err) res.json(err)
                    else res.json({ Msg: `Post liked` })
                })
            }
        }
    })

}


export const getPosts = (req, res) => {

    const sql = "SELECT posts.*, name AS ownername, ProfilePic FROM posts JOIN users ON(posts.owner = users.id) JOIN relationships ON(posts.owner = relationships.followinguserid) WHERE followeruserid = ? OR posts.owner = ?"

    db.query(sql, [req.user, req.user], (err, data) => {
        if (err) res.json(err)
        else {
            if (data.length) res.json({ Posts: data, Token: req.cookies.token })
        }
    })

}


export const ViewComments = (req, res) => {
    const { targetpostid } = req.params

    const sql = "SELECT comments.id AS CommentId, ProfilePic, name, comment, commentby FROM comments JOIN posts ON(comments.postid = posts.id) JOIN users ON(comments.commentby = users.id) WHERE posts.id = ?"

    db.query(sql, [targetpostid], (er, data) => {
        if (er) res.json(er)
        else res.json(data)
    })

}


export const AddComment = (req, res) => {
    const { targetpostid } = req.params
    const { newcomment } = req.body

    const sql = "INSERT INTO comments (`commentby`, `postid`, `comment`) VALUES (?, ?, ?)"

    db.query(sql, [req.user, targetpostid, newcomment], (err, data) => {
        if (err) res.json(err)
        else res.json({ Msg: "Comment added successfully" })

    })
}

export const EditComment = (req, res) => {
    const { commentid } = req.params
    const { updatedcomment } = req.body

    const ownerchecker = "SELECT * FROM comments WHERE commentby = ?"
    db.query(ownerchecker, [req.user], (er, dt) => {
        if (er) res.json(er)
        else {
            if (dt.length) {
                const sql = "UPDATE comments SET comment = ? WHERE id = ?"

                db.query(sql, [updatedcomment, commentid], (err, data) => {
                    if (err) res.json(err)
                    else res.json(`Comment updated`)

                })
            }
            else res.json(`Invalid request`)
        }
    })


}


export const DeleteComment = (req, res) => {
    const { commentid } = req.params
    const ownerchecker = "SELECT * FROM comments WHERE commentby = ?"

    db.query(ownerchecker, [req.user], (er, dt) => {
        if (er) res.json(er)
        else {
            if (dt.length) {
                const sql = "DELETE FROM comments WHERE id = ?"

                db.query(sql, [commentid], (err, data) => {
                    if (err) res.json(err)
                    else res.json(`Comment deleted`)

                })
            }
            else res.json(`Invalid request`)
        }
    })
}


export const ViewLikes = (req, res) => {
    const { targetpostid } = req.params

    const sql = "SELECT name, postid AS PostId FROM likes JOIN users ON(likes.likedby = users.id) WHERE likes.postid = ?"

    db.query(sql, [targetpostid], (err, data) => {
        if (err) res.json(err)
        else {
            if (data.length) res.json(data)
            else res.json(`No likeson this post`)
        }
    })

}


export const RemovePost = (req, res) => {
    const { postid } = req.params

    const sql = "SELECT * FROM posts WHERE id = ?"

    db.query(sql, [postid], (err, targetposts) => {
        if (err) res.json(err)
        else {
            const targetpost = targetposts[0]

            if (targetpost.owner = req.user) {
                const dquery = "DELETE FROM posts WHERE id = ?"

                db.query(dquery, [postid], (er, data) => {
                    if (er) res.json(er)
                    else res.json("Post deleted")
                })
            }

            else res.json(`Invalid request`)
        }
    })
}

export const EditPost = (req, res) => {

    const file = req.file
    const { postdescription } = req.body
    const { postid } = req.params

    const path = `http://localhost:8700/Images/${file.filename}`

    const sql = "UPDATE posts SET desc = ?, img = ?WHERE id = ?"

    db.query(sql, [postdescription, path, postid], (err, data) => {
        if (err) res.json(err)
        else res.json(`Post Updated`)
    })

}

export const EditPostData = (req, res) => {
    const { postid } = req.params

    const sql = "SELECT * FROM posts WHERE id = ?"

    db.query(sql, [postid], (err, data) => {
        if (err) res.json(err)
        else res.json({ TargetPost: data[0] })
    })

}
