const mine = () => import("../views/mine/mine.vue");
const newCollection = () => import("../views/collection/newCollection.vue");
const uploadFile = () => import("../views/upload/uploadFile.vue");
const uploadInfo = () => import("../views/upload/uploadInfo.vue");
const myCollectionList = () => import("../views/collection/myCollectionList.vue");
const myCollectionItem = () => import("../views/collection/myCollectionItem.vue");
const myContent = () => import("../views/mine/myContent.vue");
const indexResult = () => import("../views/index/search/indexResult.vue");
const search = () => import("../views/index/search/search.vue");
const myRecentlyReadList = () => import("../views/mine/myRecentlyReadList.vue");
const myDownloadList = () => import("../views/mine/myDownloadList.vue");
const walletChangeRecordList = () => import("../views/mine/walletChangeRecordList.vue");
const notify = () => import("../views/notify/notify.vue");
const notifyLikeList = () => import("../views/notify/notifyLikeList.vue");

const asyncRouterMap = [{
        path: '/newCollection',
        meta: {
            title: '新建收藏夹',
            permission: ["USER", "ADMIN"]
        },
        component: newCollection
    },
    {
        path: '/mine',
        meta: {
            title: '我的',
            permission: ["USER", "ADMIN"]
        },
        component: mine
    },
    {
        path: '/uploadFile',
        meta: {
            title: '文件上传 - 选择文件',
            permission: ["USER", "ADMIN"]
        },
        component: uploadFile
    },
    {
        path: '/uploadInfo',
        meta: {
            title: '文件上传 - 补全信息',
            permission: ["USER", "ADMIN"]
        },
        component: uploadInfo
    },
    {
        path: '/myCollectionList',
        meta: {
            title: '我的收藏',
            permission: ["USER", "ADMIN"]
        },
        component: myCollectionList
    },
    {
        path: '/myCollectionItem',
        meta: {
            title: '我的收藏',
            permission: ["USER", "ADMIN"]
        },
        component: myCollectionItem
    },
    {
        path: '/myUpload',
        meta: {
            title: '我的贡献',
            permission: ["USER", "ADMIN"]
        },
        component: myContent
    },
    {
        path: '/indexResult',
        meta: {
            title: '索引结果',
            permission: ["USER", "ADMIN"]
        },
        component: indexResult
    },
    {
        path: '/search',
        meta: {
            title: '搜索结果',
            permission: ["USER", "ADMIN"]
        },
        component: search
    },
    {
        path: '/myRecentlyReadList',
        meta: {
            title: '最近浏览',
            permission: ["USER", "ADMIN"]
        },
        component: myRecentlyReadList
    },
    {
        path: '/myDownloadList',
        meta: {
            title: '最近下载',
            permission: ["USER", "ADMIN"]
        },
        component: myDownloadList
    },
    {
        path: '/walletChangeRecordList',
        meta: {
            title: '钱包变动',
            permission: ["USER", "ADMIN"]
        },
        component: walletChangeRecordList
    },
    {
        path: '/notify',
        meta: {
            title: '消息',
            permission: ["USER", "ADMIN"]
        },
        component: notify
    },
    {
        path: '/notifyLikeList',
        meta: {
            title: '赞同',
            permission: ["USER", "ADMIN"]
        },
        component: notifyLikeList
    },
];
export default asyncRouterMap;