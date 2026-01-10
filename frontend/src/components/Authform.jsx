import { motion } from "framer-motion"
import useAuthstore from "../store/authstore"
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import toast from "react-hot-toast";
import api from "../axios";
import { FaUser } from "react-icons/fa";

export default function Authform({ type }) {
    const { login, user } = useAuthstore();
    const navigate = useNavigate();

    const islogin = type === "login";

    const validationschema = Yup.object({
        email: Yup.string().email().required("Email is required"),
        password: Yup.string().min(6).required("Password is required"),
        ...(islogin ? {} : {
            name: Yup.string().min(3).required("name is required"),
            role: Yup.string().oneOf(["reader", "writer", "editor"]).required("Role is required")
        })
    })


    const handlesubmit = async (values, { setSubmitting, setErrors }) => {
        try {
            const res = await api.post(`auth/${type}`, values)

            login(res.data)
            if (islogin) {
                toast('Logged in',
                    {
                        icon: '🎉',
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                    }
                )

                navigate("/home")

            } else {
                toast('Signup successful',
                    {
                        icon: '🎉',
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                    })
                navigate("/login")
            }

        } catch (error) {

            toast('Something went wrong',
                {
                    icon: '❌',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                })
        } finally {
            setSubmitting(false)
        }
    }
    return (
        <div className="min-h-screen bg-base-100 p-4 flex justify-center items-center">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            className={`w-full max-w-md mx-auto px-4 sm:px-6 py-8 `}
        >
            <div className="bg-base-100 p-6 sm:p-8 rounded-xl shadow-xl w-full">
                <h2 className="text-2xl font-bold text-center mb-6 flex justify-center items-center gap-2">  <FaUser />{islogin ? "Login" : "Sign Up"}</h2>
                <Formik initialValues={{ name: "", email: "", password: "", role: "reader" }} validationSchema={validationschema} onSubmit={handlesubmit}>
                    {({ isSubmitting, handleBlur, handleChange, values }) => (
                        <Form className="space-y-4">
                            {!islogin && (
                                <>
                                    <div>
                                        <label className="input input-bordered w-full">
                                            <svg className="h-5 w-5 opacity-70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                <g
                                                    strokeLinejoin="round"
                                                    strokeLinecap="round"
                                                    strokeWidth="2.5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                >
                                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                                    <circle cx="12" cy="7" r="4"></circle>
                                                </g>
                                            </svg>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.name}
                                                placeholder="Your name"
                                                className="grow"

                                            />
                                        </label>
                                        <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>


                                    <select className="select select-bordered w-full" name="role" onChange={handleChange} onBlur={handleBlur} value={values.role}>

                                        <option value="reader">Reader</option>
                                        <option value="writer">Writer</option>
                                        <option value="editor">Editor</option>
                                    </select>

                                    <ErrorMessage name="role" component="div" className="text-red-500 text-sm mt-1" />
                                </>
                            )}

                            <div>
                                <label className="input input-bordered join-item w-full">
                                    <svg className="h-5 w-5 opacity-70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <g
                                            strokeLinejoin="round"
                                            strokeLinecap="round"
                                            strokeWidth="2.5"
                                            fill="none"
                                            stroke="currentColor"
                                        >
                                            <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                        </g>
                                    </svg>
                                    <input type="email" className="grow" placeholder="mail@site.com" id="email" name="email" onChange={handleChange} onBlur={handleBlur} value={values.email} />

                                </label>
                                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1  " />



                            </div>



                            <div>
                                <label className="input input-bordered w-full">
                                    <svg className="h-5 w-5 opacity-70 " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <g
                                            strokeLinejoin="round"
                                            strokeLinecap="round"
                                            strokeWidth="2.5"
                                            fill="none"
                                            stroke="currentColor"
                                        >
                                            <path
                                                d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
                                            ></path>
                                            <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                                        </g>
                                    </svg>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="Password"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.password}
                                        className="grow"
                                    />
                                </label>

                                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                            </div>


                            <button className="w-full btn btn-active" type="submit" disabled={isSubmitting}>{islogin ? "Login" : "Sign Up"}</button>
                            {islogin ? (<div className="text-center mt-4"><Link className="link link-hover" to={"/signup"}>Don't have a account , Create one</Link></div>) : (<div className="text-center mt-4"><Link className="link link-hover" to={"/login"}>Already have a account</Link></div>)}

                        </Form>
                    )}
                </Formik>
            </div>

        </motion.div>
        </div>
       


    )
}