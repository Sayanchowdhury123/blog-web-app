import { motion } from "framer-motion"
import useAuthstore from "../store/authstore"
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import toast from "react-hot-toast";
import api from "../axios";
import { FaUser } from "react-icons/fa";
import useProfilestore from "@/store/profilestore";
import { IoMdClose } from "react-icons/io";

export default function Updatep() {
    const { editpassword, load, setupdatebox } = useProfilestore()

    const validationschema = Yup.object({
        newpass: Yup.string().min(6).required("Password is required"),
        oldpass: Yup.string().min(6).required("Password is required"),

    })


    const handlesubmit = async (values, { setSubmitting, setErrors }) => {
        try {

            await editpassword(values.oldpass, values.newpass)

        } catch (error) {
           toast.error(error.response?.data?.msg || "Something went wrong");

        } finally {
            setSubmitting(false)
        }
    }


    return (

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            className="z-20 backdrop-blur-sm inset-0 fixed flex justify-center items-center"
        >
            <div className="bg-base-200 w-[400px] p-6 rounded-xl ">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold ">Update Password</h2>
                    <div>
                        <IoMdClose onClick={setupdatebox} />
                    </div>

                </div>

                <Formik initialValues={{ newpass: "", oldpass: "" }} validationSchema={validationschema} onSubmit={handlesubmit}>
                    {({ isSubmitting, handleBlur, handleChange, values }) => (
                        <Form className="space-y-4">


                            <div>
                                <label className="input join-item w-full">
                                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
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
                                        id="oldpass"
                                        name="oldpass"
                                        type="password"
                                        placeholder="old password"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.oldpass}
                                    />
                                </label>
                                <ErrorMessage name="oldpass" component="div" className="text-red-500 text-sm mt-1 ml-2 " />



                            </div>



                            <div>
                                <label className="input w-full">
                                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
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
                                        id="newpass"
                                        name="newpass"
                                        type="password"
                                        placeholder="new password"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.newpass}
                                    />
                                </label>

                                <ErrorMessage name="newpass" component="div" className="text-red-500 text-sm mt-1 ml-2" />
                            </div>


                            <button className="w-full btn btn-active" type="submit" disabled={isSubmitting}>Update Password</button>


                        </Form>
                    )}
                </Formik>
            </div>


        </motion.div>


    )
}