import { useState } from "react";
import Tabs from "./tabs";
import UserInformation from "./UserInformation";
import AddProductForm from "./productForm";

function AdminView({
  user,
  unverifiedUsers,
  handleVerify,
  handleCancelVerification,
  updateUser,
  handleAddProduct,
}) {
  const [activeTab, setActiveTab] = useState(0);
  console.log("hellos");
  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <Tabs
        tabs={["User Information", "Unverified Users", "Add Product"]}
        activeTab={activeTab}
        onChangeTab={handleTabChange}
      />
      {activeTab === 0 && (
        <UserInformation user={user} updateUser={updateUser} />
      )}
      {activeTab === 1 && (
        <UnverifiedUsersList
          unverifiedUsers={unverifiedUsers}
          handleVerify={handleVerify}
          handleCancelVerification={handleCancelVerification}
        />
      )}
      {activeTab === 2 && <AddProductForm onAddProduct={handleAddProduct} />}
    </div>
  );
}

function UnverifiedUsersList({
  unverifiedUsers,
  handleVerify,
  handleCancelVerification,
}) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Unverified Users</h2>
      <ul className="space-y-4">
        {unverifiedUsers.map((user) => (
          <li
            key={user._id}
            className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-sm">
            <div>
              <p className="text-lg font-medium">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleVerify(user._id)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                Verify
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminView;
