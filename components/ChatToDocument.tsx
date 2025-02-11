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
import {toast} from "sonner";
import {Input} from "@/components/ui/input"
import * as Y from "yjs";
import {BotIcon, MessageCircleCode} from "lucide-react";
import Markdown from "react-markdown";


function ChatToDocument({doc}: { doc: Y.Doc }) {

    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [summary, setSummary] = useState<string>("");
    const [input, setInput] = useState('');
    const [question, setQuestion] = useState('');

    const handleAskQuestion = async (e: FormEvent) => {
        e.preventDefault();

        setQuestion(input);

        startTransition(async ()=> {
            const docStore = doc.get("document-store");
            const documentData = docStore.toJSON() as string;


            const texts = documentData.match(/<paragraph[^>]*>(.*?)<\/paragraph>/g)
                ?.map(p => {
                    const match = p.match(/<paragraph[^>]*>(.*?)<\/paragraph>/);
                    return match ? match[1] : '';
                })
                .filter(text => text.trim().length > 0);

            const textContent = texts?.join('\n\n') || '';

            if (!textContent) {
                toast.error("Document is empty");
                return;
            }

            console.log("Extracted content:", textContent);

            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/chatToDocument`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        documentData: textContent,
                        question: input
                    })
                }
            );

            if (res.ok) {
                const {message} = await res.json();
                setInput("");
                setSummary(message);
                toast.success("Question asked successfully");
            }
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <Button asChild variant={"outline"}>
                <DialogTrigger>
                    <MessageCircleCode className={"mr-2"}/>
                    Chat to Document
                </DialogTrigger>
            </Button>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Chat too the Document!</DialogTitle>
                    <DialogDescription>
                        Ask a question and chat to the document with AI
                    </DialogDescription>

                    <hr className={"mt-5"}/>
                    {question && <p className={"mt-5 text-gray-500"}>Q: {question}</p>}
                </DialogHeader>

                {summary && (
                    <div className={"flex flex-col items-center max-h-96 overflow-y-scroll gap-2 p-5 bg-gray-100"}>
                        <div className={"flex"}>
                            <BotIcon className={"w-10 flex-shrink-0"}/>
                            <p className={"font-bold"}>
                                GPT {isPending ? "is thinking...." : "Says"}
                            </p>
                        </div>
                        <p>{isPending ? "Thinking..." : <Markdown>{summary}</Markdown>}</p>
                    </div>
                )}

                <form className={"flex gap-2"} onSubmit={handleAskQuestion}>
                    <Input
                        type={"text"}
                        placeholder={"i.e. what is this about"}
                        className={"w-full"}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <Button type={"submit"} disabled={!input || isPending}>
                        {isPending ? "Asking..." : "Ask"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>

    );
}

export default ChatToDocument;