export default {
    pullUserNotifyList(self, successCallback = () => { }) {
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
        }).then(async (response) => {
            let notifyList = response.data.msg;
            for (const element of notifyList) {
                if (element.username !== element.notifyEntity.buildUsername) {
                    switch (element.notifyEntity.action) {
                        case "LIKE":
                        case "LIKE_COMMENT":
                            // 处理commentID，如果包含下划线则只取前面部分
                            let likeCommentID = element.notifyEntity.commentID;
                            if (likeCommentID && likeCommentID.includes('_')) {
                                likeCommentID = likeCommentID.split('_')[0];
                            }
                            await self.$Axios({
                                method: 'get',
                                url: '/comment/getCommentById',
                                params: {
                                    bindID: element.notifyEntity.targetID,
                                    mainType: 'DOCUMENT',
                                    commentID: likeCommentID
                                },
                            }).then((response) => {
                                userNotifyList.likeList.push({
                                    buildUsername: element.notifyEntity.buildUsername,
                                    action: element.notifyEntity.action,
                                    buildDate: element.notifyEntity.buildDate,
                                    comment: response.data.msg.commentContent.length > 20
                                        ? response.data.msg.commentContent.substring(0, 20) + '...'
                                        : response.data.msg.commentContent,
                                    isRead: element.isRead
                                });
                            })
                            break;
                        case "DOWNLOAD":
                        case "SCORED":
                            userNotifyList.downloadAndScoreList.push(element);
                            break;
                        case "NEW_COMMENT":
                        case "NEW_REPLY":
                            // 处理commentID，如果包含下划线则只取前面部分
                            let replyCommentID = element.notifyEntity.commentID;
                            if (replyCommentID && replyCommentID.includes('_')) {
                                replyCommentID = replyCommentID.split('_')[0];
                            }
                            // 获取原评论内容
                            await self.$Axios({
                                method: 'get',
                                url: '/comment/getCommentById',
                                params: {
                                    bindID: element.notifyEntity.targetID,
                                    mainType: 'DOCUMENT',
                                    commentID: replyCommentID
                                },
                            }).then((response) => {
                                let originalComment = '';
                                let replyContent = element.notifyEntity.content;

                                if (response.data.msg) {
                                    // 获取原评论内容
                                    originalComment = response.data.msg.commentContent;
                                }

                                userNotifyList.commentList.push({
                                    buildUsername: element.notifyEntity.buildUsername,
                                    action: element.notifyEntity.action,
                                    buildDate: element.notifyEntity.buildDate,
                                    originalComment: originalComment.length > 20
                                        ? originalComment.substring(0, 20) + '...'
                                        : originalComment,
                                    replyContent: replyContent.length > 100
                                        ? replyContent.substring(0, 100) + '...'
                                        : replyContent,
                                    isRead: element.isRead
                                });
                            }).catch((error) => {
                                console.log('获取评论内容失败:', error);
                                // 如果获取失败，仍然推送通知但不显示原评论内容
                                userNotifyList.commentList.push({
                                    buildUsername: element.notifyEntity.buildUsername,
                                    action: element.notifyEntity.action,
                                    buildDate: element.notifyEntity.buildDate,
                                    originalComment: '',
                                    replyContent: element.notifyEntity.content.length > 100
                                        ? element.notifyEntity.content.substring(0, 100) + '...'
                                        : element.notifyEntity.content,
                                    isRead: element.isRead
                                });
                            });
                            break;
                        case "INVITATION":
                            userNotifyList.invitationList.push(element);
                            break;
                        default:
                            break;
                    }
                }
            }
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