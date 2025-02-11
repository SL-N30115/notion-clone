'use client'

import {ReactNode} from "react";
import {ClientSideSuspense, RoomProvider as RoomProviderWrapper} from "@liveblocks/react";
import LoadingSpinner from "@/components/LoadingSpinner";
import LiveCursorProvider from "@/components/LiveCursorProvider";

function RoomProvider({roomId, children}: { roomId: string, children: ReactNode }) {
    return (
        <RoomProviderWrapper
            id={roomId}
            initialPresence={{
                cursor: null
            }}>
            <ClientSideSuspense fallback={<LoadingSpinner/>}>
                <LiveCursorProvider>
                    {children}
                </LiveCursorProvider>
            </ClientSideSuspense>
        </RoomProviderWrapper>
    );
}

export default RoomProvider;