'use client'

import {NewDocumentButton} from "@/components/NewDocumentButton";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {MenuIcon} from "lucide-react";
import {useCollection} from "react-firebase-hooks/firestore";
import {useUser} from "@clerk/nextjs";
import {collectionGroup, DocumentData, query, where} from "@firebase/firestore";
import {db} from "@/firebase";
import {useEffect, useState} from "react";
import SidebarOption from "@/components/SidebarOption";


interface RoomDocument extends DocumentData {
    createdAt: string,
    role: "owner" | "editor",
    roomId: string,
    userId: string
}


function Sidebar() {
    const {user} = useUser();
    const [groupData, setGroupData] = useState<{
        owner: RoomDocument[];
        editor: RoomDocument[];
    }>({owner: [], editor: []});

    const [data] = useCollection(
        user && (
            query(
                collectionGroup(db, 'rooms'),
                where('userId', '==', user.emailAddresses[0].toString())
            )
        )
    );

    useEffect(() => {
        if (!data) return;

        const group = data.docs.reduce<{
            owner: RoomDocument[];
            editor: RoomDocument[];
        }>(
            (aac, cur) => {
                const roomData = cur.data() as RoomDocument;

                if (roomData.role === 'owner') {
                    aac.owner.push({
                        id: cur.id,
                        ...roomData
                    });
                } else {
                    aac.editor.push({
                        id: cur.id,
                        ...roomData
                    });
                }

                return aac;
            }, {owner: [], editor: []}
        )

        setGroupData(group);

    }, [data]);


    const menuOptions = (
        <>
            <NewDocumentButton/>

            <div className={"flex py-4 flex-col space-y-4 md:max-w-36"}>
                {/*  My Documents  */}
                {groupData.owner.length === 0 ? (
                    <h2 className={"text-gray-500 font-semibold text-sm"}>No Document found</h2>
                ) : (
                    <>
                        <h2 className={"text-gray-500 font-semibold text-sm"}>My Documents</h2>
                        {
                            groupData.owner.map((doc) => (
                                <SidebarOption key={doc.id} id={doc.id} href={`/doc/${doc.id}`}/>
                            ))
                        }
                    </>
                )}

            {/*    List...*/}
            {/*   Shared with me */}

            {groupData.editor.length > 0 &&
                (
                    <>
                        <h2 className={"text-gray-500 font-semibold text-sm"}>Shared with Me</h2>
                        {
                            groupData.editor.map((doc) => (
                                <SidebarOption key={doc.id} id={doc.id} href={`/doc/${doc.id}`}/>
                            ))
                        }
                    </>
                )
            }

            {/*    List...*/}
            </div>
        </>
    );

    return (
        <div className={"p-2 md:p-5 bg-gray-200 relative"}>
            <div className={"md:hidden"}>
                <Sheet>
                    <SheetTrigger>
                        <MenuIcon className={"p-2 hover:opacity-30 rounded-lg"} size={40}/>
                    </SheetTrigger>

                    <SheetContent side={"left"}>
                        <SheetHeader>
                            <SheetTitle>Menu</SheetTitle>
                            <div>
                                {menuOptions}
                            </div>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            </div>

            <div className={"hidden md:inline"}>
                {menuOptions}
            </div>


        </div>
    );
}

export default Sidebar;