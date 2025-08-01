'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Users, Briefcase, Target, UserCog, FileText, Upload } from 'lucide-react';

// A reusable component for the stat cards on the dashboard
const StatCard = ({ title, value, icon: Icon, colorClass, loading }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between transition-transform hover:scale-105">
    <div>
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mt-1">
        {loading ? '...' : value}
      </p>
    </div>
    <div className={`p-3 rounded-full ${colorClass}`}>
      <Icon className="w-6 h-6" />
    </div>
  </div>
);

export default function CmsDashboard() {
  const { user: currentUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ leads: 0, careers: 0, users: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push('/auth/login');
    }
  }, [authLoading, currentUser, router]);

  // Fetch dashboard stats when the component mounts
  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        const res = await fetch('/api/cms/stats', { credentials: 'include' });
        if (!res.ok) throw new Error('Could not fetch stats');
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error('Dashboard stats error:', error);
        // Optionally handle error UI here
      } finally {
        setStatsLoading(false);
      }
    };

    // Only fetch stats if the user is logged in
    if (currentUser) {
      fetchStats();
    }
  }, [currentUser]);

  // Display a loading state while the user session is being fetched
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show a brief loading state before redirect
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* === Header Section === */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {currentUser?.name || 'User'}!
          </h1>
          <p className="text-gray-500 mt-1">
             Here&apos;s a quick summary of your application&apos;s activity.
          </p>
        </div>

        {/* === Stats Cards Section === */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(currentUser?.role === 'Admin' || currentUser?.role === 'SuperAdmin') && (
            <StatCard
              title="Total Leads"
              value={stats.leads}
              loading={statsLoading}
              icon={Target}
              colorClass="bg-blue-100 text-blue-600"
            />
          )}
          {(currentUser?.role === 'Admin' || currentUser?.role === 'SuperAdmin') && (
            <StatCard
              title="Active Careers"
              value={stats.careers}
              loading={statsLoading}
              icon={Briefcase}
              colorClass="bg-green-100 text-green-600"
            />
          )}
          <StatCard
            title="Verified Users"
            value={stats.users}
            loading={statsLoading}
            icon={Users}
            colorClass="bg-purple-100 text-purple-600"
          />
        </div>

        {/* === Quick Actions Section === */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {(currentUser?.role === 'Admin' || currentUser?.role === 'SuperAdmin') && (
              <Link href="/cms/admin/users">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center gap-4 cursor-pointer">
                  <UserCog className="w-8 h-8 text-indigo-600" />
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">Manage Users</h3>
                    <p className="text-gray-500 text-sm">Create, delete, or update user roles.</p>
                  </div>
                </div>
              </Link>
            )}

            {(currentUser?.role === 'Admin' || currentUser?.role === 'SuperAdmin') && (
              <Link href="/cms/leads">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center gap-4 cursor-pointer">
                  <FileText className="w-8 h-8 text-rose-600" />
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">View Leads</h3>
                    <p className="text-gray-500 text-sm">Review and export all lead submissions.</p>
                  </div>
                </div>
              </Link>
            )}

            {(currentUser?.role === 'Admin' || currentUser?.role === 'SuperAdmin') && (
              <Link href="/cms/careers">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center gap-4 cursor-pointer">
                  <FileText className="w-8 h-8 text-rose-600" />
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">View Applicants</h3>
                    <p className="text-gray-500 text-sm">Review and export all applicant submissions.</p>
                  </div>
                </div>
              </Link>
            )}

            {(currentUser?.role === 'Admin' || currentUser?.role === 'SuperAdmin') && (
              <Link href="/cms/jobs">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center gap-4 cursor-pointer">
                  <Briefcase className="w-8 h-8 text-emerald-600" />
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">Job Management</h3>
                    <p className="text-gray-500 text-sm">Create, edit, and manage job postings.</p>
                  </div>
                </div>
              </Link>
            )}

            {(currentUser?.role === 'Employee' || currentUser?.role === 'Admin' || currentUser?.role === 'SuperAdmin') && (
              <Link href="/cms/uploads">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center gap-4 cursor-pointer">
                  <Upload className="w-8 h-8 text-blue-600" />
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">File Uploads</h3>
                    <p className="text-gray-500 text-sm">View and manage uploaded files and documents.</p>
                  </div>
                </div>
              </Link>
            )}

            {/* === Reset Password Tile (Visible for all logged-in users) === */}
            {currentUser && (
              <Link href="/cms/reset-password">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center gap-4 cursor-pointer">
                  <Users className="w-8 h-8 text-pink-600" />
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">Reset Password</h3>
                    <p className="text-gray-500 text-sm">Change your account password securely.</p>
                  </div>
                </div>
              </Link>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
