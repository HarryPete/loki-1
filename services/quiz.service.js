
import { Assignment } from "@/models/assignment.model";
import { Batch } from "@/models/batch.model";
import { Course } from "@/models/course.model";
import { Group } from "@/models/group.model";
import { Quiz } from "@/models/quiz.model";

class quizService
{
    async createQuiz(id, title, course, reference)
    {
        try
        {
            const newQuiz = await Quiz.create({id, title, course, reference});
            await newQuiz.save();
            return newQuiz
        }
        catch(error)
        {
            return error
        }
    }

    async updateQuiz(quizId, reference)
    {
        try
        {
            await Quiz.findByIdAndUpdate(quizId, {$set: {reference}});
            return 
        }
        catch(error)
        {
            return error
        }
    }

    async getAllQuizzes()
    {
        try
        {
            const quizzes = await Quiz.find()
            .populate({
                path: 'course',
                model: Course
            })
            
            return quizzes
        }
        catch(error)
        {
            throw error
        }
    }

    async getQuizById(id)
    {
        try
        {
            const quiz = await Quiz.findById(id)
            .populate({
                path: 'group',
                model: Group,
                populate:
                [{
                    path: 'batch',
                    model: Batch,
                    populate:
                    {
                        path: 'course',
                        model: Course
                    }
                },
                {
                    path: 'assignment',
                    model: Assignment
                }]
            })
            return quiz
        }
        catch(error)
        {
            throw error
        }
    }

    async getQuizByTitle(id)
    {
        try
        {
            const quiz = await Quiz.findById(id)
            return quiz
        }
        catch(error)
        {
            throw error
        }
    }

    async findQuizByBatch(batchId)
    {
        try
        {
            console.log(batchId)
            const quiz = await Quiz.find()
            .populate({path: 'group', model: Group, populate: {
                path: 'batch', model: Batch, match: {_id: batchId}
            }});

            return quiz
        }
        catch(error)
        {
            console.log(error.message)
            throw error
        }
    }

    async updateGroup(quizId, group)
    {
        try
        {
            return await Quiz.findByIdAndUpdate(quizId, {$push: {'group': group}});
        }
        catch(error)
        {
            return error
        }
    }

    async deleteQuiz(quizId)
    {
        try
        {
            return await Quiz.findByIdAndDelete(quizId);
        }
        catch(error)
        {
            return error
        }
    }
}

export default quizService