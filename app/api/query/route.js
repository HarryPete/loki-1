import dbConnect from "@/dbConfig/dbConnect";
import queryService from "@/services/query.service";
import { NextResponse } from "next/server";
const queryInstance = new queryService(); 

export async function POST(req)
{
    try
    {
        await dbConnect();

        const { name, email, contact, message } = await req.json()
        await queryInstance.createQuery(name, email, contact, message)
        return NextResponse.json({message: 'Response recorded'});
    }
    catch(error)
    {
        return NextResponse.json({error: error.message});
    }
}