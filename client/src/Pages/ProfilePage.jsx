import { useState } from "react";
import { Form, useLoaderData } from "react-router-dom";
import { TbEdit } from 'react-icons/tb'
import UserCard from "../components/UserCard";
import EditUserCard from "../components/EditUserCard";
import ShortPost from "../components/ShortPost";
import { BACKEND_URL } from "../utils/constant";

export async function loader({ params }) {

    try {
        const response = await fetch( `${BACKEND_URL}/user/progile/${params.id}`,{
            method: 'GET',
            credentials: 'include',
        });
        
        if (response.ok) {
            const userData = await response.json()
            return userData
        } else {
            return false; // server could not find that user , you are not authenticate user to see the detail ( token is not provided )
        }
    } catch (error) {
        console.log(error, 'profile page , fetch user data')
        return null;
    }

}


export default function ProfilePage() {
    const [editUser, setEditUser] = useState(false)
    const metaData = useLoaderData(); // user can be null

    const user = metaData?.user;
    const userPosts = metaData?.userPosts

    return (
        <>
            {metaData &&
                <>
                    {!editUser &&
                        <>
                            <UserCard author={user} noOfPosts={userPosts.length} >
                                <button onClick={ ()=> setEditUser( true )} className="btn hover:text-green-600">
                                    <TbEdit className='inline-block me-1' />
                                    Edit
                                </button>
                            </UserCard>

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
                                <p className="text-2xl font-medium text-gray-200 text-center mt-4 mb-12">! You are not Posted a single post yet!</p>
                            )}
                        </>
                    }

                    { editUser && 
                        <EditUserCard
                            setEditUser = { setEditUser }
                            user = { user }
                        />
                    }
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