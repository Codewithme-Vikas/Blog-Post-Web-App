import { Outlet } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {


    return (
        <>
            <div className='w-[95%] sm:w-[90%] lg:w-5/6 mx-auto'>
                <Header />
                <Outlet />
            </div>
            <ToastContainer 
                autoClose={3000}
                position="top-center"
            />
        </>
    )
}

export default App
