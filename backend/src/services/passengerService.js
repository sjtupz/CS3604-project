const dbPassenger = require('../db/passenger')
const userDb = require('../db/userDb')
const { isValidIdentityNumber } = require('../utils/validators');

async function getPassengers(userId, queryParams = {}) {
  const { name } = queryParams
  let passengers = []
  
  // 1. Get other passengers
  if (name && name.trim()) {
    passengers = await dbPassenger.getPassengersByName(userId, name.trim())
  } else {
    passengers = await dbPassenger.getPassengers(userId)
  }

  // 2. Get Self info
  const user = await userDb.findUserById(userId)
  if (!user) {
    console.warn(`[PassengerService] User not found for ID: ${userId} - Self passenger will not be added.`);
  } else {
    // Check if self is already in passengers list (by identity number)
    const selfIndex = passengers.findIndex(p => p.idNumber === user.identityNumber);

    if (selfIndex !== -1) {
      // Found self in DB list. Move to top and mark as self.
      const selfPassenger = passengers[selfIndex];
      selfPassenger.isSelf = true;
      selfPassenger.passengerId = selfPassenger.passengerId || user.id; // Ensure ID exists
      
      // Remove from current position
      passengers.splice(selfIndex, 1);
      // Add to top
      passengers.unshift(selfPassenger);
    } else {
      // Self not in DB list. Inject dynamic self.
      const selfPassenger = {
        passengerId: user.id,
        name: user.fullName,
        idType: user.identityType,
        idNumber: user.identityNumber,
        phone: user.phoneNumber,
        verificationStatus: user.verificationStatus || '已通过',
        discountType: user.passengerType || '成人',
        isSelf: true
      }

      // Filter self by name if searching
      if (name && name.trim()) {
        if (selfPassenger.name && selfPassenger.name.includes(name.trim())) {
          passengers.unshift(selfPassenger)
        }
      } else {
        passengers.unshift(selfPassenger)
      }
    }
  }

  return passengers
}

async function getPassengersByName(userId, name) {
  return dbPassenger.getPassengersByName(userId, name)
}

async function createPassenger(userId, data) {
  // Map frontend field names to database field names
  const passengerData = {
    name: data.name,
    idType: data.idType,
    idNumber: data.idNumber,
    phone: data.phone,
    discountType: data.type || data.discountType || '成人', // Map 'type' to 'discountType'
    expiryDate: data.expiryDate,
    birthDate: data.birthDate
  }
  
  const { name, idType, idNumber } = passengerData
  
  // Validation messages per requirements
  if (!name) throw new Error('请输入您的姓名！')
  if (!idNumber) throw new Error('请输入证件号码！')
  
  // 1. Check if ID exists in registered users (Users table)
  const registeredUser = await userDb.findUserByIdentityNumber(idNumber);

  if (registeredUser) {
    // If ID is registered, Name MUST match
    if (registeredUser.fullName !== name && registeredUser.realName !== name) {
       throw new Error('身份信息不一致！');
    }
  } else {
    // If ID not registered, check format
    if (idType === '居民身份证' && !isValidIdentityNumber(idNumber)) {
      throw new Error('请正确输入18位的证件号码！');
    }
  }

  return dbPassenger.createPassenger(userId, passengerData)
}

async function updatePassenger(passengerId, userId, data) {
  // Map frontend field names to database field names for update
  const updateData = {
    name: data.name,
    idType: data.idType,
    idNumber: data.idNumber,
    phone: data.phone,
    discountType: data.type || data.discountType,
    expiryDate: data.expiryDate,
    birthDate: data.birthDate
  }
  
  // Remove undefined fields
  Object.keys(updateData).forEach(key => {
    if (updateData[key] === undefined) {
      delete updateData[key]
    }
  })
  
  return dbPassenger.updatePassenger(passengerId, userId, updateData)
}

async function deletePassenger(passengerId, userId) {
  return dbPassenger.deletePassenger(passengerId, userId)
}

async function deletePassengers(ids, userId) {
  return dbPassenger.deletePassengers(ids, userId)
}

module.exports = {
  getPassengers,
  getPassengersByName,
  createPassenger,
  updatePassenger,
  deletePassenger,
  deletePassengers,
}
