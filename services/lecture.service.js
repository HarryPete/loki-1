import { Lecture } from "@/models/lecture.model";

class lectureService
{
    async addNewLecture(title, recording)
    {
        try
        {
            const lecture = await Lecture.create({title, recording})
            await lecture.save();
            return lecture
        }
        catch(error)
        {
            throw error
        }
    }

    async updateLecture(lectureId, lectureDetails)
    {
        try
        {
            await Lecture.findByIdAndUpdate(lectureId, {$set: lectureDetails })
            return
        }
        catch(error)
        {
            throw error
        }
    }

    async getLecture(lectureId)
    {
        try
        {
            const lecture = await Lecture.findById(lectureId)
            return lecture
        }
        catch(error)
        {
            throw error
        }
    }
}

export default lectureService