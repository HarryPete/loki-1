import { Query } from "@/models/query.model";

class queryService
{

    async createQuery(name, email, contact)
    {
        try
        {
            const newQuery = await Query.create({name, email, contact, message});
            await newQuery.save();
            return;
        }
        catch(error)
        {
            throw error
        }
    }
}

export default queryService