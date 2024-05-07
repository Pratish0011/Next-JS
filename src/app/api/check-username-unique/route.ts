import dbConnect from "@/lib/dbConnects";
import UserModel from "@/model/User";
import {z} from "zod"
import { usernameValidation } from "@/schemas/signUpSchema";



const UsernameQuerySchema= z.object({
    username: usernameValidation
})


export async function GET(request: Request){

    // Use this in all other routes

console.log("Request : ", request)

     await dbConnect()

     try {

        // Extracting query params
        const {searchParams} = new URL(request.url)

        const queryparam = {
            username: searchParams.get('username')
        }
        
        // validate with zod

        const result = UsernameQuerySchema.safeParse(queryparam)

        console.log(result)

        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []

            return Response.json(
                {
                    success: false,
                    message: usernameErrors?.length > 0 
                    ? usernameErrors.join(', ')
                    : "Invalid query parameters"
                },
                {
                    status: 400
                }
            )
        }

        const {username} = result.data

        const existingUser = await UserModel.findOne({
            username,
            isVerified: true
        })

        if(existingUser){
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken"
                },
                {
                    status: 400
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: "Username is unique"
            },
            {
                status: 201
            }
        )
     } catch (error) {
        console.error("Error checking username", error)
        return Response.json(
            {
                success: false,
                message:"Error checking username"
            },
            {
                status: 500
            }
        )
     }
}