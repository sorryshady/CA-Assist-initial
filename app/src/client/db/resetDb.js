import { db } from './db'
const deletDatabase = async () => {
  try {
    await db.delete() // Delete the entire database
    console.log('Database deleted successfully')
  } catch (error) {
    console.error('Failed to delete database:', error)
  }
}

deletDatabase()
