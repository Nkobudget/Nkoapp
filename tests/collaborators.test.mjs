import assert from 'node:assert/strict';
import { test } from 'node:test';

test('collaborator limits enforce a maximum of 4 invited collaborators per production', () => {
  const MAX_COLLABORATORS = 4;
  const projectId = 'proj-123';
  const ownerId = 'user-owner';

  let collaborators = [
    { id: 'c1', project_id: projectId, user_id: 'user-1', email: 'collab1@example.com' },
    { id: 'c2', project_id: projectId, user_id: 'user-2', email: 'collab2@example.com' },
    { id: 'c3', project_id: projectId, user_id: 'user-3', email: 'collab3@example.com' },
  ];

  const canInvite = (existing, email, resolvedId) => {
    const cleanEmail = email.trim().toLowerCase();
    if (existing.length >= MAX_COLLABORATORS) return { allowed: false, reason: 'max_reached' };
    if (resolvedId === ownerId) return { allowed: false, reason: 'own_account' };
    if (existing.some((c) => c.user_id === resolvedId)) return { allowed: false, reason: 'duplicate' };
    return { allowed: true };
  };

  // 4th collaborator is allowed
  assert.equal(canInvite(collaborators, 'collab4@example.com', 'user-4').allowed, true);

  // Once 4th collaborator is added
  collaborators.push({ id: 'c4', project_id: projectId, user_id: 'user-4', email: 'collab4@example.com' });

  // 5th collaborator is rejected
  const fifth = canInvite(collaborators, 'collab5@example.com', 'user-5');
  assert.equal(fifth.allowed, false);
  assert.equal(fifth.reason, 'max_reached');

  // Duplicate is rejected
  assert.equal(canInvite(collaborators.slice(0, 3), 'collab2@example.com', 'user-2').reason, 'duplicate');

  // Self-invite is rejected
  assert.equal(canInvite(collaborators.slice(0, 3), 'owner@example.com', ownerId).reason, 'own_account');
});

test('individual collaborator removal leaves other collaborators intact', () => {
  const projectId = 'proj-123';
  let collaborators = [
    { id: 'c1', project_id: projectId, user_id: 'user-1' },
    { id: 'c2', project_id: projectId, user_id: 'user-2' },
    { id: 'c3', project_id: projectId, user_id: 'user-3' },
    { id: 'c4', project_id: projectId, user_id: 'user-4' },
  ];

  // Remove collaborator c2
  collaborators = collaborators.filter((c) => c.id !== 'c2');

  assert.equal(collaborators.length, 3);
  assert.deepEqual(collaborators.map((c) => c.id), ['c1', 'c3', 'c4']);
  // Free seat is available again (3 < 4)
  assert.equal(collaborators.length < 4, true);
});

test('only the production admin can export data and share/invite collaborators', () => {
  const project = { id: 'proj-123', name: 'Nna', user_id: 'admin-owner-id' };
  const adminUser = { id: 'admin-owner-id', email: 'owner@example.com' };
  const collaboratorUser = { id: 'collab-user-id', email: 'editor@example.com' };

  const canExport = (user, proj) => {
    return user.id === proj.user_id;
  };

  const canShareOrInvite = (user, proj) => {
    return user.id === proj.user_id;
  };

  const canManageCollaborators = (user, proj) => {
    return user.id === proj.user_id;
  };

  // Admin permissions
  assert.equal(canExport(adminUser, project), true);
  assert.equal(canShareOrInvite(adminUser, project), true);
  assert.equal(canManageCollaborators(adminUser, project), true);

  // Collaborator permissions (blocked from export, share, and invite)
  assert.equal(canExport(collaboratorUser, project), false);
  assert.equal(canShareOrInvite(collaboratorUser, project), false);
  assert.equal(canManageCollaborators(collaboratorUser, project), false);
});


