import express from 'express'
import { FollowUser, Login, Logout, Register, UploadProfilePic, getFollowers } from '../../Controllers/UserControllers.js'
import { VerifyToken } from '../../VerifyToken/VerifyToken.js'
import { upload } from '../../Multer/multer.js'

export const userRouter = express.Router()

userRouter.get('/', (req, res) => res.json(`Server is running`))

userRouter.post('/register', Register)

userRouter.post('/login', Login)

userRouter.get('/logout', Logout)

userRouter.post('/followunfollowuser/:usertofollow', VerifyToken, FollowUser)

userRouter.get('/getfollowers/:targetuserid', VerifyToken, getFollowers)

userRouter.put('/updateprofilepic/:userid', VerifyToken, upload.single('file'), UploadProfilePic)