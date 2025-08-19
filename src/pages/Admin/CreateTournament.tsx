import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-hot-toast";
import {
  FaSave,
  FaTimes,
  FaCalendar,
  FaTrophy,
  FaInfoCircle,
  FaDollarSign,
} from "react-icons/fa";
import { adminApi } from "../../services/admin";

const schema = yup
  .object({
    name: yup.string().required("Tournament name is required"),
    format: yup
      .string()
      .oneOf(["T20", "ODI", "Test"])
      .required("Format is required"),
    type: yup
      .string()
      .oneOf(["league", "knockout", "round-robin", "group-stage"])
      .required("Type is required"),
    status: yup
      .string()
      .oneOf(["upcoming", "active", "completed", "cancelled"])
      .required("Status is required"),
    startDate: yup.string().required("Start date is required"),
    endDate: yup.string().required("End date is required"),
    description: yup.string().optional(),
    prizePool: yup.number().positive("Prize pool must be positive").optional(),
  })
  .test(
    "end-date-after-start",
    "End date must be after start date",
    function (value) {
      if (!value.startDate || !value.endDate) return true;
      return new Date(value.endDate) > new Date(value.startDate);
    }
  );

interface CreateTournamentFormData {
  name: string;
  format: "T20" | "ODI" | "Test";
  type: "league" | "knockout" | "round-robin" | "group-stage";
  status: "upcoming" | "active" | "completed" | "cancelled";
  startDate: string;
  endDate: string;
  description?: string;
  prizePool?: number;
}

const CreateTournament: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreateTournamentFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      format: "T20",
      type: "league",
      status: "upcoming",
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
    },
  });

  // Create tournament mutation
  const createTournamentMutation = useMutation({
    mutationFn: (data: CreateTournamentFormData) =>
      adminApi.createTournament(data),
    onSuccess: (response) => {
      toast.success("Tournament created successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-tournaments"] });
      navigate(`/admin/tournaments/${response.data.id}`);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to create tournament"
      );
    },
  });

  const onSubmit = async (data: CreateTournamentFormData) => {
    setIsSubmitting(true);
    try {
      await createTournamentMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const watchedStartDate = watch("startDate");
  const watchedEndDate = watch("endDate");

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Create New Tournament
          </h1>
          <p className="text-gray-600">
            Set up a new cricket tournament or competition
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/tournaments")}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900"
        >
          <FaTimes className="mr-2" />
          Cancel
        </button>
      </div>

      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FaTrophy className="mr-2 text-yellow-500" />
              Tournament Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tournament Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tournament Name *
                </label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="Enter tournament name"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                  )}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Tournament Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tournament Type *
                </label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.type ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="league">League</option>
                      <option value="knockout">Knockout</option>
                      <option value="round-robin">Round Robin</option>
                      <option value="group-stage">Group Stage</option>
                    </select>
                  )}
                />
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.type.message}
                  </p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
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
                      <option value="upcoming">Upcoming</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
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
                    placeholder="Enter tournament description (optional)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )}
              />
            </div>
          </div>

          {/* Tournament Schedule */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FaCalendar className="mr-2 text-green-500" />
              Tournament Schedule
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="date"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.startDate ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                  )}
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.startDate.message}
                  </p>
                )}
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date *
                </label>
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="date"
                      min={watchedStartDate}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.endDate ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                  )}
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>

            {/* Duration Preview */}
            {watchedStartDate && watchedEndDate && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-800">
                  <p className="font-medium">📅 Tournament Duration:</p>
                  <p>
                    {new Date(watchedStartDate).toLocaleDateString()} to{" "}
                    {new Date(watchedEndDate).toLocaleDateString()}
                  </p>
                  <p className="text-xs mt-1">
                    Duration:{" "}
                    {Math.ceil(
                      (new Date(watchedEndDate).getTime() -
                        new Date(watchedStartDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    days
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Prize Pool */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FaDollarSign className="mr-2 text-green-500" />
              Prize Pool (Optional)
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prize Pool Amount
              </label>
              <Controller
                name="prizePool"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    min="0"
                    step="1000"
                    placeholder="Enter prize pool amount (optional)"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.prizePool ? "border-red-500" : "border-gray-300"
                    }`}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                  />
                )}
              />
              {errors.prizePool && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.prizePool.message}
                </p>
              )}
            </div>
          </div>

          {/* Tournament Info */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-2">💡 Tournament Information:</p>
              <ul className="space-y-1 text-xs">
                <li>
                  • <strong>Tournament Name:</strong> Should be descriptive and
                  unique
                </li>
                <li>
                  • <strong>Format:</strong> Determines the type of matches
                  (T20, ODI, Test)
                </li>
                <li>
                  • <strong>Tournament Type:</strong> League, Knockout, Round
                  Robin, or Group Stage
                </li>
                <li>
                  • <strong>Status:</strong> Current state of the tournament
                </li>
                <li>
                  • <strong>Duration:</strong> Should be realistic for the
                  number of teams and matches
                </li>
                <li>
                  • <strong>Prize Pool:</strong> Optional but helps attract
                  teams and players
                </li>
                <li>
                  • After creation, you can add teams and schedule matches
                </li>
              </ul>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/admin/tournaments")}
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
                  Creating...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Create Tournament
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTournament;
