import { BACKEND_URL } from "../utils/constant";
export default function UserCard({ author, noOfPosts, children }) {
    // children is a button - used to handle [ edit button ] profile page by UserCard 
    return (
        <>
            <div className="flex flex-col gap-1 shadow-lg shadow-blue-400 p-6 my-12 border rounded">
                <div className="flex justify-center">
                    <img className='rounded-[50%] aspect-square object-cover w-[200px] hover:scale-110  duration-200 ease-in' src={`${BACKEND_URL}/static/profile/${author.avatar}`} />
                </div>
                <h1 className="italic">Name :
                    <span className="ms-2 text-xl font-medium italic">
                        {author.username}
                    </span>
                </h1>

                <a href={`mailto:${author.email}`} title="send email" className="italic hover:underline text-blue-400">{author.email}</a>
                <p className="italic">No of posts :
                    <span className="ms-1 font-semibold">{noOfPosts}</span>
                </p>
                <p>
                    {/* {author.bio}                     */}
                </p>

                {children &&
                    <div className="mt-4">
                        {children}
                    </div>
                }

            </div>


        </>
    )
}