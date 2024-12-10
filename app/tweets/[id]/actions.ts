import db from "@/lib/db";


export async function getTweet(id: number) {
    const tweet = await db.tweet.findUnique({
        where: {
            id,
        },
        include: {
            user: {
                select: {
                    username: true,
                },
            },
            _count: {
                select: {
                    responses: true,
                },
              },
        },
        
    });
    return tweet;
}