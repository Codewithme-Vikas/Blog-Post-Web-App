import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { UserContextProvider } from './context/UserContext.jsx'

import ErrorPage from './ErrorPage.jsx'
import HomePage , { loader as homePageLoader } from './Pages/HomePage.jsx'
import RegisterPage , { action as registerAction } from './Pages/RegisterPage.jsx'
import LoginPage from './Pages/LoginPage.jsx'
import CreatePostPage  from './Pages/CreatePostPage.jsx'
import PostPage , { loader as postPageLoader } from './Pages/PostPage.jsx'
import UserPostsPage , { loader as userPostsLoader } from './Pages/UserPostsPage.jsx'
import ProfilePage , { loader as profileLoader } from './Pages/ProfilePage.jsx'

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <HomePage />,
                loader : homePageLoader,
            },
            {
                path: 'register',
                element: <RegisterPage />,
                action : registerAction,
            },
            {
                path: 'login',
                element: <LoginPage />,
            },
            {
                path : 'post',
                element : <CreatePostPage/>,
            },
            {
                path : 'post/:id',
                element : <PostPage/>,
                loader : postPageLoader,
            },
            {
                path : 'author/:id',
                element : <UserPostsPage/>,
                loader : userPostsLoader,
            },
            {
                path : 'profile/:id',
                element : <ProfilePage/>,
                loader : profileLoader,
            }
        ],
    }
])

ReactDOM.createRoot(document.getElementById('root')).render(
    //   <React.StrictMode>
    <UserContextProvider>
        <RouterProvider router={router}>
            <App />
        </RouterProvider>
    </UserContextProvider>
    //   </React.StrictMode>,
)
