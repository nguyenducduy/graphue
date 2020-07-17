const STORE_SETTINGS = storedSettings => {
  const settings = {};
  Object.keys(storedSettings).forEach(key => {
    const currentSettings: any = localStorage.getItem(`app.settings.${key}`);
    if (currentSettings !== null) {
      const item: any = JSON.parse(localStorage.getItem(`app.settings.${key}`));
      settings[key] = item === null ? storedSettings[key] : item;
    }
  });

  return settings;
};

const state: any = {
  ...STORE_SETTINGS({
    isMobileView: false,
    isTabletView: false,
    isMobileMenuOpen: false,
    isMenuCollapsed: true
  })
};

const mutations: any = {
  CHANGE_SETTING(state, payload) {
    window.localStorage.setItem(
      `app.settings.${payload.setting}`,
      payload.value
    );
    state[payload.setting] = payload.value;
  },
  SETUP_URL_SETTINGS(state, payload) {
    let queryParams: any = payload;
    let keys: any = false;

    if (payload.redirect) {
      const str = payload.redirect;
      const subs = str.substring(str.indexOf("?") + 1);
      if (str.indexOf("?") >= 0) {
        queryParams = JSON.parse(
          '{"' +
            decodeURI(subs)
              .replace(/"/g, '\\"')
              .replace(/&/g, '","')
              .replace(/=/g, '":"') +
            '"}'
        );
      }
    }

    delete queryParams["redirect"];
    keys = Object.keys(queryParams);

    if (keys.length) {
      keys.forEach(key => {
        if (key in state) {
          state[key] = queryParams[key] === "true";
        }
      });
    }
  }
};

const actions: any = {};

const getters: any = {
  isMenuCollapsed(state) {
    return state.isMenuCollapsed;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
