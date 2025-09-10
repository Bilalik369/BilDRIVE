"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Calendar, MapPin, Star, Download, RefreshCw } from "lucide-react"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import Loading from "../../components/ui/Loading"
import { useRide } from "../../hooks/useRide"
import { RIDE_STATUS } from "../../utils/constants"
import { formatCurrency, formatDate } from "../../utils/helpers"

const RideHistoryPage = () => {
  const navigate = useNavigate()
  const { rides, loading, getUserRides } = useRide()
  const [filteredRides, setFilteredRides] = useState([])
  const [filters, setFilters] = useState({
    status: "all",
    dateRange: "all",
    minPrice: "",
    maxPrice: "",
    search: "",
  })
  const [sortBy, setSortBy] = useState("date-desc")
  const [currentPage, setCurrentPage] = useState(1)
  const ridesPerPage = 10

  useEffect(() => {
    getUserRides({ limit: 100 })
  }, [])

  useEffect(() => {
    let filtered = [...rides]

    // Filtre par statut
    if (filters.status !== "all") {
      filtered = filtered.filter((ride) => ride.status === filters.status)
    }

    // Filtre par recherche
    if (filters.search) {
      filtered = filtered.filter(
        (ride) =>
          ride.pickup.address.toLowerCase().includes(filters.search.toLowerCase()) ||
          ride.destination.address.toLowerCase().includes(filters.search.toLowerCase()) ||
          (ride.driver &&
            `${ride.driver.firstName} ${ride.driver.lastName}`.toLowerCase().includes(filters.search.toLowerCase())),
      )
    }

    // Filtre par prix
    if (filters.minPrice) {
      filtered = filtered.filter((ride) => ride.price.total >= Number.parseFloat(filters.minPrice))
    }
    if (filters.maxPrice) {
      filtered = filtered.filter((ride) => ride.price.total <= Number.parseFloat(filters.maxPrice))
    }

    // Filtre par date
    if (filters.dateRange !== "all") {
      const now = new Date()
      const filterDate = new Date()

      switch (filters.dateRange) {
        case "today":
          filterDate.setHours(0, 0, 0, 0)
          break
        case "week":
          filterDate.setDate(now.getDate() - 7)
          break
        case "month":
          filterDate.setMonth(now.getMonth() - 1)
          break
        case "3months":
          filterDate.setMonth(now.getMonth() - 3)
          break
      }

      filtered = filtered.filter((ride) => new Date(ride.createdAt) >= filterDate)
    }

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.createdAt) - new Date(a.createdAt)
        case "date-asc":
          return new Date(a.createdAt) - new Date(b.createdAt)
        case "price-desc":
          return b.price.total - a.price.total
        case "price-asc":
          return a.price.total - b.price.total
        default:
          return 0
      }
    })

    setFilteredRides(filtered)
    setCurrentPage(1)
  }, [rides, filters, sortBy])

  const getStatusColor = (status) => {
    const colors = {
      [RIDE_STATUS.COMPLETED]: "bg-green-100 text-green-800",
      [RIDE_STATUS.CANCELLED]: "bg-red-100 text-red-800",
      [RIDE_STATUS.IN_PROGRESS]: "bg-blue-100 text-blue-800",
      [RIDE_STATUS.SCHEDULED]: "bg-purple-100 text-purple-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  const getStatusLabel = (status) => {
    const labels = {
      [RIDE_STATUS.COMPLETED]: "Terminée",
      [RIDE_STATUS.CANCELLED]: "Annulée",
      [RIDE_STATUS.IN_PROGRESS]: "En cours",
      [RIDE_STATUS.SCHEDULED]: "Programmée",
    }
    return labels[status] || status
  }

  // Pagination
  const totalPages = Math.ceil(filteredRides.length / ridesPerPage)
  const startIndex = (currentPage - 1) * ridesPerPage
  const endIndex = startIndex + ridesPerPage
  const currentRides = filteredRides.slice(startIndex, endIndex)

  // Statistiques
  const stats = {
    total: filteredRides.length,
    completed: filteredRides.filter((r) => r.status === RIDE_STATUS.COMPLETED).length,
    cancelled: filteredRides.filter((r) => r.status === RIDE_STATUS.CANCELLED).length,
    totalSpent: filteredRides
      .filter((r) => r.status === RIDE_STATUS.COMPLETED)
      .reduce((sum, r) => sum + r.price.total, 0),
    averageRating:
      filteredRides
        .filter((r) => r.rating?.passenger)
        .reduce((sum, r, _, arr) => sum + r.rating.passenger / arr.length, 0) || 0,
  }

  if (loading) return <Loading />

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white min-h-screen text-gray-900">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Historique des courses</h1>
          <p className="text-gray-600">Consultez toutes vos courses passées</p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <Button variant="outline" icon={<Download className="w-4 h-4 bg-transparent" />} className="bg-transparent">
            Exporter
          </Button>
          <Button variant="outline" icon={<RefreshCw className="w-4 h-4 bg-transparent" />} className="bg-transparent">
            Actualiser
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <Card className="p-6 text-center bg-white border border-gray-200 md:bg-orange-50 md:border-orange-200">
          <div className="text-3xl font-bold text-orange-600 mb-2">{stats.total}</div>
          <div className="text-gray-600">Total</div>
        </Card>
        <Card className="p-6 text-center bg-white border border-gray-200 md:bg-green-50 md:border-green-200">
          <div className="text-3xl font-bold text-green-600 mb-2">{stats.completed}</div>
          <div className="text-gray-600">Terminées</div>
        </Card>
        <Card className="p-6 text-center bg-white border border-gray-200 md:bg-red-50 md:border-red-200">
          <div className="text-3xl font-bold text-red-600 mb-2">{stats.cancelled}</div>
          <div className="text-gray-600">Annulées</div>
        </Card>
        <Card className="p-6 text-center bg-white border border-gray-200 md:bg-purple-50 md:border-purple-200">
          <div className="text-3xl font-bold text-purple-600 mb-2">{formatCurrency(stats.totalSpent)}</div>
          <div className="text-gray-600">Dépensé</div>
        </Card>
        <Card className="p-6 text-center bg-white border border-gray-200 md:bg-yellow-50 md:border-yellow-200">
          <div className="text-3xl font-bold text-yellow-600 mb-2">{stats.averageRating.toFixed(1)}</div>
          <div className="text-gray-600">Note moyenne</div>
        </Card>
      </div>

      {/* Filtres */}
      <Card className="p-6 mb-8 bg-white border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* Recherche */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Statut */}
          <div>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Tous les statuts</option>
              <option value={RIDE_STATUS.COMPLETED}>Terminées</option>
              <option value={RIDE_STATUS.CANCELLED}>Annulées</option>
              <option value={RIDE_STATUS.SCHEDULED}>Programmées</option>
            </select>
          </div>

          {/* Période */}
          <div>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Toutes les dates</option>
              <option value="today">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="3months">3 derniers mois</option>
            </select>
          </div>

          {/* Prix min */}
          <div>
            <input
              type="number"
              placeholder="Prix min"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Prix max */}
          <div>
            <input
              type="number"
              placeholder="Prix max"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Tri */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="text-sm text-gray-600">
            {filteredRides.length} course{filteredRides.length > 1 ? "s" : ""} trouvée
            {filteredRides.length > 1 ? "s" : ""}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Trier par:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="date-desc">Date (récent)</option>
              <option value="date-asc">Date (ancien)</option>
              <option value="price-desc">Prix (élevé)</option>
              <option value="price-asc">Prix (bas)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Liste des courses */}
      {currentRides.length === 0 ? (
        <Card className="p-12 text-center bg-white border border-gray-200">
          <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucune course trouvée</h3>
          <p className="text-gray-500 mb-6">Aucune course ne correspond à vos critères de recherche</p>
          <Button
            onClick={() =>
              setFilters({
                status: "all",
                dateRange: "all",
                minPrice: "",
                maxPrice: "",
                search: "",
              })
            }
          >
            Réinitialiser les filtres
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {currentRides.map((ride) => (
            <Card
              key={ride._id}
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white border border-gray-200"
              onClick={() => navigate(`/ride/details/${ride._id}`)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 flex-1">
                  {/* Itinéraire */}
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                      <MapPin className="w-4 h-4 text-green-500 mb-1" />
                      <div className="w-px h-8 bg-gray-300"></div>
                      <MapPin className="w-4 h-4 text-red-500 mt-1" />
                    </div>
                    <div>
                      <div className="font-medium text-sm mb-1">{ride.pickup.address}</div>
                      <div className="text-gray-600 text-sm">{ride.destination.address}</div>
                    </div>
                  </div>

                  {/* Informations de la course */}
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div>
                      <Calendar className="w-4 h-4 inline mr-1" />
                      {formatDate(ride.createdAt)}
                    </div>
                    {ride.driver && (
                      <div>
                        Chauffeur: {ride.driver.firstName} {ride.driver.lastName}
                      </div>
                    )}
                    {ride.rating?.passenger && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        {ride.rating.passenger}
                      </div>
                    )}
                  </div>
                </div>

                {/* Prix et statut */}
                <div className="text-right">
                  <div className="font-bold text-xl text-primary mb-2">{formatCurrency(ride.price.total)}</div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ride.status)}`}>
                    {getStatusLabel(ride.status)}
                  </span>
                </div>
              </div>

              {/* Actions rapides */}
              <div className="flex gap-2 mt-4 pt-4 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/ride/details/${ride._id}`)
                  }}
                >
                  Voir détails
                </Button>

                {ride.status === RIDE_STATUS.COMPLETED && !ride.rating?.passenger && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/ride/rating/${ride._id}`)
                    }}
                  >
                    Noter
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate("/ride/request", {
                      state: {
                        pickup: ride.pickup.address,
                        destination: ride.destination.address,
                      },
                    })
                  }}
                >
                  Refaire
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="bg-transparent"
          >
            Précédent
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
              className={currentPage !== page ? "bg-transparent" : ""}
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="bg-transparent"
          >
            Suivant
          </Button>
        </div>
      )}
    </div>
  )
}

export default RideHistoryPage
