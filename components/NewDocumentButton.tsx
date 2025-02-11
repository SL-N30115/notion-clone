'use client';

import {Button} from "@/components/ui/button";
import {useTransition} from "react";
import {useRouter} from "next/navigation";
import {createNewDocument} from "@/actions/actions";

export const NewDocumentButton = () => {

    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleCreateNewDocument = () => {
        startTransition(async () => {
            // Create a new document
            const {docId} = await createNewDocument();
            router.push(`/doc/${docId}`);
        });
    };

    return (
        <Button onClick={handleCreateNewDocument}
                disabled={isPending}>{isPending ? "Creating..." : "New Document"}</Button>
    );
};
