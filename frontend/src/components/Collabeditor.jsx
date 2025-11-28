
import Sidebar from '@/components/Sidebar'

import useAuthstore from '@/store/authstore'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'


import 'reactjs-tiptap-editor/style.css';

import 'prism-code-editor-lightweight/layout.css';
import 'prism-code-editor-lightweight/themes/github-dark.css';

import Loading2 from '@/components/Loadin2'
import api from '@/axios'
import toast from 'react-hot-toast'
import useProfilestore from '@/store/profilestore'
import useBlogmstore from '@/store/Blogm'
import Collabe from './Collabe'
import Navbar from './Navbar';








export default function Collabeditor() {

    const { user } = useAuthstore()
    const location = useLocation()
    const { t, editor } = location.state || {};
    const [blogtext, setblogtext] = useState(t?.blogtext || "")
    const [l, setl] = useState(false)
    const navigate = useNavigate()
    const { setshownav } = useAuthstore()
    const { fetchuser, userinfo } = useProfilestore()
    const { blogt, clearblogtext } = useBlogmstore()










    const endcollab = async () => {
        try {
            const res = await api.patch(`/blogs/${t._id}/end-collab`, { blogid: t._id }, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            console.log(res.data);

        } catch (error) {
            console.log(error);
        }
    }


    const handlesubmit = async (e) => {
        e.preventDefault()
        setl(true)

        try {


            endcollab()

            toast('Content Updation successful',
                {
                    icon: '🎉',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                })

            if (user.role === "editor") {
                const res = await api.post(`/profile/${t._id}/ep/${user.id}`, {}, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    }
                })


            }


            navigate('/yourblogs')

        } catch (error) {
            console.log(error);
            toast('Content updation failed',
                {
                    icon: '❌',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                })
        } finally {
            setl(false)
        }
    }

    useEffect(() => {
        fetchuser()
    }, [])

    if (l) return <Loading2 />

   

    return (
        <div className="  relative w-full   ">



            <Sidebar />
            <div className=' space-y-4  w-full'>

               <Navbar/>
                <div className=''>
                    <h1 className="text-3xl text-center font-semibold">Collaboration</h1>
                </div>

                <div className='flex justify-center items-center  p-4 '>
                    <form onSubmit={handlesubmit} className=" w-full" >
                        <div className='w-full max-w-4xl mx-auto' >
                            <Collabe intialContent={t?.blogtext} onContentChange={setblogtext} blogid={t._id} blog={t}   />
                        </div>
                        

                        <div className='text-center'>
                            <button type='submit' className='btn btn-neutral mt-4 '>Exit</button>
                        </div>


                    </form>

                </div>

            </div>



        </div>

    )
}