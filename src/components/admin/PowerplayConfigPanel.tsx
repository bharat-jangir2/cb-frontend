import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import { PowerPlayStatus, PowerPlayType, type PowerPlay, type PowerplayData } from '../../types/powerplay';


interface PowerplayConfigPanelProps {
  matchId: string;
  currentInnings: number;
  powerplays: PowerPlay[];
  onCreatePowerplay: (data: PowerplayData) => void;
  onUpdatePowerplay: (index: number, data: Partial<PowerplayData>) => void;
  onDeletePowerplay: (index: number) => void;
  isLoading?: boolean;
  matchStatus?: string;
}

interface PowerplayFormData {
  type: PowerPlayType;
  startOver: number;
  endOver: number;
  maxFieldersOutside: number;
  description: string;
  isMandatory: boolean;
}

export const PowerplayConfigPanel: React.FC<PowerplayConfigPanelProps> = ({
  matchId,
  currentInnings,
  powerplays,
  onCreatePowerplay,
  onUpdatePowerplay,
  onDeletePowerplay,
  isLoading = false,
  matchStatus,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<PowerplayFormData>({
    defaultValues: {
      type: PowerPlayType.MANDATORY,
      startOver: 1,
      endOver: 6,
      maxFieldersOutside: 2,
      description: '',
      isMandatory: true,
    },
  });

  const watchedType = watch('type');

  const onSubmit = (data: PowerplayFormData) => {
    // Ensure currentInnings is a valid number
    const innings = currentInnings && currentInnings > 0 ? currentInnings : 1;
    
    const powerplayData: PowerplayData = {
      ...data,
      status: PowerPlayStatus.PENDING,
      innings: innings,
    };

    console.log('🔧 Creating powerplay with data:', powerplayData);
    console.log('🔧 Current innings:', currentInnings);
    console.log('🔧 Using innings value:', innings);

    if (editingIndex !== null) {
      onUpdatePowerplay(editingIndex, powerplayData);
      setEditingIndex(null);
    } else {
      onCreatePowerplay(powerplayData);
      setIsAdding(false);
    }
    reset();
  };

  const handleEdit = (index: number, powerplay: PowerPlay) => {
    setEditingIndex(index);
    reset({
      type: powerplay.type,
      startOver: powerplay.startOver,
      endOver: powerplay.endOver,
      maxFieldersOutside: powerplay.maxFieldersOutside,
      description: powerplay.description || '',
      isMandatory: powerplay.isMandatory,
    });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingIndex(null);
    reset();
  };

  const getPowerplayTypeColor = (type: PowerPlayType) => {
    switch (type) {
      case PowerPlayType.MANDATORY:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case PowerPlayType.BATTING:
        return 'bg-green-100 text-green-800 border-green-200';
      case PowerPlayType.BOWLING:
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: PowerPlayStatus) => {
    switch (status) {
      case PowerPlayStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case PowerPlayStatus.ACTIVE:
        return 'bg-green-100 text-green-800';
      case PowerPlayStatus.COMPLETED:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Match Status Warning */}
      {matchStatus && matchStatus !== 'in_progress' && (
        <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Match Not In Progress
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Powerplay management requires the match to be in progress. Current status: {matchStatus}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Powerplay Configuration</h3>
        {!isAdding && editingIndex === null && matchStatus === 'in_progress' && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            disabled={isLoading}
          >
            <FaPlus className="mr-2" />
            Add Powerplay
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingIndex !== null) && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-md font-medium mb-4">
            {editingIndex !== null ? 'Edit Powerplay' : 'Add New Powerplay'}
          </h4>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Powerplay Type
                </label>
                <select
                  {...register('type', { required: 'Powerplay type is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={PowerPlayType.MANDATORY}>Mandatory</option>
                  <option value={PowerPlayType.BATTING}>Batting</option>
                  <option value={PowerPlayType.BOWLING}>Bowling</option>
                </select>
                {errors.type && (
                  <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>
                )}
              </div>

              {/* Mandatory Flag */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register('isMandatory')}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">
                  Mandatory Powerplay
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Start Over */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Over
                </label>
                <input
                  type="number"
                  {...register('startOver', { 
                    required: 'Start over is required',
                    min: { value: 1, message: 'Start over must be at least 1' }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
                {errors.startOver && (
                  <p className="text-red-500 text-xs mt-1">{errors.startOver.message}</p>
                )}
              </div>

              {/* End Over */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Over
                </label>
                <input
                  type="number"
                  {...register('endOver', { 
                    required: 'End over is required',
                    min: { value: 1, message: 'End over must be at least 1' }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
                {errors.endOver && (
                  <p className="text-red-500 text-xs mt-1">{errors.endOver.message}</p>
                )}
              </div>

              {/* Max Fielders Outside */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Fielders Outside
                </label>
                <select
                  {...register('maxFieldersOutside', { required: 'Max fielders is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                </select>
                {errors.maxFieldersOutside && (
                  <p className="text-red-500 text-xs mt-1">{errors.maxFieldersOutside.message}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <input
                type="text"
                {...register('description')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., First powerplay, Batting powerplay"
              />
            </div>

            {/* Form Actions */}
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                disabled={isLoading}
              >
                <FaSave className="mr-2" />
                {editingIndex !== null ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
              >
                <FaTimes className="mr-2" />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Powerplays List */}
      <div className="space-y-3">
        <h4 className="text-md font-medium text-gray-900">Configured Powerplays</h4>
        
        {powerplays.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No powerplays configured yet.</p>
            <p className="text-sm">Click "Add Powerplay" to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {powerplays.map((powerplay, index) => (
              <div
                key={powerplay._id || index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPowerplayTypeColor(powerplay.type)}`}>
                      {powerplay.type}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(powerplay.status)}`}>
                      {powerplay.status}
                    </span>
                    {powerplay.isMandatory && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Mandatory
                      </span>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Overs {powerplay.startOver}-{powerplay.endOver}</span>
                    <span className="mx-2">•</span>
                    <span>Max {powerplay.maxFieldersOutside} fielders outside</span>
                    {powerplay.description && (
                      <>
                        <span className="mx-2">•</span>
                        <span>{powerplay.description}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(index, powerplay)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                    disabled={isLoading}
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => onDeletePowerplay(index)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded"
                    disabled={isLoading}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
