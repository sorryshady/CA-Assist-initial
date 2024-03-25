import React, { useState, useEffect, useRef } from 'react'
import WaveSurfer from 'wavesurfer.js'
import { FaPlay, FaPause } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import './AudioPlayer.css'
import { db } from '@/client/db/db'
const wavesurferOptions = (ref) => ({
  container: ref,
  waveColor: '#333',
  progressColor: '#60a5fa',
  cursorColor: 'transparent',
  responsive: true,
  height: 40,
  normalize: true,
  backend: 'WebAudio',
  barWidth: 1,
  barGap: 2,
})
const AudioPlayer = ({ audioFile = null, audioId = null }) => {
  const [url, setUrl] = useState(null)
  const fetchAudioFile = async () => {
    const file = await db.audioMessages.get(audioId)
    const url = URL.createObjectURL(file.message)
    setUrl(url)
  }
  useEffect(() => {
    if (audioId) {
      fetchAudioFile()
    }
  }, [])
  const formatTime = (seconds) => {
    let date = new Date(0)
    date.setSeconds(seconds)
    return date.toISOString().substring(14, 19)
  }
  const waveformRef = useRef(null)
  const wavesurfer = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    const options = wavesurferOptions(waveformRef.current)
    wavesurfer.current = WaveSurfer.create(options)
    if (audioFile || url) wavesurfer.current.load(audioFile || url)
    wavesurfer.current.on('ready', () => {
      setDuration(wavesurfer.current.getDuration())
    })
    wavesurfer.current.on('audioprocess', () => {
      setCurrentTime(wavesurfer.current.getCurrentTime())
    })
    wavesurfer.current.on('finish', () => {
      setPlaying(false)
    })

    return () => {
      wavesurfer.current.un('audioprocess')
      wavesurfer.current.un('ready')
      wavesurfer.current.un('finish')
      wavesurfer.current.destroy()
    }
  }, [audioFile, audioId, url])

  const handlePlay = () => {
    setPlaying(!playing)
    wavesurfer.current.playPause()
  }
  return (
    <div className='flex gap-3 items-center '>
      <Button onClick={handlePlay}>{playing ? <FaPause /> : <FaPlay />}</Button>
      <>
        <div>{formatTime(currentTime)}</div>
        <div
          id='waveform'
          ref={waveformRef}
          className='w-full flex flex-col'
        ></div>
        <div>{formatTime(duration)}</div>
      </>
    </div>
  )
}
export default AudioPlayer
