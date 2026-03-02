import { Request, Response } from "express";
import { IService } from "./service.interface";

class ServiceController {
  // GET /api/services - Barcha servicelarni olish
  async getAll(req: Request, res: Response): Promise<void> {
    const services: IService[] = [];

    res.json({
      success: true,
      data: services,
      message: "Services list",
    });
  }

  // GET /api/services/:id - Bitta serviceni olish
  async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    res.json({
      success: true,
      data: { id },
      message: `Service ${id}`,
    });
  }

  // POST /api/services - Yangi service yaratish
  async create(req: Request, res: Response): Promise<void> {
    const body: IService = req.body;

    res.status(201).json({
      success: true,
      data: body,
      message: "Service created",
    });
  }

  // PUT /api/services/:id - Serviceni yangilash
  async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const body: IService = req.body;

    res.json({
      success: true,
      data: { id, ...body },
      message: `Service ${id} updated`,
    });
  }

  // DELETE /api/services/:id - Serviceni o'chirish
  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    res.json({
      success: true,
      message: `Service ${id} deleted`,
    });
  }
}

export default new ServiceController();
