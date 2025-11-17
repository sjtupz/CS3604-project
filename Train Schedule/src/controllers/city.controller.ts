import { Request, Response, NextFunction } from 'express'
import { CityService } from '../services/city.service'

export class CityController {
  static async getDepartures(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const keyword = String(req.query.keyword || '')
      const page = req.query.page ? parseInt(String(req.query.page), 10) : 1
      const pageSize = req.query.pageSize ? parseInt(String(req.query.pageSize), 10) : 10
      const { meta, data } = CityService.search(keyword, page, pageSize)
      res.status(200).json({ meta, data })
    } catch (e) { next(e as Error) }
  }
  static async getDestinations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const keyword = String(req.query.keyword || '')
      const page = req.query.page ? parseInt(String(req.query.page), 10) : 1
      const pageSize = req.query.pageSize ? parseInt(String(req.query.pageSize), 10) : 10
      const { meta, data } = CityService.search(keyword, page, pageSize)
      res.status(200).json({ meta, data })
    } catch (e) { next(e as Error) }
  }
}