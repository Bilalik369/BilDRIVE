"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { FiToggleLeft, FiToggleRight, FiClock, FiMapPin, FiSettings, FiBarChart2, FiAlertCircle } from "react-icons/fi"
import Card from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import Loading from "../../components/ui/Loading"
import { toast } from "react-hot-toast"
import {
  useGetAvailabilityStatusQuery,
  useUpdateAvailabilityMutation,
  useGetAvailabilityStatsQuery,
  useSetAvailabilityScheduleMutation,
} from "../../redux/api/driverApi"
import { setCredentials } from "../../redux/slices/authSlice"

const DriverAvailabilityPage = () => {
  const dispatch = useDispatch()
  
  const { user } = useSelector((state) => state.auth)
  const [isAvailable, setIsAvailable] = useState(user?.isAvailable || false)
  const [showSchedule, setShowSchedule] = useState(false)
  const [schedule, setSchedule] = useState({
    monday: { enabled: false, start: "09:00", end: "18:00" },
    tuesday: { enabled: false, start: "09:00", end: "18:00" },
    wednesday: { enabled: false, start: "09:00", end: "18:00" },
    thursday: { enabled: false, start: "09:00", end: "18:00" },
    friday: { enabled: false, start: "09:00", end: "18:00" },
    saturday: { enabled: false, start: "09:00", end: "18:00" },
    sunday: { enabled: false, start: "09:00", end: "18:00" },
  })

  const {
    data: availabilityStatus,
    isLoading: statusLoading,
    refetch: refetchStatus,
  } = useGetAvailabilityStatusQuery(user?.id)

  const { data: stats, isLoading: statsLoading } = useGetAvailabilityStatsQuery(user?.id)

  const [updateAvailability, { isLoading: updateLoading }] = useUpdateAvailabilityMutation()
  const [setAvailabilitySchedule, { isLoading: scheduleLoading }] = useSetAvailabilityScheduleMutation()

  useEffect(() => {
    if (availabilityStatus) {
      setIsAvailable(availabilityStatus.isAvailable)
      if (availabilityStatus.schedule) {
        setSchedule(availabilityStatus.schedule)
      }
    }
  }, [availabilityStatus])

  const handleToggleAvailability = async () => {
    try {
      const newStatus = !isAvailable
      const result = await updateAvailability({
        driverId: user?.id,
        isAvailable: newStatus,
      }).unwrap()

      setIsAvailable(newStatus)
      dispatch(setCredentials({ user: { ...user, isAvailable: newStatus } }))

      toast.success(newStatus ? "Vous êtes maintenant disponible" : "Vous êtes maintenant indisponible")

      refetchStatus()
    } catch (error) {
      toast.error(error.data?.message || "Erreur lors de la mise à jour")
    }
  }

  const handleSaveSchedule = async () => {
    try {
      await setAvailabilitySchedule({
        driverId: user?.id,
        schedule,
      }).unwrap()

      toast.success("Horaires sauvegardés avec succès")
      setShowSchedule(false)
    } catch (error) {
      toast.error(error.data?.message || "Erreur lors de la sauvegarde")
    }
  }

  const getDayLabel = (day) => {
    const labels = {
      monday: "Lundi",
      tuesday: "Mardi",
      wednesday: "Mercredi",
      thursday: "Jeudi",
      friday: "Vendredi",
      saturday: "Samedi",
      sunday: "Dimanche",
    }
    return labels[day] || day
  }

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  if (statusLoading || statsLoading) {
    return <Loading />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Disponibilité</h1>
          <p className="text-gray-600 mt-1">Gérez votre disponibilité et vos horaires de travail</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Availability Toggle */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Statut de disponibilité</h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Activez/désactivez votre disponibilité pour recevoir des demandes
                  </p>
                </div>

                <button
                  onClick={handleToggleAvailability}
                  disabled={updateLoading}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isAvailable ? "bg-green-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      isAvailable ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div
                className={`p-4 rounded-lg border-2 ${
                  isAvailable ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${isAvailable ? "bg-green-100" : "bg-gray-100"}`}>
                    {isAvailable ? (
                      <FiToggleRight className={`w-6 h-6 ${isAvailable ? "text-green-600" : "text-gray-400"}`} />
                    ) : (
                      <FiToggleLeft className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className={`font-semibold ${isAvailable ? "text-green-800" : "text-gray-700"}`}>
                      {isAvailable ? "Vous êtes disponible" : "Vous êtes indisponible"}
                    </p>
                    <p className={`text-sm ${isAvailable ? "text-green-600" : "text-gray-600"}`}>
                      {isAvailable
                        ? "Vous recevez des demandes de course"
                        : "Vous ne recevez pas de demandes de course"}
                    </p>
                  </div>
                </div>
              </div>

              {availabilityStatus?.lastToggle && (
                <div className="mt-4 text-sm text-gray-600">
                  Dernière modification: {new Date(availabilityStatus.lastToggle).toLocaleString()}
                </div>
              )}
            </Card>

            {/* Current Session */}
            {isAvailable && availabilityStatus?.currentSession && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Session actuelle</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="p-3 bg-blue-100 rounded-full w-12 h-12 mx-auto mb-2">
                      <FiClock className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-sm text-gray-600">Temps en ligne</p>
                    <p className="font-semibold text-lg">
                      {formatDuration(availabilityStatus.currentSession.duration)}
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="p-3 bg-green-100 rounded-full w-12 h-12 mx-auto mb-2">
                      <FiMapPin className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-600">Courses acceptées</p>
                    <p className="font-semibold text-lg">{availabilityStatus.currentSession.ridesAccepted}</p>
                  </div>

                  <div className="text-center">
                    <div className="p-3 bg-purple-100 rounded-full w-12 h-12 mx-auto mb-2">
                      <FiBarChart2 className="w-6 h-6 text-purple-600" />
                    </div>
                    <p className="text-sm text-gray-600">Gains session</p>
                    <p className="font-semibold text-lg">
                      {availabilityStatus.currentSession.earnings?.toFixed(2) || "0.00"}€
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Schedule Settings */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Horaires programmés</h3>
                  <p className="text-gray-600 text-sm mt-1">Définissez vos horaires de disponibilité automatique</p>
                </div>

                <Button onClick={() => setShowSchedule(!showSchedule)} variant="outline" size="sm">
                  <FiSettings className="w-4 h-4 mr-2" />
                  {showSchedule ? "Masquer" : "Configurer"}
                </Button>
              </div>

              {showSchedule ? (
                <div className="space-y-4">
                  {Object.entries(schedule).map(([day, config]) => (
                    <div key={day} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-20">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={config.enabled}
                            onChange={(e) =>
                              setSchedule({
                                ...schedule,
                                [day]: { ...config, enabled: e.target.checked },
                              })
                            }
                            className="text-blue-600"
                          />
                          <span className="text-sm font-medium">{getDayLabel(day)}</span>
                        </label>
                      </div>

                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="time"
                          value={config.start}
                          onChange={(e) =>
                            setSchedule({
                              ...schedule,
                              [day]: { ...config, start: e.target.value },
                            })
                          }
                          disabled={!config.enabled}
                          className="px-2 py-1 border border-gray-300 rounded text-sm disabled:bg-gray-100"
                        />
                        <span className="text-gray-500">à</span>
                        <input
                          type="time"
                          value={config.end}
                          onChange={(e) =>
                            setSchedule({
                              ...schedule,
                              [day]: { ...config, end: e.target.value },
                            })
                          }
                          disabled={!config.enabled}
                          className="px-2 py-1 border border-gray-300 rounded text-sm disabled:bg-gray-100"
                        />
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-end gap-3 pt-4">
                    <Button onClick={() => setShowSchedule(false)} variant="outline">
                      Annuler
                    </Button>
                    <Button onClick={handleSaveSchedule} loading={scheduleLoading}>
                      Sauvegarder les horaires
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {Object.entries(schedule)
                    .filter(([_, config]) => config.enabled)
                    .map(([day, config]) => (
                      <div key={day} className="flex justify-between items-center text-sm">
                        <span className="font-medium">{getDayLabel(day)}</span>
                        <span className="text-gray-600">
                          {config.start} - {config.end}
                        </span>
                      </div>
                    ))}

                  {Object.values(schedule).every((config) => !config.enabled) && (
                    <p className="text-gray-600 text-sm">Aucun horaire programmé</p>
                  )}
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            {/* Weekly Stats */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cette semaine</h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Temps en ligne</span>
                  <span className="font-semibold">{formatDuration(stats?.weeklyOnlineTime || 0)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Sessions</span>
                  <span className="font-semibold">{stats?.weeklySessions || 0}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Taux d'acceptation</span>
                  <span className="font-semibold">{stats?.weeklyAcceptanceRate?.toFixed(1) || "0.0"}%</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Courses terminées</span>
                  <span className="font-semibold">{stats?.weeklyCompletedRides || 0}</span>
                </div>
              </div>
            </Card>

            {/* Tips */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Conseils</h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-blue-100 rounded-full mt-1">
                    <FiClock className="w-3 h-3 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Heures de pointe</p>
                    <p className="text-xs text-gray-600">7h-9h et 17h-19h sont les créneaux les plus demandés</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 bg-green-100 rounded-full mt-1">
                    <FiMapPin className="w-3 h-3 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Zones actives</p>
                    <p className="text-xs text-gray-600">Centre-ville et zones d'affaires génèrent plus de demandes</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 bg-yellow-100 rounded-full mt-1">
                    <FiBarChart2 className="w-3 h-3 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Taux d'acceptation</p>
                    <p className="text-xs text-gray-600">Maintenez un taux &gt; 80% pour plus de demandes</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Notifications */}
            {!isAvailable && (
              <Card className="p-6 bg-yellow-50 border-yellow-200">
                <div className="flex items-start gap-3">
                  <FiAlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800">Vous êtes indisponible</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Activez votre disponibilité pour commencer à recevoir des demandes de course.
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DriverAvailabilityPage
