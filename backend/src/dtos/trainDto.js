/**
 * Train Query DTO
 * @typedef {Object} TrainQueryDto
 * @property {string} from - Departure station
 * @property {string} to - Arrival station
 * @property {string} date - Departure date (YYYY-MM-DD)
 * @property {string} [trainTypes] - Comma separated train types (GC, D, Z)
 * @property {string} [seatTypes] - Comma separated seat types
 * @property {string} [departureTimeStart] - Start of departure time range (HH:mm)
 * @property {string} [departureTimeEnd] - End of departure time range (HH:mm)
 * @property {string} [passengerCategory] - normal or student
 * @property {string} [sortBy] - trainNumber, departureTime, arrivalTime, duration
 * @property {string} [sortOrder] - asc, desc
 * @property {number} [page] - Page number (default 1)
 * @property {number} [pageSize] - Page size (default 20)
 */

class TrainDto {
  static toResponse(train) {
    return {
      trainNumber: train.trainNumber,
      departureStation: train.departureStation,
      arrivalStation: train.arrivalStation,
      departureTime: train.departureTime,
      arrivalTime: train.arrivalTime,
      duration: train.duration,
      arrivalDayIndicator: train.arrivalDayIndicator,
      seatAvailability: train.seatAvailability
    };
  }
}

module.exports = TrainDto;
