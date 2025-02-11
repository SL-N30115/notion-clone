import RoomProvider from "@/components/RoomProvider";
import {auth} from "@clerk/nextjs/server";
import {ReactNode} from "react";

interface PageParams {
    params: Promise<{
        id: string;
    }>;
    children: ReactNode;
}

async function DocLayout({children, params}: PageParams) {
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;

    const {userId, redirectToSignIn} = await auth();

    if (!userId) return redirectToSignIn();

    return (
        <RoomProvider roomId={id}>{children}</RoomProvider>
    );
}

export default DocLayout;