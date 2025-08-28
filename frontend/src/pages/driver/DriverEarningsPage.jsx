"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import {
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiCalendar,
  FiDownload,
  FiFilter,
  FiCreditCard,
  FiBarChart2,
  FiClock,
} from "react-icons/fi"
import Card from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import Loading from "../../components/ui/Loading"
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom"

const DriverEarningsPage = () => {
  
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [selectedPeriod, setSelectedPeriod] = useState("week")
  const [showFilters, setShowFilters] = useState(false)
  const [payoutLoading, setPayoutLoading] = useState(false)
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    status: "all",
  })

  const [stats, setStats] = useState({
    availableBalance: 245.80,
    totalEarnings: 1850.50,
    completedRides: 78,
    pendingEarnings: 65.20,
    pendingRides: 3,
    earningsChange: 15.2,
    averageEarning: 23.72,
    weeklyEarnings: [
      { day: "Lun", amount: 45.20 },
      { day: "Mar", amount: 67.80 },
      { day: "Mer", amount: 52.30 },
      { day: "Jeu", amount: 78.90 },
      { day: "Ven", amount: 89.40 },
      { day: "Sam", amount: 125.60 },
      { day: "Dim", amount: 98.70 },
    ],
    payoutHistory: [
      {
        id: "payout_001",
        amount: 450.00,
        status: "completed",
        requestedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        processedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: "payout_002",
        amount: 320.50,
        status: "pending",
        requestedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        processedAt: null,
      },
    ],
  })

  const [earnings, setEarnings] = useState([
    {
      id: "earning_001",
      rideId: "ride_123",
      amount: 18.50,
      commission: 3.70,
      status: "completed",
      pickupAddress: "Gare du Nord",
      destinationAddress: "Tour Eiffel",
      completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: "earning_002",
      rideId: "ride_124",
      amount: 65.00,
      commission: 13.00,
      status: "completed",
      pickupAddress: "République",
      destinationAddress: "Aéroport CDG",
      completedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    },
    {
      id: "earning_003",
      rideId: "ride_125",
      amount: 22.30,
      commission: 4.46,
      status: "pending",
      pickupAddress: "Châtelet",
      destinationAddress: "Bastille",
      completedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    },
  ])

  const handleRequestPayout = async () => {
    try {
      setPayoutLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success("Demande de retrait envoyée avec succès")
      setStats(prev => ({ ...prev, availableBalance: 0 }))
    } catch (error) {
      toast.error("Erreur lors de la demande")
    } finally {
      setPayoutLoading(false)
    }
  }

  const periods = [
    { value: "today", label: "Aujourd'hui" },
    { value: "week", label: "Cette semaine" },
    { value: "month", label: "Ce mois" },
    { value: "year", label: "Cette année" },
  ]

  const getStatusColor = (status) => {
    const colors = {
      completed: "text-green-600 bg-green-100",
      pending: "text-yellow-600 bg-yellow-100",
      cancelled: "text-red-600 bg-red-100",
    }
    return colors[status] || colors.pending
  }

  const getStatusLabel = (status) => {
    const labels = {
      completed: "Terminée",
      pending: "En attente",
      cancelled: "Annulée",
    }
    return labels[status] || status
  }

  const formatCurrency = (amount) => {
    return `${amount.toFixed(2)}€`
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mes gains</h1>
              <p className="text-gray-600 mt-1">Suivez vos revenus et gérez vos retraits</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex bg-white rounded-lg border">
                {periods.map((period) => (
                  <button
                    key={period.value}
                    onClick={() => setSelectedPeriod(period.value)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      selectedPeriod === period.value ? "bg-blue-600 text-white" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>

              <Button onClick={() => setShowFilters(!showFilters)} variant="outline" size="sm">
                <FiFilter className="w-4 h-4 mr-2" />
                Filtres
              </Button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <Card className="mt-4 p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date de début</label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date de fin</label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Tous</option>
                    <option value="completed">Terminées</option>
                    <option value="pending">En attente</option>
                    <option value="cancelled">Annulées</option>
                  </select>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Solde disponible</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.availableBalance)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FiDollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <Button
                onClick={handleRequestPayout}
                loading={payoutLoading}
                size="sm"
                disabled={stats.availableBalance < 10}
              >
                <FiCreditCard className="w-4 h-4 mr-2" />
                Retirer
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Gains totaux</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalEarnings)}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FiBarChart2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              {stats.earningsChange >= 0 ? (
                <FiTrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <FiTrendingDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={stats.earningsChange >= 0 ? "text-green-600" : "text-red-600"}>
                {stats.earningsChange >= 0 ? "+" : ""}
                {stats.earningsChange}% vs période précédente
              </span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Courses terminées</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedRides}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <FiCalendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-600">Gain moyen: {formatCurrency(stats.averageEarning)}</span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.pendingEarnings)}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <FiClock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-600">{stats.pendingRides} course(s)</span>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Earnings List */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Historique des gains</h2>
                <Button variant="outline" size="sm">
                  <FiDownload className="w-4 h-4 mr-2" />
                  Exporter
                </Button>
              </div>

              {earnings.length > 0 ? (
                <div className="space-y-4">
                  {earnings.map((earning) => (
                    <div
                      key={earning.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-medium text-gray-900">Course #{earning.rideId}</p>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(earning.status)}`}
                          >
                            {getStatusLabel(earning.status)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {earning.pickupAddress} → {earning.destinationAddress}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(earning.completedAt)}</p>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-green-600">{formatCurrency(earning.amount)}</p>
                        <p className="text-xs text-gray-500">Commission: {formatCurrency(earning.commission)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4">
                    <FiDollarSign className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 mb-4">Aucun gain pour cette période</p>
                </div>
              )}
            </Card>
          </div>

          {/* Summary & Actions */}
          <div className="space-y-6">
            {/* Weekly Chart */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Gains hebdomadaires</h3>

              <div className="space-y-3">
                {stats.weeklyEarnings.map((day, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{day.day}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${(day.amount / Math.max(...stats.weeklyEarnings.map((d) => d.amount))) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-12 text-right">{formatCurrency(day.amount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Payout History */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Historique des retraits</h3>

              {stats.payoutHistory.length > 0 ? (
                <div className="space-y-3">
                  {stats.payoutHistory.slice(0, 5).map((payout) => (
                    <div key={payout.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{formatCurrency(payout.amount)}</p>
                        <p className="text-xs text-gray-600">{formatDate(payout.requestedAt)}</p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          payout.status === "completed"
                            ? "text-green-600 bg-green-100"
                            : payout.status === "pending"
                              ? "text-yellow-600 bg-yellow-100"
                              : "text-red-600 bg-red-100"
                        }`}
                      >
                        {payout.status === "completed" && "Traité"}
                        {payout.status === "pending" && "En cours"}
                        {payout.status === "failed" && "Échoué"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-sm">Aucun retrait effectué</p>
              )}
            </Card>

            {/* Payment Info */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations de paiement</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Taux de commission</span>
                  <span className="font-medium">20%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Retrait minimum</span>
                  <span className="font-medium">10€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Délai de traitement</span>
                  <span className="font-medium">1-3 jours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Méthode de paiement</span>
                  <span className="font-medium">Virement bancaire</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                  onClick={() => navigate("/driver/profile")}
                >
                  Modifier les informations
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DriverEarningsPage
