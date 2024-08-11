import { useState } from "react";

export default function UserInformation({ user, updateUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user.user?.fullname);
  const [email, setEmail] = useState(user.user?.email);

  const handleSave = () => {
    updateUser(user.user?.id, { fullname: fullName, email });
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      <div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            disabled={!isEditing}
            className="mt-1 p-2 block w-full text-black border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            className="mt-1 p-2 block text-black w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled
          />
        </div>
        {isEditing && (
          <div className="text-right mt-4">
            <button
              onClick={() => setIsEditing(false)}
              className="mr-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Save
            </button>
          </div>
        )}
      </div>
      {!isEditing && (
        <div>
          <h3 className="text-xl font-medium text-gray-900">{user.fullName}</h3>
          <p className="text-sm text-gray-600">{user.email}</p>
          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            Edit Information
          </button>
        </div>
      )}
    </div>
  );
}
