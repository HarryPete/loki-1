import mongoose, { Schema } from "mongoose";

const batchSchema = new Schema(
    {
        title: 
        { 
            type: String
        },
        course:
        {
            type: Schema.Types.ObjectId,
            ref: 'Course'
        },
        mocks:
        [{  
            id:
            {
                type: Number, 
                required: true
            },
            quiz: 
            {
                type: Schema.Types.ObjectId,
                ref: 'Quiz'
            },
            results:
            [{
                type: Schema.Types.ObjectId,
                ref: 'Test'
            }],
            status:
            {
                type: String,
                enum: ['Locked', 'Unlocked'],
                default : 'Locked'
            },
            hide:
            {
                type: Boolean,
                default : false
            },
        }],
        enrollments:
        [{
            type: Schema.Types.ObjectId,
            ref: 'Enrollment'
        }],
        status:
        {
            type: String,
            enum: ['Upcoming', 'Ongoing', 'Completed'],
            default : 'Upcoming'
        },
        access:
        {
            type: Boolean,
            enum: [true, false],
            default : true
        },
        enrollmentStatus:
        {
            type: Boolean,
            enum: [true, false],
            default : false
        },
        sessions:
        [{
            type: Schema.Types.ObjectId,
            ref: 'Session'
        }],
        mentor: 
        {
            type: Schema.Types.ObjectId,
            ref: 'Mentor'
        },
        zoomLink:
        {
            type: String,
        },
        whatsappLink:
        {
            type: String,
        },
        startDate:
        {
            type: Date
        },
        endDate:
        {
            type: Date
        }
    },
    {
        timestamps: true
    }
)

export const Batch = mongoose.models?.Batch || mongoose.model('Batch', batchSchema) 