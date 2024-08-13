import User from "@/app/models/User"; // Adjust the path to where your User model is located
import bcrypt from "bcryptjs";

async function createDefaultUser() {
  const defaultUserEmail = "admin@gmail.com"; // Set the default email
  const defaultUserPassword = "admin123"; // Set the default password
  const defaultUserRole = "admin"; // Set the default role
  const verified = true

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email: defaultUserEmail });
    if (existingUser) {
      console.log("Default user already exists.");
      return;
    }

    // Hash the default password
    const hashedPassword = await bcrypt.hash(defaultUserPassword, 10);

    // Create the default user
    const defaultUser =await User.create({
      email: defaultUserEmail,
      password: hashedPassword,
      role: defaultUserRole,
      fullname: "admin",
      verified
    });

    console.log("Default user created successfully.");
  } catch (err) {
    console.error("Error creating default user:", err);
  }
}

export default createDefaultUser;
