import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function UserProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (router.query.data) {
      try {
        const parsedData = JSON.parse(router.query.data);
        setUserData(parsedData);
      } catch (err) {
        console.error("Failed to parse data:", err);
      }
    }
  }, [router.query.data]);

  if (!userData) {
    return <p>Loading user data...</p>;
  }

  return (
    <div>
      <h1>User Profile</h1>
      <pre>{JSON.stringify(userData, null, 2)}</pre>
      <button 
      onClick={()=>router.push('/dashboard')}
        className="w-1/4 p-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
        Back to Dashboard
      </button>
    </div>
  );
}
