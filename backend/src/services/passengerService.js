const dbPassenger = require('../db/passenger')

async function getPassengers(userId, queryParams = {}) {
  const { name } = queryParams
  if (name && name.trim()) {
    return dbPassenger.getPassengersByName(userId, name.trim())
  }
  return dbPassenger.getPassengers(userId)
}

async function getPassengersByName(userId, name) {
  return dbPassenger.getPassengersByName(userId, name)
}

async function createPassenger(userId, data) {
  const { name, idType, idNumber } = data || {}
  if (!name) throw new Error('请输入姓名')
  if (!idNumber || (idNumber && idNumber.length < 8)) throw new Error('请输入正确的证件号码！')
  return dbPassenger.createPassenger(userId, data)
}

async function updatePassenger(passengerId, userId, data) {
  return dbPassenger.updatePassenger(passengerId, userId, data)
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
