/**
 * Authorization Roles
 */
const authRoles = {
  admin: ['admin'],
  gli_admin: ['gli_admin', 'admin'],
  real_estate_admin: ['real_estate_admin', 'admin'],
  gli_employee: ['gli_employee', 'gli_admin', 'admin'],
  real_estate_agent: ['real_estate_agent', 'real_estate_admin', 'admin'],
  applicant: ['applicant'],
  onlyGuest: [],
};

export default authRoles;
