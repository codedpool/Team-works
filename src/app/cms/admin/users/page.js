// app/cms/admin/users/page.js
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { PlusCircle, XCircle, Trash2, User, Mail, Shield, CheckCircle, Clock, Key, Eye, EyeOff, AlertTriangle } from 'lucide-react';

// Password Edit Modal Component (keeping the same as before)
const PasswordEditModal = ({ user, currentUser, onClose, onPasswordUpdated }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setError('');

        if (!newPassword || !confirmPassword) {
            setError('Both password fields are required.');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`/api/cms/users/${user._id}/password`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: newPassword }),
                credentials: 'include',
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Failed to update password.');
            }

            onPasswordUpdated();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        <Key className="w-5 h-5" />
                        Change Password
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <XCircle className="w-6 h-6" />
                    </button>
                </div>

                <div className="mb-4 p-3 bg-blue-50 rounded-xl">
                    <p className="text-sm text-blue-800">
                        <strong>User:</strong> {user.name} ({user.email})
                    </p>
                </div>

                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-all"
                                placeholder="Enter new password"
                                required
                                minLength="6"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-all"
                                placeholder="Confirm new password"
                                required
                                minLength="6"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl flex items-center">
                            <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-auto px-6 py-3 text-white rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100"
                            style={{
                                background: loading ? '#9ca3af' : 'linear-gradient(90deg, #5292E4 0%, #036DA9 100%)',
                                boxShadow: loading ? 'none' : '0 4px 16px rgba(82, 146, 228, 0.3)'
                            }}
                        >
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full sm:w-auto px-6 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-all duration-300 font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Create User Form Component (keeping the same as before)
const CreateUserForm = ({ currentUser, onUserCreated, onCancel }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Employee');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreate = async (e) => {
        e.preventDefault();
        setError('');
        if (!name || !email || !password || !role) {
            setError('All fields are required.');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch('/api/cms/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role }),
                credentials: 'include',
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Failed to create user.');
            }
            onUserCreated();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Register New User</h2>
            <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                        type="text" 
                        placeholder="Full Name" 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:bg-white focus:border-blue-500 focus:outline-none transition-all" 
                        required 
                    />
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:bg-white focus:border-blue-500 focus:outline-none transition-all" 
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:bg-white focus:border-blue-500 focus:outline-none transition-all" 
                        required 
                        minLength="6" 
                    />
                    <select 
                        value={role} 
                        onChange={e => setRole(e.target.value)} 
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
                    >
                        <option value="Employee">Employee</option>
                        <option value="Admin">Admin</option>
                        {currentUser?.role === 'SuperAdmin' && <option value="SuperAdmin">SuperAdmin</option>}
                    </select>
                </div>
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl flex items-center">
                        <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                    </div>
                )}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full sm:w-auto px-6 py-3 text-white rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100"
                        style={{
                            background: loading ? '#9ca3af' : 'linear-gradient(90deg, #5292E4 0%, #036DA9 100%)',
                            boxShadow: loading ? 'none' : '0 4px 16px rgba(82, 146, 228, 0.3)'
                        }}
                    >
                        {loading ? 'Creating...' : 'Create User'}
                    </button>
                    <button 
                        type="button" 
                        onClick={onCancel} 
                        className="w-full sm:w-auto px-6 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-all duration-300 font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

const getRoleBadgeColor = (role) => {
    const colors = {
        'SuperAdmin': 'bg-red-100 text-red-900 font-semibold',
        'Admin': 'bg-orange-100 text-orange-900 font-semibold',
        'Employee': 'bg-blue-100 text-blue-900 font-semibold'
    };
    return colors[role] || 'bg-gray-100 text-gray-900 font-semibold';
};

