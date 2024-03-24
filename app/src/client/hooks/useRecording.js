import React, { useState, useEffect, useRef } from 'react'

export const useRecording = () => {
  const [recording, setRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const recorder = useRef(null)
  const [paused, setPaused] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [close, setClose] = useState(false)

  useEffect(() => {
    let timer
    if (recording && !paused) {
      timer = setInterval(() => {
        setElapsedTime((prevElapsedTime) => prevElapsedTime + 1)
      }, 1000)
    } else {
      clearInterval(timer)
    }

    return () => clearInterval(timer)
  }, [recording, paused])

  const handleStartRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        recorder.current = new MediaRecorder(stream)
        const chunks = []

        recorder.current.ondataavailable = (event) => {
          chunks.push(event.data)
        }

        recorder.current.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' })
          setAudioBlob(blob)
          const url = URL.createObjectURL(blob)
          setAudioUrl(url)
        }

        recorder.current.start()
        setRecording(true)
        setClose(true)
      })
      .catch((error) => {
        console.error('Error accessing microphone:', error)
      })
  }

  const handleStopRecording = () => {
    if (recorder.current && recorder.current.state !== 'inactive') {
      recorder.current.stop()
    }
    setRecording(false)
    setPaused(false)
    setElapsedTime(0)
  }

  const handlePauseResumeRecording = () => {
    if (recorder.current) {
      if (paused) {
        recorder.current.resume()
      } else {
        recorder.current.pause()
      }
      setPaused(!paused)
    }
  }
  const handleSendAudio = () => {
    console.log('Sending audio:', audioUrl, audioBlob)
    setClose(false)
  }
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = Math.floor(timeInSeconds % 60)
    return `${minutes}.${seconds < 10 ? '0' : ''}${seconds}`
  }
  const deleteHandler = () => {
    setClose(false)
    setAudioBlob(null)
    setAudioUrl(null)
  }

  return {
    recording,
    audioBlob,
    audioUrl,
    elapsedTime,
    handleStartRecording,
    handleStopRecording,
    handlePauseResumeRecording,
    handleSendAudio,
    formatTime,
    deleteHandler,
    close,
    setClose,
    paused,
  }
}
