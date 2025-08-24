import React from "react";
import { FaWifi, FaTimes, FaSpinner, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

interface WebSocketStatusProps {
  isConnected: boolean;
  isConnecting?: boolean;
  lastUpdateTime?: Date;
  error?: string;
  matchId?: string;
}

const WebSocketStatus: React.FC<WebSocketStatusProps> = ({
  isConnected,
  isConnecting = false,
  lastUpdateTime,
  error,
  matchId,
}) => {
  const getStatusColor = () => {
    if (error) return "text-red-500";
    if (isConnected) return "text-green-500";
    if (isConnecting) return "text-yellow-500";
    return "text-red-500";
  };

  const getStatusIcon = () => {
    if (error) return <FaExclamationTriangle className="text-red-500" />;
    if (isConnected) return <FaCheckCircle className="text-green-500" />;
    if (isConnecting) return <FaSpinner className="animate-spin text-yellow-500" />;
    return <FaTimes className="text-red-500" />;
  };

  const getStatusText = () => {
    if (error) return "Error";
    if (isConnected) return "Connected";
    if (isConnecting) return "Connecting";
    return "Disconnected";
  };

  return (
    <div className="flex items-center space-x-2 bg-white rounded-lg shadow-sm border border-gray-200 p-2">
      <div className="flex items-center space-x-1">
        {getStatusIcon()}
        <span className={`text-xs font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>
      
      {matchId && (
        <div className="text-xs text-gray-500">
          Match: {matchId.slice(-8)}
        </div>
      )}
      
      {lastUpdateTime && (
        <div className="text-xs text-gray-500">
          Last: {lastUpdateTime.toLocaleTimeString()}
        </div>
      )}
      
      {error && (
        <div className="text-xs text-red-500 max-w-32 truncate" title={error}>
          {error}
        </div>
      )}
    </div>
  );
};

export default WebSocketStatus;
