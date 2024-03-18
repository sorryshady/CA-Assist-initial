import React from 'react'
import {
  AiOutlineFilePdf,
  AiOutlineFileWord,
  AiOutlineFileExcel,
  AiOutlineFileImage,
  AiOutlineFileUnknown,
  AiOutlineFileZip,
  AiOutlineFileText,
} from 'react-icons/ai'

const iconMap = {
  'application/pdf': AiOutlineFilePdf,
  'application/msword': AiOutlineFileWord,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    AiOutlineFileWord,
  'application/vnd.ms-excel': AiOutlineFileExcel,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
    AiOutlineFileExcel,
  'image/jpeg': AiOutlineFileImage,
  'image/png': AiOutlineFileImage,
  'image/gif': AiOutlineFileImage,
  'image/bmp': AiOutlineFileImage,
  'image/webp': AiOutlineFileImage,
  'application/zip': AiOutlineFileZip,
  'text/plain': AiOutlineFileText,
  '.pdf': AiOutlineFilePdf,
  '.doc': AiOutlineFileWord,
  '.docx': AiOutlineFileWord,
  '.xls': AiOutlineFileExcel,
  '.xlsx': AiOutlineFileExcel,
  '.jpg': AiOutlineFileImage,
  '.jpeg': AiOutlineFileImage,
  '.png': AiOutlineFileImage,
  '.gif': AiOutlineFileImage,
  '.bmp': AiOutlineFileImage,
  '.webp': AiOutlineFileImage,
  '.zip': AiOutlineFileZip,
  '.txt': AiOutlineFileText,
  default: AiOutlineFileUnknown,
}


export const setIcon = (fileType) => {
  const IconComponent = iconMap[fileType] || iconMap['default']
  return React.createElement(IconComponent, { size: 32 })
}
