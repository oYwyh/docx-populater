import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";

export default function Preview({ pdfBlob, docBlob }: { pdfBlob: Blob | null, docBlob: Blob | null }) {

    useEffect(() => {
        console.log(pdfBlob)
    }, [pdfBlob])

    return (
        <Card>
            <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>Preview your document here</CardDescription>
            </CardHeader>
            <CardContent>
                {pdfBlob && docBlob ?
                    <embed className="w-full h-[600px]" src={URL.createObjectURL(pdfBlob)} />
                    : (
                        <p className="text-center">No document uploaded</p>
                    )}
            </CardContent>
        </Card>
    )
}