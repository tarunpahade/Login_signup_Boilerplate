
import { NextApiRequest, NextApiResponse } from "next";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "@/helpers/mailer";
import Users from "@/dbconfig/dbconfig";



export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json()
    console.log('this is body',reqBody);
    
    
    const { username, email, password } = reqBody;


    //Check if user already exists
    const user1 = await Users.findOne({ email: email });
    if (user1) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }
    //hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
console.log('hashedPassword',hashedPassword);

    const newUser = {
      username,
      email,
      password: hashedPassword,
      isVerified:false,
      isAdmin:false,
      userId:Math.floor(Math.random()*100000),
     imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    }
    const savedUser = await Users.insertOne(newUser)
   

//send email
const mail=await  sendMail({email:email,emailtype:'verify',userId:savedUser.insertedId})


    return NextResponse.json({
      message: "User created successfully",
      success: true,
      savedUser,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

