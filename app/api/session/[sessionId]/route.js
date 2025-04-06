import dbConnect from "@/dbConfig/dbConnect";
import sessionService from "@/services/session.service";
const sessionInstance = new sessionService();

export async function PUT(req, {params})
{
    try
    {
        await dbConnect();

        const { sessionId } = await params;
        const { status } = await req.json();
        await sessionInstance.updateSessionStatus(sessionId, status);
        return new Response(JSON.stringify({message : 'updated'}));
    }
    catch(error)
    {
        return error
    }
}