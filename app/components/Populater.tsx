import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Docxtemplater from "docxtemplater"
import { useForm } from "react-hook-form"
import { useEffect } from 'react'
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@radix-ui/react-toast"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { CircleAlert } from "lucide-react"

export default function Populater({
    doc,
    setTab,
    placeholders,
    formData,
    setFormData,
    docBlob,
    setDocBlob,
}: {
    doc: Docxtemplater,
    setTab: React.Dispatch<React.SetStateAction<string>>,
    placeholders: string[],
    formData: { [key: string]: string },
    setFormData: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
    docBlob: Blob | null,
    setDocBlob: React.Dispatch<React.SetStateAction<Blob | null>>,
}) {
    const form = useForm()
    const { toast } = useToast()



    const handleReplacer = async (data: { [key: string]: unknown }) => {
        // Replace undefined values with empty strings
        const cleanedData = Object.fromEntries(
            Object.entries(data).map(([key, value]) => [key, value ?? ""])
        );

        doc.render(cleanedData);

        const blob = doc?.getZip().generate({
            type: 'blob',
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        });

        setDocBlob(blob || null);
    };


    // const { data: pdfBlob, isLoading, isSuccess } = useQuery({
    //     queryKey: ['convert'],
    //     queryFn: async () => convertToPdf(docBlob as Blob),
    //     enabled: !!docBlob
    // })

    // useEffect(() => {
    //     if (!pdfBlob) return
    //     setPdfBlob(pdfBlob)
    // }, [pdfBlob])

    const handleInputChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    useEffect(() => {
        if (!docBlob) return;
        toast({
            variant: 'default',
            title: 'Success',
            description: 'Placeholders populated successfully',
            duration: 5000,
            className: 'bg-black',
            action: <ToastAction onClick={() => setTab("download")} altText="Download">Download</ToastAction>
        })
    }, [docBlob])

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-row gap-2 items-center">
                    <CardTitle>Populater</CardTitle>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger><CircleAlert size={18} /></TooltipTrigger>
                            <TooltipContent>
                                <p>This app detects placeholder which are rounded with &#123;curly brackets&#125; <br /> if a field left empty it will not be populated</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <CardDescription>Populate placeholders with values</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form className="flex flex-col gap-3" onSubmit={form.handleSubmit(handleReplacer)}>
                        <div className="flex flex-col gap-3">
                            {placeholders.map((placeholder, index) => {
                                // Start a new div for every two items
                                if (index % 2 === 0) {
                                    return (
                                        <div key={index} className="flex flex-row gap-3">
                                            <FormField
                                                key={placeholder}
                                                control={form.control}
                                                name={placeholder}
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-col gap-0 flex-1">
                                                        <FormLabel className="capitalize">{placeholder.replace("_", " ")}</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder={placeholder.replace("_", " ")}
                                                                {...field}
                                                                value={formData[placeholder]}
                                                                onChange={(e) => {
                                                                    field.onChange(e.target.value);
                                                                    handleInputChange(placeholder, e.target.value);
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            {index + 1 < placeholders.length && (
                                                <FormField
                                                    key={placeholders[index + 1]}
                                                    control={form.control}
                                                    name={placeholders[index + 1]}
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-col gap-0 flex-1">
                                                            <FormLabel className="capitalize">{placeholders[index + 1].replace("_", " ")}</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder={placeholders[index + 1].replace("_", " ")}
                                                                    {...field}
                                                                    value={formData[placeholders[index + 1]]}
                                                                    onChange={(e) => {
                                                                        field.onChange(e.target.value);
                                                                        handleInputChange(placeholders[index + 1], e.target.value);
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            )}
                                        </div>
                                    );
                                }
                                return null; // Avoid rendering anything outside the div
                            })}
                        </div>
                        <Button className="w-full" type="submit" disabled={docBlob != null}>
                            Replace
                        </Button>
                    </form>
                </Form>

            </CardContent>
        </Card >
    )
}