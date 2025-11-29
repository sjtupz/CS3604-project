const { query, get, run } = require('./personal_database');

async function findById(id) {
  throw new Error('Not implemented')
}

async function updateById(id, data) {
  throw new Error('Not implemented')
}

async function deleteById(id) {
  throw new Error('Not implemented')
}

async function deleteMany(ids) {
  throw new Error('Not implemented')
}

module.exports = {
  findById,
  updateById,
  deleteById,
  deleteMany,
}