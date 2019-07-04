//var host = "https://10bea00b.ngrok.io/";
var host = "https://scoutive.online/";
var api_version = "api/v1/";

var ep = {
    BLOOD_TYPE: host + api_version + "get/bloods",
    PLAYER_POSITION_TYPE: host + api_version + "get/positions/players",
    EMPLOYEE_POSITION_TYPE: host + api_version + "get/positions/employee",
    GROUP: host + api_version + "get/groups",
    BRANCH: host + api_version + "get/branchs",
    CLUB: host + api_version + "get/clubs",
    ACCOUNT_LOGIN: host + api_version + "login",
    SCHOOL_CREATE: host + api_version + "create/school",
    SCHOOL_GET: host + api_version + "get/school",
    SCHOOL_UPDATE: host + api_version + "update/school",
    FORGOT_PASSWORD: host + api_version + "password/forgot",
    RESET_PASSWORD: host + api_version + "password/reset",
    ACCOUNT_ACTIVATION: host + api_version + "activation",
    CREATE_EMPLOYEE: host + api_version + "create/employee",
    UPDATE_EMPLOYEE: host + api_version + "update/employee",
    LIST_EMPLOYEE: host + api_version + "list/employees",
    GET_EMPLOYEE_NAME: host + api_version + "list/employees/name",
    GET_EMPLOYEE: host + api_version + "get/employee",
    CREATE_PLAYER: host + api_version + "create/player",
    LIST_PLAYER: host + api_version + "list/players",
    GET_PLAYER_NAME: host + api_version + "list/players/name",
    GET_PLAYER: host + api_version + "get/player",
    UPDATE_PLAYER: host + api_version + "update/player",
    UPDATE_PLAYERS: host + api_version + "update/players",
    LIST_GROUP: host + api_version + "list/groups",
    CREATE_GROUP: host + api_version + "create/group",
    UPDATE_GROUP: host + api_version + "update/group",
    GET_GROUP: host + api_version + "get/group",
    CHECK_PERMISSION: host + api_version + "check/permission",
    COMPLETE_ROLLCALL: host + api_version + "complete/rollcall",
    CREATE_ROLLCALL: host + api_version + "create/rollcall",
    LIST_ROLLCALL: host + api_version + "list/rollcalls",
    UPLOAD_FILE: host + api_version + "upload/file",
    VACATION_CREATE: host + api_version + "create/vacation/"
};

export default ep;