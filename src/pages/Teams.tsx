import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { teamsApi } from "../services/teams";
import { useAuthStore } from "../stores/authStore";
import {
  FaRocket,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSearch,
  FaFilter,
} from "react-icons/fa";
import type { Team } from "../types/teams";

const Teams = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  const { data: teams, isLoading } = useQuery({
    queryKey: ["teams"],
    queryFn: () => teamsApi.getTeams(),
  });

  const createTeamMutation = useMutation({
    mutationFn: (data: Partial<Team>) => teamsApi.createTeam(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      setShowCreateModal(false);
    },
  });

  const updateTeamMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Team> }) =>
      teamsApi.updateTeam(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      setEditingTeam(null);
    },
  });

  const deleteTeamMutation = useMutation({
    mutationFn: (id: string) => teamsApi.deleteTeam(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });

  const filteredTeams = teams?.filter((team) =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.country?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateTeam = (formData: FormData) => {
    const data = {
      name: formData.get("name") as string,
      shortName: formData.get("shortName") as string,
      country: formData.get("country") as string,
      captain: formData.get("captain") as string,
      coach: formData.get("coach") as string,
      homeVenue: formData.get("homeVenue") as string,
      founded: parseInt(formData.get("founded") as string) || undefined,
      description: formData.get("description") as string,
    };
    createTeamMutation.mutate(data);
  };

  const handleUpdateTeam = (formData: FormData) => {
    if (!editingTeam) return;
    
    const data = {
      name: formData.get("name") as string,
      shortName: formData.get("shortName") as string,
      country: formData.get("country") as string,
      captain: formData.get("captain") as string,
      coach: formData.get("coach") as string,
      homeVenue: formData.get("homeVenue") as string,
      founded: parseInt(formData.get("founded") as string) || undefined,
      description: formData.get("description") as string,
    };
    updateTeamMutation.mutate({ id: editingTeam.id, data });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teams</h1>
          <p className="text-gray-600">
            Manage cricket teams and their information
          </p>
        </div>
        {(user?.role === "admin" || user?.role === "scorer") && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <FaPlus className="h-4 w-4" />
            <span>Add Team</span>
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search teams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="card">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : filteredTeams && filteredTeams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map((team) => (
              <div key={team.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {team.logo ? (
                      <img
                        src={team.logo}
                        alt={team.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-cricket-green rounded-full flex items-center justify-center">
                        <FaRocket className="h-6 w-6 text-white" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">{team.name}</h3>
                      <p className="text-sm text-gray-500">{team.shortName}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <FaEye className="h-4 w-4" />
                    </button>
                    {(user?.role === "admin" || user?.role === "scorer") && (
                      <>
                        <button
                          onClick={() => setEditingTeam(team)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <FaEdit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteTeamMutation.mutate(team.id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={deleteTeamMutation.isPending}
                        >
                          <FaTrash className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  {team.country && (
                    <p className="text-gray-600">
                      <span className="font-medium">Country:</span> {team.country}
                    </p>
                  )}
                  {team.captain && (
                    <p className="text-gray-600">
                      <span className="font-medium">Captain:</span> {team.captain}
                    </p>
                  )}
                  {team.coach && (
                    <p className="text-gray-600">
                      <span className="font-medium">Coach:</span> {team.coach}
                    </p>
                  )}
                  {team.homeVenue && (
                    <p className="text-gray-600">
                      <span className="font-medium">Home Venue:</span> {team.homeVenue}
                    </p>
                  )}
                  {team.founded && (
                    <p className="text-gray-600">
                      <span className="font-medium">Founded:</span> {team.founded}
                    </p>
                  )}
                </div>

                {team.description && (
                  <p className="text-sm text-gray-500 mt-3 line-clamp-2">
                    {team.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FaRocket className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No teams found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? "Try adjusting your search." : "Get started by creating a team."}
            </p>
          </div>
        )}
      </div>

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Create New Team</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleCreateTeam(new FormData(e.currentTarget));
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Short Name</label>
                  <input
                    type="text"
                    name="shortName"
                    required
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Country</label>
                  <input
                    type="text"
                    name="country"
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Captain</label>
                  <input
                    type="text"
                    name="captain"
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Coach</label>
                  <input
                    type="text"
                    name="coach"
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Home Venue</label>
                  <input
                    type="text"
                    name="homeVenue"
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Founded Year</label>
                  <input
                    type="number"
                    name="founded"
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    rows={3}
                    className="input-field mt-1"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  className="btn-primary flex-1"
                  disabled={createTeamMutation.isPending}
                >
                  {createTeamMutation.isPending ? "Creating..." : "Create Team"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Team Modal */}
      {editingTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Team</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleUpdateTeam(new FormData(e.currentTarget));
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingTeam.name}
                    required
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Short Name</label>
                  <input
                    type="text"
                    name="shortName"
                    defaultValue={editingTeam.shortName}
                    required
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Country</label>
                  <input
                    type="text"
                    name="country"
                    defaultValue={editingTeam.country}
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Captain</label>
                  <input
                    type="text"
                    name="captain"
                    defaultValue={editingTeam.captain}
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Coach</label>
                  <input
                    type="text"
                    name="coach"
                    defaultValue={editingTeam.coach}
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Home Venue</label>
                  <input
                    type="text"
                    name="homeVenue"
                    defaultValue={editingTeam.homeVenue}
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Founded Year</label>
                  <input
                    type="number"
                    name="founded"
                    defaultValue={editingTeam.founded}
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    defaultValue={editingTeam.description}
                    rows={3}
                    className="input-field mt-1"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  className="btn-primary flex-1"
                  disabled={updateTeamMutation.isPending}
                >
                  {updateTeamMutation.isPending ? "Updating..." : "Update Team"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingTeam(null)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams; 