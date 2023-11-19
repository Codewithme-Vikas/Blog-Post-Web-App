import { useState } from "react";


export default function useUpvote(id, userInfo) {

    const [upvote, setUpvote] = useState(false) // set upvote by post.upvote.author.id === userInfo.id

    async function upVoteHandler() {

        const baseAPI = `http://localhost:8080/post/${id}/`;
        const realAPI  = upvote ? ( baseAPI + 'downvote' ) : ( baseAPI + 'upvote' );

        try {
            const response = await fetch( realAPI , {
                method: 'POST',
                body: JSON.stringify({ author: userInfo.id }),
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                console.log( userInfo.id, userInfo.username, 'custom hook ')
                setUpvote(prev => !prev)
                return true;
            } else {
                return false; // can not upvote
            }

        } catch (error) {
            console.log( error , 'upVote handler in cutom hook')
            return null;
        }

    }

    return { upvote,setUpvote, upVoteHandler }

}