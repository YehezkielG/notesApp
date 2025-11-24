import { Schema, model, models, Document } from 'mongoose';
import dbConnect from '@/lib/mongoose';

export interface IUser extends Document {
    _id: Schema.Types.ObjectId;
    name?: string;
    email: string;
    emailVerified?: Date;
    image?: string;
    username?: string;
    displayName?: string;
    bio?: string;
    isOnboarded: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    followers?: Schema.Types.ObjectId[];
    following?: Schema.Types.ObjectId[];
}

const UserSchema = new Schema<IUser>({
    name: String,
    email: {
        type: String,
        unique: true,
    },
    emailVerified: Date,
    image: String,
    username: {
        type: String,
        unique: true,
        sparse: true,
    },
    displayName: String,
    bio: {
        type: String,
        maxlength: 160, // Batasi 160 karakter, seperti Twitter
      },
    isOnboarded: {
        type: Boolean,
        default: false,
    },  
}, {
    timestamps: true,
});

UserSchema.add({
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
});


const User = models.User || model<IUser>('User', UserSchema);

export default User;