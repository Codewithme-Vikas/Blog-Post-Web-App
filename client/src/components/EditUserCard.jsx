import { useContext, useState } from "react"
import { UserContext } from '../context/UserContext'
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/constant";
export default function EditUserCard({ user, setEditUser }) {
    const navigate = useNavigate()
    const { setUserInfo } = useContext(UserContext);


    const [avatar, setAvatar] = useState( `${BACKEND_URL}/static/profile/${user.avatar}`) // this is only for UI, it will not be used for send to server because it will be raw data after onchange due to handle change

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = (event) => {
                // Update the 'avatar' state with the data URL of the selected image
                setAvatar(event.target.result);
            };

            reader.readAsDataURL(file);
        }
    };


    async function profileEditHandler(event) {
        event.preventDefault()

        try {
            const formData = new FormData(event.target) // it also container avatar[ not useState avatar]

            const response = await fetch( `${BACKEND_URL}/user/profile/${user._id}`, {
                method: 'POST',
                body: formData,
                credentials: 'include',
            })

            if (response.ok) {
                const userData = await response.json();
                setUserInfo(userData)
                setEditUser(false)
                return navigate(`/profile/${user._id}`)
            } else {
                return false // api couldn't update the user data
            }
        } catch (error) {
            console.log(error, 'error in user/profile/:id api endpoints , profileEditHandler')
            return null;
        }

    }

    return (
        <>
            <div className="border p-6 my-8 flex rounded-lg hover:shadow-lg hover-shadow-slate-400">

                <form onSubmit={profileEditHandler}>

                    <h2 className="mt-0 font-bold typo-headline">Profile Picture</h2>
                    <p className="mt-1 typo-callout text-theme-label-tertiary">
                        Upload a picture to make your profile stand out and let people recognize
                        your comments and contributions easily!
                    </p>
                    <div className="flex relative w-min">
                        <label
                            className="relative group  flex justify-center items-center cursor-pointer overflow-hidden border w-24 h-24 rounded-[50%] mt-6"
                        >
                            <input
                                id="avatar"
                                type="file"
                                name="avatar"
                                className="hidden"
                                onChange={e => handleAvatarChange(e)}
                            />
                            <img
                                className="w-full h-full object-cover group-hover:opacity-64"
                                src={avatar || "https://lh3.googleusercontent.com/a-/AOh14GiCHTmj2KjD8KwsWj-c-o3iAobmj0FtDwTKh8b9=s100"}
                                alt="File upload preview"
                            />
                            <span className="hidden group-hover:block absolute">
                                <svg
                                    width="1em"
                                    height="1em"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-8 h-8 pointer-events-none"
                                >
                                    <path
                                        d="M12.833 4a4.83 4.83 0 013.781 1.823l.146.192.069.01a4.834 4.834 0 014.151 4.346l.015.223.005.218v4.046a4.833 4.833 0 01-4.171 4.788c-1.721.238-3.33.357-4.829.357-1.498 0-3.108-.12-4.829-.357a4.833 4.833 0 01-4.166-4.57L3 14.858v-4.046a4.833 4.833 0 013.956-4.753l.283-.044a4.835 4.835 0 013.454-1.992l.248-.018.226-.005h1.666zm0 1.5h-1.666a3.331 3.331 0 00-3.015 1.91c-.255.03-.514.064-.775.1a3.333 3.333 0 00-2.872 3.118l-.005.184v4.046a3.333 3.333 0 002.877 3.302 33.88 33.88 0 004.623.343 33.88 33.88 0 004.623-.343 3.333 3.333 0 002.872-3.118l.005-.184v-4.046a3.333 3.333 0 00-2.877-3.302c-.261-.036-.52-.07-.774-.099a3.335 3.335 0 00-2.807-1.905l-.209-.006zM12 9.5a3.333 3.333 0 110 6.667A3.333 3.333 0 0112 9.5zm0 1.5a1.833 1.833 0 100 3.667A1.833 1.833 0 0012 11zm5-1.333a.833.833 0 110 1.666.833.833 0 010-1.666z"
                                        fill="currentcolor"
                                        fillRule="evenodd"
                                    ></path>
                                </svg>
                            </span>
                        </label>
                    </div>
                    <h2 className="mt-10 font-bold typo-headline">Account Information</h2>

                    <div className="flex flex-col items-stretch max-w-sm mt-6 shadow rounded-lg shadow-slate-600 bg-[#1b1b1b]  hover:bg-[#1f1f1f]">
                        <div className="flex relative rounded-14 flex-row items-center TextField_field__sbF77 pl-3 h-12  px-4 overflow-hidden bg-theme-float border border-transparent cursor-text fields_field__Mnwg4">
                            <span className="mr-2 text-theme-label-primary">
                                <svg width="1em" height="1em" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 pointer-events-none">
                                    <path
                                        d="M20.25 13.375a3.125 3.125 0 01-5.723 1.738A4 4 0 017.5 12.5v-1a4 4 0 016.501-3.122L14 8.25a.75.75 0 011.493-.102l.007.102v5.125a1.625 1.625 0 003.244.14l.006-.14V9.75a5.25 5.25 0 00-5.034-5.246L13.5 4.5h-3a5.25 5.25 0 00-5.246 5.034l-.004.216v4.5a5.25 5.25 0 005.034 5.246l.216.004h3a.75.75 0 01.102 1.493L13.5 21h-3a6.75 6.75 0 01-6.746-6.513l-.004-.237v-4.5a6.75 6.75 0 016.513-6.746L10.5 3h3a6.75 6.75 0 016.746 6.513l.004.237v3.625zM11.5 9A2.5 2.5 0 009 11.5v1a2.5 2.5 0 105 0v-1A2.5 2.5 0 0011.5 9z"
                                        fill="currentcolor"
                                        fillRule="evenodd"
                                    ></path>
                                </svg>
                            </span>
                            <div className="flex flex-col flex-1 items-start max-w-full">
                                <label className="w-full text-xs text-gray-400" htmlFor="username">Username</label>
                                <input
                                    placeholder="Username"
                                    name="username"
                                    id="username"
                                    defaultValue={user.username}
                                    size={1}
                                    className="self-stretch text-theme-label-primary min-w-0  bg-transparent typo-body caret-theme-label-link focus:outline-none"
                                    fdprocessedid="qa0726"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-stretch max-w-sm mt-6 shadow-sm rounded-lg shadow-slate-600 bg-[#1b1b1b]  hover:bg-[#1f1f1f]">
                        <div className="flex relative rounded-14 flex-row items-center TextField_field__sbF77 pl-3 h-12  px-4 overflow-hidden bg-theme-float border border-transparent cursor-text fields_field__Mnwg4">
                            <span className="mr-2 text-theme-label-primary">
                                <svg width="1em" height="1em" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 pointer-events-none">
                                    <path
                                        d="M12 3a4.75 4.75 0 014.75 4.75 4.753 4.753 0 01-2.046 3.902l-.176.116.303.1.302.11.105.044.256.122c2.284 1.14 3.796 3.316 3.987 5.798l.016.267.004.266v.352l-.005.114-.008.104-.013.115a2.167 2.167 0 01-1.838 1.81l-.168.018-.212.013-1.985-.439a1 1 0 01-.783-1.028l.013-.112.297-1.787.016-.115a1 1 0 00-.832-1.083l-.081-.01-.082-.004h-3.59l-.116.002a1 1 0 00-.926.846l-.007.111.002.096.012.11.304 1.834a1 1 0 01-.662 1.11l-.108.03-1.984.44-.282-.02-.129-.015c-.94-.146-1.674-.89-1.813-1.88l-.018-.177-.003-.139.001-.36.006-.264c.116-2.657 1.774-5.009 4.364-6.171.199-.077.398-.146.598-.207l-.017-.01A4.75 4.75 0 0112 3zm0 14.5a1 1 0 110 2 1 1 0 010-2zm.002-4.62c-.865 0-1.73.165-2.595.496-1.922.865-3.208 2.61-3.385 4.597l-.016.239-.005.233-.001.33.002.098.015.102a.67.67 0 00.45.487l.098.023.067.005 1.31-.29-.227-1.367-.019-.136-.01-.137-.005-.137.006-.164a2.5 2.5 0 012.168-2.315l.162-.016.164-.005h3.639l.137.004a2.5 2.5 0 012.362 2.58l-.011.162-.022.163-.227 1.368 1.315.291.104-.015a.667.667 0 00.492-.448l.023-.1.008-.103v-.352l-.004-.237-.015-.24c-.155-1.838-1.262-3.47-2.937-4.394l-.221-.116-.228-.108-.325-.117a7.103 7.103 0 00-2.27-.381zM12 4.5a3.25 3.25 0 101.347 6.209l.201-.1.194-.116.166-.113A3.25 3.25 0 0012 4.5z"
                                        fill="currentcolor"
                                        fillRule="evenodd"
                                    ></path>
                                </svg>
                            </span>
                            <div className="flex flex-col flex-1 items-start max-w-full">
                                <label className="w-full text-xs text-gray-400" htmlFor="emial">Email</label>
                                <input
                                    placeholder="Email"
                                    name="email"
                                    id="email"
                                    defaultValue={user.email}
                                    size={1}
                                    className="self-stretch text-theme-label-primary min-w-0  bg-transparent typo-body caret-theme-label-link focus:outline-none"
                                    fdprocessedid="slkcud"
                                />
                            </div>
                        </div>
                    </div>

                    <h2 className="mt-10 font-bold typo-headline">About</h2>
                    <div className="flex flex-col max-w-sm mt-6 shadow rounded-lg shadow-slate-600 bg-[#1b1b1b]  hover:bg-[#1f1f1f]">
                        <div className="flex relative rounded-14 flex-col TextField_field__sbF77 pt-2  px-4 overflow-hidden bg-theme-float border border-transparent cursor-text fields_field__Mnwg4">
                            <textarea
                                placeholder="Bio"
                                name="bio"
                                id="bio"
                                defaultValue={user.bio}
                                maxLength={200}
                                rows={5}
                                className="w-full min-w-0 self-stretch bg-transparent typo-body caret-theme-label-link focus:outline-none resize-none mb-3 text-theme-label-tertiary hover:text-theme-label-primary"
                            />
                            <span className="py-2 ml-auto typo-caption1 text-theme-label-quaternary">0/100</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-stretch max-w-sm mt-6 shadow rounded-lg shadow-slate-600 bg-[#1b1b1b]  hover:bg-[#1f1f1f]">
                        <div className="flex relative rounded-14 flex-row items-center TextField_field__sbF77 h-12  px-4 overflow-hidden bg-theme-float border border-transparent cursor-text fields_field__Mnwg4">
                            <div className="flex flex-col flex-1 items-start max-w-full">
                                <input
                                    placeholder="Company"
                                    name="company"
                                    id="company"
                                    defaultValue={user.company}
                                    size={1}
                                    className="self-stretch text-theme-label-tertiary hover:text-theme-label-primary min-w-0  bg-transparent typo-body caret-theme-label-link focus:outline-none"
                                    fdprocessedid="j124up"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-stretch max-w-sm mt-6 shadow rounded-lg shadow-slate-600 bg-[#1b1b1b]  hover:bg-[#1f1f1f]">
                        <div className="flex relative rounded-14 flex-row items-center TextField_field__sbF77 h-12  px-4 overflow-hidden bg-theme-float border border-transparent cursor-text fields_field__Mnwg4">
                            <div className="flex flex-col flex-1 items-start max-w-full">
                                <input
                                    placeholder="Job Title"
                                    name="job"
                                    id="job"
                                    defaultValue={user.job}
                                    size={1}
                                    className="self-stretch text-theme-label-tertiary hover:text-theme-label-primary min-w-0  bg-transparent typo-body caret-theme-label-link focus:outline-none"
                                    fdprocessedid="x53ar"
                                />
                            </div>
                        </div>
                    </div>

                    <h2 className="mt-10 font-bold typo-headline">Profile Social Links</h2>
                    <p className="mt-1 typo-callout text-theme-label-tertiary">
                        Add your social media profiles so others can connect with you and you can grow your network!
                    </p>
                    <div className="flex flex-col items-stretch max-w-sm mt-6 shadow rounded-lg shadow-slate-600 bg-[#1b1b1b]  hover:bg-[#1f1f1f]">
                        <div className="flex relative rounded-14 flex-row items-center TextField_field__sbF77 pl-3 h-12  px-4 overflow-hidden bg-theme-float border border-transparent cursor-text fields_field__Mnwg4">
                            <span className="mr-2 text-theme-label-tertiary hover:text-theme-label-primary">
                                <svg height="1em" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 pointer-events-none">
                                    <path
                                        d="M20.281 8.16c-.156 7.225-4.687 12.251-11.562 12.565-2.813.157-4.844-.785-6.719-1.884 2.031.314 4.687-.471 6.094-1.728-2.032-.157-3.282-1.256-3.907-2.984.625.157 1.25 0 1.72 0-1.876-.628-3.126-1.728-3.282-4.24.469.314 1.094.47 1.719.47C2.937 9.575 2 6.59 3.094 4.707c2.031 2.198 4.531 4.083 8.593 4.397-1.093-4.397 4.844-6.753 7.188-3.77 1.094-.156 1.875-.627 2.656-.941-.312 1.099-.937 1.727-1.718 2.355.78-.157 1.562-.314 2.187-.628-.156.785-.938 1.414-1.719 2.042z"
                                        fill="currentcolor"
                                        fillRule="evenodd"
                                    />
                                </svg>
                            </span>
                            <div className="flex flex-col flex-1 items-start max-w-full">
                                <input
                                    placeholder="Twitter"
                                    name="twitter"
                                    id="twitter"
                                    defaultValue={user.twitter}
                                    size={1}
                                    className="self-stretch text-theme-label-tertiary hover:text-theme-label-primary min-w-0  bg-transparent typo-body caret-theme-label-link focus:outline-none"
                                    fdprocessedid="hnieot"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-stretch max-w-sm mt-6 shadow rounded-lg shadow-slate-600 bg-[#1b1b1b]  hover:bg-[#1f1f1f]">
                        <div className="flex relative rounded-14 flex-row items-center TextField_field__sbF77 pl-3 h-12  px-4 overflow-hidden bg-theme-float border border-transparent cursor-text fields_field__Mnwg4">
                            <span className="mr-2 text-theme-label-tertiary hover:text-theme-label-primary">
                                <svg width="1em" height="1em" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 pointer-events-none">
                                    <path
                                        d="M9.106 24c-.002-.466-.005-.914-.01-1.343a168.92 168.92 0 01-.009-1.685l-.436.075a5.57 5.57 0 01-1.052.066 8.027 8.027 0 01-1.318-.132 2.946 2.946 0 01-1.27-.568 2.403 2.403 0 01-.834-1.164l-.19-.436a4.731 4.731 0 00-.597-.966c-.272-.353-.547-.593-.825-.72l-.132-.094a1.391 1.391 0 01-.247-.228 1.039 1.039 0 01-.17-.265c-.038-.088-.007-.16.094-.218.102-.057.285-.084.55-.084l.38.056c.252.05.565.202.938.455.373.252.68.58.92.984.29.518.64.912 1.052 1.184.41.271.824.407 1.241.407.417 0 .778-.032 1.081-.095.303-.063.588-.158.853-.284.114-.846.424-1.496.93-1.95-.721-.076-1.369-.19-1.944-.342a7.743 7.743 0 01-1.782-.738 5.103 5.103 0 01-1.527-1.269c-.404-.505-.736-1.168-.995-1.988-.259-.821-.389-1.768-.389-2.841 0-1.528.5-2.828 1.498-3.901-.467-1.149-.423-2.437.133-3.863.367-.114.91-.029 1.63.255.721.284 1.249.528 1.584.73.335.201.603.372.806.51a13.478 13.478 0 013.64-.491c1.251 0 2.465.164 3.64.492l.721-.454a10.21 10.21 0 011.744-.834c.67-.252 1.182-.322 1.537-.208.568 1.427.619 2.714.15 3.863C21.502 6.989 22 8.29 22 9.817c0 1.073-.13 2.023-.389 2.85s-.593 1.49-1.004 1.988a5.3 5.3 0 01-1.536 1.26 7.758 7.758 0 01-1.783.738c-.575.152-1.223.266-1.943.342.657.568.986 1.464.986 2.689V24H9.106z"
                                        fill="currentcolor"
                                        fillRule="evenodd"
                                    />
                                </svg>
                            </span>
                            <div className="flex flex-col flex-1 items-start max-w-full">
                                <input
                                    placeholder="GitHub"
                                    name="github"
                                    id="github"
                                    defaultValue={user.github}
                                    size={1}
                                    className="self-stretch text-theme-label-tertiary hover:text-theme-label-primary min-w-0  bg-transparent typo-body caret-theme-label-link focus:outline-none"
                                    fdprocessedid="pbfg6h"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-stretch max-w-sm mt-6 shadow rounded-lg shadow-slate-600 bg-[#1b1b1b]  hover:bg-[#1f1f1f]">
                        <div className="flex relative rounded-14 flex-row items-center TextField_field__sbF77 pl-3 h-12  px-4 overflow-hidden bg-theme-float border border-transparent cursor-text fields_field__Mnwg4">
                            <span className="mr-2 text-theme-label-tertiary hover:text-theme-label-primary">

                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" className="bi bi-linkedin" viewBox="0 0 16 16">
                                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
                                </svg>
                            </span>
                            <div className="flex flex-col flex-1 items-start max-w-full">
                                <input
                                    placeholder="Linkedin"
                                    name="linkedin"
                                    id="linkedin"
                                    defaultValue={user.linkedin}
                                    size={1}
                                    className="self-stretch text-theme-label-tertiary hover:text-theme-label-primary min-w-0  bg-transparent typo-body caret-theme-label-link focus:outline-none"
                                    fdprocessedid="maswq2"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-stretch max-w-sm mt-6 shadow rounded-lg shadow-slate-600 bg-[#1b1b1b]  hover:bg-[#1f1f1f]">
                        <div className="flex relative rounded-14 flex-row items-center TextField_field__sbF77 pl-3 h-12  px-4 overflow-hidden bg-theme-float border border-transparent cursor-text fields_field__Mnwg4">
                            <span className="mr-2 text-theme-label-tertiary hover:text-theme-label-primary">
                                <svg width="1em" height="1em" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 pointer-events-none">
                                    <path
                                        d="M13.2 4.096a3.743 3.743 0 015.148-.137l.144.137 1.412 1.412a3.743 3.743 0 01.137 5.148l-.137.144-4.023 4.023a3.743 3.743 0 01-5.148.137l-.144-.137-.706-.706a.749.749 0 01.982-1.125l.076.067.706.705c.84.84 2.181.876 3.063.105l.113-.105 4.022-4.022c.84-.84.876-2.181.105-3.064l-.105-.112-1.411-1.411a2.246 2.246 0 00-3.063-.105l-.113.105L13.2 6.213a.749.749 0 01-1.126-.982l.067-.076L13.2 4.096zM8.119 9.177a3.743 3.743 0 015.148-.137l.144.137.706.706a.749.749 0 01-.982 1.125l-.076-.067-.706-.705a2.246 2.246 0 00-3.063-.105l-.113.105-4.022 4.022a2.246 2.246 0 00-.105 3.064l.105.112 1.411 1.411c.84.84 2.181.876 3.063.105l.113-.105 1.058-1.058a.749.749 0 011.126.982l-.067.076-1.059 1.059a3.743 3.743 0 01-5.148.137l-.144-.137-1.412-1.412a3.743 3.743 0 01-.137-5.148l.137-.144L8.12 9.177z"
                                        fill="currentcolor"
                                        fillRule="evenodd"
                                    />
                                </svg>
                            </span>
                            <div className="flex flex-col flex-1 items-start max-w-full">
                                <input
                                    placeholder="Your Website"
                                    name="portfolio"
                                    id="portfolio"
                                    defaultValue={user.portfolio}
                                    size={1}
                                    className="self-stretch text-theme-label-tertiary hover:text-theme-label-primary min-w-0  bg-transparent typo-body caret-theme-label-link focus:outline-none"
                                    fdprocessedid="g0wlua"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 my-4">
                        <button className="btn hover:text-green-600">UpDate</button>
                        <button onClick={() => setEditUser(false)} type="button" className="btn hover:text-blue-600">Cancle</button>
                    </div>

                </form>

                <div className="right-box"></div>
            </div>




        </>
    )
}