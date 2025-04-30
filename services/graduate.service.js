import { Batch } from "@/models/batch.model";
import { Course } from "@/models/course.model";
import { Enrollment } from "@/models/enrollment.model";
import { Graduate } from "@/models/graduate.model";
import { User } from "@/models/user.model";

class graduateService
{
    async createGraduationBatch(graduationDetails)
    {
        try
        {
            const graduateBatch = await Graduate.create(graduationDetails)
            await graduateBatch.save();
            return graduateBatch;
        }
        catch(error)
        {
            return error
        }
    }

    async getGraduates()
    {
        try
        {
            const graduates = await Graduate.find().populate({path: 'course'});
            return graduates
        }
        catch(error)
        {
            throw error
        }
    }

    async updateGraduationList(graduationId, enrollmentId)
    {
        try
        {
            await Graduate.findByIdAndUpdate(graduationId, { $push: { enrollments: enrollmentId } });
            return
        }
        catch(error)
        {
            throw error
        }
    }

    async getMonthlyGraduates(id)
    {
        try
        {
            const monthlyGraduates = await Graduate.findById(id).populate([{path: 'course', path: 'enrollments', module: Enrollment, populate:{ path: 'user', model: User}},{ path: 'course', module: Course}]);
            return monthlyGraduates
        }
        catch(error)
        {
            throw error
        }
    }
}

export default graduateService