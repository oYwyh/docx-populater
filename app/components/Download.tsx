import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DownloadIcon } from "lucide-react";
import { saveAs } from 'file-saver';

export default function Download({ docBlob }: { docBlob: Blob | null }) {
    // const handlePdfDownload = () => {
    //     if (!pdfBlob) return
    //     saveAs(pdfBlob, 'document.pdf')
    // }

    const handleDocxDownload = () => {
        if (!docBlob) return
        saveAs(docBlob, 'document.docx')
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Download Options</CardTitle>
                <CardDescription>Choose your preferred format to download</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
                {docBlob ? (
                    <>
                        <Button className="w-full" onClick={() => handleDocxDownload()}><DownloadIcon /> Download DOCX</Button>
                        {/* <Button className="w-full" onClick={() => handlePdfDownload()}><DownloadIcon /> Download PDF</Button> */}
                    </>
                ) : <p className="text-center">No document uploaded</p>}
            </CardContent>
        </Card>
    )
}