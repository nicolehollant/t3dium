import React, { createElement, Fragment } from 'react'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import remarkRehype from 'remark-rehype'
import rehypeReact from 'rehype-react/lib'

const MarkdownPreview: React.FC<{ value: string; className: string }> = (
  props
) => {
  const md = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeHighlight)
    .use(rehypeReact, { createElement: createElement, Fragment: Fragment })
    .processSync(props.value).result
  return <div className={props.className}>{md as any}</div>
}

export default MarkdownPreview