export default function UserManagementPage() {
    const { user: currentUser, loading: authLoading } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [passwordEditUser, setPasswordEditUser] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/cms/users', { credentials: 'include' });
            if (!res.ok) throw new Error('Failed to fetch users.');
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser) fetchUsers();
    }, [currentUser]);

    const handleRoleChange = async (userId, newRole) => {
        try {
            await fetch(`/api/cms/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole }),
                credentials: 'include',
            });
            fetchUsers();
        } catch (err) {
            setError('Failed to update role.');
        }
    };

    const handleDeleteUser = async (userId) => {
        if(window.confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) {
            try {
                const res = await fetch(`/api/cms/users/${userId}`, { method: 'DELETE', credentials: 'include' });
                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.message || 'Failed to delete user.');
                }
                fetchUsers();
            } catch(err) {
                setError(err.message);
            }
        }
    };

    const handleDismissForgotPassword = async (userId) => {
        try {
            const res = await fetch(`/api/cms/users/${userId}/dismiss-forgot-password`, {
                method: 'PUT',
                credentials: 'include',
            });
            if (!res.ok) {
                throw new Error('Failed to dismiss forgot password request.');
            }
            fetchUsers();
        } catch (err) {
            setError(err.message);
        }
    };

    const canEditPassword = (user) => {
        if (currentUser?.role === 'SuperAdmin') {
            return true;
        }
        if (currentUser?.role === 'Admin') {
            return user.role === 'Employee';
        }
        return false;
    };

    const handlePasswordEdit = (user) => {
        setPasswordEditUser(user);
    };

    const handlePasswordUpdated = () => {
    setPasswordEditUser(null);
    setError('');
    
    // Show success message that includes clearing forgot password request
    const user = passwordEditUser;
    let successMessage = 'Password updated successfully!';
    
    if (user && user.forgotPasswordRequest?.isActive) {
        successMessage += ' The password reset request has been automatically cleared.';
    }
    
    alert(successMessage);
    fetchUsers(); // Refresh to show cleared forgot password notification
};

    if (authLoading || loading) {
        return (
            <div className="p-3 sm:p-4 lg:p-6 min-h-screen" style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                fontFamily: 'Inter'
            }}>
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-900 font-medium">Loading users...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-3 sm:p-4 lg:p-6 min-h-screen" style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                fontFamily: 'Inter'
            }}>
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-l-4 border-red-500">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-red-800 font-medium">Error: {error}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-3 sm:p-4 lg:p-6 min-h-screen" style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            fontFamily: 'Inter'
        }}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-4 sm:mb-6">
                    <div className="bg-white rounded-2xl p-6 shadow-lg" style={{
                        background: 'linear-gradient(90deg, #024A7A 0%, #3A6FB8 100%)'
                    }}>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <h1 className="text-2xl sm:text-3xl font-bold text-white">User Management</h1>
                            <button
                                onClick={() => setShowCreateForm(!showCreateForm)}
                                className="flex items-center justify-center gap-2 px-6 py-3 text-white rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:scale-105"
                                style={{
                                    background: 'linear-gradient(90deg, #5292E4 0%, #036DA9 100%)',
                                    boxShadow: '0 4px 16px rgba(82, 146, 228, 0.3)'
                                }}
                            >
                                {showCreateForm ? <XCircle className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
                                <span className="hidden sm:inline">
                                    {showCreateForm ? 'Cancel' : 'Register New User'}
                                </span>
                                <span className="sm:hidden">
                                    {showCreateForm ? 'Cancel' : 'Add User'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Create User Form */}
                {showCreateForm && (
                    <CreateUserForm
                        currentUser={currentUser}
                        onUserCreated={() => {
                            setShowCreateForm(false);
                            fetchUsers();
                        }}
                        onCancel={() => setShowCreateForm(false)}
                    />
                )}

                {/* Password Edit Modal */}
                {passwordEditUser && (
                    <PasswordEditModal
                        user={passwordEditUser}
                        currentUser={currentUser}
                        onClose={() => setPasswordEditUser(null)}
                        onPasswordUpdated={handlePasswordUpdated}
                    />
                )}

                {/* Users Display */}
                {users.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4" style={{
                            background: 'linear-gradient(90deg, #024A7A 0%, #3A6FB8 100%)'
                        }}>
                            <User className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No users found</h3>
                        <p className="text-gray-600">There are currently no users to display.</p>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden lg:block bg-white shadow-lg rounded-2xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead style={{
                                        background: 'linear-gradient(90deg, #024A7A 0%, #3A6FB8 100%)'
                                    }}>
                                        <tr>
                                            <th className="py-4 px-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Name</th>
                                            <th className="py-4 px-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Email</th>
                                            <th className="py-4 px-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Role</th>
                                            <th className="py-4 px-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Status</th>
                                            <th className="py-4 px-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {users.map((user, index) => (
                                            <tr key={user._id} className={`transition-colors duration-200 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50`}>
                                                <td className="py-4 px-4 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-gray-900">{user.name || 'N/A'}</span>
                                                        {user.forgotPasswordRequest?.isActive && (
                                                            <div className="flex items-center gap-1">
                                                                <AlertTriangle className="w-4 h-4 text-orange-500" />
                                                                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full font-semibold">
                                                                    Password Reset Requested
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {user.forgotPasswordRequest?.isActive && (
                                                        <div className="mt-1 text-xs text-gray-500">
                                                            Requested: {new Date(user.forgotPasswordRequest.requestedAt).toLocaleDateString()}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="py-4 px-4 text-sm text-gray-700">{user.email}</td>
                                                <td className="py-4 px-4 text-sm">
                                                    <span className={`px-3 py-1 rounded-full text-xs ${getRoleBadgeColor(user.role)}`}>
                                                        {user.role || 'Not Assigned'}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-sm">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.isVerified ? 'bg-green-100 text-green-900' : 'bg-yellow-100 text-yellow-900'}`}>
                                                        {user.isVerified ? 'Verified' : 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-sm">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <select 
                                                            defaultValue={user.role || ''} 
                                                            onChange={(e) => handleRoleChange(user._id, e.target.value)} 
                                                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 focus:border-blue-500 focus:outline-none" 
                                                            disabled={(user.role === 'SuperAdmin' && currentUser?.role !== 'SuperAdmin') || user._id === currentUser?.userId}
                                                        >
                                                            <option value="" disabled>Change role</option>
                                                            <option value="Employee">Employee</option>
                                                            <option value="Admin">Admin</option>
                                                            {currentUser?.role === 'SuperAdmin' && <option value="SuperAdmin">SuperAdmin</option>}
                                                        </select>
                                                        
                                                        {canEditPassword(user) && (
                                                            <button
                                                                onClick={() => handlePasswordEdit(user)}
                                                                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-all duration-200"
                                                                title="Change Password"
                                                            >
                                                                <Key className="w-5 h-5"/>
                                                            </button>
                                                        )}

                                                        {user.forgotPasswordRequest?.isActive && (
                                                            <button
                                                                onClick={() => handleDismissForgotPassword(user._id)}
                                                                className="p-2 text-orange-600 hover:text-orange-800 hover:bg-orange-100 rounded-lg transition-all duration-200"
                                                                title="Dismiss Password Reset Request"
                                                            >
                                                                <XCircle className="w-5 h-5"/>
                                                            </button>
                                                        )}
                                                        
                                                        <button 
                                                            onClick={() => handleDeleteUser(user._id)}
                                                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-all duration-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                                            title="Delete User"
                                                            disabled={
                                                                (user.role === 'SuperAdmin' && currentUser?.role !== 'SuperAdmin') ||
                                                                user._id === currentUser?.userId ||
                                                                (currentUser?.role === 'Admin' && user.role === 'Admin')
                                                            }
                                                        >
                                                            <Trash2 className="w-5 h-5"/>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile Cards */}
                        <div className="lg:hidden space-y-4">
                            {users.map((user) => (
                                <div key={user._id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                                                        <User className="w-5 h-5 text-gray-500" />
                                                        {user.name || 'N/A'}
                                                    </h3>
                                                    {user.forgotPasswordRequest?.isActive && (
                                                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                                                    )}
                                                </div>
                                                {user.forgotPasswordRequest?.isActive && (
                                                    <div className="mb-2 p-2 bg-orange-50 rounded-lg">
                                                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full font-semibold">
                                                            Password Reset Requested
                                                        </span>
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            {new Date(user.forgotPasswordRequest.requestedAt).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                )}
                                                <p className="text-sm text-gray-500 flex items-center gap-2">
                                                    <Mail className="w-4 h-4" />
                                                    {user.email}
                                                </p>
                                            </div>
                                            <div className="flex flex-col gap-2 ml-3">
                                                <span className={`px-3 py-1 rounded-full text-xs flex-shrink-0 ${getRoleBadgeColor(user.role)}`}>
                                                    {user.role || 'Not Assigned'}
                                                </span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${user.isVerified ? 'bg-green-100 text-green-900' : 'bg-yellow-100 text-yellow-900'}`}>
                                                    {user.isVerified ? (
                                                        <span className="flex items-center gap-1">
                                                            <CheckCircle className="w-3 h-3" />
                                                            Verified
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            Pending
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500 mb-2">Change Role</p>
                                                <select 
                                                    defaultValue={user.role || ''} 
                                                    onChange={(e) => handleRoleChange(user._id, e.target.value)} 
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:border-blue-500 focus:outline-none transition-all" 
                                                    disabled={(user.role === 'SuperAdmin' && currentUser?.role !== 'SuperAdmin') || user._id === currentUser?.userId}
                                                >
                                                    <option value="" disabled>Select new role</option>
                                                    <option value="Employee">Employee</option>
                                                    <option value="Admin">Admin</option>
                                                    {currentUser?.role === 'SuperAdmin' && <option value="SuperAdmin">SuperAdmin</option>}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="pt-4 border-t border-gray-200 space-y-3">
                                            {canEditPassword(user) && (
                                                <button
                                                    onClick={() => handlePasswordEdit(user)}
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-white rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:scale-105"
                                                    style={{
                                                        background: 'linear-gradient(90deg, #5292E4 0%, #036DA9 100%)',
                                                        boxShadow: '0 4px 12px rgba(82, 146, 228, 0.3)'
                                                    }}
                                                >
                                                    <Key className="w-4 h-4" />
                                                    Change Password
                                                </button>
                                            )}

                                            {user.forgotPasswordRequest?.isActive && (
                                                <button
                                                    onClick={() => handleDismissForgotPassword(user._id)}
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-white rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:scale-105"
                                                    style={{
                                                        background: 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)',
                                                        boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
                                                    }}
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                    Dismiss Reset Request
                                                </button>
                                            )}
                                            
                                            <button 
                                                onClick={() => handleDeleteUser(user._id)}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-white rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:scale-100"
                                                disabled={
                                                    (user.role === 'SuperAdmin' && currentUser?.role !== 'SuperAdmin') ||
                                                    user._id === currentUser?.userId ||
                                                    (currentUser?.role === 'Admin' && user.role === 'Admin')
                                                }
                                                style={{
                                                    background: (user.role === 'SuperAdmin' && currentUser?.role !== 'SuperAdmin') ||
                                                               user._id === currentUser?.userId ||
                                                               (currentUser?.role === 'Admin' && user.role === 'Admin') 
                                                        ? '#d1d5db' : 'linear-gradient(90deg, #dc2626 0%, #b91c1c 100%)',
                                                    boxShadow: (user.role === 'SuperAdmin' && currentUser?.role !== 'SuperAdmin') ||
                                                              user._id === currentUser?.userId ||
                                                              (currentUser?.role === 'Admin' && user.role === 'Admin') 
                                                        ? 'none' : '0 4px 12px rgba(220, 38, 38, 0.3)'
                                                }}
                                                title={
                                                    user._id === currentUser?.userId ? "Cannot delete yourself" :
                                                    (user.role === 'SuperAdmin' && currentUser?.role !== 'SuperAdmin') ? "Cannot delete SuperAdmin" :
                                                    (currentUser?.role === 'Admin' && user.role === 'Admin') ? "Cannot delete another Admin" :
                                                    "Delete User"
                                                }
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Delete User
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
