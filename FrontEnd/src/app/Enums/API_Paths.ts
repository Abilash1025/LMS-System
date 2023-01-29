export enum ApiPaths{
    //TODO: REMOVE AFTER TEST COMPONENT REMOVED
    testAPI = '/api/testAPI',
    encryptAPI = "/api/test/EncryptData",
    decryptAPI = "/api/test/decryptData",

    //Authentication
    loginAPI = "/api/admin/login",
    forgetPasswordAPI = "/api/authentication/forgetPassword",
    requestNewPasswordAPI = "/api/authentication/passwordReset",
    passwordUpdateApi = "/api/authentication/updatePassword",

    //Mangement Profile
    profileCreateApiAdmin = "/api/admin/register/Admin",
    profileCreateApiUser = "/api/user/register/User",
    profileEditApi = "/api/admin/update/Admin",
    profileLoadAPI = "/api/administrator/admin/getAdmin",
    getAllAdminAPI = "/api/admin/getAll/AdminInfo",
    getAllUsersAPI = "/api/user/getAll/UserInfo",
    deleteUserAPI = "/api/user/deleteUser",
    deleteAdminAPI = "/api/admin/deleteAdmin",
    getParticularAdmin="/api/admin/get/ParticularAdmin",
    updateAdminPassword="/api/admin/update/AdminPassword",

    getParticularUser="/api/user/get/ParticularUser",
    updateUserPassword="/api/user/update/UserPassword",
    profileUpdateUser="/api/user/update/User",

    //SubjectModuleModel
    addModuleModel="/api/subject/add/SubjectModule",
    getModuleModel="/api/subject/getAll/SubjectModuleInfo",
    getOneModuleModel="/api/subject/get/SubjectModule",
    editModuleModel="/api/subject/update/SubjectModule",
    deleteModuleModel="/api/subject/deleteSubjectModule", 
    
    getParticularModel="/api/subject/get/particularBatchModule",

    getParticularModuleSubjectModel="/api/subject/get/particularBatchSubject",
    
    
    //AssignmentModel
    addAssignmentModel="/api/assignment/add/Assignment",
    getAssignmentModel="/api/assignment/getAll/Assignment",
    getOneAssignmentModel="/api/assignment/get/Assignment",
    editAssignmentModel="/api/assignment/update/Assignment",
    deleteAssignmentModel="/api/assignment/deleteAssignment",


    getParticularAssignment="/api/assignment/get/particularAssignment",
    getGradedParticularAssignment="/api/assignment/get/GradedParticularIdAssignment",
    submitAssignment="/api/assignment/submit/Assignment",
    submittedAssignment="/api/assignment/get/SubmittedAssignments",
    gradeAssignment="/api/assignment/grade/Assignment",
    getSubmittedAssignments="/api/assignment/get/particularIdAssignment",


    //ModuleModel
    addModulel="/api/subject/add/subject",
    getModulel="/api/subject/getAll/SubjectInfo",
    deleteModulel="/api/subject/deleteSubject",

    //Batch
    addBatch="/api/batch/add/Batch",
    getBatch="/api/batch/getAll/BatchInfo",

    //Feedback
    getFeedback="/api/feedback/getAll/Feedback",
    deleteFeedback="/api/feedback/deleteFeedback",
    addFeedback="/api/feedback/add/Feedback",

    //HomeBanner
    updateHomeBanner="/api/homeBanner/update/homebanner",
    getHomeBanner="/api/homeBanner/get/HomeBannerInfo",

    postCardOrderAPI = "/api/payhere/post",

    //Quotes
    getQuotes="/api/quotes/get/quotes",

    //Personal File
    addPersonal="/api/personal/add/PersonalFile",
    getPersonal="/api/personal/get/particularPersonalFile",
    deletePersonal="/api/personal/deleteFile",
}
