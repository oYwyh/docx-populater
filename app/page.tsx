'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'
import Populater from '@/app/components/Populater'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Preview from '@/app/components/Preview'
import Download from '@/app/components/Download'

export default function Home() {
  const [placeholders, setPlaceholders] = useState<string[]>(['first_name', 'last_name', 'phone', 'description'])
  const [doc, setDoc] = useState<Docxtemplater | null>(null)
  const [docBlob, setDocBlob] = useState<Blob | null>(null)
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null)
  const [formData, setFormData] = useState<{ [key: string]: string }>({}); // state to store form values
  const [tab, setTab] = useState<string>("replacer");

  const onTabChange = (value: string) => {
    setTab(value);
  }

  const extractBodyPlaceholders = (content: string): string[] => {
    const regex = /\{([^{}]+)\}/g;
    const matches = content.match(regex) || [];
    return Array.from(new Set(matches.map(match => match.slice(1, -1))));
  };

  const extractHeaderFooterPlaceholders = (zip: PizZip, type: 'header' | 'footer'): string[] => {
    const files = Object.keys(zip.files).filter(fileName => fileName.startsWith(`word/${type}`));
    let placeholders: string[] = [];

    files.forEach(fileName => {
      const content = zip.files[fileName].asText();
      placeholders = [...placeholders, ...extractBodyPlaceholders(content)];
    });

    return placeholders;
  };

  const extractAllPlaceholders = (doc: Docxtemplater, zip: PizZip) => {
    const bodyText = doc.getFullText();
    const bodyPlaceholders = extractBodyPlaceholders(bodyText);

    const headerPlaceholders = extractHeaderFooterPlaceholders(zip, 'header');
    const footerPlaceholders = extractHeaderFooterPlaceholders(zip, 'footer');

    const allPlaceholders = Array.from(new Set([...bodyPlaceholders, ...headerPlaceholders, ...footerPlaceholders]));
    setPlaceholders(allPlaceholders);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocBlob(null)
    setPdfBlob(null)
    setDoc(null)
    setPlaceholders([])
    setFormData({})

    const file = e.target.files?.[0]
    if (!file) return
    const arrayBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)
    const zip = new PizZip(uint8Array)
    const doc = new Docxtemplater(zip, {
      linebreaks: true,
      paragraphLoop: true,
    });

    setDoc(doc)
    extractAllPlaceholders(doc, zip)
  }

  return (
    <div className="flex flex-col gap-4 container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Docx Placeholder Populater</CardTitle>
          <CardDescription>Upload a .docx file to populate placeholders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Input
              type="file"
              accept=".docx"
              onChange={handleFileUpload}
              className="flex-grow"
            />
          </div>
        </CardContent>
      </Card>
      {doc && placeholders.length > 0 && (
        <Tabs value={tab} onValueChange={onTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="replacer">Replacer</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="download">Download</TabsTrigger>
          </TabsList>
          <TabsContent value="replacer">
            <Populater
              doc={doc}
              formData={formData}
              setFormData={setFormData}
              docBlob={docBlob}
              setDocBlob={setDocBlob}
              setTab={setTab}
              placeholders={placeholders}
            />
          </TabsContent>
          <TabsContent value="preview"><Preview docBlob={docBlob} pdfBlob={pdfBlob} /></TabsContent>
          <TabsContent value="download"><Download docBlob={docBlob} /></TabsContent>
        </Tabs>
      )}
    </div>
  )
}