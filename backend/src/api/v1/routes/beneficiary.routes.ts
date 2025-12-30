import { Router } from 'express';
//import * as beneficiaryController from '../controllers/beneficiary.controller.js';

const router = Router();

// CRUD de beneficiarios generales
/*router.get('/', beneficiaryController.getAllBeneficiaries);
router.get('/:id', beneficiaryController.getBeneficiaryById);
router.post('/', beneficiaryController.createBeneficiary);
router.put('/:id', beneficiaryController.updateBeneficiary);
router.delete('/:id', beneficiaryController.deleteBeneficiary);

// Relaciones
router.get('/:id/cases', beneficiaryController.getBeneficiaryCases);*/

export default router;