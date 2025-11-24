'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'sessions' | 'council' | 'import'>('sessions');
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [editItem, setEditItem] = useState<any>(null);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    useEffect(() => {
        if (status === 'authenticated' && activeTab !== 'import') {
            fetchData();
        }
    }, [status, activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/${activeTab}`);

            if (!res.ok) {
                if (res.status === 401) {
                    router.push('/login');
                    return;
                }
                throw new Error(`Failed to fetch data: ${res.statusText}`);
            }

            const json = await res.json();

            if (Array.isArray(json)) {
                setData(json);
            } else {
                console.error('Received invalid data format:', json);
                setData([]);
            }
        } catch (err) {
            console.error('Error fetching data:', err);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure?')) return;
        await fetch(`/api/admin/${activeTab}?id=${id}`, { method: 'DELETE' });
        fetchData();
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = editItem?.id ? 'PUT' : 'POST';
        const body = JSON.stringify(editItem);

        await fetch(`/api/admin/${activeTab}`, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body,
        });

        setEditItem(null);
        fetchData();
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);
                const res = await fetch('/api/admin/import', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(json),
                });
                if (res.ok) {
                    alert('Import successful!');
                } else {
                    alert('Import failed.');
                }
            } catch (err) {
                alert('Invalid JSON file');
            }
        };
        reader.readAsText(file);
    };

    if (status === 'loading') return <div className="p-8">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600">Welcome, {session?.user?.name}</span>
                        <button
                            onClick={() => signOut()}
                            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>

                <div className="mb-6 flex gap-4 border-b border-gray-200">
                    <button
                        className={`px-4 py-2 ${activeTab === 'sessions' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                        onClick={() => { setActiveTab('sessions'); setEditItem(null); }}
                    >
                        Reading Sessions
                    </button>
                    <button
                        className={`px-4 py-2 ${activeTab === 'council' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                        onClick={() => { setActiveTab('council'); setEditItem(null); }}
                    >
                        Council Members
                    </button>
                    <button
                        className={`px-4 py-2 ${activeTab === 'import' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                        onClick={() => { setActiveTab('import'); setEditItem(null); }}
                    >
                        Batch Import
                    </button>
                </div>

                {activeTab === 'import' ? (
                    <div className="rounded-lg bg-white p-6 shadow">
                        <h2 className="mb-4 text-xl font-semibold">Import Data</h2>
                        <p className="mb-4 text-gray-600">Upload a JSON file containing `sessions` and/or `councilMembers` arrays.</p>
                        <input
                            type="file"
                            accept=".json"
                            onChange={handleImport}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>
                ) : (
                    <div className="rounded-lg bg-white p-6 shadow">
                        <div className="mb-4 flex justify-between">
                            <h2 className="text-xl font-semibold capitalize">{activeTab}</h2>
                            <button
                                onClick={() => setEditItem({})}
                                className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                            >
                                Add New
                            </button>
                        </div>

                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Title/Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {data.map((item) => (
                                            <tr key={item.id}>
                                                <td className="whitespace-nowrap px-6 py-4">{item.id}</td>
                                                <td className="whitespace-nowrap px-6 py-4">{item.title || item.name}</td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <button
                                                        onClick={() => setEditItem(item)}
                                                        className="mr-2 text-blue-600 hover:text-blue-900"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {editItem && activeTab !== 'import' && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="w-full max-w-lg rounded-lg bg-white p-6">
                            <h3 className="mb-4 text-lg font-bold">{editItem.id ? 'Edit' : 'Add'} {activeTab === 'sessions' ? 'Session' : 'Member'}</h3>
                            <form onSubmit={handleSave} className="space-y-4">
                                {activeTab === 'sessions' ? (
                                    <>
                                        <input
                                            placeholder="Title"
                                            value={editItem.title || ''}
                                            onChange={e => setEditItem({ ...editItem, title: e.target.value })}
                                            className="w-full rounded border p-2"
                                            required
                                        />
                                        <input
                                            type="date"
                                            value={editItem.date ? new Date(editItem.date).toISOString().split('T')[0] : ''}
                                            onChange={e => setEditItem({ ...editItem, date: e.target.value })}
                                            className="w-full rounded border p-2"
                                            required
                                        />
                                        <input
                                            placeholder="Speaker"
                                            value={editItem.speaker || ''}
                                            onChange={e => setEditItem({ ...editItem, speaker: e.target.value })}
                                            className="w-full rounded border p-2"
                                            required
                                        />
                                        <textarea
                                            placeholder="Description"
                                            value={editItem.description || ''}
                                            onChange={e => setEditItem({ ...editItem, description: e.target.value })}
                                            className="w-full rounded border p-2"
                                            required
                                        />
                                        <input
                                            placeholder="Image URL"
                                            value={editItem.imageUrl || ''}
                                            onChange={e => setEditItem({ ...editItem, imageUrl: e.target.value })}
                                            className="w-full rounded border p-2"
                                        />
                                    </>
                                ) : (
                                    <>
                                        <input
                                            placeholder="Name"
                                            value={editItem.name || ''}
                                            onChange={e => setEditItem({ ...editItem, name: e.target.value })}
                                            className="w-full rounded border p-2"
                                            required
                                        />
                                        <textarea
                                            placeholder="Bio"
                                            value={editItem.bio || ''}
                                            onChange={e => setEditItem({ ...editItem, bio: e.target.value })}
                                            className="w-full rounded border p-2"
                                            required
                                        />
                                        <input
                                            placeholder="Image URL"
                                            value={editItem.imageUrl || ''}
                                            onChange={e => setEditItem({ ...editItem, imageUrl: e.target.value })}
                                            className="w-full rounded border p-2"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Order"
                                            value={editItem.order || 0}
                                            onChange={e => setEditItem({ ...editItem, order: e.target.value })}
                                            className="w-full rounded border p-2"
                                        />
                                    </>
                                )}
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setEditItem(null)}
                                        className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
