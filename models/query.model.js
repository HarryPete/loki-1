import mongoose, { Schema } from "mongoose";

const querySchema = new Schema({
    name:
    {
        type: String,
        required: true
    },
    email:
    {
        type: String,
        required: true
    },
    contact:
    {
        type: String,
        required: true
    },
    message:
    {
        type: String,
        required: true
    },
    status:
    {
        type: String,
        enum: ['Pending', 'Resolved'],
        default : 'Pending'
    }
},
{
    timestamps: true
})

export const Query = mongoose.models?.Query || mongoose.model('Query', querySchema)