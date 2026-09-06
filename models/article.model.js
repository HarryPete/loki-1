import mongoose, { Schema } from "mongoose";

const articleSchema = new Schema(
    {
        title:
        {
            type: String,
            required: true
        },
        author:
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        pages:
        {
            type: [Schema.Types.Mixed],
            default: []
        }
    },
    {
        timestamps: true
    }
)

export const Article = mongoose.models?.Article || mongoose.model('Article', articleSchema)