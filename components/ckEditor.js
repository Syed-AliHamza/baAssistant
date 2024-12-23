'use client'

import React, { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'

import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { htmlCssExportWord } from 'html-css-export-word'

const CustomCKEditor = ({ initialData }) => {
  const [editorData, setEditorData] = useState(initialData)

  const onChange = data => {
    console.log('Editor content changed:', data)
    // You can add additional logic here if needed
  }

  useEffect(() => {
    const checkRespondisCopy = () => {
      const respondingStatus = localStorage.getItem('isCopied')
      setEditorData(respondingStatus)

      console.log(respondingStatus, 'value')
    }

    checkRespondisCopy()

    window.addEventListener('respondingisCopied', checkRespondisCopy)

    return () => {
      console.log('Cleaning up event listener')
      window.removeEventListener('respondingisCopied', checkRespondisCopy)
    }
  }, [])

  useEffect(() => {
    // Handle any other initialization if needed
    console.log('CKEditor initialized')
  }, [])
  const sourceRef = useRef()

  return (
    <div>
      {editorData ? (
        <>
          <div
            ref={sourceRef}
            id="source-html"
            style={{ marginBottom: '10px', height: '76vh', overflow: 'auto' }}
          >
            <CKEditor
              editor={ClassicEditor}
              data={editorData}
              onChange={(event, editor) => {
                const data = editor.getData()
                setEditorData(data)
                if (onChange) {
                  onChange(data)
                }
              }}
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => {
                if (sourceRef.current) {
                  const editorContent = editorData // Use editorData for accurate content capture
                  htmlCssExportWord(
                    editorContent,
                    null,
                    'exported-document.doc'
                  )
                }
              }}
              className="px-4 py-2 bg-blue-500 text-white shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 border border-blue-500"
            >
              Export as Word
            </button>
          </div>
        </>
      ) : (
        <div>
          {/* Use a video tag and point to the correct public path */}
          <video width="100%" controls muted autoPlay>
            <source src="/videos/promo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  )
}

export default CustomCKEditor
