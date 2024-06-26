import { useToast } from '@/components/ui/use-toast'
import { useState } from 'react'
import { setIcon } from '../utils/iconMap'

const ENDPOINT = import.meta.env.REACT_APP_BACKENDPOINT

export const useFile = () => {
  const initialFileData = {
    name: '',
    type: '',
    size: '',
    icon: '',
  }
  const chatId = localStorage.getItem('caChatId')
  const [file, setFile] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [fileData, setFileData] = useState(initialFileData)
  const [sending, setSending] = useState(false)
  const { toast } = useToast()

  const handleChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const fileSize = file.size
    const fileName = file.name
    const fileType = file.type
    const icon = setIcon(fileType)

    if (fileSize > 20 * 1024 * 1024) {
      setErrorMessage('File size should be less than 20MB')
      return
    } else {
      setErrorMessage('')
    }

    let size = ''
    if (fileSize < 1024 * 1024) {
      size = (fileSize / 1024).toFixed(1) + ' KB'
    } else {
      size = (fileSize / (1024 * 1024)).toFixed(1) + ' MB'
    }

    setFileData({
      name: fileName,
      type: fileType,
      size,
      icon,
    })

    setFile(file)
  }

  const handleSubmit = async () => {
    if (!chatId || !file) {
      toast({ title: 'Error', description: 'Missing chat ID or file.' })
      return
    }

    const url = ENDPOINT + 'chat'
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'file')
    formData.append('chat_id', chatId)

    try {
      setFileData(initialFileData)
      setSending(true)
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorMsg = await response.text()
        toast({
          title: 'Error',
          description: errorMsg || 'Failed to upload file.',
        })
        throw new Error(errorMsg || 'Failed to upload file')
      }
      setSending(false)
      setFile(null)
      toast({ title: 'Success', description: 'File sent successfully' })
    } catch (error) {
      toast({ title: 'Error', description: error.message })
      console.error('Error:', error.message)
    }
  }

  return {
    file,
    errorMessage,
    fileData,
    handleChange,
    handleSubmit,
    sending,
  }
}
