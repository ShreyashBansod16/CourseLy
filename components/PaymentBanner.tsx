'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export default function PaymentBanner() {
  const sp = useSearchParams()
  const router = useRouter()
  const paid = sp.get('paid') === '1'
  const canceled = sp.get('canceled') === '1'
  const sessionId = sp.get('session_id')

  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'not_paid' | 'error' | 'canceled'>(
    paid && sessionId ? 'verifying' : 'idle'
  )
  const [message, setMessage] = useState<string>('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [closingProgrammatically, setClosingProgrammatically] = useState(false)

  // Clear the URL params after closing dialog; optionally keep course_id so page logic can open video modal afterwards
  const clearParams = useMemo(() => {
    return (preserveCourseId = false) => {
      const url = new URL(window.location.href)
      const courseId = url.searchParams.get('course_id')
      url.searchParams.delete('paid')
      url.searchParams.delete('canceled')
      url.searchParams.delete('session_id')
      if (!preserveCourseId) {
        url.searchParams.delete('course_id')
      } else {
        // re-apply course_id explicitly to ensure it remains the only param
        url.search = ''
        url.searchParams.set('course_id', courseId || '')
      }
      router.replace(url.pathname + (url.search ? '?' + url.searchParams.toString() : ''))
    }
  }, [router])

  useEffect(() => {
    let ignore = false
    async function verify() {
      if (!paid || !sessionId) return
      // Open dialog immediately for better UX
      setStatus('verifying')
      setDialogOpen(true)

      // Defer video modal: stash and remove course_id from URL until user confirms success
      try {
        const url = new URL(window.location.href)
        const cid = url.searchParams.get('course_id')
        if (cid) {
          sessionStorage.setItem('deferred_course_id', cid)
          url.searchParams.delete('course_id')
          // keep paid & session_id for confirmation
          history.replaceState(null, '', url.pathname + '?' + url.searchParams.toString())
        }
      } catch {}
      try {
        const res = await fetch(`/api/confirm?session_id=${encodeURIComponent(sessionId)}`)
        const data = await res.json()
        // Debug logs to trace behavior
        console.log('[PaymentBanner] confirm status', res.status, 'body', data)
        if (!ignore) {
          if (res.ok && data?.ok) {
            setStatus('success')
            setMessage('Your payment was successful. You now have access to the course.')
            setDialogOpen(true)
          } else if (data?.reason === 'not_paid') {
            setStatus('not_paid')
            setMessage('Payment not completed. If you were charged, please contact support.')
            setDialogOpen(true)
          } else {
            setStatus('error')
            setMessage(data?.error || 'Could not confirm your payment.')
            setDialogOpen(true)
          }
        }
      } catch (e: any) {
        if (!ignore) {
          setStatus('error')
          setMessage(e?.message || 'Unexpected error while confirming payment.')
          setDialogOpen(true)
        }
      }
    }
    verify()
    return () => {
      ignore = true
    }
  }, [paid, sessionId])

  // Handle canceled explicitly
  useEffect(() => {
    if (canceled) {
      setStatus('canceled')
      setMessage('Your checkout was canceled. You can try again anytime.')
      setDialogOpen(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canceled])

  // Debug initial state once
  useEffect(() => {
    console.log('[PaymentBanner] params', { paid, canceled, sessionId })
  }, [paid, canceled, sessionId])

  return (
    <>
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) {
            if (closingProgrammatically) {
              // Button handlers already adjusted URL; just reset flag.
              setClosingProgrammatically(false)
              return
            }
            // Default close via overlay/esc: clear all params
            clearParams(false)
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {status === 'verifying' && 'Verifying payment…'}
              {status === 'success' && 'Payment successful'}
              {status === 'not_paid' && 'Payment not completed'}
              {status === 'error' && 'Payment confirmation failed'}
              {status === 'canceled' && 'Payment canceled'}
            </DialogTitle>
            <DialogDescription>
              {message || (
                status === 'success'
                  ? 'Payment confirmed. Enjoy your course!'
                  : status === 'verifying'
                  ? 'Hang tight while we confirm your checkout.'
                  : ''
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            {status === 'success' ? (
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    // Proceed to videos: restore course_id and clear other params
                    try {
                      const cid = sessionStorage.getItem('deferred_course_id')
                      const url = new URL(window.location.href)
                      url.search = ''
                      if (cid) url.searchParams.set('course_id', cid)
                      history.replaceState(null, '', url.pathname + (url.search ? '?' + url.searchParams.toString() : ''))
                      // remove paid/session_id/canceled if any remnants
                      url.searchParams.delete('paid')
                      url.searchParams.delete('session_id')
                      url.searchParams.delete('canceled')
                      history.replaceState(null, '', url.pathname + (url.search ? '?' + url.searchParams.toString() : ''))
                      sessionStorage.removeItem('deferred_course_id')
                    } catch {}
                    setClosingProgrammatically(true)
                    setDialogOpen(false)
                  }}
                >
                  Proceed to videos
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    // See all courses: clear everything and go to allcourses
                    try {
                      const url = new URL(window.location.href)
                      url.search = ''
                      history.replaceState(null, '', '/courses/allcourses')
                      sessionStorage.removeItem('deferred_course_id')
                    } catch {
                      router.push('/courses/allcourses')
                    }
                    setClosingProgrammatically(true)
                    setDialogOpen(false)
                  }}
                >
                  See all courses
                </Button>
              </div>
            ) : (
              <Button onClick={() => setDialogOpen(false)}>OK</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
