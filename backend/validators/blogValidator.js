const {z} = require("zod")

const createblogzod = z.object({
    title: z.string().trim().min(1,"title is required").max(150,"title must be under 150 characters"),
    blogtext: z.string().trim().min(1,"blog content is required").max(10000,"blog content is required"),
    tags: z.array(z.string().trim().toLowerCase().min(1,"tag cannot be empty")).min(1,"at least give one tag"),

})

module.exports = {createblogzod}


