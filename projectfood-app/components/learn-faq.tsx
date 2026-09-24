type FaqItem = { question: string; answer: string }

/**
 * The visible FAQ at the bottom of an article. Native <details>/<summary>: server-rendered,
 * keyboard and screen-reader accessible, no JavaScript, and the answers are in the DOM, which
 * is what lets the FAQPage JSON-LD describe visible content.
 */
export function LearnFaq({ title, items }: { title: string; items: FaqItem[] }) {
  if (items.length === 0) return null
  return (
    <section className="px-5 pb-14">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-extrabold text-[#1F1B16] mb-6">{title}</h2>
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <details key={item.question} className="group bg-[#F4EFE8] rounded-[18px] px-6 py-4">
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden font-bold text-[#1F1B16]">
                <span>{item.question}</span>
                <span
                  aria-hidden="true"
                  className="shrink-0 text-xl leading-none text-[#A39B91] transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-[#6B645C] leading-relaxed">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
