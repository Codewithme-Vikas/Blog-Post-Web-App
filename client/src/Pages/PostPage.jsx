import { useContext, useState } from "react"
import EditPostPage from "../components/EditPost"
import ReadPostPage from "../components/ReadPost"
import { useLoaderData, useNavigate } from "react-router-dom";
import { UserContext } from '../context/UserContext'
import { toast } from 'react-toastify'
import { BACKEND_URL } from "../utils/constant";

// loader to fetch the post on the base of id
export async function loader({ params }) {

    try {
        const response = await fetch( `${BACKEND_URL}/post/${params.id}`);

        if (response.ok) {
            const post = await response.json();
            return post;  // meta has is object which has two keys - post and comments
        } else {
            return false; // server error - server can't solve query { bad/wrong request is send }
        }

    } catch (error) {
        console.log(error, 'fetch a post with id');
        return null;
    }
}


export default function PostPage() {
    const navigate = useNavigate()

    const { userInfo } = useContext(UserContext)
    const post = useLoaderData();

    const [editPost, setEditPost] = useState(false)

    async function deletePostHandler(id) {

        try {
            const response = await fetch( `${BACKEND_URL}/post/${id}/delete`,{
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                toast.success('Post is successfully deleted!')
                return navigate('/');
            } else {
                toast.error("couldn't delete a Post")
                return false;
            }

        } catch (error) {
            console.log(error, 'delete a post');
            return null
        }
    }

    return (
        <>
            {post &&
                <>
                    {editPost ? (
                        <EditPostPage
                            post={post}
                            setEditPost={setEditPost}
                        />
                    ) : (
                        <ReadPostPage
                            post={post}
                            userInfo={userInfo}
                            setEditPost={setEditPost}
                            deletePostHandler={deletePostHandler}
                        />
                    )}
                </>
            }

            {!post &&
                <div className="mt-12">
                    <h1 className="text-center text-xl font-medium">There is no such Post</h1>
                </div>
            }
        </>
    )
}