import { model, Schema } from 'mongoose';
import { TPreviousPassword, TUser } from './user.interface';
import { userRoles } from './user.constant';

const previousPasswordSchema = new Schema<TPreviousPassword>(
    {
        password: {
            type: String,
            required: true,
        },
        timestamp: {
            type: Date,
            required: true,
        },
    },
    {
        _id: false,
    },
);

const userSchema = new Schema<TUser>(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            select: 0,
        },
        role: {
            type: String,
            enum: userRoles,
            required: true,
        },
        previousPasswords: {
            type: [previousPasswordSchema],
            default: [],
            select: 0,
        },
        passwordChangedAt: {
            type: Date,
            select: 0,
        },
    },
    {
        timestamps: true,
    },
);

userSchema.post('save', function (doc, next) {
    doc.password = undefined;
    doc.passwordChangedAt = undefined;
    doc.previousPasswords = undefined;
    next();
});

export const User = model<TUser>('User', userSchema);
