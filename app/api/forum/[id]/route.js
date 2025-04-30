
import dbConnect from "@/dbConfig/dbConnect";
import forumService from "@/services/forum.service";
import { NextResponse } from "next/server";
const forumInstance = new forumService();

// export async function DELETE(req, {params})
// {
//     try
//     {
//         await dbConnect();
//         const { title } = await params;
//         await forumInstance.deleteById(id);
//         return NextResponse.json({message : 'Discussion deleted'})
//     }
//     catch(error)
//     {
//         return error
//     }
// }

export async function GET(req, {params})
{
    try
    {
        await dbConnect();
        
        const { id } = await params;
        const discussion = await forumInstance.findDiscussionById(id);
        return NextResponse.json(discussion)
    }
    catch(error)
    {
        console.log(error);
    }
}