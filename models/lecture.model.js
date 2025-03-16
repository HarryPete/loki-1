import mongoose, { Schema } from "mongoose";

const lectureSchema = new Schema({
    title:
    {
        type: String,
        required: true
    },
    recording: String,
    modules:
    [
        {
            type: String,
            required: true
        }
    ]
},{timestamps: true})

export const Lecture = mongoose.models?.Lecture || mongoose.model('Lecture', lectureSchema)