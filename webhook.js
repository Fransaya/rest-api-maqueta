import { Router } from 'express';

const router = Router();

router.post('/webhook', (req, res) => {
  try {
    res.sendStatus(200);

    console.log('Webhook recibido:', req.body);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

export default router;
