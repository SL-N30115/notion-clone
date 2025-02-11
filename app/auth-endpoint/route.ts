import {NextRequest, NextResponse} from "next/server";
import {auth} from "@clerk/nextjs/server";
import liveblocks from "@/lib/liveblock";
import {adminDb} from "@/firebase-admin";

export async function POST(req: NextRequest) {
    const {userId, redirectToSignIn} = await auth()

    if (!userId) return redirectToSignIn()

    const {sessionClaims} = await auth()
    const {room} = await req.json();

    const userEmail = sessionClaims?.email || '';
    const userName = sessionClaims?.fullName || 'Anonymous';
    const userAvatar = sessionClaims?.image || '';

    if (!userEmail) {
        return new Response('Email is required', {status: 400});
    }

    const session = liveblocks.prepareSession(userEmail, {
        userInfo: {
            name: userName,
            email: userEmail,
            avavar: userAvatar,
        },
    });

    const usersInRoom = await adminDb.collectionGroup("rooms")
        .where("userId", "==", userEmail).get();

    const userInRoom =
        usersInRoom.docs.find((doc) => doc.id === room);

    if (userInRoom?.exists) {
        session.allow(room, session.FULL_ACCESS);
        const {body, status} = await session.authorize();

        console.log(`User ${userEmail} is allowed to access room ${room}`);

        return new Response(body, {status});
    }
    else {
        return NextResponse.json(
            {message : "You are not allowed to access this room"},
            {status: 403}
        );
    }
}