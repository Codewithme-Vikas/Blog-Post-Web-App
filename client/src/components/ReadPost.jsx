import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { BsSendFill } from 'react-icons/bs'
import { SlOptionsVertical } from 'react-icons/sl'
import useUpvote from '../hook/useUpvote';
import Comment from './Comment';
import { toast } from 'react-toastify'
import { BACKEND_URL } from "../utils/constant";


export default function ReadPostPage({ post, userInfo, setEditPost, deletePostHandler }) {

    const { upvote, setUpvote, upVoteHandler } = useUpvote(post._id, userInfo);

    const [comments, setComments] = useState([]);

    const [comment, setComment] = useState('') // for store textarea value

    const [isRerender, setIsRerender] = useState(false);


    async function fetchComments(postId) {

        try {
            const response = await fetch( `${BACKEND_URL}/comment/${postId}`)

            if (response.ok) {
                const comments = await response.json()
                setIsRerender(false)
                setComments(comments)
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.log(error, 'fetch comments')
            return null;
        }

    }


    async function createComment(event, authorId, postId) {
        event.preventDefault()

        try {
            const commentData = { comment, authorId, postId };
            const response = await fetch(`${BACKEND_URL}/comment`, {
                method: 'POST',
                body: JSON.stringify(commentData),
                headers: { 'Content-Type': 'application/json' }
            })

            if (response.ok) {
                setComment(''); // set textarea as empty
                setIsRerender(true)
                return true;
            } else {
                toast.error('Comment is not submited!');
                return false; // couldn't not create a comment
            }
        } catch (error) {
            console.log(error, 'comment handler')
            return null;
        }

    }


    async function deleteComment(id) {

        try {
            const response = await fetch( `${BACKEND_URL}/comment/${id}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            })

            if (response.ok) {
                setIsRerender(true) // fetch comments again - by useEffect
                toast.success('Your comment is deleted!')
                return true;
            } else {
                return false; // comment couldn't deleted
            }
        } catch (error) {
            console.log(error, 'delete comment')
            return null;
        }
    }


    function loadUpvote(postUpvote, userId) {
        if (postUpvote) {
            postUpvote.forEach(vote => {
                if (vote === userId) {
                    setUpvote(true)
                    return true
                }
            })
        }
        return false;
    }

    useEffect(() => {
        fetchComments(post._id);

        loadUpvote(post.upvote, userInfo?.id); // to intially set the upvote - post is upvoted or not previously
    }, []) // run only once after render UI

    useEffect(() => {
        if (isRerender) {
            fetchComments(post._id);
        }
    }, [isRerender]); // run whenever isCommentSubmit change

    return (
        <>
            <article className='article py-8'>
                <div className="post p-4 hover:shadow-xl hover:shadow-slate-700 flex flex-col gap-4">
                    <div className="post-header flex items-center justify-between gap-2">
                        <Link to={`/author/${post.author._id}`}>
                            <img className='rounded-[50%] aspect-square object-cover w-[60px] hover:scale-110 duration-200 ease-in' src={`${BACKEND_URL}/static/profile/${post.author.avatar}`} />
                        </Link>
                        <div className='post-read'>
                            <SlOptionsVertical className='text-white' />
                        </div>
                    </div>
                    <div className='post-body flex flex-col gap-3'>
                        <div className='post-content flex flex-col gap-2'>
                            <Link to={`/author/${post.author._id}`}
                                className='post-author font-semibold text-sky-300  hover:underline hover:text-cyan-700 underline-offset-2'
                            >
                                {'@' + post.author.username}
                            </Link>
                            <p className='post-title text-xl font-medium'>{post.title}</p>
                            <p className='post-summary'>{post.summary}</p>
                            <p className='post-date text-sm'>{post.createdAt}</p>
                        </div>
                        <p>
                            <img className='rounded-lg max-h-[600px]  sm:max-h-[500px] md:max-h-[450px] lg:max-h-[400px] w-full object-contain' src={`${BACKEND_URL}/static/post/${post.thumbnail}`} />
                        </p>
                        <p className='post-content' dangerouslySetInnerHTML={{ __html: post.content }} ></p>
                    </div>
                    <div className='post-footer flex items-center gap-4 justify-between'>
                        {userInfo &&
                            <>

                                <button
                                    onClick={() => upVoteHandler()}
                                    className='focus:outline-none active:scale-125 duration-100'
                                    title='like'
                                >
                                    {upvote ? (
                                        <svg width="1em" height="1em" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 pointer-events-none">
                                            <path d="M13.234 3.395c.191.136.358.303.494.493l7.077 9.285a1.06 1.06 0 01-1.167 1.633l-4.277-1.284a1.06 1.06 0 00-1.355.866l-.814 5.701a1.06 1.06 0 01-1.05.911h-.281a1.06 1.06 0 01-1.05-.91l-.815-5.702a1.06 1.06 0 00-1.355-.866l-4.276 1.284a1.06 1.06 0 01-1.167-1.633l7.077-9.285a2.121 2.121 0 012.96-.493z" fill="currentcolor" fillRule="evenodd">
                                            </path>
                                        </svg>
                                    ) : (
                                        <svg width="1em" height="1em" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 pointer-events-none">
                                            <path fill="currentcolor" d="M9.456 4.216l-5.985 7.851c-.456.637-.583 1.402-.371 2.108l.052.155a2.384 2.384 0 002.916 1.443l2.876-.864.578 4.042a2.384 2.384 0 002.36 2.047h.234l.161-.006a2.384 2.384 0 002.2-2.041l.576-4.042 2.877.864a2.384 2.384 0 002.625-3.668L14.63 4.33a3.268 3.268 0 00-5.174-.115zm3.57.613c.16.114.298.253.411.411l5.897 7.736a.884.884 0 01-.973 1.36l-3.563-1.069a.884.884 0 00-1.129.722l-.678 4.75a.884.884 0 01-.875.759h-.234a.884.884 0 01-.875-.76l-.679-4.75a.884.884 0 00-1.128-.72l-3.563 1.068a.884.884 0 01-.973-1.36L10.56 5.24a1.767 1.767 0 012.465-.41z" fillRule="evenodd">
                                            </path>
                                        </svg>
                                    )
                                    }
                                </button>

                                {/* <p>footer data </p> */}
                            </>
                        }

                    </div>
                </div>
            </article>

            {/* if post author and user is same */}
            {post.author._id === userInfo?.id &&
                <div className=" flex gap-4 pb-4">
                    <button onClick={() => setEditPost(true)} className="btn hover:text-green-600">Edit</button>
                    <button onClick={() => deletePostHandler(post._id)} type="button" className="btn hover:text-rose-600">Delete</button>
                </div>
            }


            <div className='my-6 mb-12 p-4 flex flex-col gap-6 shadow-sm shadow-slate-500 rounded-lg'>

                {userInfo &&

                    <div>
                        <form onSubmit={(event) => createComment(event, userInfo.id, post._id)} className="flex gap-2 items-end border-b-2  border-gray-300">
                            <textarea
                                name='comment'
                                onChange={(e) => setComment(e.target.value)}
                                value={comment}
                                placeholder="comment...."
                                rows={2}
                                required
                                className="flex-1  bg-transparent p-2 outline-none caret-teal-500 "
                            >
                            </textarea>
                            <button className='p-2 px-4 text-gray-200 text-xl outline-none focus:outline-none active:text-gray-700 hover:scale-110 duration-100' title='submit comment'>
                                <span><BsSendFill /></span>
                            </button>
                        </form>
                        <p className='py-1 text-xs text-slate-500'>If you got scroll bar in input box , just strecth it from right-bottom corner!</p>
                    </div>

                }


                {comments?.length > 0 &&
                    <div className='comments'>
                        {comments.map(comment => {

                            return < Comment
                                key={comment._id}
                                comment={comment}
                                userInfo={userInfo}
                                deleteComment={deleteComment}
                            />
                        })}
                    </div>
                }

            </div>


        </>
    )
}