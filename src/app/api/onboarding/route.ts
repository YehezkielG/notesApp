import { auth } from "@/auth";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { validateOnboarding, validateUsername, validateBio, validateGender, validateDisplayName } from "@/lib/utils/validator";

export async function POST(request: Request) {
    try {
        console.log(request.body)
        const session = await auth();

        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ err: "Not authenticated." }, { status: 401 });
        }
        
        const userId = session.user.id;

        const { username, displayName, gender, bio } = await request.json();

        // validate payload via centralized validators
        const validationError = validateOnboarding({ username, displayName, gender, bio });
        if (validationError) {
            return NextResponse.json({ errInput:{
                username: validateUsername(username),
                displayName: validateDisplayName(displayName),
                gender: validateGender(gender),
                bio: validateBio(bio),
            }  }, { status: 400 });
        }

        await dbConnect();

        const existingUser = await User.findOne({ 
            username: username,
            _id: { $ne: userId }
        });
        
        if (existingUser) {
            return NextResponse.json({ message: "Username already taken. Try another." }, { status: 409 });
        }

        await User.findByIdAndUpdate(userId, {
            $set: {
                username: username,
                displayName: displayName,
                name: displayName,
                gender: gender,
                bio: bio, // optional bio saved here
                isOnboarded: true,
            },
        });

        return NextResponse.json({ message: "Profile saved successfully!" }, { status: 200 });

    } catch (error) {
        console.error("Onboarding failed:", error);
        return NextResponse.json({ message: "Internal server error." }, { status: 500 });
    }
}
