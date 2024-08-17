const Constants = {
    //pagination limit
    PAGINATE_LIMIT: 20,
    //Pagination param name on url
    PAGINATION_PARAM: 'page',
    //The key stores user information in local storage
    LOCAL_STORAGE_USER_LOGIN_KEY: '_ls_user_login_key',
    /** Default display language */
    DEFAULT_LANG: 'ja',
    //The error message key is defined to get the language from i18n
    ERROR_MESSAGE_KEY: 'message',
    METHOD: {
        POST: 'post',
        GET: 'get',
        DELETE: 'delete',
        PUT: 'put',
        POST_EXCEL: 'postexcel',
        POST_PDF: 'postpdf',
    },
    CONTENT_TYPE: {
        JSON: 'application/json',
        STRAEAM: 'application/octet-stream',
        EXCEL: 'application/vnd.ms-excel',
        PDF: 'application/pdf',
        MULTIPART: 'multipart/form-data',
    },
    ENCRYPT: {
        PUBLIC_KEY: 'f4e3572fa8b8e98a3e2c8f483acc3d138632b15c6ce93ccd5cc776c582af194d',
        INIT_VECTOR: 'qfCRQ-70SdldCBUF'
    },
    /**
     *  Define keys that get values from url
     */
    PARAM_KEY: {
        ID: 'id',
        SEGMENT_01: 'segment_01',
        SEGMENT_02: 'segment_02',
        SEGMENT_03: 'segment_03',
        SEGMENT_04: 'segment_04',
    },
    DATEPICKER_I18N: {
        'ja': {
            weekdays: [ '月', '火', '水', '木', '金', '土', '日' ],
            months: [ '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            weekLabel: '週'
        }
    },
    /**
     * Define keys when using asynchronous data flow using RxJS
     */
    SUBJECT_KEY: {
        MILTIPLE_DELETE: 'multiple_delete',
    },
    //App slug url
    APP_URL: {
        DASHBOARD: 'dashboard',
        AUTH: {
            MODULE: 'auth',
            LOGIN: 'login',
            FORGOT_PASSWORD: 'forgot-password',
            RESET_PASSWORD: 'reset-password',
        },
        USERS: {
            MODULE: 'users',
            CREATE: 'create',
            EDIT: 'edit',
            DETAIL: 'detail',
            USER_ACCOUNT: 'user-account'
        },
        MANAGEMENTS: {
            MODULE: 'managements',
            ROLE: 'role',
            DIVISIONS: 'divisions'
        },
        NOTICES: {
            MODULE: 'notices',
            DETAIL: 'detail',
            CREATE: 'create',
            MOBILE: 'notice_m'
        },
        NOTICE_COMMENTS: {
            MODULE: 'notice-comments',
        },
        DAILY_REPORT: {
            MODULE: 'daily-report',
            DETAIL: 'detail',
            CREATE: 'create'
        },
        INCIDENT_REPORT: {
            MODULE: 'incident-report',
            DETAIL: 'detail',
            CREATE: 'create'
        },
        CORRECTIVE_REPORT: {
            MODULE: 'corrective-report',
            DETAIL: 'detail',
            CREATE: 'create'
        },
        PREVENTION_REPORT: {
            MODULE: 'prevention-report',
            DETAIL: 'detail',
            CREATE: 'create'
        },
        TOPIC: {
            MODULE: 'topics'
        },
        GROUP: {
            MODULE: 'group',
            DETAIL: 'detail',
            CREATE: 'create'
        },
        IN_OPE_MANAGE: {
            MODULE: 'in-ope-manage',
            DETAIL: 'detail',
            CREATE: 'create'
        },
        CONSTRUCTION: {
            MODULE: 'construction',
            DETAIL: 'detail',
            CREATE: 'create'
        },
        ALARM_HISTORY: {
            MODULE: 'alarm-history',
        },
        DEMAND: {
            MODULE: 'demand',
            DETAIL: 'detail',
            CREATE: 'create',
            INTI: 'inti'
        },
        STANDARD_DOCUMENT: {
            MODULE: 'standard-document',
            DETAIL: 'detail',
            CREATE: 'create'
        },
        ANALYSIS: {
            MODULE: 'analysis',
            DETAIL: 'detail',
            CREATE: 'create'
        },
        INSPECTION_DATA: {
            MODULE: 'inspection-data',
            DETAIL: 'detail',
            CREATE: 'create'
        },
        CHANGE_ORDER: {
            MODULE: 'change-order',
            DETAIL: 'detail',
            CREATE: 'create'
        },
        TREND: {
            MODULE: 'trend',
            DETAIL: 'detail',
            CREATE: 'create'
        },
    },
    //API slug url
    API_URL: {
        USERS: {
            LOGIN: 'auth/login',
            LOGOUT: 'auth/logout',
            USER_INFO: 'users/user-info',
            SAVE_PROFILE: 'users/save-profile',
            ALL_LIST: 'users/all-list',
            LIST_BY_USER_IDS: 'users/list-user-ids',
            SAVE: 'users/save',
            RESET_PASSWORD: 'users/reset-password',
            DELETE: 'users/delete',
            USER_UNION_GROUP: 'users/user-union-group',
        },
        ROLES: {
            LIST: 'roles/list',
            SAVE: 'roles/save',
            DELETE: 'roles/delete',
            USER: 'roles/user',
        },
        OFFICES: {
            LIST: 'offices/list'
        },
        GROUPS: {
            LIST: 'groups/list',
            DELETE: 'groups/delete',
            SAVE: 'groups/save',
            CANCEL: 'groups/cancel',
            GROUP_INFO: 'groups/group-info',
            SEND_APPROVAL: 'groups/send-approval',
            APPROVAL: 'groups/approval',
            REJECT: 'groups/reject',
        },
        DIVISIONS: {
            LIST: 'divisions/list',
            DETAIL: 'divisions/detail',
            SAVE: 'divisions/save',
            DELETE: 'divisions/delete',
            STATUS_LIST: 'divisions/status-list',
            FILTER_COLUMN: 'divisions/filter-column',
            FILTER_SEARCH: 'divisions/filter-search',
            DROPDOWN: 'divisions/divisions-dropdown',
        },
        FUNCTIONS: {
            LIST: 'functions/list',
        },
        PAGES: {
            LIST: 'pages/list',
        },
        ITEMS: {
            LIST: 'items/list',
            DROPDOWN: 'items/items-dropdown',
            DETAIL: 'items/detail',
        },
        NOTICES: {
            LIST: 'notices/list',
            DETAIL: 'notices/detail',
            SAVE: 'notices/save',
            UPLOAD: 'notices/upload',
            DELETE_FILE: 'notices/delete-file',
            FILES: 'notices/files',
            FILTER_COLUMN: 'notices/filter-column'
        },
        NOTICES_COMMENTS: {
            LIST: 'notices-comments/list',
            DETAIL: 'notices-comments/detail',
            SAVE: 'notices-comments/save',
            UPDATE: 'notices-comments/update',
            DELETE: 'notices-comments/delete',
            UPLOAD: 'notices-comments/upload',
            DELETE_FILE: 'notices-comments/delete-file',
            FILES: 'notices-comments/files',
            REACTION: 'notices-comments/reaction',
        },
        TOPICS: {
            LIST: 'topics/list',
            DETAIL: 'topics/detail',
            SAVE: 'topics/save',
            UPLOAD: 'topics/upload',
            DELETE_FILE: 'topics/delete-file',
            FILTER_LIST: 'topics/filter-list',
            FILTER_COLUMN: 'topics/filter-column',
        },
        /**
         * Upload files
         */
        FILES: {
            CHUNK: 'files/chunk',
            SAVE: 'files/save',
            REMOVE: 'files/remove',
            DOWNLOAD: 'files/download'
        },
        CORRECTIVES: {
            LIST: 'correctives/list',
            DETAIL: 'correctives/detail',
            SAVE: 'correctives/save',
            FILTER_COLUMN: 'correctives/filter-column',
        },
        MALFUNCTIONS: {
            DROPDOWN: 'malfunctions/malfunctions-dropdown',
        }
    },
    ROLE: {
        READ_ROLE: 'read_role',
        NOTICE_ROLE: 'notice_role',
        UPDATE_ROLE: 'update_role',
        APPROVAL_ROLE: 'approval_role',
        MANAGER_ROLE: 'manager_role',
        TEAM_LEADER_ROLE: 'team_leader_role',
        CHIEF_ROLE: 'chief_role'
    },
    MAPBOX_URL: 'https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
    OPENWEATHERMAP_URL: 'https://tile.openweathermap.org/map/{id}/{z}/{x}/{y}.png?appid={accessToken}',
    HEAT_STROKE_STATUS: {
        WARNING: 27,
        DANGER: 32
    },
    DATE_TYPE: {
        HOUR: 1,
        DAY: 2,
        MONTH: 3
    },
    TOPIC_STATUS: {
        PRECAUTION: 1,
        CORRECTIVE: 2,
        MALFUNCTION: 3,
        DAILY_REPORT: 4
    },
    /**
     * debounceTime for subject/observable
     */
    DEBOUNCE_TIME: 200,
    /**
     * Division's status text
     */
    STATUS_TEXTS: {
        ON_PROCESS: "起票中", // Init/Create new/Edit
        SYNCHED: "周知中", // Synched
        CLOSE: "クローズ" // Closed
    },

    /**
     * Key file upload to backend
     * The same constants config in backend side
     */
    KEY_FILE_UPLOADS: "uploads[]"
};
export default Constants;
