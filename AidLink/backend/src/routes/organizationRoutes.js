const { Router } = require('express');
const organizationController = require('../controllers/organizationController');
const requireAuth = require('../middleware/auth');
const requireRoles = require('../middleware/roles');

const router = Router();

router.get('/', organizationController.listOrganizations);
router.post('/', requireAuth, requireRoles('admin'), organizationController.createOrganization);
router.put('/:id', requireAuth, requireRoles('admin'), organizationController.updateOrganization);
router.delete('/:id', requireAuth, requireRoles('admin'), organizationController.deleteOrganization);
router.put('/:id/verify', requireAuth, requireRoles('admin'), organizationController.verifyOrganization);
router.put('/:id/members', requireAuth, requireRoles('admin'), organizationController.addMember);
router.get('/:id/members', requireAuth, requireRoles('admin'), organizationController.listMembers);
router.get('/:id/requests', requireAuth, requireRoles('admin'), organizationController.listOrganizationRequests);

module.exports = router;


