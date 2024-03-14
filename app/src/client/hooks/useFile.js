import { useToast } from '@/components/ui/use-toast'
import { useState } from 'react'
import { setIcon } from '../utils/iconMap'
const URL = import.meta.env.REACT_APP_FILE_UPLOAD_URL
export const useFile = () => {
  const [file, setFile] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [fileData, setFileData] = useState({
    name: '',
    size: '',
  })
  const { toast } = useToast()
  const handleChange = (e) => {
    const file = e.target.files[0]
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
    let size = 0
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
    const url = URL + `/files/${fileData.name}`
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        toast({ title: 'Error', description: 'Failed to upload file.' })
        throw new Error('Failed to upload file')
      }
      toast({ title: 'Success', description: 'File sent succesfully' })
      setFile(null)
      setFileData({
        name: '',
        size: '',
      })
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to upload file.' })
      console.error('Error:', error.message)
    }
  }

  return {
    file,
    errorMessage,
    fileData,
    handleChange,
    handleSubmit,
  }
}
