import { Router } from 'express'
import {
  getUsers,
  accessUser,
  createUser,
  deleteUser,
  getUserById,
} from '../handlers/user'

export const usersRouter = Router()

usersRouter.get('/', getUsers)
usersRouter.get('/:id', getUserById)

usersRouter.post('/access-user', accessUser)
usersRouter.post('/auth/create', createUser)
usersRouter.delete('/auth/delete', deleteUser)
