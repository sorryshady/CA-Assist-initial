import React, { useState, useEffect, useRef } from 'react'
import WaveSurfer from 'wavesurfer.js'
import { FaPlay, FaPause } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import './AudioPlayer.css'
const wavesurferOptions = (ref) => ({
  container: ref,
  waveColor: '#ccc',
  progressColor: '#333',
  cursorColor: 'transparent',
  responsive: true,
  height: 40,
  normalize: true,
  backend: 'WebAudio',
  barWidth: 1,
  barGap: 2,
})
const AudioPlayer = ({ audioFile }) => {
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
    wavesurfer.current.load(audioFile)
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
  }, [audioFile])

  const handlePlay = () => {
    setPlaying(!playing)
    wavesurfer.current.playPause()
  }
  return (
    <div className='flex gap-3 items-center '>
      <Button onClick={handlePlay}>{playing ? <FaPause /> : <FaPlay />}</Button>
      <div>{formatTime(currentTime)}</div>
      <div
        id='waveform'
        ref={waveformRef}
        className='w-full flex flex-col'
      ></div>
      <div>{formatTime(duration)}</div>
    </div>
  )
}
export default AudioPlayer
