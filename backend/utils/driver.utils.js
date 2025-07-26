    import Driver from "../models/driver.model.js"


    export const findNearbyDrivers = async (coordinates, vehicleType = null, deliveriesOnly = false) => {
    try {
        
        const query = {
        isAvailable: true,
        isVerified: true,
        status: "approved",
        currentLocation: {
            $near: {
            $geometry: {
                type: "Point",
                coordinates,
            },
            $maxDistance: 5000, 
            },
        },
        }

        
        if (vehicleType) {
        query["vehicle.type"] = vehicleType
        }

    
        if (deliveriesOnly) {
        query["services.deliveries"] = true
        }

    
        const drivers = await Driver.find(query).populate("user", "firstName lastName phone")

        return drivers
    } catch (error) {
        console.error("Error finding nearby drivers:", error)
        return []
    }
    }


    export const updateDriverLocation = async (driverId, coordinates) => {
    try {
        await Driver.findByIdAndUpdate(driverId, {
        currentLocation: {
            type: "Point",
            coordinates,
        },
        })
        return true
    } catch (error) {
        console.error("Error updating driver location:", error)
        return false
    }
    }

    export const getDriverAvailability = async (driverId) => {
    try {
        const driver = await Driver.findById(driverId)
        return driver ? driver.isAvailable : false
    } catch (error) {
        console.error("Error getting driver availability:", error)
        return false
    }
    }

    export const toggleDriverAvailability = async (driverId, isAvailable) => {
    try {
        await Driver.findByIdAndUpdate(driverId, { isAvailable })
        return true
    } catch (error) {
        console.error("Error toggling driver availability:", error)
        return false
    }
    }  


    // import Driver from "../models/driver.model.js"

    // // دالة لجلب كاع السواقة المتاحين مع تفاصيل كاملة
    // export const getAllAvailableDrivers = async () => {
    //     try {
    //         const drivers = await Driver.find({
    //             isAvailable: true,
    //             isVerified: true,
    //             status: { $in: ["approved", "active"] }
    //         }).populate("user", "firstName lastName phone")
    
    //         console.log(`Found ${drivers.length} available drivers:`)
    //         drivers.forEach((driver, index) => {
    //             console.log(`${index + 1}. Driver ID: ${driver._id}`)
    //             console.log(`   Name: ${driver.user?.firstName} ${driver.user?.lastName}`)
    //             console.log(`   Status: ${driver.status}`)
    //             console.log(`   Available: ${driver.isAvailable}`)
    //             console.log(`   Verified: ${driver.isVerified}`)
    //             console.log(`   Vehicle Type: ${driver.vehicle?.type || 'Not specified'}`)
    //             console.log(`   Current Location: ${JSON.stringify(driver.currentLocation)}`)
    //             console.log(`   Location Type: ${driver.currentLocation?.type}`)
    //             console.log(`   Coordinates: ${driver.currentLocation?.coordinates}`)
    //             console.log('---')
    //         })
    
    //         return drivers
    //     } catch (error) {
    //         console.error("Error finding available drivers:", error)
    //         return []
    //     }
    // }
    
    // // دالة للبحث عن السواقة القريبين مع debugging شامل
    // export const findNearbyDrivers = async (coordinates, vehicleType = null, deliveriesOnly = false) => {
    //     try {
    //         console.log("=== Debug: All available drivers ===")
    //         await getAllAvailableDrivers()
            
    //         console.log("=== findNearbyDrivers Parameters ===")
    //         console.log(`Coordinates: ${JSON.stringify(coordinates)}`)
    //         console.log(`Vehicle Type: ${vehicleType}`)
    //         console.log(`Deliveries Only: ${deliveriesOnly}`)
            
    //         // أولاً: جرب بدون شروط الموقع
    //         const basicQuery = {
    //             isAvailable: true,
    //             isVerified: true,
    //             status: { $in: ["approved", "active"] },
    //         }
    
    //         if (vehicleType) {
    //             basicQuery["vehicle.type"] = vehicleType
    //         }
    
    //         if (deliveriesOnly) {
    //             basicQuery["services.deliveries"] = true
    //         }
    
    //         console.log("=== Basic Query (without location) ===")
    //         console.log(JSON.stringify(basicQuery, null, 2))
    
    //         const allMatchingDrivers = await Driver.find(basicQuery).populate("user", "firstName lastName phone")
    //         console.log(`=== Found ${allMatchingDrivers.length} matching drivers (ignoring location) ===`)
    
    //         if (allMatchingDrivers.length === 0) {
    //             console.log("❌ No drivers match basic criteria")
    //             return []
    //         }
    
    //         // تحقق من الموقع لكل سائق
    //         console.log("=== Checking driver locations ===")
    //         allMatchingDrivers.forEach((driver, index) => {
    //             console.log(`Driver ${index + 1}: ${driver._id}`)
    //             console.log(`  Location exists: ${driver.currentLocation ? 'Yes' : 'No'}`)
    //             if (driver.currentLocation) {
    //                 console.log(`  Location type: ${driver.currentLocation.type}`)
    //                 console.log(`  Coordinates: ${JSON.stringify(driver.currentLocation.coordinates)}`)
                    
    //                 // حساب المسافة يدوياً
    //                 if (coordinates && coordinates.length === 2 && driver.currentLocation.coordinates && driver.currentLocation.coordinates.length === 2) {
    //                     const distance = calculateDistance(
    //                         coordinates[1], coordinates[0], // lat, lng للنقطة المطلوبة
    //                         driver.currentLocation.coordinates[1], driver.currentLocation.coordinates[0] // lat, lng للسائق
    //                     )
    //                     console.log(`  Distance: ${distance.toFixed(2)} meters`)
    //                     console.log(`  Within 5km: ${distance <= 5000 ? 'Yes' : 'No'}`)
    //                 }
    //             }
    //         })
    
    //         // ثانياً: جرب مع شروط الموقع
    //         if (coordinates && coordinates.length === 2) {
    //             console.log("=== Trying with location filter ===")
                
    //             const locationQuery = {
    //                 ...basicQuery,
    //                 currentLocation: {
    //                     $near: {
    //                         $geometry: {
    //                             type: "Point",
    //                             coordinates,
    //                         },
    //                         $maxDistance: 5000,
    //                     },
    //                 },
    //             }
    
    //             console.log("=== Location Query ===")
    //             console.log(JSON.stringify(locationQuery, null, 2))
    
    //             try {
    //                 const nearbyDrivers = await Driver.find(locationQuery).populate("user", "firstName lastName phone")
    //                 console.log(`=== Found ${nearbyDrivers.length} nearby drivers with $near ===`)
                    
    //                 if (nearbyDrivers.length > 0) {
    //                     return nearbyDrivers
    //                 }
    //             } catch (geoError) {
    //                 console.error("❌ Geospatial query failed:", geoError.message)
    //                 console.log("🔧 This might be due to missing geospatial index")
    //                 console.log("🔧 Falling back to manual distance calculation...")
    //             }
    //         }
    
    //         // ثالثاً: فلترة يدوية بالمسافة إذا فشل $near
    //         console.log("=== Manual distance filtering ===")
    //         const manuallyFilteredDrivers = []
            
    //         for (const driver of allMatchingDrivers) {
    //             if (!driver.currentLocation || !driver.currentLocation.coordinates) {
    //                 console.log(`Driver ${driver._id}: No location data`)
    //                 continue
    //             }
    
    //             if (!coordinates || coordinates.length !== 2) {
    //                 console.log("Invalid pickup coordinates, adding all drivers")
    //                 manuallyFilteredDrivers.push(driver)
    //                 continue
    //             }
    
    //             const distance = calculateDistance(
    //                 coordinates[1], coordinates[0], // pickup lat, lng
    //                 driver.currentLocation.coordinates[1], driver.currentLocation.coordinates[0] // driver lat, lng
    //             )
    
    //             console.log(`Driver ${driver._id}: Distance = ${distance.toFixed(2)}m`)
    
    //             if (distance <= 5000) { // 5km
    //                 manuallyFilteredDrivers.push(driver)
    //             }
    //         }
    
    //         console.log(`=== Manual filtering result: ${manuallyFilteredDrivers.length} drivers within 5km ===`)
            
    //         // إذا ما لقيناش حتى واحد، رجع كاع السواقة المتاحين
    //         if (manuallyFilteredDrivers.length === 0) {
    //             console.log("⚠️ No drivers within 5km, returning all available drivers")
    //             return allMatchingDrivers
    //         }
    
    //         return manuallyFilteredDrivers
    
    //     } catch (error) {
    //         console.error("Error finding nearby drivers:", error)
    //         return []
    //     }
    // }
    
    // // دالة لحساب المسافة بين نقطتين (Haversine formula)
    // function calculateDistance(lat1, lon1, lat2, lon2) {
    //     const R = 6371e3; // Earth's radius in meters
    //     const φ1 = lat1 * Math.PI/180; // φ, λ in radians
    //     const φ2 = lat2 * Math.PI/180;
    //     const Δφ = (lat2-lat1) * Math.PI/180;
    //     const Δλ = (lon2-lon1) * Math.PI/180;
    
    //     const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
    //               Math.cos(φ1) * Math.cos(φ2) *
    //               Math.sin(Δλ/2) * Math.sin(Δλ/2);
    //     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    //     const distance = R * c; // in metres
    //     return distance;
    // }
    
    // // دالة لجلب كاع السواقة للاختبار
    // export const getAllDriversForTesting = async () => {
    //     try {
    //         const allDrivers = await Driver.find({}).populate("user", "firstName lastName phone")
            
    //         console.log(`=== ALL DRIVERS IN DATABASE (${allDrivers.length}) ===`)
    //         allDrivers.forEach((driver, index) => {
    //             console.log(`${index + 1}. Driver ID: ${driver._id}`)
    //             console.log(`   Name: ${driver.user?.firstName || 'N/A'} ${driver.user?.lastName || 'N/A'}`)
    //             console.log(`   Status: ${driver.status}`)
    //             console.log(`   Available: ${driver.isAvailable}`)
    //             console.log(`   Verified: ${driver.isVerified}`)
    //             console.log(`   Vehicle: ${JSON.stringify(driver.vehicle)}`)
    //             console.log(`   Location: ${JSON.stringify(driver.currentLocation)}`)
    //             console.log('---')
    //         })
    
    //         return allDrivers
    //     } catch (error) {
    //         console.error("Error getting all drivers:", error)
    //         return []
    //     }
    // }
    
    // // دالة لتحديث موقع السائق
    // export const updateDriverLocation = async (driverId, coordinates) => {
    //     try {
    //         console.log(`Updating driver ${driverId} location to:`, coordinates)
            
    //         const result = await Driver.findByIdAndUpdate(driverId, {
    //             currentLocation: {
    //                 type: "Point",
    //                 coordinates,
    //             },
    //         }, { new: true })
    
    //         if (result) {
    //             console.log(`✅ Driver location updated successfully`)
    //             console.log(`New location:`, result.currentLocation)
    //             return true
    //         } else {
    //             console.log(`❌ Driver not found: ${driverId}`)
    //             return false
    //         }
    //     } catch (error) {
    //         console.error("Error updating driver location:", error)
    //         return false
    //     }
    // }
    
    // // دالة للحصول على حالة توفر السائق
    // export const getDriverAvailability = async (driverId) => {
    //     try {
    //         const driver = await Driver.findById(driverId)
    //         if (driver) {
    //             console.log(`Driver ${driverId} availability: ${driver.isAvailable}`)
    //             return driver.isAvailable
    //         } else {
    //             console.log(`Driver ${driverId} not found`)
    //             return false
    //         }
    //     } catch (error) {
    //         console.error("Error getting driver availability:", error)
    //         return false
    //     }
    // }
    
    // // دالة لتبديل حالة توفر السائق
    // export const toggleDriverAvailability = async (driverId, isAvailable) => {
    //     try {
    //         console.log(`Toggling driver ${driverId} availability to: ${isAvailable}`)
            
    //         const result = await Driver.findByIdAndUpdate(driverId, { 
    //             isAvailable 
    //         }, { new: true })
    
    //         if (result) {
    //             console.log(`✅ Driver availability updated successfully`)
    //             console.log(`New availability: ${result.isAvailable}`)
    //             return true
    //         } else {
    //             console.log(`❌ Driver not found: ${driverId}`)
    //             return false
    //         }
    //     } catch (error) {
    //         console.error("Error toggling driver availability:", error)
    //         return false
    //     }
    // }
    
    // // دالة لإنشاء geospatial index (استعملها مرة واحدة فقط)
    // export const createGeospatialIndex = async () => {
    //     try {
    //         console.log("Creating geospatial index on currentLocation...")
    //         await Driver.collection.createIndex({ currentLocation: "2dsphere" })
    //         console.log("✅ Geospatial index created successfully")
    //         return true
    //     } catch (error) {
    //         console.error("Error creating geospatial index:", error)
    //         return false
    //     }
    // }
    
    // // دالة لتعيين موقع تجريبي للسائق
    // export const setTestLocationForDriver = async (driverId, pickupCoordinates) => {
    //     try {
    //         console.log(`Setting test location for driver ${driverId}`)
            
    //         // ضع السائق قريب من نقطة الانطلاق (بزيادة صغيرة في الإحداثيات)
    //         const testCoordinates = [
    //             pickupCoordinates[0] + 0.001, // lng + 0.001
    //             pickupCoordinates[1] + 0.001  // lat + 0.001
    //         ]
    
    //         const result = await Driver.findByIdAndUpdate(driverId, {
    //             currentLocation: {
    //                 type: "Point",
    //                 coordinates: testCoordinates,
    //             },
    //             isAvailable: true,
    //             isVerified: true,
    //             status: "approved"
    //         }, { new: true })
    
    //         if (result) {
    //             console.log(`✅ Test location set for driver`)
    //             console.log(`Location: ${JSON.stringify(result.currentLocation)}`)
                
    //             const distance = calculateDistance(
    //                 pickupCoordinates[1], pickupCoordinates[0],
    //                 testCoordinates[1], testCoordinates[0]
    //             )
    //             console.log(`Distance from pickup: ${distance.toFixed(2)} meters`)
                
    //             return true
    //         } else {
    //             console.log(`❌ Driver not found: ${driverId}`)
    //             return false
    //         }
    //     } catch (error) {
    //         console.error("Error setting test location:", error)
    //         return false
    //     }
    // }