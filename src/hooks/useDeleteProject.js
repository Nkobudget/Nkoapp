// hooks/useDeleteProject.js
// ─────────────────────────────────────────────────────────────
// Drop-in hook for NKO project deletion.
// Calls the soft_delete_project() Supabase RPC function.
//
// Usage:
//   const { deleteProject, isDeleting, error } = useDeleteProject()
//   await deleteProject(projectId)   // returns true on success
// ─────────────────────────────────────────────────────────────

import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'  // adjust path to match yours

export function useDeleteProject({ onSuccess } = {}) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError]           = useState(null)

  const deleteProject = useCallback(async (projectId) => {
    if (!projectId) return false

    setIsDeleting(true)
    setError(null)

    try {
      const { data, error: rpcError } = await supabase
        .rpc('soft_delete_project', { project_id: projectId })

      if (rpcError) throw rpcError

      if (onSuccess) onSuccess(projectId)
      return true

    } catch (err) {
      const message =
        err?.message === 'Project not found'
          ? 'This project no longer exists.'
          : err?.message === 'Not authorised to delete this project'
          ? "You don't have permission to delete this project."
          : 'Something went wrong. Please try again.'

      setError(message)
      return false

    } finally {
      setIsDeleting(false)
    }
  }, [onSuccess])

  return { deleteProject, isDeleting, error }
}
