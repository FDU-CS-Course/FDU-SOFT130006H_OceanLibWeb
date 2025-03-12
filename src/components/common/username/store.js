import app from "@/App.vue";


export const state = app.observable({
    userInfoArray: [],
})

export const action = {
    setUserInfoArray(newValue) {
        state.userInfoArray = newValue
    },
    clearUserInfoArray() {
        state.userInfoArray = []
    }
}