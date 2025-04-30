import mongoose, { Schema } from "mongoose";

const graduateSchema = new Schema({
    enrollments:
    [{
        type: Schema.Types.ObjectId,
        ref: 'Enrollment'
    }],
    course:
    {
        type: Schema.Types.ObjectId,
        ref: 'Course'
    },
    month:
    {
        type: String,
        required: true
    },
    year:
    {
        type: String,
        required: true
    }
},
{
    timestamps:true
})

export const Graduate = mongoose.models?.Graduate || mongoose.model('Graduate', graduateSchema)