import { Router } from 'express';
import userRoutes from './user.routes.js';
import applicantRoutes from './applicant.routes.js';
import caseRoutes from './case.routes.js';
import beneficiaryRoutes from './beneficiary.routes.js'
/*import catalogRoutes from './catalog.routes.js';
import statsRoutes from './stats.routes.js';   */ 

const router = Router();

router.use('/users', userRoutes);
router.use('/applicants', applicantRoutes);
router.use('/cases', caseRoutes);
router.use('/beneficiary', beneficiaryRoutes);
/*router.use('/catalogs', catalogRoutes); 
router.use('/stats', statsRoutes);*/

export default router;