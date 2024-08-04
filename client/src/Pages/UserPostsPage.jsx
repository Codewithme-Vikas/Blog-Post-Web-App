import { useLoaderData } from "react-router-dom";

import ShortPost from "../components/ShortPost";
import UserCard from "../components/UserCard";
import { BACKEND_URL } from "../utils/constant";

export async function loader({ params }) {

    try {
        const response = await fetch( `${BACKEND_URL}/user/${params.id}`);

        if (response.ok) {
            const userData = await response.json()
            return userData // it will be used to render user information on UI
        } else {
            return false // response is send like 409 , server error ( server couldn't find the posts )
        }
    } catch (error) {
        console.log(error, 'userPostsPage loader')
        return null;
    }
}

export default function UserPostsPage() {
    const metaData = useLoaderData();

    const user = metaData?.user;
    const userPosts = metaData?.userPosts
    return (
        <>
            {metaData &&
                <>
                    <UserCard author={user} noOfPosts={userPosts.length} />

                    {userPosts.length > 0 ? (
                        <>
                            <h1 className="text-xl font-medium text-gray-400 text-center">Let's see {user.username} posts --!</h1>
                            <div className="posts-container py-8 flex flex-wrap items-start justify-between gap-y-8">
                                {userPosts.map(post => {
                                    return <ShortPost
                                        key={post._id}
                                        id={post._id}
                                        title={post.title}
                                        summary={post.summary}
                                        thumbnail={post.thumbnail}
                                        // content = {post.content}
                                        author={user}
                                        createdAt={post.createdAt}
                                        updatedAt={post.updatedAt}
                                    />
                                })}
                            </div>
                        </>
                    ) : (
                        <p className="text-2xl font-medium text-gray-200 text-center mt-4 mb-12">! Not Posted a single post yet!</p>
                    )}

                </>
            }



            {!metaData &&
                <div>
                    <p className="font-medium text-xl text-center my-6">There is no such user</p>
                </div>
            }

        </>
    )
}