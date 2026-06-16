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
      className="flex scroll-mt-10 flex-col items-center gap-2 bg-white px-4 py-14 md:px-14 md:py-29"
    >
      <p className="text-muted font-mono text-[11px] leading-[1.4] font-medium tracking-[1.3]">
        FAQ
      </p>
      <p className="font-display text-primary-text text-[32px] leading-[1.1] font-bold tracking-[-0.8px] md:text-[44px] md:leading-[1.08] md:tracking-[-1.1px]">
        Questions, answered.
      </p>
      <Accordion
        type="single"
        collapsible
        defaultValue={String(0)}
        className="mt-8 w-full max-w-205 border-t"
      >
        {FAQS.map((item, index) => (
          <AccordionItem value={String(index)} key={index}>
            <AccordionTrigger className="font-display text-primary-text py-5.5 text-[16px] leading-[1.4] font-semibold md:text-[18px]">
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
