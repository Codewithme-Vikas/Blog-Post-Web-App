import { useLoaderData } from "react-router-dom";
import ShortPost from "../components/ShortPost";
import { BACKEND_URL } from "../utils/constant";
export async function loader() {

    try {
        const response = await fetch(`${BACKEND_URL}/post`);

        if (response.ok) {
            const posts = await response.json();
            return posts; // This will be use it in HomePage
        } else {
            return false // response is send like 409 , server error ( server couldn't find the posts )
        }
    } catch (error) {
        console.log( error , 'homepage loader')
        return null;
    }
}

export default function HomePage() {
    const posts = useLoaderData();
    // post can be null so use posts?.length, so that will not face error

    return (
        <>
            { posts?.length > 0  ? (
                <>
                <h2 className="text-center text-lg font-medium">Let's enjoy the sea of the blogs...</h2>
                <div className="posts-container py-8 flex flex-wrap items-start justify-between gap-y-8">

                    {posts.map(post => {

                        return <ShortPost
                            key={post._id}
                            id = { post._id }
                            title = {post.title}
                            summary = {post.summary}
                            thumbnail = {post.thumbnail}
                            // content = {post.content}
                            author = {post.author}
                            createdAt = {post.createdAt}
                            updatedAt = {post.updatedAt }
                            upvote =  { post.upvote }
                        />
                    })}
                </div>
            </>
            ) : (
                <div className="my-8  flex flex-col gap-24 items-center justify-between">
                    <h1 className="font-medium text-xl text-center">There is no any Post </h1>
                    {/* spinner is start from here */}
                    <div class="spinner ">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    {/* spinner is end */}
                </div>
            )}
        </>
    )
}