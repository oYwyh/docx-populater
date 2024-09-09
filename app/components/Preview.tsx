import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Preview({ pdfBlob, docBlob }: { pdfBlob: Blob | null, docBlob: Blob | null }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>Preview your document here</CardDescription>
            </CardHeader>
            <CardContent>
                {docBlob ?
                    <embed className="w-full h-[600px]" src={URL.createObjectURL(docBlob)} />
                    : (
                        <p className="text-center">No document uploaded</p>
                    )}
            </CardContent>
        </Card>
    )
}