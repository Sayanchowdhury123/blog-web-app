import { motion } from "framer-motion"
import useAuthstore from "../store/authstore"
import { Link, useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import toast from "react-hot-toast";
import api from "../axios";
import { FaUser } from "react-icons/fa";
import useProfilestore from "@/store/profilestore";
import { IoMdClose } from "react-icons/io";
import useFpagestore from "@/store/fapagestore";

export default function Pinput() {
    const { editpassword, load, setupdatebox,editemail } = useProfilestore()
    const {userid} = useParams()
    const {fetchuserinfo} = useFpagestore()
    const validationschema = Yup.object({
        newemail: Yup.string().email().required("Email is required"),
        pass: Yup.string().min(6).required("Password is required"),

    })


    const handlesubmit = async (values, { setSubmitting, setErrors }) => {
        try {

            await editemail(values.pass,values.newemail)
            await fetchuserinfo(userid)
        } catch (error) {
            console.log(error);
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
                    <h2 className="text-xl font-bold ">Update Email</h2>
                    <div>
                        <IoMdClose onClick={setupdatebox} />
                    </div>

                </div>

                <Formik initialValues={{ pass: "", newemail: "" }} validationSchema={validationschema} onSubmit={handlesubmit}>
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
                                        id="pass"
                                        name="pass"
                                        type="password"
                                        placeholder="Enter Password"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.pass}
                                    />
                                </label>
                                <ErrorMessage name="pass" component="div" className="text-red-500 text-sm mt-1 ml-2 " />



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
                                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="12" cy="7" r="4"></circle>
                                        </g>
                                    </svg>
                                    <input
                                        id="newemail"
                                        name="newemail"
                                        type="email"
                                        placeholder="New Email"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.newemail}
                                    />
                                </label>

                                <ErrorMessage name="newemail" component="div" className="text-red-500 text-sm mt-1 ml-2" />
                            </div>


                            <button className="w-full btn btn-active" type="submit" disabled={isSubmitting}>Update Email</button>


                        </Form>
                    )}
                </Formik>
            </div>


        </motion.div>


    )
}