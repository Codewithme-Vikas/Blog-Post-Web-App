import { useRouteError } from "react-router-dom"

export default function ErrorPage(){
    const error = useRouteError()
    console.log( error )
    return(
        <div className="text-center mt-8">
            <h1>There is a error occure</h1>        
            <h3 className="text-rose-500">{ error.status || error.message }</h3>
        </div>
    )
}