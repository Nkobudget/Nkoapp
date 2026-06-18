// components/DeleteProjectModal.jsx
// ─────────────────────────────────────────────────────────────
// Confirmation modal before deleting a project.
// Requires the producer to TYPE the project name to confirm —
// the same pattern used by Vercel, GitHub, Supabase — so there
// is zero accidental deletion.
//
// Props:
//   project    — { id, name } object
//   isOpen     — boolean
//   onClose    — () => void
//   onDeleted  — (projectId) => void  called after successful delete
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from 'react'
import { useDeleteProject } from '../hooks/useDeleteProject'

export function DeleteProjectModal({ project, isOpen, onClose, onDeleted }) {
  const [confirmText, setConfirmText] = useState('')
  const inputRef = useRef(null)

  const { deleteProject, isDeleting, error } = useDeleteProject({
    onSuccess: (id) => {
      setConfirmText('')
      onDeleted?.(id)
      onClose()
    },
  })

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setConfirmText('')
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    if (isOpen) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!isOpen || !project) return null

  const isConfirmed = confirmText.trim() === project.name.trim()

  const handleDelete = async () => {
    if (!isConfirmed || isDeleting) return
    await deleteProject(project.id)
  }

  return (
    /* Backdrop */
    <div
      style={styles.backdrop}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      {/* Modal card */}
      <div style={styles.modal}>

        {/* Header */}
        <div style={styles.header}>
          <span style={styles.warningIcon} aria-hidden="true">⚠</span>
          <h2 id="delete-modal-title" style={styles.title}>
            Delete project
          </h2>
        </div>

        {/* Body */}
        <div style={styles.body}>
          <p style={styles.bodyText}>
            <strong style={{ color: '#1A1A1A' }}>{project.name}</strong> will be
            permanently removed from NKO. All budget lines, categories, and export
            history for this project will be lost.
          </p>
          <p style={styles.bodyText}>
            This action <strong style={{ color: '#C0392B' }}>cannot be undone</strong>.
          </p>

          <label style={styles.label} htmlFor="confirm-input">
            Type the project name to confirm:
            <span style={styles.projectNameHint}>{project.name}</span>
          </label>
          <input
            ref={inputRef}
            id="confirm-input"
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleDelete() }}
            placeholder={project.name}
            style={{
              ...styles.input,
              borderColor: confirmText.length > 0
                ? isConfirmed ? '#27AE60' : '#C9A84C'
                : '#D4C5A0',
            }}
            autoComplete="off"
            spellCheck="false"
            disabled={isDeleting}
          />

          {error && (
            <p style={styles.errorText} role="alert">{error}</p>
          )}
        </div>

        {/* Actions */}
        <div style={styles.actions}>
          <button
            onClick={onClose}
            style={styles.cancelBtn}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            style={{
              ...styles.deleteBtn,
              opacity: isConfirmed && !isDeleting ? 1 : 0.4,
              cursor: isConfirmed && !isDeleting ? 'pointer' : 'not-allowed',
            }}
            disabled={!isConfirmed || isDeleting}
            aria-disabled={!isConfirmed || isDeleting}
          >
            {isDeleting ? 'Deleting…' : 'Delete project'}
          </button>
        </div>

      </div>
    </div>
  )
}


// ── Inline styles (keeps the component self-contained) ────────
const styles = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(26, 26, 26, 0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '16px',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '440px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '20px 24px 16px',
    borderBottom: '1px solid #EDE9E0',
  },
  warningIcon: {
    fontSize: '18px',
    color: '#C0392B',
    lineHeight: 1,
  },
  title: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: 'inherit',
  },
  body: {
    padding: '20px 24px',
  },
  bodyText: {
    fontSize: '14px',
    color: '#555',
    lineHeight: '1.55',
    margin: '0 0 12px',
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: '8px',
    marginTop: '16px',
    letterSpacing: '0.01em',
  },
  projectNameHint: {
    display: 'block',
    fontFamily: 'monospace',
    fontSize: '13px',
    color: '#C9A84C',
    fontWeight: '700',
    marginTop: '4px',
    letterSpacing: '0.02em',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '13px',
    fontFamily: 'monospace',
    border: '1.5px solid #D4C5A0',
    borderRadius: '5px',
    outline: 'none',
    color: '#1A1A1A',
    backgroundColor: '#FDFCF9',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  },
  errorText: {
    marginTop: '10px',
    fontSize: '12px',
    color: '#C0392B',
    fontWeight: '500',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    padding: '16px 24px 20px',
    borderTop: '1px solid #EDE9E0',
  },
  cancelBtn: {
    padding: '9px 18px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#1A1A1A',
    backgroundColor: 'transparent',
    border: '1.5px solid #D4C5A0',
    borderRadius: '5px',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  deleteBtn: {
    padding: '9px 18px',
    fontSize: '13px',
    fontWeight: '700',
    color: '#FFFFFF',
    backgroundColor: '#C0392B',
    border: 'none',
    borderRadius: '5px',
    fontFamily: 'inherit',
    transition: 'opacity 0.15s',
  },
}
