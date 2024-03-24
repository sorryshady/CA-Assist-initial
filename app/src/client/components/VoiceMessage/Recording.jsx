import { useRecording } from '@/client/hooks/useRecording'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import React from 'react'
import { FaPlay, FaPause, FaStop } from 'react-icons/fa'
import { MdDelete, MdSend } from 'react-icons/md'
const Recording = ({
  recording,
  stop,
  pausePlay,
  paused,
  elapsedTime,
  deleteAudio,
  audioBlob,
  audioUrl,
  send,
}) => {
  const { formatTime } = useRecording()
  return (
    <Card className='w-full absolute top-[-75px] left-5 p-5 max-w-[50%] flex justify-between items-center'>
      <div className='flex gap-3'>
        {(recording || paused) && (
          <Button onClick={pausePlay}>
            {paused ? <FaPlay /> : <FaPause />}
          </Button>
        )}
        {recording && (
          <Button onClick={stop}>
            <FaStop />
          </Button>
        )}
      </div>
      {recording && <p>{formatTime(elapsedTime)}</p>}
      {(audioBlob || audioUrl) && (
        <div className='flex gap-3'>
          {audioUrl && (
            <Button onClick={send}>
              <MdSend />
            </Button>
          )}
          {audioBlob && (
            <Button
              className='w-fit p-3'
              variant='destructive'
              onClick={deleteAudio}
            >
              <MdDelete size={20} />
            </Button>
          )}
        </div>
      )}
    </Card>
  )
}

export default Recording
