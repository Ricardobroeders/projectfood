import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export function LearnMarkdown({ body }: { body: string }) {
  return (
    <div className="prose max-w-none text-[#1F1B16] prose-headings:text-[#1F1B16] prose-headings:font-extrabold prose-p:text-[#6B645C] prose-p:leading-relaxed prose-a:text-[#1F1B16] prose-a:underline prose-strong:text-[#1F1B16] prose-li:text-[#6B645C] prose-li:leading-relaxed prose-blockquote:border-l-[#F5C518] prose-blockquote:text-[#6B645C]">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
    </div>
  )
}
