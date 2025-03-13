import { reactive } from "vue";

export const state = reactive({
  userInfoArray: [],
});

export const action = {
  setUserInfoArray(newValue) {
    state.userInfoArray = newValue;
  },
  clearUserInfoArray() {
    state.userInfoArray = [];
  },
};
