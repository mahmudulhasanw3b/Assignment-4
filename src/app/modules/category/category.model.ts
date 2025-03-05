import { model, Schema } from 'mongoose';
import { TCategory } from './category.interface';

const categorySchema = new Schema<TCategory>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    },
);

export const Category = model<TCategory>('Category', categorySchema);
