// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.

// The list of file replacements can be found in `angular.json`.
export const environment = {
    production: true,
    default_lang: 'ja',
    api_url_mockup: 'https://foms.flex.com.vn/assets/mockup-data/',
    api_url: 'https://foms.flex.com.vn/webapi/index.php/api/v1/',
    api_request_timeout: 60000,
    /** Default toastr notification closing time */
    toastr_timeout: 6000,
    /**
     * Register API key at https://home.openweathermap.org/
     */
    weather: {
        api_path: 'https://api.openweathermap.org/data/2.5/weather?q=tokyo&appid=782c12afb1651cd2d126ec09c363438c&units=metric',
    },
    openweathermap_access_token: '782c12afb1651cd2d126ec09c363438c',
    mapbox_access_token: 'pk.eyJ1IjoicGhhbXRoYW5oZHV5OTciLCJhIjoiY2x2NHhsY2N2MGN6MDJpbjE5Z3NuNnVnbSJ9.04SdasWUt1GV1o4AMBM2dQ'
};
