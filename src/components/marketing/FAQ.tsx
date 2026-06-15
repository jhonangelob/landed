import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

import { FAQS } from '#/constants/landing'

export default function FAQ() {
  return (
    <div
      id="faq"
      className="flex flex-col items-center gap-2 bg-white px-14 py-29"
    >
      <p className="text-muted font-mono text-[11px] leading-[1.4] font-medium tracking-[1.3]">
        FAQ
      </p>
      <p className="font-display text-primary-text text-[44px] leading-[1.08] font-bold tracking-[-1.1px]">
        Questions, answered.
      </p>
      <Accordion
        type="single"
        collapsible
        defaultValue={String(0)}
        className="mt-8 w-205 border-t"
      >
        {FAQS.map((item, index) => (
          <AccordionItem value={String(index)} key={index}>
            <AccordionTrigger className="font-display text-primary-text py-5.5 text-[18px] leading-[1.4] font-semibold">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted font-sans text-[15px] leading-[1.65]">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
