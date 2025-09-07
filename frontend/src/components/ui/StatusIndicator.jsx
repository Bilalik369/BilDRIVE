import React from "react"
import { CheckCircle, Clock, AlertCircle, XCircle, MapPin, Car, Navigation } from "lucide-react"

const StatusIndicator = ({ 
  status, 
  size = "md", 
  showIcon = true, 
  showText = true,
  className = "" 
}) => {
  const getStatusConfig = (status) => {
    const configs = {
      // Ride statuses
      requested: {
        color: "bg-blue-100 text-blue-800",
        icon: Clock,
        text: "Demandée"
      },
      searching: {
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
        text: "Recherche"
      },
      accepted: {
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
        text: "Acceptée"
      },
      arrived: {
        color: "bg-purple-100 text-purple-800",
        icon: MapPin,
        text: "Arrivé"
      },
      inProgress: {
        color: "bg-indigo-100 text-indigo-800",
        icon: Navigation,
        text: "En cours"
      },
      completed: {
        color: "bg-gray-100 text-gray-800",
        icon: CheckCircle,
        text: "Terminée"
      },
      cancelled: {
        color: "bg-red-100 text-red-800",
        icon: XCircle,
        text: "Annulée"
      },
      scheduled: {
        color: "bg-orange-100 text-orange-800",
        icon: Clock,
        text: "Programmée"
      },
      noDriver: {
        color: "bg-gray-100 text-gray-800",
        icon: AlertCircle,
        text: "Pas de chauffeur"
      },
      
      // Driver statuses
      online: {
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
        text: "En ligne"
      },
      offline: {
        color: "bg-gray-100 text-gray-800",
        icon: XCircle,
        text: "Hors ligne"
      },
      available: {
        color: "bg-green-100 text-green-800",
        icon: Car,
        text: "Disponible"
      },
      unavailable: {
        color: "bg-red-100 text-red-800",
        icon: XCircle,
        text: "Indisponible"
      },
      
      // Payment statuses
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
        text: "En attente"
      },
      completed: {
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
        text: "Terminé"
      },
      failed: {
        color: "bg-red-100 text-red-800",
        icon: XCircle,
        text: "Échoué"
      },
      
      // Default
      default: {
        color: "bg-gray-100 text-gray-800",
        icon: AlertCircle,
        text: status || "Inconnu"
      }
    }
    
    return configs[status] || configs.default
  }

  const config = getStatusConfig(status)
  const Icon = config.icon
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base"
  }

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${config.color} ${sizeClasses[size]} ${className}`}>
      {showIcon && <Icon className="w-3 h-3" />}
      {showText && config.text}
    </span>
  )
}

export default StatusIndicator
