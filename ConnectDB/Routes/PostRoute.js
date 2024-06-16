import express from 'express'
import { VerifyToken } from '../../VerifyToken/VerifyToken.js'
import { AddComment, CreatePost, DeleteComment, EditComment, EditPost, EditPostData, LikePost, RemovePost, ViewComments, ViewLikes, getPosts } from '../../Controllers/PostControllers.js'
import { upload } from '../../Multer/multer.js'

export const postRouter = express.Router()

postRouter.post('/createpost', VerifyToken, upload.single('file'), CreatePost)

postRouter.post('/likepost/:postid', VerifyToken, LikePost)

postRouter.get('/getposts', VerifyToken, getPosts)

postRouter.put('/editpost/:postid', VerifyToken, upload.single('file'), EditPost)

postRouter.get('/editpostdata/:postid', VerifyToken, EditPostData)

postRouter.get('/viewcomments/:targetpostid', VerifyToken, ViewComments)

postRouter.get('/viewlikes/:targetpostid', VerifyToken, ViewLikes)

postRouter.post('/addcomment/:targetpostid', VerifyToken, AddComment)

postRouter.put('/editcomment/:commentid', VerifyToken, EditComment)

postRouter.delete('/deletecomment/:commentid', VerifyToken, DeleteComment)

postRouter.delete('/removepost/:postid', VerifyToken, RemovePost)