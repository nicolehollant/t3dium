import { FC } from 'react'
import { useCallback } from 'react'
import ReactCodeMirror, {
  ReactCodeMirrorProps,
  ReactCodeMirrorRef,
} from '@uiw/react-codemirror'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import { createTheme } from '@uiw/codemirror-themes'
import { tags as t } from '@lezer/highlight'

const theme = createTheme({
  theme: 'light',
  settings: {
    background: '#ffffff',
    foreground: '#000000',
    caret: '#059669',
    selection: '#036dd626',
    selectionMatch: '#036dd626',
    lineHighlight: '#6ee7b720',
    gutterBackground: '#ffffff00',
    gutterForeground: '#bae6fd20',
  },
  styles: [
    { tag: t.string, class: 'text-base' },
    { tag: t.heading1, class: 'text-[2.25em] text-pink-600' },
    { tag: t.heading2, class: 'text-[1.5em] text-rose-600' },
    { tag: t.heading3, class: 'text-[1.25em] text-pink-700' },
    { tag: t.heading4, class: 'text-[1.125em] text-rose-700 font-semibold' },
    { tag: t.comment, class: 'italic text-gray-400' },
    { tag: t.emphasis, class: 'italic text-lime-700' },
    { tag: t.strong, class: 'font-semibold text-cyan-600' },
  ],
})

const MarkdownEditor: FC<
  ReactCodeMirrorProps & React.RefAttributes<ReactCodeMirrorRef>
> = (props) => {
  const { onChange, ...restProps } = props
  const handleChange = useCallback(
    (value: string) => onChange?.(value, undefined as any),
    [onChange]
  )
  return (
    <ReactCodeMirror
      {...restProps}
      basicSetup={{
        lineNumbers: false,
        foldGutter: true,
        highlightActiveLine: true,
      }}
      extensions={[
        markdown({ base: markdownLanguage, codeLanguages: languages }),
      ]}
      theme={theme}
      onChange={handleChange}
    />
  )
}

export default MarkdownEditor
