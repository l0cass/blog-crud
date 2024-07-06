import { Request, Response } from 'express'
import { UserModel } from '../Schemas/User.schema'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// GET Users
export async function getUsers(_req: Request, res: Response) {
  try {
    const users = await UserModel.find(
      { deletedAt: null },
      { username: true, email: true }
    )
    return res.status(200).json(users)
  } catch (error) {
    console.error('Error getting users:', error)
    return res.status(500).send({ error: 'Internal server error' })
  }
}

// GET User by ID
export async function getUserById(req: Request, res: Response) {
  const { id } = req.params

  if (!id.trim())
    return res.status(400).send('Bad request: missing required fields')

  try {
    const user = await UserModel.findById(id)
    if (!user) return res.status(404).send('User not found')

    return res.status(200).json(user)
  } catch (error) {
    console.error('Error getting user:', error)
    return res.status(500).send({ error: 'Internal server error' })
  }
}

// CREATE User
export async function createUser(
  req: Request<{}, {}, { email: string; username: string; password: string }>,
  res: Response
) {
  const { email, username, password } = req.body

  if (!email.trim() || !username.trim() || !password.trim())
    return res.status(400).send('Bad request: missing required fields')

  try {
    const user = await UserModel.findOne({ email })
    if (user) return res.status(400).send('Email already in use')

    const salt = await bcrypt.genSalt(10)
    const encryptedPassword = await bcrypt.hash(password, salt)

    const newUser = await UserModel.create({
      email,
      username,
      password: encryptedPassword,
    })

    return res.status(201).json(newUser)
  } catch (error) {
    console.error('Error creating user:', error)
    return res.status(500).send({ error: 'Internal server error' })
  }
}

// DELETE User
export async function deleteUser(
  req: Request<{}, {}, { email: string; password: string }>,
  res: Response
) {
  const { email, password } = req.body

  if (!email.trim() || !password.trim())
    return res.status(400).send('Bad request: missing required fields')

  try {
    const user = await UserModel.findOne({ email })
    if (!user) return res.status(404).send('User not found')

    const match = await bcrypt.compare(password, user.password!)
    if (!match) return res.status(401).send('Incorrect password provided')

    await user.softDelete()
    return res.status(200).send('User deleted successfully')
  } catch (error) {
    console.error('Error deleting user:', error)
    return res.status(500).send({ error: 'Internal server error' })
  }
}

// CREATE Access User by JWT token
export async function accessUser(
  req: Request<{}, {}, { email: string; password: string }>,
  res: Response
) {
  const { email, password } = req.body

  if (!email.trim() || !password.trim())
    return res.status(400).send('Bad request: missing required fields')

  try {
    const user = await UserModel.findOne({ email })
    if (!user) return res.status(404).send('User not found')

    const match = await bcrypt.compare(password, user.password!)
    if (!match) return res.status(401).send('Incorrect password provided')

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '10m',
    })

    return res.status(200).send({ user, token })
  } catch (error) {
    console.error('Error logging in user:', error)
    return res.status(500).send({ error: 'Internal server error' })
  }
}
