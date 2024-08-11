import dbConnect from "@/utils/dbConnect";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {

  await dbConnect();

      try {
        const { fullname, email, password } = await req.json();
         console.log("sa",fullname,email,password)
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
                console.log("ssfjyj", existingUser);

        if (existingUser) {
          return new Response(
            JSON.stringify({
              message: "User Already Exists",
              error: error.message,
            }),
            {
              status: 500,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
                console.log("ssfj", hashedPassword);

        // Create a new user
        const newUser = await User.create({
          fullname,
          email,
          password: hashedPassword,
        });
        console.log("ssf",newUser)

        // Respond with the created user (excluding the password)
        return new Response(
          JSON.stringify({
            success: true,
            data: {
              id: newUser._id,
              fullname: newUser.fullname,
              email: newUser.email,
            },
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } catch (err) {
        return new Response(
          JSON.stringify({
            message: "Failed to save data",
            error: err.message,
          }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
   
  
}
