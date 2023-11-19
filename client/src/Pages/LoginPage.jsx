import { useContext } from "react"
import { useNavigate } from 'react-router-dom'
import { UserContext } from "../context/UserContext"
import { toast } from 'react-toastify'


export default function LoginPage() {
    const { setUserInfo } = useContext(UserContext)
    const navigate = useNavigate()


    async function loginHandler(event) {
        event.preventDefault()
        try {
            const formData = new FormData(event.target)
            const data = Object.fromEntries(formData)

            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' },
                credentials : 'include',
            })

            if (response.ok) {
                const responseData = await response.json()
                setUserInfo(responseData)
                return navigate("/");
            } else {
                toast.error('invalid credenticals')
                return false; // form data is not matched with actual user data
            }
        } catch (error) {
            console.log( error , 'login client side')
            return null // error during fetch the api
        }
    }

    return (
        <div className="mt-8">
            <h3 className="text-center text-xl font-medium">Login</h3>
            <form onSubmit={loginHandler} className="border w-full sm:w-3/4 mx-auto p-4 sm:p-8 flex flex-col gap-5 my-8 rounded shadow-lg shadow-cyan-700">

                <div className="form-control flex flex-col gap-1">
                    <label className="hover:cursor-pointer" htmlFor="username">Username :</label>
                    <input type="text"
                        id="username"
                        name="username"
                        placeholder="Enter username"
                        className="py-2 px-4 rounded-md"
                    />
                </div>

                <div className="form-control flex flex-col gap-1">
                    <label className="hover:cursor-pointer" htmlFor="password">password :</label>
                    <input type="password"
                        id="password"
                        name="password"
                        placeholder="Enter your account password"
                        className="py-2 px-4 rounded-md"
                    />
                </div>

                <div>
                    <button className="btn">Login</button>
                </div>

            </form>
        </div>
    )
}