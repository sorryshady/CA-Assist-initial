import Dexie from 'dexie'

export const db = new Dexie('chat')

db.version(1).stores({
  audioMessages: '++id, message, timestamp',
})



const deleteOldRecords = async () => {
  // console.log('starting checking for outdated voice messages')
  try {
    const sixHoursAgo = Date.now() - 6 * 60 * 60 * 1000
    // const fiveMinutesAgo = Date.now() - 5 * 60 * 1000
    const oldRecords = await db.audioMessages
      .where('timestamp')
      .below(sixHoursAgo)
      .toArray()
    await Promise.all(
      oldRecords.map((record) => db.audioMessages.delete(record.id))
    )
    // console.log('Old records deleted successfully')
  } catch (error) {
    console.error('Error deleting old records:', error)
  }
}

db.open()
  .then(() => {
    deleteOldRecords()
    setInterval(deleteOldRecords, 3600000)
  })
  .catch((error) => {
    console.error('Failed to open database:', error)
  })