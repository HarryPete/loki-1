import { Comment } from "@/models/comment.model";
import { Forum } from "@/models/forum.model";
import { Reply } from "@/models/reply.model";
import { User } from "@/models/user.model";

class forumService
{
    async addNewDiscussion(title, author, keywords)
    {
        try
        {
            const newDiscussion = await Forum.create({title, author, keywords})
            await newDiscussion.save();
            return newDiscussion;
        }
        catch(error)
        {
            throw error;
        }
    }

    async findAll()
    {
        try
        {
            const discussions = await Forum.find().populate({path: 'author', model: User})
            .populate
            (
                {
                    path:'comments',
                    model: Comment,
                    populate:
                    [{
                        path: 'author', 
                        model: User
                    },
                    {
                        path: 'replies', 
                        model: Reply,
                        populate:
                        {
                            path: 'author',
                            model: User
                        }
                    }]
                }
            );
            return discussions;
        }
        catch(error)
        {
            console.log(error)
            throw new Error('Failed to fetch discussions')
        }
    }

    async findDiscussionById(id)
    {
        try
        {
            const discussions = await Forum.findById(id).populate({path: 'author', model: User})
            .populate
            (
                {
                    path:'comments',
                    model: Comment,
                    populate:
                    [{
                        path: 'author', 
                        model: User
                    },
                    {
                        path: 'replies', 
                        model: Reply,
                        populate:
                        {
                            path: 'author',
                            model: User
                        }
                    }]
                }
            );
            console.log(discussions)
            return discussions;
        }
        catch(error)
        {
            return error
        }
    }

    async deleteById(id)
    {
        try
        {
            return await Forum.findByIdAndDelete(id);
        }
        catch(error)
        {
            throw new Error('Failed to delete discussion')
        }
    }


    async addCommentToDiscussion(commentId, discussionId)
    {
        try
        {
            const discussion = await Forum.findByIdAndUpdate(discussionId, {$push : {comments : commentId}})
            return discussion;
        }
        catch(error)
        {
            console.log(error)
            throw new Error('Failed to create discussion')
        }
    }

    async getTopicsCount()
    {
        try
        {
            const count = await Forum.aggregate(
            [
                { $unwind: "$keywords" }, // Deconstructs the keywords array
                { $group: {
                  _id: "$keywords", // Group by each unique keyword
                  count: { $sum: 1 } // Count occurrences
                }},
                { $sort: { count: -1 } } // Sort by count in descending order
            ]);
            return count;
        }
        catch(error)
        {
            return error;
        }
    }

}

export default forumService