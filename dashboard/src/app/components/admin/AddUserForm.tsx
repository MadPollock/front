import React from 'react';
import { ProtectedActionForm } from './ProtectedActionForm';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { postCommand, CommandContext } from '../../lib/commandClient';

export function AddUserForm() {
  const handleAddUser = async (
    data: Record<string, FormDataEntryValue>,
    context: CommandContext
  ) => {
    const payload = {
      name: data.name,
      email: data.email,
      role: data.role,
    };

    await postCommand('users/add', payload, context);
  };

  return (
    <ProtectedActionForm
      title="Add User"
      description="Create a new user account. This action requires MFA verification."
      onSubmit={handleAddUser}
      requiresMFA={true}
      actionDescription="Create new user account"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="user-name">Full Name</Label>
          <Input
            id="user-name"
            name="name"
            type="text"
            placeholder="John Doe"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="user-email">Email</Label>
          <Input
            id="user-email"
            name="email"
            type="email"
            placeholder="john@example.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="user-role">Role</Label>
          <select
            id="user-role"
            name="role"
            required
            className="w-full px-3 py-2 bg-white dark:bg-gray-950 border rounded-md"
          >
            <option value="">Select role...</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
      </div>
    </ProtectedActionForm>
  );
}
