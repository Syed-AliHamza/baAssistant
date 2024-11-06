'use client'

import { useRef } from 'react'

export default function SearchButton({}) {
  const inputRef = useRef<HTMLInputElement>(null)

  const getData = () => {
    const params = new URLSearchParams({
      sqlQuery: inputRef?.current?.value
    })
    const response = fetch(`/search?${params}`)
      .then(response => response.json())
      .then(json => console.log(json))
      .catch(error => console.log('here error-----', error))
  }

  return (
    <>
      <input
        type="text"
        placeholder="Enter your query"
        className="p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        ref={inputRef}
      />
      {/* <button
        class="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={getData}
      >
        Search
      </button> */}
    </>
  )
}
