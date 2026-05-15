import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQSection() {
  return (
    <div className="w-full max-w-3xl mx-auto py-12">
      <h3 className="text-2xl font-bold text-center mb-8 text-brand-blue">
        Frequently Asked Questions
      </h3>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-left font-semibold">
            Is this platform a clinical diagnostic tool?
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed">
            No. Executive Function OS is a theoretical model based on percolation
            theory and computational network analysis. It does not represent a
            clinical diagnosis, nor does it map directly to neural pathways. It
            should not be used to infer treatment efficacy or broad cognitive
            capacity.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-left font-semibold">
            How is my data used and protected?
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed">
            We employ a client-side privacy architecture. By default, your data is
            processed locally in your browser, meaning we have zero server access
            to your personal files or activity logs. If you choose to participate
            as a Data Contributor, your data is fully anonymized before any
            network transmission.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="text-left font-semibold">
            What is percolation theory?
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed">
            Percolation theory is a branch of mathematics and statistical physics
            that studies the behavior of connected clusters in a random graph. In
            our framework, we use it to model how cognitive "networks" remain
            navigable or break down (fragment) under stress, task switching, or
            information overload.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger className="text-left font-semibold">
            How can researchers collaborate with EFOS?
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed">
            We are actively building the EFOS Research Network. We offer tiered
            collaboration levels, including Core Collaborators (co-authorship,
            methodology design), Affiliate Researchers (validation studies), and
            Data Contributors. Please visit our Researchers page to learn more.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
