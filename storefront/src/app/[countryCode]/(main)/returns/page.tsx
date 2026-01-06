import { Heading, Text, Container } from "@medusajs/ui"

export default function ReturnsPage() {
    return (
        <div className="content-container py-12 max-w-4xl mx-auto">
            <Heading level="h1" className="text-3xl mb-8">Returns & Refunds Policy</Heading>

            <div className="flex flex-col gap-y-6 text-ui-fg-subtle">
                <section>
                    <Heading level="h2" className="text-xl mb-2 text-ui-fg-base">Overview</Heading>
                    <Text>
                        Our policy lasts 30 days. If 30 days have gone by since your purchase, unfortunately we can’t offer you a refund or exchange.
                    </Text>
                </section>

                <section>
                    <Heading level="h2" className="text-xl mb-2 text-ui-fg-base">Eligibility</Heading>
                    <Text>
                        To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging.
                    </Text>
                </section>

                <section>
                    <Heading level="h2" className="text-xl mb-2 text-ui-fg-base">Non-returnable items</Heading>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Gift cards</li>
                        <li>Downloadable software products</li>
                        <li>Some health and personal care items</li>
                    </ul>
                </section>

                <section>
                    <Heading level="h2" className="text-xl mb-2 text-ui-fg-base">Refunds</Heading>
                    <Text>
                        Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund.
                    </Text>
                </section>

                <section>
                    <Heading level="h2" className="text-xl mb-2 text-ui-fg-base">Yemen Region Specifics</Heading>
                    <Text>
                        For customers in Sana'a and Aden, we offer home pickup for returns for a small fee. Please contact our support via WhatsApp to schedule a pickup.
                        Cash on Delivery orders will be refunded via mobile wallet (flOOz, mCash) or bank transfer.
                    </Text>
                </section>
            </div>
        </div>
    )
}
