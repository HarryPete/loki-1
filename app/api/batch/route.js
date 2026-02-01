import dbConnect from "@/dbConfig/dbConnect";
import batchService from "@/services/batch.service";
const batchInstance = new batchService();
import courseService from "@/services/course.service";
const courseInstance = new courseService();
import sessionService from "@/services/session.service";
import { NextResponse } from "next/server";
const sessionInstance = new sessionService();

export async function POST(req, { params }) {
  try {
    await dbConnect();

    const { title, courseId, mentor, startDate, endDate } = await req.json();
    const newBatch = await batchInstance.addNewBatch(title, courseId, mentor, startDate, endDate);
    const course = await courseInstance.getByCourseId(courseId);

    // Sequentially process lectures in order
    for (let i = 0; i < course.lectures.length; i++) {
      const lecture = course.lectures[i];
      const batchSession = await sessionInstance.addNewSession(i + 1, lecture._id);
      await batchInstance.updateSessions(newBatch._id, batchSession._id);
    }

    return NextResponse.json({ message: 'Batch added successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}

export async function GET(req, res)
{
    try
    {
        await dbConnect();

        const batches = await batchInstance.getAllBatches();
        return NextResponse.json(batches)
    }
    catch(error)
    {
        return NextResponse.json({error: error.message})
    }
}