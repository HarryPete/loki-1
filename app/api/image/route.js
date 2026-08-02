import dbConnect from "@/dbConfig/dbConnect";
import imagelibraryService from "@/services/imagelibrary.service";
const imagelibraryInstance = new imagelibraryService();
import { NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary'

export async function POST(req)
{ 
    try
    { 
        await dbConnect();
         
        let {imageURL, folder} = await req.json();

        if (!imageURL) {
            return NextResponse.json(
                { error: "Image URL is required" },
                { status: 400 }
            );
        }

        if (!folder) {
            return NextResponse.json(
                { error: "Folder is required" },
                { status: 400 }
            );
        }

        cloudinary.config({ 
            cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, 
            api_key: process.env.CLOUDINARY_API_KEY, 
            api_secret: process.env.CLOUDINARY_API_SECRET
        });

        const result = await cloudinary.uploader.upload(imageURL, 
        {
            folder: `imagelibrary/${folder}`,
        });

        await imagelibraryInstance.upload({url: result.secure_url, folder, publicId: result.public_id});
        return NextResponse.json({message: 'Image updated'})
        
    }  
    catch(error)
    { 
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    } 
}

// export async function GET(req, {params})
// { 
//     try
//     { 
//         await dbConnect();
//         const { userId } = await params;
//         // const { batchId, enrollmentid } = await req.json();
//         const user = await userInstance.getUserById(userId);
//         return NextResponse.json(user)
//     }  
//     catch(error)
//     { 
//         return NextResponse.json({error: error.message})
//     } 
// }

// export async function DELETE(req, {params})
// { 
//     try
//     { 
//         await dbConnect();
         
//         const { userId } = await params;
//         const { batchId, enrollmentId } = await req.json(); 

//         console.log(userId, batchId, enrollmentId)

//         // await userInstance.removeEnrollment(userId, enrollmentId);
//         await batchInstance.removeEnrollment(batchId, enrollmentId);
//         await enrollmentInstance.removeEnrollment(enrollmentId)
//         return NextResponse.json({message: 'Duplicate removed'})
//     }  
//     catch(error)
//     { 
//         return NextResponse.json({error: error.message})
//     } 
// }