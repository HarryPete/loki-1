import { Course } from "@/models/course.model.js";
import { Batch } from "../models/batch.model.js"; 
import { User } from "@/models/user.model.js";
import { Session } from "@/models/session.model.js";
import { Mentor } from "@/models/mentor.model.js";
import { Feedback } from "@/models/feedback.model.js";
import { Enrollment } from "@/models/enrollment.model.js";
import { Lecture } from "@/models/lecture.model.js";
import { Test } from "@/models/test.model.js";
import { Quiz } from "@/models/quiz.model.js";
import { Graduate } from "@/models/graduate.model.js";

class batchService
{
    async addNewBatch(title, course, mentor, startDate, endDate)
    {
        try
        {
            const newBatch = await Batch.create({title, course, mentor, startDate, endDate})
            await newBatch.save()
            return newBatch
        }
        catch(error)
        {
            console.log(error)
            throw new Error(error.message)
        }
    }

    async findById(title)
    {
        try
        {
            const batch = await Batch.findOne({title})
            .populate({path: 'course', model: Course, populate:[{path: 'feedbacks', model: Feedback}, { path: 'mocks', model: Quiz}]})
            .populate({path: 'enrollments', model: Enrollment, populate: [{path: 'user', model: User}, {path: 'graduationBatch', model: Graduate}, {path: 'mocks', model: Test}]})
            .populate({path: 'sessions', model: Session, populate: {path: 'lecture', model: Lecture}})
            .populate({path: 'mentor', model: Mentor})
            .populate({path: 'mocks', populate: [{ path: 'results', model: Test, populate: {path: 'enrollment', model: Enrollment, populate: {path: 'user', model: User}}}, { path: 'quiz', model: Quiz}] })
            return batch 
        } 
        catch(error)
        {
            throw error
        }
    }

    async updateBatchAccess(batchId, access)
    {
        try
        {
            return await Batch.findByIdAndUpdate(batchId, {$set : {access}});
        }
        catch(error)
        {
            throw error
        }
    }

    async updateBatchEnrollmentStatus(batchId, enrollmentStatus)
    {
        try
        {
            return await Batch.findByIdAndUpdate(batchId, {$set : {enrollmentStatus}});
        }
        catch(error)
        {
            throw error
        }
    }

    async addQuizToBatch(batchId, quiz)
    {
        try
        {
            return await Batch.findByIdAndUpdate(batchId, {$push : {mocks: quiz}});
        }
        catch(error)
        {
            throw error
        }
    }

    async removeEnrollment(batchId, enrollmentId)
    {
        try
        {
            await Batch.findByIdAndUpdate(batchId, {$pull : {enrollments: enrollmentId }});
            return
        }
        catch(error)
        {
            throw error
        }
    }    

    async getById(id)
    {
        try
        {
            const batch = await Batch.findById(id);
            return batch
        }
        catch(error)
        {
            throw error
        }
    }

    async updateMocks(batchId, id, testId)
    {
        try
        {
            return await Batch.findOneAndUpdate({ _id: batchId, 'mocks.id': id }, { $addToSet: { 'mocks.$.results': testId }})
            
        }
        catch(error)
        {
            throw error
        }
    }

    async removeMock(batchId, id, testId)
    {
        try
        {
            return await Batch.findOneAndUpdate({ _id: batchId, 'mocks.id': id }, { $pull: { 'mocks.$.results': testId }})
            
        }
        catch(error)
        {
            throw error
        }
    }

    async updateMockStatus(batchId, id, status)
    {
        try
        {
            return await Batch.findOneAndUpdate({ _id: batchId, 'mocks.id': id }, { $set: { 'mocks.$.status': status }})
            
        }
        catch(error)
        {
            throw error
        }
    }

    async updateMockVisibility(batchId, id, visibility)
    {
        try
        {
            return await Batch.findOneAndUpdate({ _id: batchId, 'mocks.id': id }, { $set: { 'mocks.$.hide': !visibility }})
            
        }
        catch(error)
        {
            throw error
        }
    }

    async getAllBatches()
    {
        try
        {
            const batches = await Batch.find()
            .populate({path: 'course', model: Course})
            .populate({path: 'mentor', model: Mentor});
            return batches
        } 
        catch(error)
        {
            throw error
        }
    }

    async deleteById(batchId)
    {
        try
        {
            return await Batch.deleteOne({_id:batchId})
        }
        catch(error)
        {
            throw error
        }
    }

    async updateSessions(batchId, sessionId)
    {
        try
        {
            return await Batch.findByIdAndUpdate(batchId, { $push : { sessions : sessionId}});
        }
        catch(error)
        {
            throw new Error('Failed to create session')
        }
    }

    async findUpcomingBatches()
    {
        try
        {
            const upcomingBatches = await Batch.find({status:'Upcoming'}).populate('courseId');
            return upcomingBatches
        }
        catch(error)
        {
            throw new Error('Failed to fetch upcoming batches')
        }
    }

    async enrollUser(batchId, enrollmentId)
    {
        try
        {
            return await Batch.findByIdAndUpdate(batchId, {$push :{ enrollments : enrollmentId}})
        }
        catch(error)
        {
            throw new Error('Failed to update student to batch')
        }
    }

    async updateWhatsappLink(batchId, link)
    {
        try
        {
            return await Batch.findByIdAndUpdate(batchId, {$set :{ whatsappLink : link}})
        }
        catch(error)
        {
            throw new Error('Failed to update link')
        }
    }

    async updateZoomLink(batchId, link)
    {
        try
        {
            return await Batch.findByIdAndUpdate(batchId, {$set :{ zoomLink : link}})
        }
        catch(error)
        {
            throw new Error('Failed to update link')
        }
    }
}

export default batchService