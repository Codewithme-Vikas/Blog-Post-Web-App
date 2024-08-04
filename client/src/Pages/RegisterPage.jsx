import { Form, redirect, useActionData } from "react-router-dom";
import { toast } from "react-toastify";
import { BACKEND_URL } from "../utils/constant";

export async function action( { request }){
    try {
        const formData = await request.formData();
        const data = Object.fromEntries( formData )
        const repsonse = await fetch( `${BACKEND_URL}/register`,{
            method : 'POST',
            body : JSON.stringify( data ),
            headers : { 'Content-Type' : 'application/json'}
        })

        if ( repsonse.ok ){
            // return { success : true , error : 'successfull registeration!'}
            return redirect('/login');
        }else{
            // return { success : false , error : 'registeration is failed!'}
            return toast.error('Registration is failed!');
        }
        
    } catch (error) {
        return null // can't perform fetch
    }
}

export default function RegisterPage() {
    
    return (
        <div className="mt-8">
            <h3 className="text-center text-lg font-medium">Create Account</h3>
            <Form method="post" className="border w-full sm:w-3/4 mx-auto p-4 sm:p-8 flex flex-col gap-5 my-8 rounded shadow-lg shadow-cyan-700">

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
                    <label className="hover:cursor-pointer" htmlFor="email">Email :</label>
                    <input type="email"
                        id="email"
                        name="email"
                        placeholder="username@email.com"
                        className="py-2 px-4 rounded-md"
                    />
                </div>

                <div className="form-control flex flex-col gap-1">
                    <label className="hover:cursor-pointer" htmlFor="password">password :</label>
                    <input type="password"
                        id="password"
                        name="password"
                        
                        className="py-2 px-4 rounded-md"
                    />
                    <span className="text-sm text-gray-500">Create a strong password with numbers , special , lowercase and uppercase character!</span>
                </div>

                <div>
                    <button className="btn">Create account</button>
                </div>
                
            </Form>
        </div>
    )
}