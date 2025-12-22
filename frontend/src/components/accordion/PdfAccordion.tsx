import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { convertStringToPdf } from '@/lib/functions/pdfs/pdfFunctions'

export const PdfAccordion = ({ documents }: { documents: Array<any> }) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      {documents.map((doc: any, idx: number) => (
        <AccordionItem
          key={idx}
          value={`document-${idx}`}
          className="border rounded-2xl shadow-sm mb-4 bg-white"
        >
          <AccordionTrigger className="px-4 py-3 cursor-pointer rounded-t-2xl text-lg font-medium flex justify-between">
            <span className="truncate">{doc.name}</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="border rounded-xl shadow-sm overflow-hidden">
              <iframe
                src={convertStringToPdf(doc.rawBytes)}
                width="100%"
                height="600px"
                className="rounded-xl"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
