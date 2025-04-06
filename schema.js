const {z} = require("zod");
const signUpSchema = z.object({
    email: z.string().email().min(8,"email must be at least 8 characters long"),
    password: z.string().min(8,'password must be at least 8 characters long'),
    name: z.string().min(3,'name must be at least 3 characters long')
})
const signInSchema = z.object({
    email: z.string().email().min(8,"email must be at least 8 characters long"),
    password: z.string().min(8,'password must be at least 8 characters long'),
})


module.exports = {signUpSchema,signInSchema}