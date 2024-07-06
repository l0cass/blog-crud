import { Router } from 'express'
import {
  createPost,
  deletePost,
  getPosts,
  getPostsById,
} from '../handlers/post'

export const postsRouter = Router()

postsRouter.get('/', getPosts)
postsRouter.get('/:id', getPostsById)

postsRouter.post('/create', createPost)
postsRouter.delete('/delete', deletePost)
