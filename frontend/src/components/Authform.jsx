import { motion } from "framer-motion"
import useAuthstore from "../store/authstore"
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { Button } from "@radix-ui/themes";
import api from "../axios";

export default function Authform({ type }) {
    const { login,user } = useAuthstore();
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
            console.log(res.data);
            login(res.data)
            if (islogin) {
                navigate("/home")
            } else {
                navigate("/login")
            }

        } catch (error) {
            setErrors({ email: "something went wrong" })
        } finally {
            setSubmitting(false)
        }
    }
    return (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto bg-white mt-20 p-6 shadow-xl rounded-lg"
        >
            <h2 className="text-2xl font-bold text-center mb-6">{islogin ? "Login" : "Sign Up"}</h2>
            <Formik initialValues={{ name: "", email: "", password: "", role: "reader" }} validationSchema={validationschema} onSubmit={handlesubmit}>
                {({ isSubmitting }) => (
                    <Form className="space-y-4">
                        {!islogin && (
                            <>
                                <Field name="name" className="input w-full" placeholder="Name" />
                                <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />

                                <Field as="select" name="role" className="w-full input" >
                                    <option value="reader">Reader</option>
                                    <option value="writer">Writer</option>
                                    <option value="editor">Editor</option>
                                </Field>
                                <ErrorMessage name="role" component="div" className="text-red-500 text-sm" />
                            </>
                        )}
                        <Field name="email" className="input w-full" placeholder="Email" />
                        <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />

                        <Field name="password" className="input w-full" placeholder="Password" />
                        <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />

                        <Button className="w-full" type="submit" disabled={isSubmitting}>{islogin ? "Login": "Sign Up"}</Button>

                    </Form>
                )}
            </Formik>
        </motion.div>
    )
}