import { useState } from 'react';
import Head from 'next/head';

export default function TestAuthFix() {
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [secret, setSecret] = useState('');

    const fixAuth = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/fix-auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ secret })
            });
            
            const data = await response.json();
            setResult(data);
        } catch (error) {
            setResult({ error: 'Failed to call API' });
        }
        setLoading(false);
    };

    return (
        <>
            <Head>
                <title>Authentication Fix Tool</title>
            </Head>
            
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">🔧 Authentication Fix Tool</h1>
                    
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <p className="mb-4 text-gray-600">
                            Enter the first 10 characters of your NEXTAUTH_SECRET to fix admin authentication:
                        </p>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Secret Key:</label>
                            <input 
                                type="text"
                                value={secret}
                                onChange={(e) => setSecret(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md"
                                placeholder="Enter first 10 chars of NEXTAUTH_SECRET"
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                From your .env: <code>BRwdl/nWN4</code> (first 10 characters)
                            </p>
                        </div>
                        
                        <button 
                            onClick={fixAuth}
                            disabled={loading || !secret}
                            className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 disabled:bg-gray-300"
                        >
                            {loading ? 'Fixing...' : 'Fix Authentication'}
                        </button>
                    </div>
                    
                    {result && (
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-4">Result:</h3>
                            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                                {JSON.stringify(result, null, 2)}
                            </pre>
                            
                            {result.success && (
                                <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded">
                                    <h4 className="font-semibold text-green-800">✅ Success!</h4>
                                    <p className="text-green-700">You can now login with:</p>
                                    <p className="font-mono text-sm mt-2">
                                        Email: admin@diamant-rouge.com<br/>
                                        Password: Password123!
                                    </p>
                                    
                                    <div className="mt-4">
                                        <a 
                                            href="/auth" 
                                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 inline-block"
                                        >
                                            Test Login →
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
} 