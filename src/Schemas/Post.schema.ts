import mongoose, { Document, ObjectId } from 'mongoose'

interface PostType extends Document {
  _id: ObjectId
  title: string
  article: string
  author: ObjectId
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  softDelete(): Promise<void>
}

const postSchema = new mongoose.Schema<PostType>({
  title: {
    type: String,
    required: true,
  },
  article: {
    type: String,
    required: true,
  },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
})

postSchema.methods.softDelete = function (this: PostType) {
  this.deletedAt = new Date()
  return this.save()
}

export const PostModel = mongoose.model<PostType>('Post', postSchema)
