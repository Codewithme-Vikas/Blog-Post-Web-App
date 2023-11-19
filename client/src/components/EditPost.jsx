import { useState } from "react"
import { useNavigate } from "react-router-dom";
import Editor from "./Editor"
import { toast } from 'react-toastify'

// define action to send the updated post data to the server
// i could not create a action due to i don't know how to use hook inside the action

export default function EditPostPage({ post, setEditPost }) {
    const navigate = useNavigate()


    // content and setContent is used for ReactQuill
    const [content, setContent] = useState(post.content);

    async function editPostHandler(event) {
        event.preventDefault();

        try {
            const formData = new FormData(event.target)
            formData.set('content', content)
            console.log( formData , Object.fromEntries( formData ))
            console.log( formData.get('thumbnail'))
            const response = await fetch(`http://localhost:8080/post/${post._id}`, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            if (response.ok) {
                setEditPost( false )
                return navigate(`/post/${post._id}`) // also can do editPost(false) - think little
            } else {
                toast.error("couldn't update the post!")
                return false; // invalid server response
            }
        } catch (error) {
            console.log(error , 'edit a post')
            return null;
        }

    }

    return (
        <>
            <h3 className="text-lg font-medium italic">Edit Your Post...</h3>

            <form onSubmit={editPostHandler} className="border w-3/4 mx-auto p-8 flex flex-col gap-5 my-8 rounded shadow-lg shadow-cyan-700">

                <div className="form-control flex flex-col gap-1">
                    <label className="hover:cursor-pointer" htmlFor="title">Title :</label>
                    <input type="text"
                        id="title"
                        name="title"
                        placeholder="Title"
                        defaultValue={post.title}
                        className="py-2 px-4 rounded-md"
                    />
                </div>

                <div className="form-control flex flex-col gap-1">
                    <label className="hover:cursor-pointer" htmlFor="summary">Summary :</label>
                    <input type="text"
                        id="summary"
                        name="summary"
                        placeholder="Summary"
                        defaultValue={post.summary}
                        className="py-2 px-4 rounded-md"
                    />
                </div>

                <div className="form-control flex flex-col gap-1">
                    <label className="hover:cursor-pointer" htmlFor="thumbnail">Thumbnail :</label>
                    <input type="file"
                        id="thumbnail"
                        name="thumbnail"
                        className="py-2 px-4 rounded-md"
                    />
                    <span className="text-sm text-gray-500">Choose a image to show as thumbnail.</span>
                </div>


                <div className="form-control flex flex-col gap-1">
                    <Editor
                        value={content}
                        onChange={newValue => setContent(newValue)}
                    />
                </div>
                <div className=" flex gap-4">
                    <button className="btn">UpDate Post</button>
                    <button onClick={() => setEditPost(false)} type="button" className="btn hover:text-rose-600">Cancel</button>
                </div>

            </form>
        </>
    )


}