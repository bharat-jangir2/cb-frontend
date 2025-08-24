import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-hot-toast";
import {
  FaSave,
  FaTimes,
  FaCalendar,
  FaMapMarkerAlt,
  FaUsers,
  FaTrophy,
  FaInfoCircle,
  FaPlus,
  FaEdit,
} from "react-icons/fa";
import { useCreateMatch, useUpdateMatch } from "../../hooks";
import { adminApi } from "../../services/admin";

const schema = yup
  .object({
    team1Id: yup.string().required("Team 1 is required"),
    team2Id: yup.string().required("Team 2 is required"),
    tournamentId: yup.string().optional(),
    seriesId: yup.string().optional(),
    venue: yup.string().required("Venue is required"),
    startTime: yup.string().required("Start time is required"),
    format: yup
      .string()
      .oneOf(["T20", "ODI", "Test"])
      .required("Format is required"),
    status: yup
      .string()
      .oneOf(["scheduled", "in_progress", "completed", "cancelled", "paused", "abandoned"])
      .required("Status is required"),
    description: yup.string().optional(),
  })
  .test("teams-different", "Teams must be different", function (value) {
    return value.team1Id !== value.team2Id;
  });

interface CreateMatchFormData {
  team1Id: string;
  team2Id: string;
  tournamentId?: string;
  seriesId?: string;
  venue: string;
  startTime: string;
  format: "T20" | "ODI" | "Test";
  status: "scheduled" | "in_progress" | "completed" | "cancelled" | "paused" | "abandoned";
  description?: string;
}

