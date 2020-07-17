export default {
  production:
    process.env.NODE_ENV === "production" &&
    process.env.VUE_APP_PREVIEW !== "true",

  // google auth options
  googleAuthOptions: {
    storageType: "cookieStorage",
    providers: {
      google: {
        requiredUrlParams: ["scope", "access_type", "prompt"],
        clientId: process.env.VUE_APP_GOOGLE_OAUTH_CLIENT_ID,
        redirectUri: process.env.VUE_APP_GOOGLE_OAUTH_REDIRECT_URI,
        accessType: "offline",
        prompt: "consent"
      }
    }
  },

  // vue-ls options
  storageOptions: {
    name: "ls", // name variable Vue.[ls] or this.[$ls],
    storage: "local" // storage name session, local, memory
  },

  // vue2filter options
  vue2filterOptions: {
    capitalize: {
      onlyFirstLetter: false
    },
    number: {
      format: "0",
      thousandsSeparator: ",",
      decimalSeparator: "."
    },
    bytes: {
      decimalDigits: 2
    },
    percent: {
      decimalDigits: 2,
      multiplier: 100
    },
    currency: {
      symbol: "$",
      decimalDigits: 2,
      thousandsSeparator: ",",
      decimalSeparator: ".",
      symbolOnLeft: true,
      spaceBetweenAmountAndSymbol: false,
      showPlusSign: false
    },
    pluralize: {
      includeNumber: false
    },
    ordinal: {
      includeNumber: false
    }
  },

  //notification
  notification: {
    placement: "bottomLeft",
    duration: 5
  }
};
