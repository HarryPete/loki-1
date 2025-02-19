import testService from "@/services/test.service";
import assignmentService from "@/services/assignment.service";
import groupService from "@/services/group.service";
import quizService from "@/services/quiz.service";
import batchService from "@/services/batch.service";
import enrollmentService from "@/services/enrollment.service";

const testInstance = new testService();
const assignmentInstance = new assignmentService();
const groupInstance = new groupService();
const quizInstance = new quizService();
const batchInstance = new batchService();
const enrollmentInstance = new enrollmentService();

import dbConnect from "@/dbConfig/dbConnect";
import { NextResponse } from "next/server";

export async function PUT(req, {params})
{
    try
    {
        await dbConnect();

        const {quizId} = await params;
        const { reference } = await req.json();
        await quizInstance.updateQuiz(quizId, reference);
        return NextResponse.json({message: 'Quiz updated'})
    }
    catch(error)
    {
        return NextResponse.json({error: error.message})
    }
}

export async function GET(req, {params})
{
    try
    {
        await dbConnect();

        const {quizId} = await params;
        const quiz = await quizInstance.getQuizByTitle(quizId);
        return NextResponse.json(quiz);
    }
    catch(error)
    {
        return NextResponse.json({error: error.message})
    }
}

// export async function DELETE(req, {params})
// {
//     try
//     {
//         await dbConnect();
//         const {quizId} = await params;
//         await quizInstance.deleteQuiz(quizId);
//         return NextResponse.json({message: 'Mock deleted'});
//     }
//     catch(error)
//     {
//         return NextResponse.json({error: error.message})
//     }
// }





