"use client"

import { useState, useEffect } from "react"
import { Search, Calendar } from "lucide-react"
import Button from "../ui/Button"
import Input from "../ui/Input"
import Loading from "../ui/Loading"
import RideCard from "./RideCard"
import { useRide } from "../../hooks/useRide"
import { RIDE_STATUS } from "../../utils/constants"

const RideHistory = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const { rides, loading, pagination, getUserRides } = useRide()

  useEffect(() => {
    loadRides()
  }, [statusFilter, dateFilter])

  const loadRides = async (page = 1) => {
    const params = {
      page,
      limit: 10,
      ...(statusFilter && { status: statusFilter }),
      ...(dateFilter && { date: dateFilter }),
    }
    await getUserRides(params)
  }

  const filteredRides = rides.filter((ride) => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      ride.pickup.address.toLowerCase().includes(searchLower) ||
      ride.destination.address.toLowerCase().includes(searchLower) ||
      (ride.driver?.user?.firstName + " " + ride.driver?.user?.lastName).toLowerCase().includes(searchLower)
    )
  })

  const statusOptions = [
    { value: "", label: "All Rides" },
    { value: RIDE_STATUS.COMPLETED, label: "Completed" },
    { value: RIDE_STATUS.CANCELLED, label: "Cancelled" },
    { value: RIDE_STATUS.IN_PROGRESS, label: "In Progress" },
  ]

  if (loading && rides.length === 0) {
    return <Loading text="Loading your ride history..." />
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-dark mb-2">Ride History</h1>
        <p className="text-text-secondary">View and manage your past rides</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-border-color p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search rides..."
            icon={<Search className="w-5 h-5" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div>
            <select
              className="w-full px-4 py-3 bg-input-bg border border-border-color rounded-lg text-text-dark focus:outline-none focus:ring-2 focus:ring-primary"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <Input
            type="date"
            icon={<Calendar className="w-5 h-5" />}
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Rides list */}
      <div className="space-y-4">
        {filteredRides.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-bg-main rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-placeholder-text" />
            </div>
            <h3 className="text-xl font-semibold text-text-dark mb-2">No rides found</h3>
            <p className="text-text-secondary">
              {searchTerm || statusFilter || dateFilter
                ? "Try adjusting your search criteria"
                : "You haven't taken any rides yet"}
            </p>
          </div>
        ) : (
          filteredRides.map((ride) => (
            <RideCard
              key={ride._id}
              ride={ride}
              onViewDetails={(ride) => console.log("View details:", ride)}
              onRate={(ride) => console.log("Rate ride:", ride)}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page === 1}
            onClick={() => loadRides(pagination.page - 1)}
            className="bg-transparent"
          >
            Previous
          </Button>
          <span className="px-4 py-2 text-text-secondary">
            Page {pagination.page} of {pagination.pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page === pagination.pages}
            onClick={() => loadRides(pagination.page + 1)}
            className="bg-transparent"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}

export default RideHistory
