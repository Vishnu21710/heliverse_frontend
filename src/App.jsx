import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUsers,
  setFilteredUsers,
  addToTeam,
  removeFromTeam,
} from "./features/users/usersSlice";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import "./App.css";

export default function Component() {
  const dispatch = useDispatch();
  const { filteredUsers, selectedTeam, status, error, totalPages, currentPage } = useSelector(
    (state) => state.users
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState(null);

  useEffect(() => {
    dispatch(
      fetchUsers({
        page: currentPage,
        searchQuery,
        selectedDomains,
        selectedGenders,
        selectedAvailability,
      })
    );
  }, [
    dispatch,
    currentPage,
    searchQuery,
    selectedDomains,
    selectedGenders,
    selectedAvailability,
  ]);

  const handleTeamSelection = (user) => {
    if (selectedTeam.find((member) => member.domain === user.domain)) {
      alert("A team member with this domain is already selected.");
      return;
    }
    if (!user.available) {
      alert("This user is not available.");
      return;
    }
    dispatch(addToTeam(user));
  };

  const handleRemoveFromTeam = (userId) => {
    dispatch(removeFromTeam(userId));
  };

  if (status === "loading") {
    return "...Loading";
  }

  if (status === "failed") {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Team Builder</h1>

      {/* Search and Filters */}
      <div className="mb-4 flex flex-wrap gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          onChange={(e) =>
            setSelectedDomains(e.target.value ? [e.target.value] : [])
          }
          className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Domain</option>
          {["IT", "HR", "Finance", "Marketing", "Sales"].map((domain) => (
            <option key={domain} value={domain}>
              {domain}
            </option>
          ))}
        </select>
        <select
          onChange={(e) =>
            setSelectedGenders(e.target.value ? [e.target.value] : [])
          }
          className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <select
          onChange={(e) =>
            setSelectedAvailability(
              e.target.value === "true"
                ? true
                : e.target.value === "false"
                ? false
                : null
            )
          }
          className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Availability</option>
          <option value="true">Available</option>
          <option value="false">Not Available</option>
        </select>
      </div>

      {/* User Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
        {filteredUsers.length === 0 ? (
          <p>No users found</p>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white shadow-md rounded-lg overflow-hidden"
            >
              <div className="p-4">
                <div className="rounded-full overflow-hidden bg-gradient-to-tr from-blue-300 w-16 h-16 to-blue-400">
                  <img src={user.avatar} className="object-cover object-center" alt="" />
                </div>
                <h2 className="text-lg font-semibold">
                  {user.first_name} {user.last_name}
                </h2>
                <p>Domain: {user.domain}</p>
                <p className="mb-4">Gender: {user.gender}</p>
                <span className={`rounded-full ${user.available ? "bg-green-200" : "bg-red-200"} px-5 py-1 text-sm my-4`}>
                 
                  {user.available ? "Available" : "Not Available"}
                </span>
              </div>
              <div className="px-4 py-2 bg-gray-100">
                <button
                  onClick={() => handleTeamSelection(user)}
                  disabled={
                    !user.available ||
                    selectedTeam.some(
                      (member) => member.domain === user.domain
                    )
                  }
                  className={`w-full py-2 rounded-md ${
                    user.available &&
                    !selectedTeam.some(
                      (member) => member.domain === user.domain
                    )
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Add to Team
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center space-x-2 my-4">
        <button
          onClick={() => dispatch(fetchUsers({ page: Math.max(currentPage - 1, 1), searchQuery, selectedDomains, selectedGenders, selectedAvailability }))}
          disabled={currentPage === 1}
          className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => dispatch(fetchUsers({ page: Math.min(currentPage + 1, totalPages), searchQuery, selectedDomains, selectedGenders, selectedAvailability }))}
          disabled={currentPage === totalPages}
          className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Selected Team */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Selected Team</h2>
        {selectedTeam.length === 0 ? (
          <p>No team members selected.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {selectedTeam.map((user) => (
              <div
                key={user.id}
                className="bg-white shadow-md rounded-lg overflow-hidden"
              >
                <div className="p-4">
                  <h2 className="text-lg font-semibold">
                    {user.first_name} {user.last_name}
                  </h2>
                  <p>Domain: {user.domain}</p>
                  <p>Gender: {user.gender}</p>
                  <p>
                    Availability:{" "}
                    {user.available ? "Available" : "Not Available"}
                  </p>
                </div>
                <div className="px-4 py-2 bg-gray-100">
                  <button
                    onClick={() => handleRemoveFromTeam(user.id)}
                    className="w-full py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
                  >
                    Remove from Team
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
``
