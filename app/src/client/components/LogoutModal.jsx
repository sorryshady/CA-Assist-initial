import React from 'react'
import { logout } from 'wasp/client/auth'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { db } from '../db/db'
const PORT = import.meta.env.REACT_APP_CA_CHAT_PORT
const ENDPOINT = import.meta.env.REACT_APP_BACKENDPOINT
const LogoutModal = ({ user, children }) => {
  const logoutHandler = async () => {
    const chatId = localStorage.getItem('caChatId')
    if (chatId) {
      const URL = ENDPOINT + 'disconnect'
      const body = {
        chat_id: chatId,
      }
      const response = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
    }
    localStorage.clear()
    await db.delete()
    logout()
  }
  const description =
    user.subscriptionStatus && localStorage.getItem('caChatId') ? (
      <AlertDialogDescription>
        This action cannot be undone. This will permanently clear your chat
        history and will disconnect you from current Chartered Accountant.
      </AlertDialogDescription>
    ) : (
      <AlertDialogDescription>
        This action cannot be undone. This will permanently clear your chat
        history.
      </AlertDialogDescription>
    )
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          {description}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant='destructive' onClick={logoutHandler}>
              Logout
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default LogoutModal
