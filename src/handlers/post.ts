import { Request, Response } from 'express'
import { PostModel } from '../Schemas/Post.schema'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { UserModel } from '../Schemas/User.schema'

// GET Posts
export async function getPosts(req: Request, res: Response) {
  const token = req.headers.authorization?.split(' ')[1] as string

  try {
    if (!token) return res.status(401).send('Unauthorized')

    jwt.verify(token, process.env.JWT_SECRET!)

    return res
      .status(200)
      .json({ posts: await PostModel.find({ deletedAt: null }) })
  } catch (error: any) {
    if (error.name === 'TokenExpiredError')
      return res.status(401).send('Unauthorized')

    console.error('Error getting posts:', error)
    return res.status(500).send({ error: 'Internal server error' })
  }
}

// GET Post by ID
export async function getPostsById(req: Request, res: Response) {
  const { id } = req.params
  const token = req.headers.authorization?.split(' ')[1] as string

  try {
    if (!token) return res.status(401).send('Unauthorized')

    jwt.verify(token, process.env.JWT_SECRET!)

    const user = await UserModel.findById(id)
    if (!user) return res.status(404).send('User not found')

    const posts = await PostModel.find({ author: id, deletedAt: null })

    return res.status(200).json(posts)
  } catch (error: any) {
    if (error.name === 'TokenExpiredError')
      return res.status(401).send('Unauthorized')
  }
}

// POST Post
export async function createPost(
  req: Request<{}, {}, { title: string; article: string }>,
  res: Response
) {
  const { title, article } = req.body
  const token = req.headers.authorization?.split(' ')[1] as string

  try {
    if (!title.trim() || !article.trim())
      return res.status(400).send('Bad request')

    const payload = jwt.decode(token) as JwtPayload | null
    if (!payload) return res.status(401).send('Unauthorized')

    const user = await UserModel.findById(payload?.id)
    if (!user) return res.status(404).send('User not found')

    const newPost = await PostModel.create({
      title,
      article,
      author: payload?.id,
    })

    user.posts.push(newPost._id)
    await user.save()

    return res.status(200).send('Post created successfully')
  } catch (error: any) {
    if (error.name === 'TokenExpiredError')
      return res.status(401).send('Unauthorized')
  }
}

// DELETE Post
export async function deletePost(req: Request, res: Response) {
  const { id } = req.body
  const token = req.headers.authorization?.split(' ')[1] as string

  try {
    if (!id.trim()) return res.status(400).send('Bad request')

    const payload = jwt.decode(token) as JwtPayload | null
    if (!payload) return res.status(401).send('Unauthorized')

    const user = await UserModel.findById(payload?.id)
    if (!user) return res.status(404).send('User not found')

    const post = await PostModel.findById(id)
    if (!post) return res.status(404).send('Post not found')

    if (post.author.toString() !== user._id.toString())
      return res.status(401).send('Unauthorized')

    await post.softDelete()

    return res.status(200).send('Post deleted successfully')
  } catch (error: any) {
    if (error.name === 'TokenExpiredError')
      return res.status(401).send('Unauthorized')
  }
}
