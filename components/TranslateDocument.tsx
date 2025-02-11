'use client'

import * as Y from "yjs";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {FormEvent, useState, useTransition} from "react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {toast} from "sonner";
import {BotIcon} from "lucide-react";
import Markdown from "react-markdown";



type Language = | "english"
    | "spanish"
    | "japanese"
    | "french"
    | "german"
    | "chinese"

const languages: Language[] = ["english", "spanish", "japanese", "french", "german", "chinese"];


function TranslateDocument({doc}: { doc: Y.Doc }) {

    const [isOpen, setIsOpen] = useState(false);
    const [language, setLanguage] = useState<string>("");
    const [summary, setSummary] = useState<string>("");
    const [isPending, startTransition] = useTransition();

    const handleAskQuestion = (e: FormEvent) => {
        e.preventDefault()

        startTransition(async () => {
            const docStore = doc.get("document-store");
            const documentData = docStore.toJSON() as string;


            const texts = documentData.match(/<paragraph[^>]*>(.*?)<\/paragraph>/g)
                ?.map(p => {
                    // 提取實際文本內容
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

            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/translateDocument`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        documentData: textContent,
                        targetLang: language
                    })
                }
            );

            if (res.ok) {
                const {translation} = await res.json();
                console.log(translation.translated_text)
                setSummary(translation.translated_text);
                toast.success("Document translated successfully");
            }
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <Button asChild variant={"outline"}>
                <DialogTrigger>Translate</DialogTrigger>
            </Button>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Translate the Document</DialogTitle>
                    <DialogDescription>
                        Select a Language and AI will translate a summary of the document in the selected language.
                    </DialogDescription>
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
                    <Select
                        value={language}
                        onValueChange={(value) => setLanguage(value)}
                    >
                        <SelectTrigger className={"w-full"}>
                            <SelectValue placeholder={"Select a language"}/>
                        </SelectTrigger>
                        <SelectContent>
                            {languages.map((lang) => (
                                <SelectItem key={lang} value={lang}>
                                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button type={"submit"} disabled={!language || isPending}>
                        {isPending ? "Translating..." : "Translate"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default TranslateDocument;