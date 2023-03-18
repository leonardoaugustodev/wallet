import colors from 'vuetify/es5/util/colors'
import i18n from './config/i18n'

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
        '~/plugins/yahoo.js',
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
        '@nuxtjs/i18n',
        '@nuxtjs/dotenv'
    ],
    
    i18n: {
        locales: [
            { code: 'pt_BR', name: 'Portuguese' },
            { code: 'en', name: 'English' },
        ],
        defaultLocale: 'en',
        vueI18n: i18n,
    },
    
    // Axios module configuration: https://go.nuxtjs.dev/config-axios
    axios: {
        // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
        baseURL: '/',
    },

    firebase: {
        config: {
            apiKey: process.env.FIREBASE_API_KEY,
            authDomain: process.env.FIREBASE_AUTH_DOMAIN,
            projectId: process.env.FIREBASE_PROJECT_ID,
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.FIREBASE_APP_ID,
            measurementId: process.env.FIREBASE_MEASUREMENT_ID,
        },
        services: {
            auth: {
                persistence: 'local',
                initialize: {
                    onAuthStateChangedAction: 'users/onAuthStateChanged',
                    subscribeManually: false,
                },
                ssr: false,
                emulatorPort: process.env.NODE_ENV === 'development' ? 9099 : undefined,
                emulatorHost: 'http://localhost',
                disableEmulatorWarnings: true,
            },
            firestore: {
                emulatorPort: process.env.NODE_ENV === 'development' ? 8080 : undefined,
                emulatorHost: 'localhost',
            },
            hosting: true,
            functions: {
                location: 'southamerica-east1',
                emulatorPort: process.env.NODE_ENV === 'development' ? 5001 : undefined,
                emulatorHost: 'http://127.0.0.1',
              }
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
                    primaryText: colors.deepOrange.base,
                },
            },
        },
    },

    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {},

    
}
