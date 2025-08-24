import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { FaSave, FaTimes, FaBolt, FaClock, FaUsers } from 'react-icons/fa';
import { PowerPlayStatus, PowerPlayType, type PowerPlay, type PowerplayData } from '../../types/powerplay';

interface PowerplayConfigFormProps {
  powerplay?: PowerPlay;
  onSubmit: (data: PowerplayData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  currentInnings: number;
}

interface PowerplayFormData {
  type: PowerPlayType;
  startOver: number;
  endOver: number;
  maxFieldersOutside: number;
  description: string;
  isMandatory: boolean;
}

export const PowerplayConfigForm: React.FC<PowerplayConfigFormProps> = ({
  powerplay,
  onSubmit,
  onCancel,
  isLoading = false,
  currentInnings,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<PowerplayFormData>({
    defaultValues: {
      type: powerplay?.type || PowerPlayType.MANDATORY,
      startOver: powerplay?.startOver || 1,
      endOver: powerplay?.endOver || 6,
      maxFieldersOutside: powerplay?.maxFieldersOutside || 2,
      description: powerplay?.description || '',
      isMandatory: powerplay?.isMandatory ?? true,
    },
  });

  const watchedType = watch('type');
  const watchedStartOver = watch('startOver');
  const watchedEndOver = watch('endOver');

  const handleFormSubmit = async (data: PowerplayFormData) => {
    setIsSubmitting(true);
    try {
      const powerplayData: PowerplayData = {
        ...data,
        startOver: Number(data.startOver),
        endOver: Number(data.endOver),
        maxFieldersOutside: Number(data.maxFieldersOutside),
        status: PowerPlayStatus.PENDING,
        innings: currentInnings,
      };

      await onSubmit(powerplayData);
      toast.success(powerplay ? 'Powerplay updated successfully' : 'Powerplay created successfully');
      reset();
    } catch (error) {
      toast.error('Failed to save powerplay');
      console.error('Powerplay form error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeDescription = (type: PowerPlayType) => {
    switch (type) {
      case PowerPlayType.MANDATORY:
        return 'Standard powerplay with fielding restrictions';
      case PowerPlayType.BATTING:
        return 'Batting team chooses when to activate';
      case PowerPlayType.BOWLING:
        return 'Bowling team chooses when to activate';
      default:
        return '';
    }
  };

  const getTypeColor = (type: PowerPlayType) => {
    switch (type) {
      case PowerPlayType.MANDATORY:
        return 'bg-red-100 text-red-800 border-red-200';
      case PowerPlayType.BATTING:
        return 'bg-green-100 text-green-800 border-green-200';
      case PowerPlayType.BOWLING:
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const calculateOvers = () => {
    const start = watchedStartOver || 0;
    const end = watchedEndOver || 0;
    return Math.max(0, end - start);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FaBolt className="mr-2 text-green-600" />
          {powerplay ? 'Edit Powerplay' : 'Create New Powerplay'}
        </h3>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600"
        >
          <FaTimes className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Powerplay Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Powerplay Type
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {Object.values(PowerPlayType).map((type) => (
              <label
                key={type}
                className={`relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none ${
                  watchedType === type
                    ? getTypeColor(type)
                    : 'border-gray-300 bg-white hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  value={type}
                  {...register('type', { required: 'Powerplay type is required' })}
                  className="sr-only"
                />
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-sm">
                      <p className={`font-medium capitalize ${
                        watchedType === type ? 'text-current' : 'text-gray-900'
                      }`}>
                        {type}
                      </p>
                      <p className={`text-xs ${
                        watchedType === type ? 'text-current opacity-80' : 'text-gray-500'
                      }`}>
                        {getTypeDescription(type)}
                      </p>
                    </div>
                  </div>
                  {watchedType === type && (
                    <div className="shrink-0 text-current">
                      <FaBolt className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </label>
            ))}
          </div>
          {errors.type && (
            <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
          )}
        </div>

        {/* Over Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Over
            </label>
            <input
              type="number"
              min="1"
              max="50"
              {...register('startOver', {
                required: 'Start over is required',
                min: { value: 1, message: 'Start over must be at least 1' },
                max: { value: 50, message: 'Start over cannot exceed 50' },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {errors.startOver && (
              <p className="mt-1 text-sm text-red-600">{errors.startOver.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Over
            </label>
            <input
              type="number"
              min="1"
              max="50"
              {...register('endOver', {
                required: 'End over is required',
                min: { value: 1, message: 'End over must be at least 1' },
                max: { value: 50, message: 'End over cannot exceed 50' },
                validate: (value) => {
                  const startOver = watchedStartOver || 0;
                  return value > startOver || 'End over must be greater than start over';
                },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {errors.endOver && (
              <p className="mt-1 text-sm text-red-600">{errors.endOver.message}</p>
            )}
          </div>
        </div>

        {/* Over Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <FaClock className="text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Over Summary</span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-blue-600">Duration:</span>
              <span className="ml-1 font-medium text-blue-800">{calculateOvers()} overs</span>
            </div>
            <div>
              <span className="text-blue-600">Range:</span>
              <span className="ml-1 font-medium text-blue-800">
                {watchedStartOver || 0} - {watchedEndOver || 0}
              </span>
            </div>
            <div>
              <span className="text-blue-600">Current Over:</span>
              <span className="ml-1 font-medium text-blue-800">{currentInnings}</span>
            </div>
          </div>
        </div>

        {/* Fielding Restrictions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FaUsers className="inline mr-2 text-gray-500" />
            Maximum Fielders Outside Circle
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[2, 3, 4, 5].map((count) => (
              <label
                key={count}
                className={`relative flex cursor-pointer rounded-lg border p-3 shadow-sm focus:outline-none ${
                  watch('maxFieldersOutside') === count
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 bg-white hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  value={count}
                  {...register('maxFieldersOutside', {
                    required: 'Maximum fielders is required',
                  })}
                  className="sr-only"
                />
                <div className="flex w-full items-center justify-center">
                  <div className="text-sm">
                    <p className={`font-medium ${
                      watch('maxFieldersOutside') === count ? 'text-green-900' : 'text-gray-900'
                    }`}>
                      {count} Fielders
                    </p>
                  </div>
                </div>
              </label>
            ))}
          </div>
          {errors.maxFieldersOutside && (
            <p className="mt-1 text-sm text-red-600">{errors.maxFieldersOutside.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            rows={3}
            {...register('description')}
            placeholder="Add any notes or special instructions for this powerplay..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* Mandatory Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Mandatory Powerplay
            </label>
            <p className="text-xs text-gray-500">
              Must be activated during the specified over range
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              {...register('isMandatory')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
          </label>
        </div>

        {/* Validation Summary */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <FaTimes className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Please fix the following errors:
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <ul className="list-disc pl-5 space-y-1">
                    {Object.values(errors).map((error, index) => (
                      <li key={index}>{error?.message}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <FaSave className="mr-2" />
            {isSubmitting ? 'Saving...' : (powerplay ? 'Update Powerplay' : 'Create Powerplay')}
          </button>
        </div>
      </form>
    </div>
  );
};
