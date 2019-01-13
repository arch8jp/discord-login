import Vuex from "vuex";

const createStore = () => {
  return new Vuex.Store({
    state: () => ({
      user: null
    }),
    mutations: {
      loginAsUser(state, user) {
        state.user = user;
      }
    },
    actions: {
      async nuxtServerInit({ commit }, { req }) {
        console.log("init", req.session.user);
        if (req.session.user) {
          commit("loginAsUser", req.session.user);
        }
      },
      logout({ commit }) {
        this.$axios.$get("/logout");
        commit("loginAsUser", null);
      }
    }
  });
};

export default createStore;
