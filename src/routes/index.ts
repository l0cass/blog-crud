import { Router } from 'express'
import { usersRouter } from './user.routes'
import { postsRouter } from './post.routes'

export const indexRouter = Router()

indexRouter.use('/posts', postsRouter)
indexRouter.use('/users', usersRouter)
