'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {FormEvent, useState, useTransition} from "react";
import {Button} from "@/components/ui/button";
import {usePathname} from "next/navigation";
import {toast} from "sonner";
import { Input } from "@/components/ui/input"
import {InviteUserToDocument} from "@/actions/actions";


function InviteUser() {

    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const pathName = usePathname();
    const [email, setEmail] = useState("");

    const handleInvite = async (e: FormEvent) => {
        e.preventDefault();

        const roomId = pathName.split("/").pop();
        if (!roomId) return;



        startTransition(async () => {
            const {success} = await InviteUserToDocument(roomId, email);

            if (success) {
                setIsOpen(false);
                setEmail("");
                toast.success("User invited successfully");
            } else {
                toast.error("An error occurred while inviting the user");
            }
        });
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <Button asChild variant={"outline"}>
                <DialogTrigger>Invite</DialogTrigger>
            </Button>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invite a User to collaborate</DialogTitle>
                    <DialogDescription>
                        Enter the email of the user you want to invite
                    </DialogDescription>
                </DialogHeader>
                <form className={"flex gap-2"} onSubmit={handleInvite}>
                    <Input
                    type={"email"}
                    placeholder={"Enter email"}
                    className={"w-full"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button type={"submit"} disabled={!email || isPending}>
                        {isPending ? "Inviting..." : "Invite"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>

    );
}

export default InviteUser;