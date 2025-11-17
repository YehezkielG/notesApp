import { Schema, model, models, Document } from 'mongoose';

export interface IUser extends Document {
    name?: string;
    email: string;
    emailVerified?: Date;
    image?: string;
    username?: string;
    displayName?: string;
    gender?: string;
    bio?: string;
    isOnboarded: boolean;
    createdAt?: Date;
    updatedAt?: Date;
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
    gender: String,
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

const User = models.User || model<IUser>('User', UserSchema);

export default User;