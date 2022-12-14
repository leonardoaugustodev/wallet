import colors from 'vuetify/es5/util/colors'

export default {
    // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
    ssr: false,

    // Global page headers: https://go.nuxtjs.dev/config-head
    head: {
        titleTemplate: '%s - Wallet',
        title: 'Wallet',
        htmlAttrs: {
            lang: 'en',
        },
        meta: [
            { charset: 'utf-8' },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
            },
            { hid: 'description', name: 'description', content: '' },
            { name: 'format-detection', content: 'telephone=no' },
        ],
        link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },

    // Global CSS: https://go.nuxtjs.dev/config-css
    css: [],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [
        '~/plugins/notifier.js',
        '~/plugins/utils.js',
        '~/plugins/brapi.js',
        '~/plugins/calculator.js',
        { src: '~/plugins/apexchart.js', ssr: false },
    ],

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: true,

    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    buildModules: [
        // https://go.nuxtjs.dev/typescript
        '@nuxt/typescript-build',
        // https://go.nuxtjs.dev/vuetify
        '@nuxtjs/vuetify',
    ],

    // Modules: https://go.nuxtjs.dev/config-modules
    modules: [
        // https://go.nuxtjs.dev/axios
        '@nuxtjs/axios',
        '@nuxtjs/firebase',
    ],

    // Axios module configuration: https://go.nuxtjs.dev/config-axios
    axios: {
        // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
        baseURL: '/',
    },

    firebase: {
        config: {
            apiKey: 'AIzaSyCprcq0b0tQSM4LExW86Rx35CC3Lu0Sl9g',
            authDomain: 'walleet-a57a8.firebaseapp.com',
            projectId: 'walleet-a57a8',
            storageBucket: 'walleet-a57a8.appspot.com',
            messagingSenderId: '641828251067',
            appId: '1:641828251067:web:8c5d42856f92aa3eb7909e',
            measurementId: 'G-D4Q3P38XCK',
        },
        services: {
            auth: {
                persistence: 'local',
                initialize: {
                    onAuthStateChangedAction: 'users/onAuthStateChanged',
                    subscribeManually: false,
                },
                ssr: false,
                emulatorPort:
                    process.env.NODE_ENV === 'development' ? 9099 : undefined,
                emulatorHost: 'http://localhost',
                disableEmulatorWarnings: true,
            },
            firestore: {
                emulatorPort:
                    process.env.NODE_ENV === 'development' ? 8080 : undefined,
                emulatorHost: 'localhost',
            },
            hosting: true,
        },
    },

    // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
    vuetify: {
        customVariables: ['~/assets/variables.scss'],
        treeShake: true,
        theme: {
            dark: true,
            themes: {
                dark: {
                    primary: colors.deepPurple.base,
                    accent: colors.pink.lighten1,
                    secondary: colors.amber.darken3,
                    info: colors.teal.lighten1,
                    warning: colors.amber.base,
                    error: colors.deepOrange.accent4,
                    success: colors.green.accent4,
                    primaryText: colors.deepOrange.base
                },
            },
        },
    },

    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {},
}
