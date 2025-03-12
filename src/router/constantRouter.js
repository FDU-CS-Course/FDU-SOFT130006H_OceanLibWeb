const login = () => import("../views/login.vue");
const reg = () => import("../views/reg.vue");
const homepage = () => import("../views/index/index/index.vue");
const index = () => import("../views/index/index/index.vue");
const wall = () => import("../views/wall/index/index.vue");
const preview = () => import("../views/index/preview/preview.vue");
const about = () => import("../views/function/about.vue");
const result = () => import("../views/function/result.vue");
const vip = () => import("../views/function/vip.vue");
const freePrint = () => import("../views/function/freePrint.vue");
const uploadFileStatement = () => import("../views/statement/uploadFileStatement.vue");

const constantRouterMap = [{
        path: '/login',
        meta: {
            title: '用户登录'
        },
        component: login
    },
    {
        path: '/reg',
        meta: {
            title: '用户注册'
        },
        component: reg
    },
    {
        path: '/',
        meta: {
            title: '主页',
        },
        component: homepage
    },
    {
        path: '/index',
        meta: {
            title: '主页',
        },
        component: index
    },
    {
        path: '/wall',
        meta: {
            title: '互助墙',
        },
        component: wall
    },
    {
        path: '/preview',
        meta: {
            title: '预览',
        },
        component: preview
    },
    {
        path: '/about',
        meta: {
            title: '关于',
        },
        component: about
    }, {
        path: '/result',
        meta: {
            title: '结果',
        },
        component: result
    }, {
        path: '/vip',
        meta: {
            title: 'VIP申请',
        },
        component: vip
    },
    {
        path: '/freePrint',
        meta: {
            title: '免费打印',
        },
        component: freePrint
    }, 
    {
        path: '/statement/uploadFileStatement',
        meta: {
            title: '文件上传须知',
        },
        component: uploadFileStatement
    }
];
export default constantRouterMap;