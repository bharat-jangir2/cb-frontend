import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-hot-toast";
import {
  FaSave,
  FaTimes,
  FaCalendar,
  FaUsers,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaGlobe,
} from "react-icons/fa";
import { adminApi } from "../../services/admin";

const schema = yup
  .object({
    name: yup.string().required("Series name is required"),
    shortName: yup.string().optional(),
    description: yup.string().required("Description is required"),
    type: yup
      .string()
      .oneOf(["BILATERAL", "MULTILATERAL", "TRI_SERIES", "QUAD_SERIES"])
      .required("Type is required"),
    format: yup
      .string()
      .oneOf(["T20", "ODI", "TEST", "MIXED"])
      .required("Format is required"),
    status: yup
      .string()
      .oneOf(["UPCOMING", "LIVE", "COMPLETED", "CANCELLED"])
      .required("Status is required"),
    startDate: yup.string().required("Start date is required"),
    endDate: yup.string().required("End date is required"),
    venue: yup.string().optional(),
    country: yup.string().optional(),
    participatingTeams: yup.array().of(yup.string().required()).optional(),
    rules: yup.string().optional(),
    terms: yup.string().optional(),
  })
  .test(
    "end-date-after-start",
    "End date must be after start date",
    function (value) {
      if (!value.startDate || !value.endDate) return true;
      return new Date(value.endDate) > new Date(value.startDate);
    }
  );

interface CreateSeriesFormData {
  name: string;
  shortName?: string;
  description: string;
  type: "BILATERAL" | "MULTILATERAL" | "TRI_SERIES" | "QUAD_SERIES";
  format: "T20" | "ODI" | "TEST" | "MIXED";
  status: "UPCOMING" | "LIVE" | "COMPLETED" | "CANCELLED";
  startDate: string;
  endDate: string;
  venue?: string;
  country?: string;
  participatingTeams?: string[];
  rules?: string;
  terms?: string;
}

const CreateSeries: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreateSeriesFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      type: "BILATERAL",
      format: "T20",
      status: "UPCOMING",
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
    },
  });

  // Create series mutation
  const createSeriesMutation = useMutation({
    mutationFn: (data: CreateSeriesFormData) =>
      adminApi.createSeries(data as any),
    onSuccess: (response) => {
      toast.success("Series created successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-series"] });
      navigate(`/admin/series/${response.data.id}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create series");
    },
  });

  const onSubmit = async (data: CreateSeriesFormData) => {
    setIsSubmitting(true);
    try {
      await createSeriesMutation.mutateAsync(data);
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
            Create New Series
          </h1>
          <p className="text-gray-600">
            Set up a new cricket series between teams
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/series")}
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
              <FaUsers className="mr-2 text-blue-500" />
              Series Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Series Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Series Name *
                </label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="Enter series name"
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

              {/* Short Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Name
                </label>
                <Controller
                  name="shortName"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="Enter short name (optional)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {/* Series Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Series Type *
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
                      <option value="BILATERAL">Bilateral</option>
                      <option value="MULTILATERAL">Multilateral</option>
                      <option value="TRI_SERIES">Tri Series</option>
                      <option value="QUAD_SERIES">Quad Series</option>
                    </select>
                  )}
                />
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.type.message}
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
                      <option value="TEST">Test</option>
                      <option value="MIXED">Mixed</option>
                    </select>
                  )}
                />
                {errors.format && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.format.message}
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
                      <option value="UPCOMING">Upcoming</option>
                      <option value="LIVE">Live</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
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
                Description *
              </label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    rows={3}
                    placeholder="Enter series description"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.description ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                )}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FaMapMarkerAlt className="mr-2 text-green-500" />
              Location Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Venue */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Venue
                </label>
                <Controller
                  name="venue"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="Enter venue name (optional)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="Enter host country (optional)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Series Schedule */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FaCalendar className="mr-2 text-purple-500" />
              Series Schedule
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
              <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                <div className="text-sm text-purple-800">
                  <p className="font-medium">📅 Series Duration:</p>
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

          {/* Additional Information */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FaInfoCircle className="mr-2 text-orange-500" />
              Additional Information
            </h2>

            <div className="space-y-6">
              {/* Rules */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Series Rules
                </label>
                <Controller
                  name="rules"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      rows={3}
                      placeholder="Enter series rules (optional)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}
                />
              </div>

              {/* Terms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Terms & Conditions
                </label>
                <Controller
                  name="terms"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      rows={3}
                      placeholder="Enter terms and conditions (optional)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Series Info */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-2">💡 Series Information:</p>
              <ul className="space-y-1 text-xs">
                <li>
                  • <strong>Series Name:</strong> Should be descriptive (e.g.,
                  "India vs Australia 2024")
                </li>
                <li>
                  • <strong>Series Type:</strong> Bilateral (2 teams),
                  Multilateral (multiple teams), etc.
                </li>
                <li>
                  • <strong>Format:</strong> T20, ODI, Test, or Mixed format
                </li>
                <li>
                  • <strong>Status:</strong> Current state of the series
                </li>
                <li>
                  • <strong>Duration:</strong> Should be realistic for the
                  number of matches
                </li>
                <li>
                  • After creation, you can add participating teams and schedule
                  individual matches
                </li>
              </ul>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/admin/series")}
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
                  Create Series
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSeries;
