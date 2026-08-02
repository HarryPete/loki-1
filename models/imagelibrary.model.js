import mongoose, { Schema } from "mongoose";

const imagelibrarySchema = new Schema({
    url:
    {
        type: String
    },
    folder:
    {
        type: String
    },
    publicId:
    {
        type: String
    }
},
{
    timestamps: true
})

export const Imagelibrary = mongoose.models?.Imagelibrary || mongoose.model('Imagelibrary', imagelibrarySchema)