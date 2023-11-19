import { BsTrash3Fill } from 'react-icons/bs'
import { Link } from 'react-router-dom'

export default function Comment({ comment, userInfo , deleteComment }) {

    return (
        <>
            <div className="py-2 border-b-2 border-gray-600">
                <div className="flex gap-8">
                    <p className="text-base whitespace-pre-wrap">{ comment.comment }</p>

                    {userInfo?.id === comment.author._id &&
                        <button
                            onClick={ ()=> deleteComment( comment._id ) }
                            className='p-1 text-rose-800 text-xl focus:outline-none hover:scale-110 duration-100 active:text-red-500'>
                            <span>
                                 <BsTrash3Fill/>
                            </span>
                        </button>
                    }

                </div>
                <p className="text-end italic text-sm font-medium">
                     
                    <Link to={`/author/${comment.author._id}`} className='hover:underline underline-offset-2'>&mdash; { comment.author.username }</Link>
                </p>
            </div>
        </>
    )
}