import { Imagelibrary } from "@/models/imagelibrary.model";

class imagelibraryService
{
    async upload(url, folder)
    {
        try
        {
            const iamge = await Imagelibrary.create({url, folder, publicId})
            await iamge.save();
            return iamge
        }
        catch(error)
        {
            return error
        }
    }
}

export default imagelibraryService