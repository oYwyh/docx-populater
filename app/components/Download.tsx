import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DownloadIcon } from "lucide-react";
import { saveAs } from 'file-saver';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

export default function Download({ docBlob }: { docBlob: Blob | null }) {
    const [open, setOpen] = useState(false)

    const filenameSchema = z.object({
        filename: z.string().min(1, 'Filename is required')
    })

    const form = useForm<z.infer<typeof filenameSchema>>({
        resolver: zodResolver(filenameSchema)
    })

    const handleDocxDownload = (data: z.infer<typeof filenameSchema>) => {
        if (!docBlob) return
        saveAs(docBlob, data.filename)
        setOpen(false)
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Download Options</CardTitle>
                    <CardDescription>Choose your preferred format to download</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    {docBlob ? (
                        <>
                            <Button className="w-full" onClick={() => setOpen(true)}><DownloadIcon /> Download DOCX</Button>
                        </>
                    ) : <p className="text-center">No document uploaded</p>}
                </CardContent>
            </Card>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="bg-white">
                    <DialogHeader>
                        <DialogTitle className="text-black">Set File Name</DialogTitle>
                        <DialogDescription>
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form className="flex flex-col gap-2 text-black" onSubmit={form.handleSubmit(handleDocxDownload)}>
                            <FormField
                                control={form.control}
                                name="filename"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>File Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="FileName" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button className="w-full">Submit</Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    )
}