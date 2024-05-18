// import React, { useState, useEffect, useRef } from 'react'
// import WaveSurfer from 'wavesurfer.js'
// import { FaPlay, FaPause } from 'react-icons/fa'
// import { Button } from '@/components/ui/button'
// import './AudioPlayer.css'
// import { db } from '@/client/db/db'
// const wavesurferOptions = (ref) => ({
//   container: ref,
//   waveColor: '#333',
//   progressColor: '#60a5fa',
//   cursorColor: 'transparent',
//   responsive: true,
//   height: 40,
//   normalize: true,
//   backend: 'WebAudio',
//   barWidth: 1,
//   barGap: 2,
// })
// const AudioPlayer = ({
//   audioFile = null,
//   audioId = null,
//   audioFileUrl = null,
// }) => {
//   const [url, setUrl] = useState(null)
//   let fallbackContent
//   const fetchAudioFile = async () => {
//     const file = await db.audioMessages.get(audioId)
//     if (file) {
//       const url = URL.createObjectURL(file.message)
//       setUrl(url)
//     }
//   }
//   useEffect(() => {
//     if (audioId) {
//       fetchAudioFile()
//     }
//   }, [])
//   const formatTime = (seconds) => {
//     let date = new Date(0)
//     date.setSeconds(seconds)
//     return date.toISOString().substring(14, 19)
//   }
//   const waveformRef = useRef(null)
//   const wavesurfer = useRef(null)
//   const [playing, setPlaying] = useState(false)
//   const [duration, setDuration] = useState(0)
//   const [currentTime, setCurrentTime] = useState(0)

//   useEffect(() => {
//     if (audioFile || url) {
//       const options = wavesurferOptions(waveformRef.current)
//       wavesurfer.current = WaveSurfer.create(options)
//       wavesurfer.current.load(audioFile || url)
//       wavesurfer.current.on('ready', () => {
//         setDuration(wavesurfer.current.getDuration())
//       })
//       wavesurfer.current.on('audioprocess', () => {
//         setCurrentTime(wavesurfer.current.getCurrentTime())
//       })
//       wavesurfer.current.on('finish', () => {
//         setPlaying(false)
//       })
//     }

//     return () => {
//       if (wavesurfer.current) {
//         wavesurfer.current.un('audioprocess')
//         wavesurfer.current.un('ready')
//         wavesurfer.current.un('finish')
//         wavesurfer.current.destroy()
//       }
//     }
//   }, [audioFile, audioId, audioFileUrl, url])

//   const handlePlay = () => {
//     setPlaying(!playing)
//     wavesurfer.current.playPause()
//   }
//   // if (!audioFile && !url) return fallbackContent
//   return (
//     <div className='flex gap-3 items-center '>
//       {(audioFile || url) && (
//         <>
//           <Button onClick={handlePlay}>
//             {playing ? <FaPause /> : <FaPlay />}
//           </Button>

//           <div>{formatTime(currentTime)}</div>
//           <div
//             id='waveform'
//             ref={waveformRef}
//             className='w-full flex flex-col'
//           ></div>
//           <div>{formatTime(duration)}</div>
//         </>
//       )}
//       {!audioFile && !url && (
//         <p className='text-sm text-red-400'>Audio File has expired.</p>
//       )}
//     </div>
//   )
// }
// export default AudioPlayer
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

const AudioPlayer = ({
  audioFile = null,
  audioId = null,
  audioFileUrl = null,
}) => {
  const [url, setUrl] = useState(null)
  const [fallbackContent, setFallbackContent] = useState(null)

  const fetchAudioFile = async () => {
    try {
      const response = await fetch(audioFileUrl)
      const arrayBuffer = await response.arrayBuffer()
      const blob = new Blob([arrayBuffer])
      const url = URL.createObjectURL(blob)
      setUrl(url)
    } catch (error) {
      console.error('Error fetching audio file:', error)
      setFallbackContent(
        <p className='text-sm text-red-400'>Error fetching audio file.</p>
      )
    }
  }

  useEffect(() => {
    if (audioId) {
      fetchAudioFileFromDB()
    } else if (audioFileUrl) {
      fetchAudioFile()
    }
  }, [audioId, audioFileUrl])

  const fetchAudioFileFromDB = async () => {
    try {
      const file = await db.audioMessages.get(audioId)
      if (file) {
        const url = URL.createObjectURL(file.message)
        setUrl(url)
      } else {
        setFallbackContent(
          <p className='text-sm text-red-400'>Audio File not found.</p>
        )
      }
    } catch (error) {
      console.error('Error fetching audio file from DB:', error)
      setFallbackContent(
        <p className='text-sm text-red-400'>Error fetching audio file.</p>
      )
    }
  }

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
    if (audioFile || url) {
      const options = wavesurferOptions(waveformRef.current)
      wavesurfer.current = WaveSurfer.create(options)
      wavesurfer.current.load(audioFile || url)
      wavesurfer.current.on('ready', () => {
        setDuration(wavesurfer.current.getDuration())
      })
      wavesurfer.current.on('audioprocess', () => {
        setCurrentTime(wavesurfer.current.getCurrentTime())
      })
      wavesurfer.current.on('finish', () => {
        setPlaying(false)
      })
    }

    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.un('audioprocess')
        wavesurfer.current.un('ready')
        wavesurfer.current.un('finish')
        wavesurfer.current.destroy()
      }
    }
  }, [audioFile, url])

  const handlePlay = () => {
    setPlaying(!playing)
    wavesurfer.current.playPause()
  }

  return (
    <div className='flex gap-3 items-center min-h-[5svh] min-w-[10vw] w-fit'>
      {(audioFile || url) && (
        <>
          <Button onClick={handlePlay} className='p-3'>
            {playing ? <FaPause /> : <FaPlay />}
          </Button>

          <div>{formatTime(currentTime)}</div>
          <div
            id='waveform'
            ref={waveformRef}
            className='w-full flex flex-col'
            style={{ zIndex: 0 }}
          ></div>
          <div>{formatTime(duration)}</div>
        </>
      )}
      {fallbackContent}
    </div>
  )
}

export default AudioPlayer
