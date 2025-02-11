'use client'

import {PointerEventHandler, ReactNode} from "react";
import {useMyPresence, useOthers} from "@liveblocks/react/suspense";
import FollowPointer from "@/components/FollowPointer";

function LiveCursorProvider({children}: { children: ReactNode }) {

    const [myPresence, updateMyPresence] = useMyPresence();
    const others = useOthers();

    const handlePointerMove: PointerEventHandler<HTMLDivElement> = (e) => {
        const cursor = {x: Math.floor(e.pageX), y: Math.floor(e.pageY)};
        updateMyPresence({cursor});
    };

    function handlePointerLeave() {
        console.log(myPresence)
        updateMyPresence({cursor: null});
    }

    return (
        <div
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
        >
            {/*    Render cursors*/}
            {others.filter((other) => other.presence.cursor !== null).map(
                ({connectionId, presence, info}) => (
                    <FollowPointer
                        key={connectionId}
                        info={info}
                        x={presence.cursor!.x}
                        y={presence.cursor!.y}
                    />
                )
            )}
            {children}
        </div>
    );
}

export default LiveCursorProvider;