import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from './ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { api } from '../lib/api';

interface User {
    idUser: number;
    username: string;
}

export function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({ username: '', password: '' });

    const fetchUsers = async () => {
        try {
            const data = await api.users.getAll();
            setUsers(data);
        } catch {
            toast.error('Failed to fetch users');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.users.create(formData);
            toast.success('User created successfully');
            setIsCreateDialogOpen(false);
            setFormData({ username: '', password: '' });
            fetchUsers();
        } catch {
            toast.error('Failed to create user');
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;
        try {
            await api.users.update(selectedUser.idUser, formData);
            toast.success('User updated successfully');
            setIsEditDialogOpen(false);
            setFormData({ username: '', password: '' });
            fetchUsers();
        } catch {
            toast.error('Failed to update user');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            await api.users.delete(id);
            toast.success('User deleted successfully');
            fetchUsers();
        } catch {
            toast.error('Failed to delete user');
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">User Management</h2>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>Create User</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New User</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>
                            <Button type="submit">Create</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.idUser}>
                            <TableCell>{user.idUser}</TableCell>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Dialog open={isEditDialogOpen && selectedUser?.idUser === user.idUser} 
                                            onOpenChange={(open: boolean) => {
                                                setIsEditDialogOpen(open);
                                                if (!open) setSelectedUser(null);
                                            }}>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setFormData({ username: user.username, password: '' });
                                                }}
                                            >
                                                Edit
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Edit User</DialogTitle>
                                            </DialogHeader>
                                            <form onSubmit={handleUpdate} className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="edit-username">Username</Label>
                                                    <Input
                                                        id="edit-username"
                                                        value={formData.username}
                                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="edit-password">New Password</Label>
                                                    <Input
                                                        id="edit-password"
                                                        type="password"
                                                        value={formData.password}
                                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                        placeholder="Leave blank to keep current password"
                                                    />
                                                </div>
                                                <Button type="submit">Update</Button>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                    <Button
                                        variant="destructive"
                                        onClick={() => handleDelete(user.idUser)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
} 