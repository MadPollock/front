import React from 'react';
import { AddUserForm } from '../components/admin/AddUserForm';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';

const mockUsers = [
  { id: '1', name: 'Alex Morgan', email: 'alex@example.com', role: 'admin', status: 'active' },
  { id: '2', name: 'Sarah Chen', email: 'sarah@example.com', role: 'user', status: 'active' },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'viewer', status: 'active' },
  { id: '4', name: 'Emma Wilson', email: 'emma@example.com', role: 'user', status: 'pending' },
];

export function AddUserView() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div>
        <h1 style={{ fontFamily: 'Manrope' }}>User Management</h1>
        <p className="text-muted-foreground mt-1">
          Add new users and manage access levels
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AddUserForm />

        <div className="bg-card rounded-2xl border border-border p-6" style={{ boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontFamily: 'Manrope', fontSize: '18px', fontWeight: 500 }} className="mb-4">Current Users</h2>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="size-8">
                          <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                        {user.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}