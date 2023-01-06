import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const sales: AppRouteModule = {
  path: '/sales',
  name: 'sales',
  component: LAYOUT,
  redirect: '/sales/leads',
  meta: {
    orderNo: 11,
    icon: 'ion:settings-outline',
    title: t('routes.demo.sales.sales'),
  },
  children: [
    {
      path: 'leads/:id',
      name: 'Leads',
      meta: {
        title: t('routes.demo.sales.leads'),
        ignoreKeepAlive: false,
      },
      component: () => import('/@/views/demo/sales/leads/index.vue'),
    },
    {
      path: 'order/:id',
      name: 'Order',
      meta: {
        title: t('routes.demo.sales.order'),
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/demo/sales/order/index.vue'),
    },
  ],
};

export default sales;
