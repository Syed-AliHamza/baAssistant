import { useEffect, useRef, useState } from 'react'
import ReactQuill from 'react-quill'
import { markdownToHtml } from './parser'
import { htmlCssExportWord } from 'html-css-export-word'

import 'react-quill/dist/quill.snow.css'

export interface EditorContentChanged {
  html: string
  markdown: string
}

export interface EditorProps {
  value?: string
  content: string
  onChange?: (changes: EditorContentChanged) => void
}

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike', 'blockquote', 'link'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ indent: '-1' }, { indent: '+1' }],
  ['emoji'],
  ['clean']
]

const Editor: React.FC<EditorProps> = ({
  selectedItems,
  setSelectedItems,
  content
}) => {
  const [value, setValue] = useState<string>(content)
  const reactQuillRef = useRef<ReactQuill>(null)

  useEffect(() => {
    if (selectedItems && selectedItems !== '') {
      console.log('here selectedItems', markdownToHtml(selectedItems))
      setValue(prevValue => prevValue + '\n' + markdownToHtml(selectedItems))
      setSelectedItems('')
    }
  }, [selectedItems])
  const handleChange = (content: string) => {
    setValue(content)
  }
  console.log('here value', value)
  const sourceRef = useRef()
  // Dummy data for demonstration
  const dummyData = [
    { date: '2023-07-01', offers: 10 },
    { date: '2023-07-02', offers: 15 },
    { date: '2023-07-03', offers: 8 },
    { date: '2023-07-04', offers: 20 },
    { date: '2023-07-05', offers: 5 }
  ]
  return (
    <div>
      <div className="hidden">
        <div ref={sourceRef} id="source-html">
          <h1>Apex Bar Chart</h1>

          <table>
            <tr>
              <th>sr</th>

              <th>title</th>
            </tr>
            <tr>
              <td>1</td> <td>test</td>{' '}
            </tr>
          </table>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => {
            htmlCssExportWord(
              sourceRef.current.innerHTML,
              null,
              'exported-document.doc'
            )
          }}
          className="px-4 py-2 bg-blue-500 text-white shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 border border-blue-500"
        >
          Export as Word
        </button>
      </div>
      <ReactQuill
        ref={reactQuillRef}
        theme="snow"
        placeholder="Start writing..."
        modules={{
          toolbar: {
            container: TOOLBAR_OPTIONS
          }
        }}
        value={value}
        onChange={handleChange}
        className="-full h-full"
      />
    </div>
  )
}

export default Editor
