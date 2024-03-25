import Dexie from 'dexie'

export const db = new Dexie('chat')

db.version(1).stores({
  audioMessages: '++id, message',
})
