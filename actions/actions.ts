'use server';


import {auth} from "@clerk/nextjs/server";
import {adminDb} from "@/firebase-admin";
import liveblocks from "@/lib/liveblock";

export async function createNewDocument() {

    const {sessionClaims} = await auth();

    const docCollectionRef = adminDb.collection("documents");
    const docRef = await docCollectionRef.add(
        {
            title: "New Doc",
        });

    await adminDb.collection('users').doc(sessionClaims?.email!).collection('rooms')
        .doc(docRef.id).set({
            userId: sessionClaims?.email,
            role: "owner",
            createAt: new Date(),
            roomId: docRef.id
        });

    return {docId: docRef.id};
}

export async function deleteDocument(roomId: string) {

    try {
        await adminDb.collection("documents").doc(roomId).delete();

        const query = await adminDb
            .collectionGroup("rooms")
            .where("roomId", "==", roomId)
            .get();

        const batch = adminDb.batch();

        query.forEach((doc) => {
            batch.delete(doc.ref);
        });

        await batch.commit();

        await liveblocks.deleteRoom(roomId);

        return {success: true};

    } catch (e) {
        return {success: false};
    }
}

export async function InviteUserToDocument(roomId: string, email: string) {
    try {

        await adminDb.collection("users")
            .doc(email)
            .collection("rooms")
            .doc(roomId)
            .set({
                userId: email,
                role: "editor",
                createAt: new Date(),
                roomId
            });

        return {success: true};
    } catch (e) {
        return {success: false};
    }
}

export async function removeUserFromDocument(roomId: string, email: string) {
    try {
        await adminDb.collection("users")
            .doc(email)
            .collection("rooms")
            .doc(roomId)
            .delete();

        return {success: true};
    } catch (e) {
        return {success: false};
    }
}