
export const roleConstants = {
  client: 'CLIENT',
  worker: 'WORKER',
  admin: 'ADMIN',
  midStream: 'MIDSTREAM',
}

export const statusCodes = {
  success: 200,
  created: 201,
  noContent: 204,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  conflict: 409,
  internalServerError: 500,
}

export const endPointRoutes = {
  userProfile: '/userProfiles',
  analytics: '/analytics',
  referralForms: '/referralForms',
  assignCases: '/assignCases',
  company: '/company',
  devTools: '/devTools',
  referralDocuments: '/referral-documents',
  serviceCase: '/serviceCase',
  servicePlan: '/servicePlan',
}

export const userProfileRoutes = {
  createUserProfile: '/createUserProfile',
  getUserProfile: '/getUserProfile',
}

export const userReferralRoutes = {
  createUserReferral: '/createReferralForm',
  getUserReferrals: '/user/getReferralForm/:googleId',
  generateUserFullForm: '/generateFullReferralForm',
  updateReferralChecklist: '/checklist/:referralId',
  createReferralNote: '/notes/:referralId',
  // Staff-only routes
  getAllReferrals: '/getAllReferralForms/:companyId',
  getCaseWorkerReferrals: '/caseWorker/getReferralForm/:googleId',
}

export const audioDocumentRoutes = {
  uploadAudioDocument: '/upload-audio',
  updateUserAudioDocuments: '/document/:documentId',
}

export const companyRoutes = {
  createCompany: '/createCompany',
  joinCompany: '/joinCompany',
  getCompanyList: '/getCompanyList',
}