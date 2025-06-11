export default {
    pullUserNotifyList(self, successCallback = () => {}) {
        let userNotifyList = JSON.parse(localStorage.getItem("userNotifyList"));
        if (userNotifyList == null) {
            userNotifyList = {
                likeList: [],
                downloadAndScoreList: [],
                commentList: [],
                invitationList: [],
            }
        }
        else {
            userNotifyList.likeList = [];
            userNotifyList.downloadAndScoreList = [];
            userNotifyList.commentList = [];
            userNotifyList.invitationList = [];
        }
        let lastPullDate = localStorage.getItem("notifyLastPullDate");
        self.$Axios({
            method: 'get',
            url: '/notify/getLatestNotifications',
            params: {
                username: sessionStorage.getItem("username"),
                latestPullDate: lastPullDate,
            },
        }).then((response) => {
            let notifyList = response.data.msg;
            notifyList.forEach(element => {
                if (element.username !== element.notifyEntity.buildUsername) {
                    switch (element.notifyEntity.action) {
                        case "LIKE":
                        case "LIKE_COMMENT":
                            userNotifyList.likeList.push(element);
                            break;
                        case "DOWNLOAD":
                        case "SCORED":
                            userNotifyList.downloadAndScoreList.push(element);
                            break;
                        case "NEW_COMMENT":
                        case "NEW_REPLY":
                            userNotifyList.commentList.push(element);
                            break;
                        case "INVITATION":
                            userNotifyList.invitationList.push(element);
                            break;
                        default:
                            break;
                    }
                }
            });
            localStorage.setItem("userNotifyList", JSON.stringify(userNotifyList));
            localStorage.setItem("notifyLastPullDate", new Date().toLocaleString());
            self.$Axios({
                method: 'post',
                url: '/notify/readNotifications',
                params: {
                    username: sessionStorage.getItem("username"),
                    latestPullDate: lastPullDate
                }
            })
            successCallback();
        }).catch((e) => {
            console.log(e)
        });
    },
    getUserNotifyList() {
        return JSON.parse(localStorage.getItem("userNotifyList"));
    }
}