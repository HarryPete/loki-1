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

    async getAllQueries()
    {
        try
        {
            const queries = await Query.find({});
            return queries;
        }
        catch(error)
        {
            throw error
        }
    }
}

export default queryService