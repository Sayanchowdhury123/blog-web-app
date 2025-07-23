import useAuthstore from "../store/authstore"
import { motion } from "framer-motion"

export default function Alert({del}) {

const {setshowalert} = useAuthstore()

    return (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.3}} className="card bg-neutral text-neutral-content w-96">
            <div className="card-body items-center text-center">
                <h2 className="card-title">Delete!</h2>
                <p>Are you sure you want to delete this blog?</p>
                <div className="card-actions justify-end mt-3">
                    <button className="btn btn-primary" onClick={del}>Confirm</button>
                    <button className="btn btn-error" onClick={setshowalert}>Cancel</button>
                </div>
            </div>
        </motion.div>
    )
}