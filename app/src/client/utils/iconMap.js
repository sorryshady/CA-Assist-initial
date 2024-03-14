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
  'application/pdf': <AiOutlineFilePdf />,
  'application/msword': <AiOutlineFileWord />,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': (
    <AiOutlineFileWord />
  ),
  'application/vnd.ms-excel': <AiOutlineFileExcel />,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': (
    <AiOutlineFileExcel />
  ),
  'image/jpeg': <AiOutlineFileImage />,
  'image/png': <AiOutlineFileImage />,
  'image/gif': <AiOutlineFileImage />,
  'image/bmp': <AiOutlineFileImage />,
  'image/webp': <AiOutlineFileImage />,
  'application/zip': <AiOutlineFileZip />,
  'text/plain': <AiOutlineFileText />,
}

export const setIcon = (fileType) => {
  const fileIcon = iconMap[fileType] || <AiOutlineFileUnknown />
  return fileIcon
}
