//var host = "https://7c9a2694.ngrok.io/";
import {
    getCookie
} from "./core";

var host = "https://scoutive.online/";

if (getCookie("sc_debug")) {
    host = getCookie("sc_debug");
}

var api_version = "api/v1/";

var ep = {
    GET_IP: "https://api.ipify.org?format=json",
    BLOOD_TYPE: host + api_version + "get/bloods",
    PLAYER_POSITION_TYPE: host + api_version + "get/positions/players",
    EMPLOYEE_POSITION_TYPE: host + api_version + "get/positions/employee",
    GROUP: host + api_version + "get/groups",
    BRANCH: host + api_version + "get/branchs",
    CLUB: host + api_version + "get/clubs",
    BANK: host + api_version + "get/banks",
    ACCOUNT_LOGIN: host + api_version + "login",
    SCHOOL_CREATE: host + api_version + "create/school",
    SCHOOL_GET: host + api_version + "get/school",
    SCHOOL_UPDATE: host + api_version + "update/school",
    SCHOOL_LIST_PERMISSION: host + api_version + "list/permissions",
    SCHOOL_UPDATE_PERMISSION: host + api_version + "update/permissions",
    PASSWORD_FORGOT: host + api_version + "password/forgot",
    PASSWORD_RESET: host + api_version + "password/reset",
    PASSWORD_CHANGE: host + api_version + "password/change",
    PASSWORD_CHANGE_EMPLOYEE: host + api_version + "password/change/employee",
    ACCOUNT_ACTIVATION: host + api_version + "activation",
    CREATE_EMPLOYEE: host + api_version + "create/employee",
    EMPLOYEE_DELETE: host + api_version + "delete/employee",
    UPDATE_EMPLOYEE: host + api_version + "update/employee",
    LIST_EMPLOYEE: host + api_version + "list/employees",
    GET_EMPLOYEE_NAME: host + api_version + "list/employees/name",
    GET_EMPLOYEE: host + api_version + "get/employee",
    PLAYER_CREATE: host + api_version + "create/player",
    PLAYER_TRIAL_CREATE: host + api_version + "create/player/trial",
    PLAYER_DELETE: host + api_version + "delete/player",
    PLAYER_FREEZE: host + api_version + "freeze/player",
    PLAYER_REFRESH: host + api_version + "refresh/player",
    PLAYER_LIST: host + api_version + "list/players",
    GET_PLAYER_NAME: host + api_version + "list/players/name",
    GET_PLAYER: host + api_version + "get/player",
    UPDATE_PLAYER: host + api_version + "update/player",
    UPDATE_PLAYERS: host + api_version + "update/players",
    LIST_GROUP: host + api_version + "list/groups",
    CREATE_GROUP: host + api_version + "create/group",
    UPDATE_GROUP: host + api_version + "update/group",
    GROUP_DELETE: host + api_version + "delete/group",
    GET_GROUP: host + api_version + "get/group",
    CHECK_PERMISSION: host + api_version + "check/permission",
    COMPLETE_ROLLCALL: host + api_version + "complete/rollcall",
    CREATE_ROLLCALL: host + api_version + "create/rollcall",
    LIST_ROLLCALL: host + api_version + "list/rollcalls",
    ROLLCALL_MAKE: host + api_version + "create/rollcall/",
    ROLLCALL_LIST_TYPE: host + api_version + "list/rollcall/",
    ROLLCALL_ACTIVE: host + api_version + "active/rollcall/",
    UPLOAD_FILE: host + api_version + "upload/file",
    VACATION_CREATE: host + api_version + "create/vacation/",
    VACATION_UPDATE: host + api_version + "update/vacation",
    VACATION_LIST: host + api_version + "list/vacations/",
    VACATION_DELETE: host + api_version + "delete/vacation",
    VACATION_PAY: host + api_version + "pay/vacations",
    ADVANCE_PAYMENT_CREATE: host + api_version + "create/advancepayment",
    ADVANCE_PAYMENT_LIST: host + api_version + "list/advancepayments",
    ADVANCE_PAYMENT_PAY: host + api_version + "pay/advancepayments",
    BUDGET_LIST: host + api_version + "list/budgets",
    BUDGET_GET: host + api_version + "get/budget",
    BUDGET_CREATE: host + api_version + "create/budget",
    BUDGET_DEFAULT: host + api_version + "set/default/budget",
    SALARY_CREATE: host + api_version + "create/salary",
    SALARY_LIST: host + api_version + "list/employee/salaries",
    FEE_CREATE: host + api_version + "pay/player/fee",
    FEE_LIST: host + api_version + "list/player/fees",
    ACCOUNTING_CREATE: host + api_version + "list/accounting/types" ,
    ACCOUNTING_TYPE_LIST: host + api_version + "list/accounting/types" 
};

export default ep;