import mongoose, { Document, ObjectId } from 'mongoose'

interface UserType extends Document {
  _id: ObjectId
  email: string
  password: string
  username: string
  posts: ObjectId[]

  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  softDelete(): Promise<void>
}

const userSchema = new mongoose.Schema<UserType>({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
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

userSchema.methods.softDelete = function (this: UserType) {
  this.deletedAt = new Date()
  return this.save()
}

export const UserModel = mongoose.model<UserType>('User', userSchema)
