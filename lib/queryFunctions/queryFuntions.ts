export async function fetchChats() {
  const response = await fetch('/api/chats')

  if (!response.ok) {
    throw new Error('Network response was not ok')
  }

  return response.json()
}
