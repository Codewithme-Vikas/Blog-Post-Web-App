import { useContext, useEffect } from "react";
import { NavLink , useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { toast } from 'react-toastify'
import { BACKEND_URL } from "../utils/constant";
export default function Header() {
    const navigate = useNavigate()
    const { userInfo, setUserInfo } = useContext(UserContext);

    async function fetchUserData() {
        try {
            const response = await fetch( `${BACKEND_URL}/profile`, {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });

            // set according to api
            if (response.ok) {
                const userData = await response.json()
                setUserInfo(userData);
                return true
            } else {
                return false;  //see what will be api response 
            }

        } catch (error) {
            console.log(error, 'fetchuser data in header')
            return null;
        }
    }

    useEffect(() => {
        fetchUserData();
    }, []);

    async function logoutHandler() {

        try {
            const response = await fetch( `${BACKEND_URL}/logout`, {
                method: 'POST',
                credentials: 'include',
            })

            if (response.ok) {
                setUserInfo(null)
                toast.success('successfully logOut!')
                return navigate('/login');
            } else {
                toast.error("couldn't logout!")
                return false; // api send not logout or unexpected status
            }
        } catch (error) {
            console.log(error, 'logout handler ')
            return null;
        }
    }


    return (
        <div className="flex items-center justify-between py-2 mb-2">
            <div className="logo">
                <NavLink to={'/'} className='text-lg font-medium'>BlogPost</NavLink>
            </div>
            <div>
                <nav>
                    <ul className="flex items-center justify-end gap-3">

                        {userInfo &&
                            <>
                                {/* <NavLink to={''} className='p-1 font-medium text-lg italic'>{userInfo.username} </NavLink> */}
                                <NavLink to={`/profile/${userInfo.id}`} title={userInfo.username}>
                                    <img className='rounded-[50%] aspect-square object-cover w-[40px] hover:scale-110  duration-200 ease-in' src={ `${BACKEND_URL}/static/profile/${userInfo.avatar}`} />
                                </NavLink>
                                <NavLink to={'/post'} className='p-1'>Create post</NavLink>
                                <a
                                    onClick={logoutHandler}
                                    className='p-1 cursor-pointer'
                                >LogOut</a>
                            </>
                        }
                        {!userInfo &&
                            <>
                                <NavLink to={'/login'} className='p-1'>Login</NavLink>
                                <NavLink to={'/register'} className='p-1'>Register</NavLink>
                            </>
                        }

                    </ul>
                </nav>
            </div>
        </div>
    )
}