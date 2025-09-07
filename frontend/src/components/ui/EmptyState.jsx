import React from "react"
import { Plus, Search, Car, MapPin, Clock, Star } from "lucide-react"
import Button from "./Button"

const EmptyState = ({ 
  icon = "default",
  title = "Aucun élément trouvé",
  description = "Il n'y a rien à afficher pour le moment.",
  actionLabel = "Ajouter",
  onAction = null,
  actionIcon = Plus,
  className = ""
}) => {
  const getIcon = () => {
    const iconProps = "w-16 h-16 text-gray-300 mx-auto mb-4"
    
    switch (icon) {
      case "ride":
        return <Car className={iconProps} />
      case "map":
        return <MapPin className={iconProps} />
      case "time":
        return <Clock className={iconProps} />
      case "search":
        return <Search className={iconProps} />
      case "star":
        return <Star className={iconProps} />
      default:
        return <div className={`w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        </div>
    }
  }

  const ActionIcon = actionIcon

  return (
    <div className={`text-center py-12 ${className}`}>
      {getIcon()}
      
      <h3 className="text-lg font-semibold text-gray-600 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">
        {description}
      </p>
      
      {onAction && (
        <Button 
          onClick={onAction}
          icon={<ActionIcon className="w-4 h-4" />}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export default EmptyState
