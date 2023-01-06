<template>
  <div class="p-4">
    <BasicTable
      @register="registerTable"
      @edit-change="onEditChange"
      :striped="striped"
      :canResize="canResize"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction :actions="createActions(record, column)" />
        </template>
      </template>
      <template #toolbar>
        <a-button type="primary" @click="expandAll">展开全部</a-button>
        <a-button type="primary" @click="collapseAll">折叠全部</a-button>
        <a-button type="primary" @click="toggleAction">
          {{ !displayAction ? '显示Action' : '隐藏Action' }}
        </a-button>
        <a-button type="primary" @click="toggleCanResize">
          {{ !canResize ? '自适应高度' : '取消自适应' }}
        </a-button>
        <a-button type="primary" @click="toggleStriped">
          {{ !striped ? '显示斑马纹' : '隐藏斑马纹' }}
        </a-button>
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import {
    BasicTable,
    useTable,
    TableAction,
    BasicColumn,
    ActionItem,
    EditRecordRow,
  } from '/@/components/Table';
  import { optionsListApi } from '/@/api/demo/select';
  import { getBasicColumns, getTreeTableData } from '/@/views/demo/table/tableData';
  import { demoListApi } from '/@/api/demo/table';
  import { treeOptionsListApi } from '/@/api/demo/tree';
  import { cloneDeep } from 'lodash-es';
  import { useMessage } from '/@/hooks/web/useMessage';

  const columns: BasicColumn[] = [
    {
      title: '输入框',
      dataIndex: 'name',
      editRow: true,
      editComponentProps: {
        prefix: '$',
      },
      width: 150,
    },
    {
      title: '默认输入状态',
      dataIndex: 'name7',
      editRow: true,
      width: 150,
    },
    {
      title: '输入框校验',
      dataIndex: 'name1',
      editRow: true,
      align: 'left',
      // 默认必填校验
      editRule: true,
      width: 150,
    },
    {
      title: '输入框函数校验',
      dataIndex: 'name2',
      editRow: true,
      align: 'right',
      editRule: async (text) => {
        if (text === '2') {
          return '不能输入该值';
        }
        return '';
      },
    },
    {
      title: '数字输入框',
      dataIndex: 'id',
      editRow: true,
      editRule: true,
      editComponent: 'InputNumber',
      width: 150,
    },
    {
      title: '下拉框',
      dataIndex: 'name3',
      editRow: true,
      editComponent: 'Select',
      editComponentProps: {
        options: [
          {
            label: 'Option1',
            value: '1',
          },
          {
            label: 'Option2',
            value: '2',
          },
          {
            label: 'Option3',
            value: '3',
          },
        ],
      },
      width: 200,
    },
    {
      title: '远程下拉',
      dataIndex: 'name4',
      editRow: true,
      editComponent: 'ApiSelect',
      editComponentProps: {
        api: optionsListApi,
        resultField: 'list',
        labelField: 'name',
        valueField: 'id',
      },
      width: 200,
    },
    {
      title: '远程下拉树',
      dataIndex: 'name8',
      editRow: true,
      editComponent: 'ApiTreeSelect',
      editRule: false,
      editComponentProps: {
        api: treeOptionsListApi,
        resultField: 'list',
      },
      width: 200,
    },
    {
      title: '日期选择',
      dataIndex: 'date',
      editRow: true,
      editComponent: 'DatePicker',
      editComponentProps: {
        valueFormat: 'YYYY-MM-DD',
        format: 'YYYY-MM-DD',
      },
      width: 150,
    },
    {
      title: '时间选择',
      dataIndex: 'time',
      editRow: true,
      editComponent: 'TimePicker',
      editComponentProps: {
        valueFormat: 'HH:mm',
        format: 'HH:mm',
      },
      width: 100,
    },
    {
      title: '勾选框',
      dataIndex: 'name5',
      editRow: true,

      editComponent: 'Checkbox',
      editValueMap: (value) => {
        return value ? '是' : '否';
      },
      width: 100,
    },
    {
      title: '开关',
      dataIndex: 'name6',
      editRow: true,
      editComponent: 'Switch',
      editValueMap: (value) => {
        return value ? '开' : '关';
      },
      width: 100,
    },
    {
      title: '单选框',
      dataIndex: 'radio1',
      editRow: true,
      editComponent: 'RadioGroup',
      editComponentProps: {
        options: [
          {
            label: '选项1',
            value: '1',
          },
          {
            label: '选项2',
            value: '2',
          },
        ],
      },
      width: 200,
    },
    {
      title: '单选按钮框',
      dataIndex: 'radio2',
      editRow: true,
      editComponent: 'RadioButtonGroup',
      editComponentProps: {
        options: [
          {
            label: '选项1',
            value: '1',
          },
          {
            label: '选项2',
            value: '2',
          },
        ],
      },
      width: 200,
    },
    {
      title: '远程单选框',
      dataIndex: 'radio3',
      editRow: true,
      editComponent: 'ApiRadioGroup',
      editComponentProps: {
        api: optionsListApi,
        resultField: 'list',
        labelField: 'name',
        valueField: 'id',
      },
      width: 200,
    },
  ];
  export default defineComponent({
    components: { BasicTable, TableAction },
    setup() {
      const canResize = ref(false);
      const striped = ref(true);
      const displayAction = ref(true);
      const { createMessage: msg } = useMessage();
      const currentEditKeyRef = ref('');
      const [registerTable, { expandAll, collapseAll }] = useTable({
        title: '可编辑行示例',
        titleHelpMessage: [
          '本例中修改[数字输入框]这一列时，同一行的[远程下拉]列的当前编辑数据也会同步发生改变',
        ],
        api: demoListApi,
        columns: columns,
        showIndexColumn: false,
        showTableSetting: true,
        tableSetting: { fullScreen: true },
        actionColumn: {
          width: 160,
          title: 'Action',
          dataIndex: 'action',
          // slots: { customRender: 'action' },
        },
        isTreeTable: true,
        dataSource: getTreeTableData(),
        rowKey: 'id',
        // columns: getBasicColumns(),
        // rowSelection: {
        //   type: 'checkbox',
        //   getCheckboxProps(record: Recordable) {
        //     // Demo: 第一行（id为0）的选择框禁用
        //     if (record.id === '0') {
        //       return { disabled: true };
        //     } else {
        //       return { disabled: false };
        //     }
        //   },
        // },
      });

      function toggleCanResize() {
        canResize.value = !canResize.value;
      }
      function toggleStriped() {
        striped.value = !striped.value;
      }
      function toggleAction() {
        displayAction.value = !displayAction.value;
      }

      function handleEdit(record: EditRecordRow) {
        currentEditKeyRef.value = record.key;
        record.onEdit?.(true);
      }

      function handleCancel(record: EditRecordRow) {
        currentEditKeyRef.value = '';
        record.onEdit?.(false, false);
      }

      async function handleSave(record: EditRecordRow) {
        // 校验
        msg.loading({ content: '正在保存...', duration: 0, key: 'saving' });
        const valid = await record.onValid?.();
        if (valid) {
          try {
            const data = cloneDeep(record.editValueRefs);
            console.log(data);
            //TODO 此处将数据提交给服务器保存
            // ...
            // 保存之后提交编辑状态
            const pass = await record.onEdit?.(false, true);
            if (pass) {
              currentEditKeyRef.value = '';
            }
            msg.success({ content: '数据已保存', key: 'saving' });
          } catch (error) {
            msg.error({ content: '保存失败', key: 'saving' });
          }
        } else {
          msg.error({ content: '请填写正确的数据', key: 'saving' });
        }
      }

      function createActions(record: EditRecordRow, column: BasicColumn): ActionItem[] {
        if (!record.editable) {
          return [
            {
              label: '编辑',
              disabled: currentEditKeyRef.value ? currentEditKeyRef.value !== record.key : false,
              onClick: handleEdit.bind(null, record),
            },
          ];
        }
        return [
          {
            label: '保存',
            onClick: handleSave.bind(null, record, column),
          },
          {
            label: '取消',
            popConfirm: {
              title: '是否取消编辑',
              confirm: handleCancel.bind(null, record, column),
            },
          },
        ];
      }

      function onEditChange({ column, value, record }) {
        // 本例
        if (column.dataIndex === 'id') {
          record.editValueRefs.name4.value = `${value}`;
        }
        console.log(column, value, record);
      }

      return {
        registerTable,
        handleEdit,
        createActions,
        onEditChange,
        canResize,
        striped,
        displayAction,
        toggleStriped,
        toggleCanResize,
        toggleAction,
        expandAll,
        collapseAll,
      };
    },
  });
</script>
