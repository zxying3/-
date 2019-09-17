import Main from '@/components/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
         
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '/message',
    name: 'message',
    component: Main,
    meta: {
      hideInBread: true,
      hideInMenu: true
    },
    children: [
      {
        path: 'message_page',
        name: 'message_page',
        meta: {
          icon: 'md-notifications',
          title: '消息中心'
        },
        component: () => import('@/view/single-page/message/index.vue')
      }
    ]
  },
  {
    path: '/product_manager',
    name: 'product_manager',
    meta: {
      access: ['admin'],
      icon: 'logo-buffer',
      title: '产品管理',
    },
    component: Main,
    children: [
      {
        path: 'category',
        name: 'category',
        meta: {
          icon: 'md-arrow-dropdown-circle',
          title: '产品大类'
        },
        component: () => import('@/view/product-manager/category.vue')
      },
      {
        path: 'product',
        name: 'product',
        meta: {
          icon: 'ios-people',
          title: '产品子类'
        },
        component: () => import('@/view/product-manager/product.vue')
      }
    ]
  },
  {
    path: '/business_manager',
    name: 'business_manager',
    meta: {
      icon: 'md-menu',
      title: '收单管理'
    },
    component: Main,
    children: [
      {
        path: 'lbimages',
        name: 'lbimages',
        meta: {
          access: ['admin'],
          icon: 'ios-hammer',
          title: '轮播图'
        },
        component: () => import('@/view/business-manager/lbimages.vue')
      },
      {
        path: 'business_list',
        name: 'business_list',
        meta: {
          icon: 'md-funnel',
          title: '申请列表'
        },
        component: () => import('@/view/business-manager/business-list.vue')
      },
      {
        path: 'bank_list',
        name: 'bank_list',
        meta: {
          icon: 'md-funnel',
          title: '银行列表'
        },
        component: () => import('@/view/business-manager/bank-list.vue')
      }
    ]
  },
  {
    path: '/authen_manager',
    name: 'authen_manager',
    meta: {
      icon: 'md-git-branch',
      title: '认证管理'
    },
    component: Main,
    children: [
      {
        path: 'business_authen',
        name: 'business_authen',
        meta: {
          icon: 'md-funnel',
          title: '代理商认证'
        },
        component: () => import('@/view/authen-manager/business-authen.vue')
      },
      {
        path: 'agent_authen',
        name: 'agent_authen',
        meta: {
          icon: 'md-funnel',
          title: '商户认证'
        },
        component: () => import('@/view/authen-manager/agent-authen.vue')
      }    
    ]
  },
  {
    path: '/spread',
    name: 'spread',
    component: Main,
    meta: {
      hideInBread: true
    },
    children: [
      {
        path: 'spread_users',
        name: 'spread_users',
        meta: {
          icon: '_qq',
          title: '推广用户'
        },
        component: () => import('@/view/spread/spread-users.vue')
      }
    ]
  },
  {
    path: '/myCenter',
    name: 'myCenter',
    component: Main,
    meta: {
      hideInBread: true
    },
    children: [
      {
        path: 'my',
        name: 'my',
        meta: {
          icon: 'ios-bug',
          title: '个人中心'
        },
        component: () => import('@/view/myCenter/my.vue')
      }
    ]
  },
  {
    path: '/spread_set',
    name: 'spread_set',
    meta: {
      icon: 'md-add',
      title: '推广设置'
    },
    component: Main,
    children: [
      {
        path: 'my_set',
        name: 'my_set',
        meta: {
          icon: 'md-funnel',
          title: '个人设置'
        },
        component: () => import('@/view/spread-set/my-set.vue')
      },
      {
        path: 'people_set',
        name: 'people_set',
        meta: {
          icon: 'md-funnel',
          title: '受邀人设置'
        },
        component: () => import('@/view/spread-set/people-set.vue')
      }
    ]
  },
  {
    path: '/order_manager',
    name: 'order_manager',
    meta: {
      access: ['admin'],
      icon: 'md-cloud-upload',
      title: '订单管理'
    },
    component: Main,
    children: [
      {
        path: 'order-import',
        name: 'order-import',
        meta: {
          icon: 'md-add',
          title: '订单导入'
        },
        component: () => import('@/view/order-manager/order-import.vue')
      },
      {
        path: 'order',
        name: 'order',
        meta: {
          icon: 'md-funnel',
          title: '订单列表'
        },
        component: () => import('@/view/order-manager/order.vue')
      }
    ]
  },
  {
    path: '/system_set',
    name: 'system_set',
    meta: {
      icon: 'ios-navigate',
      title: '系统设置'
    },
    component: Main,
    children: [
      {
        path: 'home',
        name: 'home',
        meta: {
          icon: 'md-funnel',
          title: '首页'
        },
        component: () => import('@/view/system-set/home.vue')
      },
      {
        path: 'technology',
        name: 'technology',
        meta: {
          access: ['admin'],
          icon: 'md-funnel',
          title: '技术支持'
        },
        component: () => import('@/view/system-set/technology.vue')
      },
      {
        path: 'service',
        name: 'service',
        meta: {
          icon: 'md-funnel',
          title: '客服中心'
        },
        component: () => import('@/view/system-set/service.vue')
      },
      {
        path: 'about_us',
        name: 'about_us',
        meta: {
          icon: 'md-funnel',
          title: '关于我们'
        },
        component: () => import('@/view/system-set/about-us.vue')
      }
    ]
  },
  // {
  //   path: '/error_store',
  //   name: 'error_store',
  //   meta: {
  //     hideInBread: true
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'error_store_page',
  //       name: 'error_store_page',
  //       meta: {
  //         icon: 'ios-bug',
  //         title: '错误收集'
  //       },
  //       component: () => import('@/view/error-store/error-store.vue')
  //     }
  //   ]
  // },
  // {
  //   path: '/error_logger',
  //   name: 'error_logger',
  //   meta: {
  //     hideInBread: true,
  //     hideInMenu: true
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'error_logger_page',
  //       name: 'error_logger_page',
  //       meta: {
  //         icon: 'ios-bug',
  //         title: '错误收集'
  //       },
  //       component: () => import('@/view/single-page/error-logger.vue')
  //     }
  //   ]
  // },
  {
    path: '/argu',
    name: 'argu',
    meta: {
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: 'params/:id',
        name: 'params',
        meta: {
          icon: 'md-flower',
          title: route => `{{ params }}-${route.params.id}`,
          notCache: true,
          beforeCloseName: 'before_close_normal'
        },
        component: () => import('@/view/argu-page/params.vue')
      },
      {
        path: 'query',
        name: 'query',
        meta: {
          icon: 'md-flower',
          title: route => `{{ query }}-${route.query.id}`,
          notCache: true
        },
        component: () => import('@/view/argu-page/query.vue')
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
