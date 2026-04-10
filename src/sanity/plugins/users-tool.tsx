"use client"
import { definePlugin } from 'sanity';
import { Users } from 'lucide-react';

function UsersToolComponent() {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <div style={{ width: '100%', height: '100%', minHeight: 'calc(100vh - 3rem)' }}>
      <iframe
        src={`${baseUrl}/admin/users`}
        style={{
          width: '100%',
          height: '100%',
          minHeight: 'calc(100vh - 3rem)',
          border: 'none',
          background: 'rgb(12, 12, 18)',
        }}
        title="User Management"
      />
    </div>
  );
}

export const usersToolPlugin = definePlugin({
  name: 'users-tool',
  tools: [
    {
      name: 'users',
      title: 'Users',
      icon: () => <Users size={18} />,
      component: UsersToolComponent,
    },
  ],
});
