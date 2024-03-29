import { getCookie } from "./core";

var host = "https://scoutive.online/";
var ipdata_key = "d3d0e4b1a996cdcb4c06738e28a998aa3bd95bfc18b2e21362a52be5";

if (getCookie("sc_debug")) {
    host = getCookie("sc_debug");
}

var api_version = "api/v1/";

var ep = {
    GET_GEOLOCATION: "https://api.ipdata.co/?api-key=" + ipdata_key,
    BLOOD_TYPE: host + api_version + "get/bloods",
    PLAYER_POSITION_TYPE: host + api_version + "get/positions/players/",
    EMPLOYEE_POSITION_TYPE: host + api_version + "get/positions/employee",
    GROUP: host + api_version + "get/groups",
    BRANCH: host + api_version + "get/branchs",
    CLUB: host + api_version + "get/clubs",
    BANK: host + api_version + "get/banks",
    AREA: host + api_version + "list/areas",
    SERVICES: host + api_version + "get/services",
    AREAS_UPDATE: host + api_version + "update/areas",
    ACCOUNT_LOGIN: host + api_version + "login",
    SCHOOL_CREATE: host + api_version + "create/school",
    SCHOOL_GET: host + api_version + "get/school",
    SCHOOL_GET_FEES: host + api_version + "get/school/fees",
    SCHOOL_UPDATE: host + api_version + "update/school",
    SCHOOL_LIST_PERMISSION: host + api_version + "list/permissions",
    SCHOOL_UPDATE_PERMISSION: host + api_version + "update/permissions",
    SCHOOL_SET_SETTINGS: host + api_version + "set/school/settings",
    PASSWORD_FORGOT: host + api_version + "password/forgot",
    PASSWORD_RESET: host + api_version + "password/reset",
    PASSWORD_CHANGE: host + api_version + "password/change",
    PASSWORD_CHANGE_EMPLOYEE: host + api_version + "password/change/employee",
    ACCOUNT_ACTIVATION: host + api_version + "activation",
    CREATE_EMPLOYEE: host + api_version + "create/employee",
    EMPLOYEE_DELETE: host + api_version + "delete/employee",
    EMPLOYEE_ACTIVATE: host + api_version + "active/employee",
    UPDATE_EMPLOYEE: host + api_version + "update/employee",
    LIST_EMPLOYEE: host + api_version + "list/employees",
    GET_EMPLOYEE_NAME: host + api_version + "list/employees/name",
    GET_EMPLOYEE: host + api_version + "get/employee",
    PLAYER_CREATE: host + api_version + "create/player",
    PLAYER_TRIAL_CREATE: host + api_version + "create/player/trial",
    PLAYER_DELETE: host + api_version + "delete/player",
    PLAYER_FREEZE: host + api_version + "freeze/player",
    PLAYER_REFRESH: host + api_version + "refresh/player",
    PLAYER_ACTIVATE: host + api_version + "active/player",
    PLAYER_LIST: host + api_version + "list/players",
    PLAYER_PARENTS: host + api_version + "get/player/parents",
    GET_PLAYER_NAME: host + api_version + "list/players/name",
    GET_PLAYER: host + api_version + "get/player",
    UPDATE_PLAYER: host + api_version + "update/player",
    UPDATE_PLAYERS: host + api_version + "update/players",
    LIST_GROUP: host + api_version + "list/groups",
    CREATE_GROUP: host + api_version + "create/group",
    UPDATE_GROUP: host + api_version + "update/group",
    GROUP_DELETE: host + api_version + "delete/group",
    GET_GROUP: host + api_version + "get/group",
    CHANGE_GROUP: host + api_version + "change/group",
    CHECK_PERMISSION: host + api_version + "check/permission",
    COMPLETE_ROLLCALL: host + api_version + "complete/rollcall",
    CREATE_ROLLCALL: host + api_version + "create/rollcall",
    CLOSE_ROLLCALL: host + api_version + "close/rollcall",
    LIST_ROLLCALL: host + api_version + "list/rollcalls",
    ROLLCALL_MAKE: host + api_version + "create/rollcall/",
    ROLLCALL_NOTE: host + api_version + "create/rollcall/",
    ROLLCALL_DELETE: host + api_version + "delete/rollcall/",
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
    BUDGET_UPDATE: host + api_version + "update/budget",
    BUDGET_TRANSFER: host + api_version + "transfer/budget",
    BUDGET_BALANCE_HISTORY: host + api_version + "budget/balance/history",
    SALARY_CREATE: host + api_version + "create/salary",
    SALARY_LIST: host + api_version + "list/employee/salaries",
    FEE_CREATE: host + api_version + "pay/player/fee",
    FEE_UPDATE: host + api_version + "update/player/fee",
    FEE_DELETE: host + api_version + "delete/player/fee",
    FEE_LIST: host + api_version + "list/player/fees",
    FEE_LIST_NEW: host + api_version + "list/player/fees/new",
    ACCOUNTING_CREATE: host + api_version + "create/accounting/record",
    ACCOUNTING_LIST: host + api_version + "list/accounting/records",
    ACCOUNTING_DETAIL: host + api_version + "get/accounting/record",
    ACCOUNTING_TYPE_LIST: host + api_version + "list/accounting/types",
    REPORT_CREATED_PLAYERS: host + api_version + "report/created/players",
    REPORT_BIRTHDAYS: host + api_version + "report/birthdays",
    REPORT_UNPAID_PLAYERS: host + api_version + "report/unpaid/players",
    REPORT_TRAINING_GROUPS: host + api_version + "report/training/groups",
    REPORT_MESSAGES_ALLTIME: host + api_version + "report/messages/alltime",
    PARENT_CREATE: host + api_version + "create/parent",
    PARENT_UPDATE: host + api_version + "update/parent",
    PARENT_LIST: host + api_version + "list/parents",
    PARENT_GET: host + api_version + "get/parent",
    PARENT_PLAYERS: host + api_version + "get/parent/players",
    START: host + api_version + "start",
    SESSION: host + api_version + "session",
    SESSION_LIST: host + api_version + "list/sessions",
    SESSION_DEACITVE: host + api_version + "deactive/session",
    RECIPIENT_CREATE: host + api_version + "create/recipient",
    MESSAGES_CREATE: host + api_version + "create/message",
    MESSAGES_SEND_TEST: host + api_version + "send/test/message",
    MESSAGES_LIST_PERSON_MESSAGES: host + api_version + "list/person/messages",
    MESSAGES_TEMPLATES_LIST: host + api_version + "list/message/templates",
    MESSAGES_TEMPLATES_CREATE: host + api_version + "create/message/template",
    MESSAGES_TEMPLATES_DETAIL: host + api_version + "get/message/template",
    MESSAGES_TEMPLATES_UPDATE: host + api_version + "update/message/template",
    MESSAGES_TEMPLATES_ACTIVATE: host + api_version + "set/active/message/templates",
    CAMPAIGN_CREATE: host + api_version + "create/campaign",
    CAMPAIGN_LIST: host + api_version + "list/campaigns",
    CAMPAIGN_CANCEL: host + api_version + "cancel/campaign",
    CAMPAIGN_DETAIL: host + api_version + "get/campaign",
    CAMPAIGN_STATUS_TOGGLE: host + api_version + "toggle/campaign/status",
    SEGMENTS_STATIC_LIST: host + api_version + "list/segments/static",
    SEGMENT_CREATE: host + api_version + "create/segment"
};

export default ep;
