import { Router } from 'express';

import { VoluntariosController } from '../controllers/voluntarios.controller';

export const createVoluntariosRoutes = (
  voluntariosController: VoluntariosController
): Router => {
  const router = Router();

  router.post('/voluntarios', voluntariosController.create);
  router.get('/voluntarios', voluntariosController.list);
  router.get('/voluntarios/:id', voluntariosController.getById);
  router.put('/voluntarios/:id', voluntariosController.update);
  router.patch('/voluntarios/:id/inativar', voluntariosController.inactivate);

  return router;
};
