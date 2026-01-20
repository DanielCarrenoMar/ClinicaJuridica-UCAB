import { Router } from 'express';
import * as beneficiaryController from '../controllers/beneficiary.controller.js';

const router = Router();

router.get('/', beneficiaryController.getAllBeneficiaries);
// Las rutas específicas deben ir ANTES de las rutas con parámetros
router.get('/stats/type-distribution', beneficiaryController.getBeneficiaryTypeStats);
router.get('/:id/cases', beneficiaryController.getBeneficiaryCases);
router.get('/:id', beneficiaryController.getBeneficiaryById);
router.post('/', beneficiaryController.createBeneficiary);
router.put('/:id', beneficiaryController.updateBeneficiary);
router.delete('/:id', beneficiaryController.deleteBeneficiary);

export default router;