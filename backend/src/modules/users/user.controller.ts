import { Request, Response } from "express";
import { IUser } from "./user.interface";

class UserController {
  // GET /api/users - Barcha userlarni olish
  async getAll(req: Request, res: Response): Promise<void> {
    const users: IUser[] = [];

    res.json({
      success: true,
      data: users,
      message: "Users list",
    });
  }

  // GET /api/users/:id - Bitta userni olish
  async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    res.json({
      success: true,
      data: { id },
      message: `User ${id}`,
    });
  }

  // POST /api/users - Yangi user yaratish
  async create(req: Request, res: Response): Promise<void> {
    const body: IUser = req.body;

    res.status(201).json({
      success: true,
      data: body,
      message: "User created",
    });
  }

  // PUT /api/users/:id - Userni yangilash
  async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const body: IUser = req.body;

    res.json({
      success: true,
      data: { id, ...body },
      message: `User ${id} updated`,
    });
  }

  // DELETE /api/users/:id - Userni o'chirish
  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    res.json({
      success: true,
      message: `User ${id} deleted`,
    });
  }
}

export default new UserController();
