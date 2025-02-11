import Document from "@/components/Document";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

async function DocumentPage({params}: PageProps) {
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;

    return (
        <div className="flex flex-col flex-1 min-h-screen">
            <Document id={id}/>
        </div>
    );
}

export default DocumentPage;