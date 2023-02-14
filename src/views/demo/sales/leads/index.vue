<template>
  <PageWrapper
    title="可展开表格"
    content="TableAction组件可配置stopButtonPropagation来阻止操作按钮的点击事件冒泡，以便配合Table组件的expandRowByClick"
  >
    <BasicTable @register="registerTable">
      <template #toolbar> </template>
      <template #expandedRowRender="{ record }">
        <BasicTable @register="registerTable2" />
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            stopButtonPropagation
            :actions="[
              {
                label: '删除',
                icon: 'ic:outline-delete-outline',
                onClick: handleDelete.bind(null, record),
              },
            ]"
            :dropDownActions="[
              {
                label: '启用',
                popConfirm: {
                  title: '是否启用？',
                  confirm: handleOpen.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { PageWrapper } from '/@/components/Page';
  import { getLeadesColumns, getLeades2Columns } from '/@/views/demo/table/tableData';

  import { demoListApi } from '/@/api/demo/table';

  export default defineComponent({
    components: { BasicTable, TableAction, PageWrapper },
    setup() {
      const [registerTable] = useTable({
        api: demoListApi,
        title: '可展开表格演示',
        titleHelpMessage: ['已启用expandRowByClick', '已启用stopButtonPropagation'],
        columns: getLeadesColumns(),
        rowKey: 'id',
        canResize: false,
        expandRowByClick: false,
        showTableSetting: true,
        actionColumn: {
          width: 160,
          title: 'Action',
          dataIndex: 'action',
          fixed: 'right',
          // slots: { customRender: 'action' },
        },
      });
      const [registerTable2] = useTable({
        api: demoListApi,
        title: '线索生命周期跟进记录',
        titleHelpMessage: ['包含销售跟进记录', '包含教务跟进记录', '包含老师反馈记录'],
        columns: getLeades2Columns(),
        rowKey: 'id',
        canResize: false,
        expandRowByClick: false,
        actionColumn: {
          width: 160,
          title: 'Action',
          dataIndex: 'action',
          fixed: 'right',
          // slots: { customRender: 'action' },
        },
      });
      function handleDelete(record: Recordable) {
        console.log('点击了删除', record);
      }
      function handleOpen(record: Recordable) {
        console.log('点击了启用', record);
      }

      return {
        registerTable,
        registerTable2,
        handleDelete,
        handleOpen,
      };
    },
  });
</script>
