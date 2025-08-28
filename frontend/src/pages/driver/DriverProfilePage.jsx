"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import {
  FiUser,
  FiCamera,
  FiTruck,
  FiFileText,
  FiSave,
  FiUpload,
  FiEdit3,
  FiCheck,
  FiX,
  FiAlertCircle,
  FiPhone,
  FiMail,
  FiCalendar,
} from "react-icons/fi"
import Card from "../../components/ui/Card"
import Button from "../../components/ui/Button"
import Input from "../../components/ui/Input"
import { toast } from "react-hot-toast"

const DriverProfilePage = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [activeTab, setActiveTab] = useState("personal")
  const [isEditing, setIsEditing] = useState(false)
  const [showDocumentModal, setShowDocumentModal] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [vehicleLoading, setVehicleLoading] = useState(false)
  
  const [profilePicturePreview, setProfilePicturePreview] = useState(null)
  const [documentPreview, setDocumentPreview] = useState(null)

  const [profile, setProfile] = useState({
    firstName: "Jean",
    lastName: "Dupont",
    phone: "+33 6 12 34 56 78",
    email: "jean.dupont@email.com",
    address: "15 Rue de la Paix, 75001 Paris",
    emergencyContact: "Marie Dupont - +33 6 98 76 54 32",
    profilePicture: "/placeholder.svg?height=96&width=96&text=JD",
    rating: 4.8,
    totalRides: 156,
    status: "active",
    joinDate: new Date(2023, 0, 15),
    lastActive: new Date(),
    vehicle: {
      make: "Peugeot",
      model: "308",
      year: "2020",
      color: "Noir",
      licensePlate: "AB-123-CD",
      type: "comfort",
      seats: 4,
      fuelType: "essence",
    },
    documents: [
      {
        type: "driverLicense",
        status: "approved",
        uploadedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        expiryDate: new Date(2028, 5, 15),
        fileUrl: "/documents/driver-license.pdf",
      },
      {
        type: "vehicleRegistration",
        status: "approved",
        uploadedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        expiryDate: new Date(2025, 11, 20),
        fileUrl: "/documents/vehicle-registration.pdf",
      },
      {
        type: "insurance",
        status: "pending",
        uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        expiryDate: new Date(2024, 8, 30),
        fileUrl: "/documents/insurance.pdf",
      },
      {
        type: "criminalRecord",
        status: "approved",
        uploadedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        expiryDate: new Date(2025, 2, 10),
        fileUrl: "/documents/criminal-record.pdf",
      },
    ],
    bankInfo: {
      accountHolder: "Jean Dupont",
      iban: "FR76 1234 5678 9012 3456 789",
      bic: "BNPAFRPP",
    },
    preferences: {
      notifications: {
        email: true,
        sms: true,
        push: true,
      },
      workingHours: {
        start: "06:00",
        end: "22:00",
      },
      maxDistance: 50,
      acceptPets: true,
      acceptLuggage: true,
    },
  })

  const [formData, setFormData] = useState({
    firstName: profile.firstName,
    lastName: profile.lastName,
    phone: profile.phone,
    email: profile.email,
    address: profile.address,
    emergencyContact: profile.emergencyContact,
  })

  const [vehicleData, setVehicleData] = useState({
    make: profile.vehicle.make,
    model: profile.vehicle.model,
    year: profile.vehicle.year,
    color: profile.vehicle.color,
    licensePlate: profile.vehicle.licensePlate,
    type: profile.vehicle.type,
    seats: profile.vehicle.seats,
    fuelType: profile.vehicle.fuelType,
  })

  const [bankData, setBankData] = useState({
    accountHolder: profile.bankInfo.accountHolder,
    iban: profile.bankInfo.iban,
    bic: profile.bankInfo.bic,
  })

  const [preferencesData, setPreferencesData] = useState({
    notifications: { ...profile.preferences.notifications },
    workingHours: { ...profile.preferences.workingHours },
    maxDistance: profile.preferences.maxDistance,
    acceptPets: profile.preferences.acceptPets,
    acceptLuggage: profile.preferences.acceptLuggage,
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    // Simulate loading profile data
    const loadProfile = async () => {
      try {
        // API call would go here
        console.log("Profile loaded")
      } catch (error) {
        showToastMessage("Erreur lors du chargement du profil", "error")
      }
    }
    loadProfile()
  }, [])

  const showToastMessage = (message, type = "success") => {
    if (type === "error") {
      toast.error(message)
    } else if (type === "info") {
      toast(message)
    } else {
      toast.success(message)
    }
  }

  const validateForm = (data, type) => {
    const newErrors = {}

    if (type === "personal") {
      if (!data.firstName.trim()) newErrors.firstName = "Le prénom est requis"
      if (!data.lastName.trim()) newErrors.lastName = "Le nom est requis"
      if (!data.phone.trim()) newErrors.phone = "Le téléphone est requis"
      if (!data.email.trim()) newErrors.email = "L'email est requis"
      if (data.email && !/\S+@\S+\.\S+/.test(data.email)) {
        newErrors.email = "Format d'email invalide"
      }
    }

    if (type === "vehicle") {
      if (!data.make.trim()) newErrors.make = "La marque est requise"
      if (!data.model.trim()) newErrors.model = "Le modèle est requis"
      if (!data.year) newErrors.year = "L'année est requise"
      if (!data.licensePlate.trim()) newErrors.licensePlate = "La plaque est requise"
    }

    if (type === "bank") {
      if (!data.accountHolder.trim()) newErrors.accountHolder = "Le titulaire est requis"
      if (!data.iban.trim()) newErrors.iban = "L'IBAN est requis"
      if (!data.bic.trim()) newErrors.bic = "Le BIC est requis"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleUpdateProfile = async () => {
    if (!validateForm(formData, "personal")) return

    try {
      setUpdateLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setProfile((prev) => ({ ...prev, ...formData }))
      showToastMessage("Profil mis à jour avec succès", "success")
      setIsEditing(false)
    } catch (error) {
      showToastMessage("Erreur lors de la mise à jour", "error")
    } finally {
      setUpdateLoading(false)
    }
  }

  const handleUpdateVehicle = async () => {
    if (!validateForm(vehicleData, "vehicle")) return

    try {
      setVehicleLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setProfile((prev) => ({ ...prev, vehicle: vehicleData }))
      showToastMessage("Informations véhicule mises à jour", "success")
    } catch (error) {
      showToastMessage("Erreur lors de la mise à jour", "error")
    } finally {
      setVehicleLoading(false)
    }
  }

  const handleUpdateBankInfo = async () => {
    if (!validateForm(bankData, "bank")) return

    try {
      setUpdateLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setProfile((prev) => ({ ...prev, bankInfo: bankData }))
      showToastMessage("Informations bancaires mises à jour", "success")
    } catch (error) {
      showToastMessage("Erreur lors de la mise à jour", "error")
    } finally {
      setUpdateLoading(false)
    }
  }

  const handleUpdatePreferences = async () => {
    try {
      setUpdateLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setProfile((prev) => ({ ...prev, preferences: preferencesData }))
      showToastMessage("Préférences mises à jour", "success")
    } catch (error) {
      showToastMessage("Erreur lors de la mise à jour", "error")
    } finally {
      setUpdateLoading(false)
    }
  }

  const handleDocumentUpload = async (file, documentType) => {
    if (!file) return

    // Validate file
    const maxSize = 5 * 1024 * 1024 // 5MB
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"]

    if (file.size > maxSize) {
      showToastMessage("Le fichier est trop volumineux (max 5MB)", "error")
      return
    }

    if (!allowedTypes.includes(file.type)) {
      showToastMessage("Format de fichier non supporté", "error")
      return
    }

    try {
      setUploadLoading(true)

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => setDocumentPreview(e.target.result)
        reader.readAsDataURL(file)
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update document status
      setProfile((prev) => ({
        ...prev,
        documents: prev.documents.map((doc) =>
          doc.type === documentType
            ? {
                ...doc,
                status: "pending",
                uploadedAt: new Date(),
                fileUrl: URL.createObjectURL(file),
              }
            : doc,
        ),
      }))

      showToastMessage("Document téléchargé avec succès", "success")
      setShowDocumentModal(false)
      setDocumentPreview(null)
    } catch (error) {
      showToastMessage("Erreur lors du téléchargement", "error")
    } finally {
      setUploadLoading(false)
    }
  }

  const handleProfilePictureUpload = async (file) => {
    if (!file) return

    const maxSize = 2 * 1024 * 1024 // 2MB
    if (file.size > maxSize) {
      showToastMessage("L'image est trop volumineuse (max 2MB)", "error")
      return
    }

    if (!file.type.startsWith("image/")) {
      showToastMessage("Veuillez sélectionner une image", "error")
      return
    }

    try {
      setUpdateLoading(true)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfilePicturePreview(e.target.result)
        setProfile((prev) => ({ ...prev, profilePicture: e.target.result }))
      }
      reader.readAsDataURL(file)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      showToastMessage("Photo de profil mise à jour", "success")
    } catch (error) {
      showToastMessage("Erreur lors de la mise à jour", "error")
    } finally {
      setUpdateLoading(false)
    }
  }

  const getDocumentStatus = (document) => {
    if (!document) return { status: "missing", color: "text-red-600 bg-red-100", label: "Manquant", icon: FiX }

    switch (document.status) {
      case "approved":
        return { status: "approved", color: "text-green-600 bg-green-100", label: "Approuvé", icon: FiCheck }
      case "pending":
        return { status: "pending", color: "text-yellow-600 bg-yellow-100", label: "En attente", icon: FiAlertCircle }
      case "rejected":
        return { status: "rejected", color: "text-red-600 bg-red-100", label: "Rejeté", icon: FiX }
      default:
        return { status: "missing", color: "text-red-600 bg-red-100", label: "Manquant", icon: FiX }
    }
  }

  const isDocumentExpiringSoon = (document) => {
    if (!document?.expiryDate) return false
    const daysUntilExpiry = Math.ceil((document.expiryDate - new Date()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0
  }

  const isDocumentExpired = (document) => {
    if (!document?.expiryDate) return false
    return document.expiryDate < new Date()
  }

  const tabs = [
    { id: "personal", label: "Informations personnelles", icon: FiUser },
    { id: "vehicle", label: "Véhicule", icon: FiTruck },
    { id: "documents", label: "Documents", icon: FiFileText },
    { id: "bank", label: "Informations bancaires", icon: FiFileText },
    { id: "preferences", label: "Préférences", icon: FiUser },
  ]

  const vehicleTypes = [
    { value: "economy", label: "Économique" },
    { value: "comfort", label: "Confort" },
    { value: "premium", label: "Premium" },
    { value: "xl", label: "XL" },
  ]

  const fuelTypes = [
    { value: "essence", label: "Essence" },
    { value: "diesel", label: "Diesel" },
    { value: "hybrid", label: "Hybride" },
    { value: "electric", label: "Électrique" },
  ]

  const requiredDocuments = [
    { type: "driverLicense", label: "Permis de conduire", required: true, description: "Permis de conduire valide" },
    {
      type: "vehicleRegistration",
      label: "Carte grise",
      required: true,
      description: "Certificat d'immatriculation du véhicule",
    },
    {
      type: "insurance",
      label: "Assurance véhicule",
      required: true,
      description: "Attestation d'assurance en cours de validité",
    },
    {
      type: "criminalRecord",
      label: "Casier judiciaire",
      required: true,
      description: "Extrait de casier judiciaire (moins de 3 mois)",
    },
    {
      type: "medicalCertificate",
      label: "Certificat médical",
      required: false,
      description: "Certificat médical d'aptitude à la conduite",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mon profil</h1>
          <p className="text-gray-600 mt-1">Gérez vos informations personnelles et professionnelles</p>
        </div>

        {/* Profile Header */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                {profile.profilePicture ? (
                  <img
                    src={profile.profilePicture || "/placeholder.svg"}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <FiUser className="w-12 h-12 text-blue-600" />
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors cursor-pointer">
                <FiCamera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleProfilePictureUpload(e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-gray-900">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-gray-600 flex items-center justify-center sm:justify-start gap-1 mt-1">
                <FiMail className="w-4 h-4" />
                {profile.email}
              </p>
              <p className="text-gray-600 flex items-center justify-center sm:justify-start gap-1">
                <FiPhone className="w-4 h-4" />
                {profile.phone}
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-4 mt-3">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">⭐</span>
                  <span className="font-medium">{profile.rating.toFixed(1)}</span>
                </div>
                <div className="text-sm text-gray-600">{profile.totalRides} courses</div>
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    profile.status === "active" ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"
                  }`}
                >
                  {profile.status === "active" ? "Actif" : "Inactif"}
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2 flex items-center justify-center sm:justify-start gap-1">
                <FiCalendar className="w-4 h-4" />
                Membre depuis {profile.joinDate.toLocaleDateString()}
              </p>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "personal" && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Informations personnelles</h3>
              <Button onClick={() => setIsEditing(!isEditing)} variant="outline" size="sm">
                <FiEdit3 className="w-4 h-4 mr-2" />
                {isEditing ? "Annuler" : "Modifier"}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                <Input
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  disabled={!isEditing}
                  error={errors.firstName}
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  disabled={!isEditing}
                  error={errors.lastName}
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!isEditing}
                  error={errors.phone}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <Input
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                  type="email"
                  error={errors.email}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  disabled={!isEditing}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact d'urgence</label>
                <Input
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Nom et téléphone"
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end gap-3 mt-6">
                <Button onClick={() => setIsEditing(false)} variant="outline">
                  Annuler
                </Button>
                <Button onClick={handleUpdateProfile} loading={updateLoading}>
                  <FiSave className="w-4 h-4 mr-2" />
                  Sauvegarder
                </Button>
              </div>
            )}
          </Card>
        )}

        {activeTab === "vehicle" && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Informations véhicule</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Marque *</label>
                <Input
                  value={vehicleData.make}
                  onChange={(e) => setVehicleData({ ...vehicleData, make: e.target.value })}
                  error={errors.make}
                />
                {errors.make && <p className="text-red-500 text-sm mt-1">{errors.make}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Modèle *</label>
                <Input
                  value={vehicleData.model}
                  onChange={(e) => setVehicleData({ ...vehicleData, model: e.target.value })}
                  error={errors.model}
                />
                {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Année *</label>
                <Input
                  value={vehicleData.year}
                  onChange={(e) => setVehicleData({ ...vehicleData, year: e.target.value })}
                  type="number"
                  min="2000"
                  max={new Date().getFullYear() + 1}
                  error={errors.year}
                />
                {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Couleur</label>
                <Input
                  value={vehicleData.color}
                  onChange={(e) => setVehicleData({ ...vehicleData, color: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Plaque d'immatriculation *</label>
                <Input
                  value={vehicleData.licensePlate}
                  onChange={(e) => setVehicleData({ ...vehicleData, licensePlate: e.target.value.toUpperCase() })}
                  error={errors.licensePlate}
                />
                {errors.licensePlate && <p className="text-red-500 text-sm mt-1">{errors.licensePlate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type de véhicule</label>
                <select
                  value={vehicleData.type}
                  onChange={(e) => setVehicleData({ ...vehicleData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {vehicleTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de places</label>
                <Input
                  value={vehicleData.seats}
                  onChange={(e) => setVehicleData({ ...vehicleData, seats: Number.parseInt(e.target.value) })}
                  type="number"
                  min="2"
                  max="8"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type de carburant</label>
                <select
                  value={vehicleData.fuelType}
                  onChange={(e) => setVehicleData({ ...vehicleData, fuelType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {fuelTypes.map((fuel) => (
                    <option key={fuel.value} value={fuel.value}>
                      {fuel.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button onClick={handleUpdateVehicle} loading={vehicleLoading}>
                <FiSave className="w-4 h-4 mr-2" />
                Sauvegarder les modifications
              </Button>
            </div>
          </Card>
        )}

        {activeTab === "documents" && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Documents requis</h3>
            </div>

            <div className="space-y-4">
              {requiredDocuments.map((doc) => {
                const document = profile.documents.find((d) => d.type === doc.type)
                const status = getDocumentStatus(document)
                const isExpiring = document && isDocumentExpiringSoon(document)
                const isExpired = document && isDocumentExpired(document)

                return (
                  <div
                    key={doc.type}
                    className={`p-4 border rounded-lg ${
                      isExpired
                        ? "border-red-300 bg-red-50"
                        : isExpiring
                          ? "border-yellow-300 bg-yellow-50"
                          : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-gray-100 rounded-full">
                          <FiFileText className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {doc.label}
                            {doc.required && <span className="text-red-500 ml-1">*</span>}
                          </p>
                          <p className="text-sm text-gray-600">{doc.description}</p>
                          {document && (
                            <div className="text-sm text-gray-600 mt-1">
                              <p>Téléchargé le {document.uploadedAt.toLocaleDateString()}</p>
                              {document.expiryDate && (
                                <p
                                  className={
                                    isExpired
                                      ? "text-red-600 font-medium"
                                      : isExpiring
                                        ? "text-yellow-600 font-medium"
                                        : ""
                                  }
                                >
                                  Expire le {document.expiryDate.toLocaleDateString()}
                                  {isExpired && " (Expiré)"}
                                  {isExpiring && !isExpired && " (Expire bientôt)"}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <status.icon className="w-4 h-4" />
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                            {status.label}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          {document?.fileUrl && (
                            <Button onClick={() => window.open(document.fileUrl, "_blank")} variant="outline" size="sm">
                              Voir
                            </Button>
                          )}
                          <Button
                            onClick={() => {
                              setSelectedDocument(doc)
                              setShowDocumentModal(true)
                            }}
                            variant="outline"
                            size="sm"
                          >
                            <FiUpload className="w-4 h-4 mr-2" />
                            {document ? "Remplacer" : "Télécharger"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Tous les documents marqués d'un astérisque (*) sont obligatoires pour pouvoir
                conduire. Les documents sont vérifiés sous 24-48h. Pensez à renouveler vos documents avant leur
                expiration.
              </p>
            </div>
          </Card>
        )}

        {activeTab === "bank" && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Informations bancaires</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Titulaire du compte *</label>
                <Input
                  value={bankData.accountHolder}
                  onChange={(e) => setBankData({ ...bankData, accountHolder: e.target.value })}
                  error={errors.accountHolder}
                />
                {errors.accountHolder && <p className="text-red-500 text-sm mt-1">{errors.accountHolder}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">IBAN *</label>
                <Input
                  value={bankData.iban}
                  onChange={(e) => setBankData({ ...bankData, iban: e.target.value.toUpperCase() })}
                  placeholder="FR76 1234 5678 9012 3456 789"
                  error={errors.iban}
                />
                {errors.iban && <p className="text-red-500 text-sm mt-1">{errors.iban}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">BIC/SWIFT *</label>
                <Input
                  value={bankData.bic}
                  onChange={(e) => setBankData({ ...bankData, bic: e.target.value.toUpperCase() })}
                  placeholder="BNPAFRPP"
                  error={errors.bic}
                />
                {errors.bic && <p className="text-red-500 text-sm mt-1">{errors.bic}</p>}
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Sécurité:</strong> Vos informations bancaires sont cryptées et sécurisées. Elles ne sont
                utilisées que pour les virements de vos gains.
              </p>
            </div>

            <div className="flex justify-end mt-6">
              <Button onClick={handleUpdateBankInfo} loading={updateLoading}>
                <FiSave className="w-4 h-4 mr-2" />
                Sauvegarder
              </Button>
            </div>
          </Card>
        )}

        {activeTab === "preferences" && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Préférences</h3>
            </div>

            <div className="space-y-8">
              {/* Notifications */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Notifications</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferencesData.notifications.email}
                      onChange={(e) =>
                        setPreferencesData({
                          ...preferencesData,
                          notifications: { ...preferencesData.notifications, email: e.target.checked },
                        })
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Notifications par email</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferencesData.notifications.sms}
                      onChange={(e) =>
                        setPreferencesData({
                          ...preferencesData,
                          notifications: { ...preferencesData.notifications, sms: e.target.checked },
                        })
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Notifications par SMS</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferencesData.notifications.push}
                      onChange={(e) =>
                        setPreferencesData({
                          ...preferencesData,
                          notifications: { ...preferencesData.notifications, push: e.target.checked },
                        })
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Notifications push</span>
                  </label>
                </div>
              </div>

              {/* Working Hours */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Horaires de travail préférés</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Début</label>
                    <Input
                      type="time"
                      value={preferencesData.workingHours.start}
                      onChange={(e) =>
                        setPreferencesData({
                          ...preferencesData,
                          workingHours: { ...preferencesData.workingHours, start: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fin</label>
                    <Input
                      type="time"
                      value={preferencesData.workingHours.end}
                      onChange={(e) =>
                        setPreferencesData({
                          ...preferencesData,
                          workingHours: { ...preferencesData.workingHours, end: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Max Distance */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Distance maximale</h4>
                <div className="w-full max-w-xs">
                  <Input
                    type="number"
                    value={preferencesData.maxDistance}
                    onChange={(e) =>
                      setPreferencesData({
                        ...preferencesData,
                        maxDistance: Number.parseInt(e.target.value),
                      })
                    }
                    min="5"
                    max="100"
                  />
                  <p className="text-sm text-gray-600 mt-1">Distance maximale en kilomètres pour accepter une course</p>
                </div>
              </div>

              {/* Additional Preferences */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Préférences additionnelles</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferencesData.acceptPets}
                      onChange={(e) =>
                        setPreferencesData({
                          ...preferencesData,
                          acceptPets: e.target.checked,
                        })
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Accepter les animaux de compagnie</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferencesData.acceptLuggage}
                      onChange={(e) =>
                        setPreferencesData({
                          ...preferencesData,
                          acceptLuggage: e.target.checked,
                        })
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Accepter les bagages volumineux</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <Button onClick={handleUpdatePreferences} loading={updateLoading}>
                <FiSave className="w-4 h-4 mr-2" />
                Sauvegarder les préférences
              </Button>
            </div>
          </Card>
        )}

        {/* Document Upload Modal (inline fallback) */}
        {showDocumentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{`Télécharger ${selectedDocument?.label || "document"}`}</h3>
                <button onClick={() => { setShowDocumentModal(false); setDocumentPreview(null) }} className="text-gray-500 hover:text-gray-700">✕</button>
              </div>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {documentPreview ? (
                    <div className="space-y-4">
                      <img src={documentPreview || "/placeholder.svg"} alt="Preview" className="max-w-full h-32 object-contain mx-auto" />
                      <p className="text-sm text-green-600">Document prêt à être téléchargé</p>
                    </div>
                  ) : (
                    <>
                      <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Glissez-déposez votre fichier ici ou cliquez pour sélectionner</p>
                    </>
                  )}
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => { const file = e.target.files[0]; if (file && selectedDocument) { handleDocumentUpload(file, selectedDocument.type) } }} className="hidden" id="document-upload" disabled={uploadLoading} />
                  {!uploadLoading && (
                    <label htmlFor="document-upload" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                      {documentPreview ? "Changer le fichier" : "Sélectionner un fichier"}
                    </label>
                  )}
                  {uploadLoading && (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-sm text-gray-600">Téléchargement en cours...</span>
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  <p>Formats acceptés: PDF, JPG, PNG</p>
                  <p>Taille maximale: 5MB</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default DriverProfilePage
