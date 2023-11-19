import { Link } from 'react-router-dom'
import { FaShare } from 'react-icons/fa'
import { SlOptionsVertical } from 'react-icons/sl'
import { AiFillHeart } from 'react-icons/ai'

export default function ShortPost({ id, title, summary, thumbnail, author, createdAt, updatedAt, upvote }) {

    const displaySummary = summary ? summary.slice(0, 80) + '...' : 'no summary'

    // i am fail to add the upvote feature at here :( --> i will do it in next projects

    return (
        <article className='article basis-full sm:basis-[48%] lg:basis-[32%]'>
            <div className="post flex flex-col gap-4 p-3 sm:p-4 shadow-md shadow-slate-800 lg:shadow lg:shadow-slate-800 lg:hover:shadow-lg lg:hover:shadow-slate-700">
                <div className="post-header flex items-center justify-between gap-2">
                    <Link to={`/author/${author._id}`} title={author.username}>
                        <img className='rounded-[50%] aspect-square object-cover w-12 hover:scale-125 duration-200 ease-in' src={`http://localhost:8080/static/profile/${author.avatar}`} />
                    </Link>
                    <div className='post-read'>
                        <span>
                            <Link to={`/post/${id}`} className='flex items-center gap-2 p-2 rounded-lg bg-slate-400 text-black'>
                                <p>Read post</p>
                                <FaShare />
                            </Link>
                        </span>
                        <SlOptionsVertical className='text-white' />
                    </div>
                </div>
                <div className='post-body flex flex-col gap-3'>
                    <div className='post-content flex flex-col gap-2'>
                        <Link to={`/post/${id}`} className='post-title text-xl'>{title}</Link>
                        <p className='post-summary'> {displaySummary} </p>
                        <p className='post-date text-sm'>{createdAt}</p>
                    </div>
                    <Link to={`/post/${id}`}>
                        <img className='rounded-lg h-[250px] sm:h-[200px] w-full object-cover' src={`http://localhost:8080/static/post/${thumbnail}`} />
                    </Link>
                </div>
                <div className='post-footer flex items-center gap-4 justify-between'>

                    {upvote?.length > 0 &&
                        <div className='flex gap-2 items-center' title='likes'>
                            {/* <svg width="1em" height="1em" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 pointer-events-none">
                                <path d="M13.234 3.395c.191.136.358.303.494.493l7.077 9.285a1.06 1.06 0 01-1.167 1.633l-4.277-1.284a1.06 1.06 0 00-1.355.866l-.814 5.701a1.06 1.06 0 01-1.05.911h-.281a1.06 1.06 0 01-1.05-.91l-.815-5.702a1.06 1.06 0 00-1.355-.866l-4.276 1.284a1.06 1.06 0 01-1.167-1.633l7.077-9.285a2.121 2.121 0 012.96-.493z" fill="currentcolor" fillRule="evenodd">
                                </path>
                            </svg> */}
                            <AiFillHeart className='text-slate-500 text-xl'/> :
                            <span> {upvote.length} </span>
                        </div>

                    }

                    {/* <p className='self-end'>footer data </p> */}
                </div>
            </div>
        </article>
    )
}