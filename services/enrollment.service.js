import { Batch } from "@/models/batch.model";
import { Course } from "@/models/course.model";
import { Enrollment } from "@/models/enrollment.model";
import { Lecture } from "@/models/lecture.model";
import { Mentor } from "@/models/mentor.model";
import { Quiz } from "@/models/quiz.model";
import { Session } from "@/models/session.model";
import { Test } from "@/models/test.model";
import { User } from "@/models/user.model";

class enrollmentService
{

    async enroll(user, batch)
    {
        try
        {
            const enrollment = await Enrollment.create({user, batch})
            await enrollment.save();
            return enrollment;
        }
        catch(error)
        {
            return error
        }
    }

    async getEnrollmentById(enrollmentId)
    {
        try
        {
            const enrollment = await Enrollment.findById(enrollmentId)
            .populate(
            [{
                path: 'batch', 
                model: Batch,
                populate:
                [{
                    path: 'course',
                    model: Course
                },
                {
                    path: 'sessions',
                    model: Session,
                    populate:
                    {
                        path: 'lecture',
                        model: Lecture
                    }
                },
                {
                    path: 'mentor',
                    model: Mentor
                }]
            },
            {
                path: 'user',
                model: User
            },
            {
                path: 'mocks', 
                model: Test,
            }])

            return enrollment
        }
        catch(error)
        {
            throw error
        }
    }

    async assignTest(userId, testId)
    {
        try
        {
            return await Enrollment.findOneAndUpdate({user: userId}, {$push : {assessments: testId}})
        }
        catch(error)
        {
            throw error
        }
    }

    async getEnrollments()
    {
        try
        {
            const enrollments = await Enrollment.find({}).populate([{path: 'user', model: User},{ path: 'batch', model: Batch}, { path: 'mocks', model: Test,  populate: { path: 'quiz', model: Quiz}}]);
            return enrollments
        }
        catch(error)
        {
            throw error
        }
    }

    async assignMockTest(enrollmentId, testId)
    {
        try
        {
            return await Enrollment.findByIdAndUpdate(enrollmentId, {$push : { mocks : testId }})
        }
        catch(error)
        {
            throw error
        }
    }

    async updateGraduation(enrollmentId, graduationBatch)
    {
        try
        {
            return await Enrollment.findByIdAndUpdate(enrollmentId, {$set : {graduationBatch}})
        }
        catch(error)
        {
            throw error
        }
    }

    async removeEnrollment(enrollmentId)
    {
        try
        {
            return await Enrollment.findByIdAndDelete(enrollmentId);
        }
        catch(error)
        {
            throw error
        }
    }    

    async updateEnrollment(enrollmentId, updates)
    {
        try
        {
            return await Enrollment.findByIdAndUpdate(enrollmentId, {$set : updates})
        }
        catch(error)
        {
            throw error
        }
    }

    async removeMock(enrollmentId, testId)
    {
        try
        {
            return await Enrollment.findByIdAndUpdate(enrollmentId, {$pull : { mocks : testId }})   
        }
        catch(error)
        {
            throw error
        }
    }
}

export default enrollmentService