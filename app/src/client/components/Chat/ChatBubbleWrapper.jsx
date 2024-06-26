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
        'mb-5',
        'md:mb-6',
        'relative'
      )}
    >
      {children}
    </div>
  )
}
