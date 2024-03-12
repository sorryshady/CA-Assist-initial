import React from 'react'
import clsx from 'clsx'
export const ChatBubbleWrapper = ({ type, children }) => {
  return (
    <div
      className={clsx(
        'flex',
        { 'flex-row-reverse': type !== 'userMessage' },
        'justify-end',
        'gap-2',
        'mb-6'
      )}
    >
      {children}
    </div>
  )
}
