import { useRecording } from '@/client/hooks/useRecording'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import React from 'react'
import { FaPlay, FaPause, FaStop } from 'react-icons/fa'
import { MdDelete, MdSend } from 'react-icons/md'
import AudioPlayer from './AudioPlayer'
const Recording = ({
  recording,
  stop,
  pausePlay,
  paused,
  elapsedTime,
  deleteAudio,
  audioBlob,
  audioUrl,
  // audioFile,
  send,
}) => {
  let url = null
  // if (audioFile) {
  //   url = audioFile.current ? URL.createObjectURL(audioFile.current) : null
  // }
  const { formatTime } = useRecording()
  return (
    <Card className='w-fit absolute top-[-60px] md:top-[-65px] lg:top-[-65px] left-4 md:left-5 p-3 md:p-4 flex justify-between items-center z-[1000] max-w-[95vw]'>
      {(recording || paused) && (
        <div className='flex gap-2 md:gap-3'>
          {(recording || paused) && (
            <Button onClick={pausePlay} className='p-3'>
              {paused ? <FaPlay /> : <FaPause />}
            </Button>
          )}
          {recording && (
            <Button onClick={stop} className='p-3'>
              <FaStop />
            </Button>
          )}
        </div>
      )}
      {recording && (
        <p className='text-lg ml-[5vw]'>{formatTime(elapsedTime)}</p>
      )}
      {(audioBlob || audioUrl) && (
        <div className='flex gap-2 md:justify-between items-center'>
          <AudioPlayer audioFile={url || audioUrl} />
          <div className='flex gap-3 md:ml-10'>
            {audioUrl && (
              <Button onClick={send} className='p-3'>
                <MdSend size={18} />
              </Button>
            )}
            {audioBlob && (
              <Button
                variant='destructive'
                onClick={deleteAudio}
                className='p-3'
              >
                <MdDelete size={20} />
              </Button>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}

export default Recording
