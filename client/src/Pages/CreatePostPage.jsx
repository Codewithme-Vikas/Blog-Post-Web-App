import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import Editor from "../components/Editor";
import { toast } from 'react-toastify'

import { BACKEND_URL } from "../utils/constant";

//create a action to send data to server api '/post'
// i could not define a action because i don't know the how to use useState functionality inside the action

export default function CreatePostPage() {
    const navigate = useNavigate()
    const [content, setContent] = useState('')

    async function createPosthandler(event) {
        event.preventDefault()

        try {
            const formData = new FormData(event.target)
            formData.set('content', content)
            // if thumbnail is not set then also formData contain a object named as file , where file name fill as ''
            // add a at least content length - task
            const response = await fetch( `${BACKEND_URL}/post`, {
                method: 'POST',
                body: formData,
                credentials : 'include',
            })

            if (response.ok) {
                return navigate('/');
            } else {
                toast.error("You couldn't post!");
                return false; // backend validation is failed
            }

        } catch (error) {
            console.log(error, 'create a post');
            return null;
        }
    }

    return (
        <>
            <h3 className="text-lg font-medium italic">Let's create a dream Post...</h3>

            <form onSubmit={createPosthandler} className="border w-3/4 mx-auto p-8 flex flex-col gap-5 my-8 rounded shadow-lg shadow-cyan-700">

                <div className="form-control flex flex-col gap-1">
                    {/* <label className="hover:cursor-pointer" htmlFor="username">Title :</label> */}
                    <input type="text"
                        id="title"
                        name="title"
                        placeholder="Title"
                        className="py-2 px-4 rounded-md"
                    />
                </div>

                <div className="form-control flex flex-col gap-1">
                    {/* <label className="hover:cursor-pointer" htmlFor="password">password :</label> */}
                    <input type="text"
                        id="summary"
                        name="summary"
                        placeholder="Summary"
                        className="py-2 px-4 rounded-md"
                    />
                </div>

                <div className="form-control flex flex-col gap-1">
                    <label className="hover:cursor-pointer" htmlFor="thumbnail">Thumbnail :</label>
                    <input type="file"
                        id="thumbnail"
                        name="thumbnail"
                        className="py-2 px-4 rounded-md"
                        required
                    />
                    <span className="text-sm text-gray-500">Choose a image to show as thumbnail.</span>
                </div>


                <div className="form-control flex flex-col gap-1">
                    <Editor
                        value={content}
                        onChange={newValue => setContent(newValue)}
                    />
                </div>
                <div>
                    <button className="btn">Create Post</button>
                </div>

            </form>
        </>
    )
}