const CreateMatch: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!id;

  // Add mutation hooks
  const createMatchMutation = useCreateMatch();
  const updateMatchMutation = useUpdateMatch();

  // Fetch existing match data if in edit mode
  const { data: existingMatch, isLoading: matchLoading } = useQuery({
    queryKey: ["match", id],
    queryFn: () => adminApi.getMatch(id!),
    enabled: isEditMode && !!id,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<CreateMatchFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      format: "T20",
      status: "scheduled",
      startTime: new Date().toISOString().slice(0, 16),
    },
    mode: "onChange",
  });

  // Fetch teams using adminApi (keeping this for now since we haven't migrated teams yet)
  const {
    data: teamsData,
    isLoading: teamsLoading,
    error: teamsError,
  } = useQuery({
    queryKey: ["teams"],
    queryFn: () => adminApi.getTeams({ limit: 100 }),
  });

  console.log("🚀 ~ teamsData:", teamsData);
  console.log("🚀 ~ teamsData structure:", {
    hasData: !!teamsData,
    hasDataData: !!teamsData?.data,
    hasDataDataData: !!teamsData?.data?.data,
    dataLength: teamsData?.data?.data?.length || 0,
    fullStructure: JSON.stringify(teamsData, null, 2),
  });

  // Populate form with existing match data when in edit mode
  useEffect(() => {
    if (isEditMode && existingMatch) {
      // Handle both wrapped and direct API responses
      const match = (existingMatch as any)?.data || existingMatch as any;
      console.log("🎯 Edit mode - existingMatch data:", existingMatch);
      console.log("🎯 Edit mode - match object:", match);
      console.log("🎯 Edit mode - match structure:", {
        teamAId: match.teamAId,
        teamBId: match.teamBId,
        venue: match.venue,
        startTime: match.startTime,
        matchType: match.matchType,
        status: match.status,
        name: match.name,
      });
      
      const formData = {
        team1Id: match.teamAId?._id || "",
        team2Id: match.teamBId?._id || "",
        tournamentId: match.tournamentId || "",
        seriesId: match.seriesId || "",
        venue: match.venue || "",
        startTime: match.startTime ? new Date(match.startTime).toISOString().slice(0, 16) : "",
        format: match.matchType || "T20",
        status: (match.status === "live" ? "in_progress" : match.status) as "scheduled" | "in_progress" | "completed" | "cancelled" | "paused" | "abandoned" || "scheduled",
        description: match.name || "",
      };
      
      console.log("🎯 Edit mode - form data to reset:", formData);
      
      // Use setTimeout to ensure the form is ready before resetting
      setTimeout(() => {
        reset(formData);
        console.log("🎯 Edit mode - form reset completed");
      }, 100);
    }
  }, [isEditMode, existingMatch, reset]);

  // Fetch tournaments using direct API endpoint
  const {
    data: tournamentsData,
    isLoading: tournamentsLoading,
    error: tournamentsError,
  } = useQuery({
    queryKey: ["tournaments"],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/tournaments?limit=100`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch tournaments: ${response.statusText}`);
      }
      return response.json();
    },
  });

  // Fetch series using direct API endpoint
  const {
    data: seriesData,
    isLoading: seriesLoading,
    error: seriesError,
  } = useQuery({
    queryKey: ["series"],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/series?limit=100`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch series: ${response.statusText}`);
      }
      return response.json();
    },
  });

  console.log("🏆 ~ tournamentsData:", tournamentsData);
  console.log("🏆 ~ tournamentsData structure:", {
    hasData: !!tournamentsData,
    hasDataData: !!tournamentsData?.data,
    hasDataTournaments: !!tournamentsData?.tournaments,
    tournamentsLength: tournamentsData?.tournaments?.length || 0,
    total: tournamentsData?.total || 0,
    fullStructure: JSON.stringify(tournamentsData, null, 2),
  });
  console.log("📊 ~ seriesData:", seriesData);
  console.log("📊 ~ seriesData structure:", {
    hasData: !!seriesData,
    hasDataData: !!seriesData?.data,
    hasDataSeries: !!seriesData?.series,
    seriesLength: seriesData?.series?.length || 0,
    total: seriesData?.total || 0,
    fullStructure: JSON.stringify(seriesData, null, 2),
  });

  const onSubmit = async (data: CreateMatchFormData) => {
    console.log("🚀 onSubmit called with data:", data);
    console.log("🚀 Form errors:", errors);
    console.log("🚀 Form is valid:", Object.keys(errors).length === 0);

    // Check if form has validation errors
    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the form errors before submitting");
      return;
    }

    // Check if required fields are filled
    if (
      !data.team1Id ||
      !data.team2Id ||
      !data.venue ||
      !data.startTime ||
      !data.format ||
      !data.status
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Check if teams are different
    if (data.team1Id === data.team2Id) {
      toast.error("Teams must be different");
      return;
    }

    // Transform data to match backend API expectations
    const apiData = {
      name:
        data.description || `Match between ${data.team1Id} and ${data.team2Id}`,
      teamAId: data.team1Id,
      teamBId: data.team2Id,
      venue: data.venue,
      startTime: data.startTime,
      matchType: data.format,
      overs: data.format === "T20" ? 20 : data.format === "ODI" ? 50 : 90,
    };

    setIsSubmitting(true);
    try {
      if (isEditMode && id) {
        // Update existing match (without status)
        console.log("🚀 Updating match with data:", apiData);
        await updateMatchMutation.mutateAsync({ matchId: id, data: apiData });
        
        // Update status separately if it has changed
        if (data.status && data.status !== "scheduled") {
          console.log("🚀 Updating match status to:", data.status);
          // Import the matches service to update status
          const { matchesAPI } = await import("../../services/api/matches.service");
          await matchesAPI.updateMatchStatus(id, {
            status: data.status as any,
          });
        }
        
        toast.success("Match updated successfully");
      } else {
        // Create new match
        console.log("🚀 Creating match with data:", apiData);
        await createMatchMutation.mutateAsync(apiData as any);
        toast.success("Match created successfully");
      }
      
      // Navigate back to matches list
      navigate("/admin/matches");
    } catch (error) {
      console.error("❌ Error in onSubmit:", error);
      toast.error("Failed to save match");
    } finally {
      setIsSubmitting(false);
    }
  };

  const watchedTeam1 = watch("team1Id");
  const watchedTeam2 = watch("team2Id");
  const watchedTournament = watch("tournamentId");
  const watchedSeries = watch("seriesId");
  const watchedFormat = watch("format");
  const watchedStatus = watch("status");

  // Debug: Log current form values
  console.log("🎯 Current form values:", {
    team1Id: watchedTeam1,
    team2Id: watchedTeam2,
    tournamentId: watchedTournament,
    seriesId: watchedSeries,
    format: watchedFormat,
    status: watchedStatus,
  });

  // Ensure format field is set
  useEffect(() => {
    const currentFormat = watch("format");
    if (!currentFormat) {
      setValue("format", "T20");
      console.log("🚀 Setting default format to T20");
    }
  }, [watch, setValue]);

  // Debug: Monitor form reset
  useEffect(() => {
    if (isEditMode) {
      console.log("🎯 Edit mode detected, waiting for data...");
    }
  }, [isEditMode]);

  // Debug: Monitor form values after reset
  useEffect(() => {
    if (isEditMode && existingMatch) {
      console.log("🎯 Form values after reset attempt:", {
        team1Id: watch("team1Id"),
        team2Id: watch("team2Id"),
        venue: watch("venue"),
        startTime: watch("startTime"),
        format: watch("format"),
        status: watch("status"),
        description: watch("description"),
      });
    }
  }, [isEditMode, existingMatch, watch]);

  // Manual form population as fallback
  useEffect(() => {
    if (isEditMode && existingMatch) {
      // Handle both wrapped and direct API responses
      const match = (existingMatch as any)?.data || existingMatch as any;
      
      // Set form values manually if they're not set
      setTimeout(() => {
        if (!watch("team1Id") && match.teamAId?._id) {
          setValue("team1Id", match.teamAId._id);
          console.log("🎯 Manually set team1Id:", match.teamAId._id);
        }
        if (!watch("team2Id") && match.teamBId?._id) {
          setValue("team2Id", match.teamBId._id);
          console.log("🎯 Manually set team2Id:", match.teamBId._id);
        }
        if (!watch("venue") && match.venue) {
          setValue("venue", match.venue);
          console.log("🎯 Manually set venue:", match.venue);
        }
        if (!watch("startTime") && match.startTime) {
          const formattedTime = new Date(match.startTime).toISOString().slice(0, 16);
          setValue("startTime", formattedTime);
          console.log("🎯 Manually set startTime:", formattedTime);
        }
        if (!watch("format") && match.matchType) {
          setValue("format", match.matchType);
          console.log("🎯 Manually set format:", match.matchType);
        }
        if (!watch("status") && match.status) {
          const mappedStatus = match.status === "live" ? "in_progress" : match.status;
          setValue("status", mappedStatus as any);
          console.log("🎯 Manually set status:", mappedStatus);
        }
        if (!watch("description") && match.name) {
          setValue("description", match.name);
          console.log("🎯 Manually set description:", match.name);
        }
      }, 200);
    }
  }, [isEditMode, existingMatch, setValue, watch]);

  // Show loading state while fetching existing match data
  if (isEditMode && matchLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading match data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? "Edit Match" : "Create New Match"}
          </h1>
          <p className="text-gray-600">
            {isEditMode 
              ? "Update match details and settings" 
              : "Schedule a new cricket match"
            }
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/matches")}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900"
        >
          <FaTimes className="mr-2" />
          Cancel
        </button>
      </div>

             <div className="max-w-4xl mx-auto">
         <form
           key={isEditMode ? `edit-${id}` : "create"}
           onSubmit={handleSubmit(onSubmit)}
           className="space-y-6"
         >
          {/* Teams Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FaUsers className="mr-2 text-blue-500" />
              Match Teams
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Team 1 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team 1 *
                </label>
                <Controller
                  name="team1Id"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.team1Id ? "border-red-500" : "border-gray-300"
                      }`}
                      disabled={teamsLoading}
                    >
                      <option value="">
                        {teamsLoading ? "Loading teams..." : "Select Team 1"}
                      </option>
                      {teamsError ? (
                        <option value="" disabled>
                          Error loading teams
                        </option>
                      ) : (teamsData?.data || []).length > 0 ? (
                        (teamsData?.data || []).map((team: any) => (
                          <option
                            key={team._id || team.id}
                            value={team._id || team.id}
                          >
                            {team.name} ({team.shortName})
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>
                          No teams available
                        </option>
                      )}
                    </select>
                  )}
                />
                {errors.team1Id && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.team1Id.message}
                  </p>
                )}
                {teamsError && (
                  <p className="mt-1 text-sm text-red-600">
                    Failed to load teams. Please refresh the page.
                  </p>
                )}
              </div>

              {/* Team 2 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team 2 *
                </label>
                <Controller
                  name="team2Id"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.team2Id ? "border-red-500" : "border-gray-300"
                      }`}
                      disabled={teamsLoading}
                    >
                      <option value="">
                        {teamsLoading ? "Loading teams..." : "Select Team 2"}
                      </option>
                      {teamsError ? (
                        <option value="" disabled>
                          Error loading teams
                        </option>
                      ) : (teamsData?.data || []).length > 0 ? (
                        (teamsData?.data || []).map((team: any) => (
                          <option
                            key={team._id || team.id}
                            value={team._id || team.id}
                          >
                            {team.name} ({team.shortName})
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>
                          No teams available
                        </option>
                      )}
                    </select>
                  )}
                />
                {errors.team2Id && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.team2Id.message}
                  </p>
                )}
                {teamsError && (
                  <p className="mt-1 text-sm text-red-600">
                    Failed to load teams. Please refresh the page.
                  </p>
                )}
              </div>
            </div>

            {/* Teams Preview */}
            {watchedTeam1 && watchedTeam2 && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="text-center">
                  <div className="text-lg font-semibold text-blue-900">
                    {(teamsData?.data || []).find(
                      (t: any) => (t._id || t.id) === watchedTeam1
                    )?.name || "Team 1"}{" "}
                    vs{" "}
                    {(teamsData?.data || []).find(
                      (t: any) => (t._id || t.id) === watchedTeam2
                    )?.name || "Team 2"}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Match Details Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FaInfoCircle className="mr-2 text-green-500" />
              Match Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Format */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Format *
                </label>
                <Controller
                  name="format"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.format ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="T20">T20</option>
                      <option value="ODI">ODI</option>
                      <option value="Test">Test</option>
                    </select>
                  )}
                />
                {errors.format && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.format.message}
                  </p>
                )}
              </div>

              {/* Start Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time *
                </label>
                <Controller
                  name="startTime"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="datetime-local"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.startTime ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                  )}
                />
                {errors.startTime && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.startTime.message}
                  </p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Match Status *
                </label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.status ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="paused">Paused</option>
                      <option value="abandoned">Abandoned</option>
                    </select>
                  )}
                />
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.status.message}
                  </p>
                )}
              </div>
            </div>

            {/* Venue */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Venue *
              </label>
              <Controller
                name="venue"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Enter venue name"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.venue ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                )}
              />
              {errors.venue && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.venue.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    rows={3}
                    placeholder="Enter match description (optional)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )}
              />
            </div>
          </div>

          {/* Tournament & Series Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FaTrophy className="mr-2 text-yellow-500" />
              Tournament & Series (Optional)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tournament */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tournament
                </label>
                <Controller
                  name="tournamentId"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={tournamentsLoading}
                    >
                      <option value="">
                        {tournamentsLoading
                          ? "Loading tournaments..."
                          : "Select Tournament (Optional)"}
                      </option>
                      {tournamentsError ? (
                        <option value="" disabled>
                          Error loading tournaments
                        </option>
                      ) : (tournamentsData?.tournaments || []).length > 0 ? (
                        (tournamentsData?.tournaments || []).map(
                          (tournament: any) => (
                            <option
                              key={tournament._id || tournament.id}
                              value={tournament._id || tournament.id}
                            >
                              {tournament.name} ({tournament.format})
                            </option>
                          )
                        )
                      ) : (
                        <option value="" disabled>
                          No tournaments available
                        </option>
                      )}
                    </select>
                  )}
                />
                {tournamentsError && (
                  <p className="mt-1 text-sm text-red-600">
                    Failed to load tournaments. Please refresh the page.
                  </p>
                )}
              </div>

              {/* Series */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Series
                </label>
                <Controller
                  name="seriesId"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={seriesLoading}
                    >
                      <option value="">
                        {seriesLoading
                          ? "Loading series..."
                          : "Select Series (Optional)"}
                      </option>
                      {seriesError ? (
                        <option value="" disabled>
                          Error loading series
                        </option>
                      ) : (seriesData?.series || []).length > 0 ? (
                        (seriesData?.series || []).map((series: any) => (
                          <option
                            key={series._id || series.id}
                            value={series._id || series.id}
                          >
                            {series.name} ({series.type})
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>
                          No series available
                        </option>
                      )}
                    </select>
                  )}
                />
                {seriesError && (
                  <p className="mt-1 text-sm text-red-600">
                    Failed to load series. Please refresh the page.
                  </p>
                )}
              </div>
            </div>

            {/* Tournament & Series Preview */}
            {(watchedTournament || watchedSeries) && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-green-800">
                  <p className="font-medium mb-2">
                    📋 Selected Tournament & Series:
                  </p>
                  <div className="space-y-2">
                    {watchedTournament && (
                      <div className="flex items-center">
                        <span className="font-medium">🏆 Tournament:</span>
                        <span className="ml-2">
                          {(tournamentsData?.tournaments || []).find(
                            (t: any) => (t._id || t.id) === watchedTournament
                          )?.name || "Unknown Tournament"}
                        </span>
                      </div>
                    )}
                    {watchedSeries && (
                      <div className="flex items-center">
                        <span className="font-medium">📊 Series:</span>
                        <span className="ml-2">
                          {(seriesData?.series || []).find(
                            (s: any) => (s._id || s.id) === watchedSeries
                          )?.name || "Unknown Series"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="mt-4 flex space-x-4">
              <button
                type="button"
                onClick={() => navigate("/admin/tournaments/create")}
                className="flex items-center px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FaPlus className="mr-2" />
                Create Tournament
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/series/create")}
                className="flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaPlus className="mr-2" />
                Create Series
              </button>
            </div>

            {/* Tournament & Series Info */}
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-2">
                  💡 Tournament & Series Information:
                </p>
                <ul className="space-y-1 text-xs">
                  <li>
                    • <strong>Tournament:</strong> A competition with multiple
                    teams (e.g., IPL, World Cup)
                  </li>
                  <li>
                    • <strong>Series:</strong> A bilateral or multilateral
                    series between teams (e.g., India vs Australia)
                  </li>
                  <li>
                    • Both fields are optional - matches can be standalone
                    fixtures
                  </li>
                  <li>
                    • Selecting a tournament/series helps organize matches and
                    generate statistics
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/admin/matches")}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  {isEditMode ? <FaEdit className="mr-2" /> : <FaSave className="mr-2" />}
                  {isEditMode ? "Update Match" : "Create Match"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMatch;
