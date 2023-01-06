<template>
  <div class="p-4">
    <!-- <template v-if="canResize">
      <BasicTable
        @register="registerTable"
        @edit-end="handleEditEnd"
        @edit-cancel="handleEditCancel"
        :beforeEditSubmit="beforeEditSubmit"
        :striped="striped"
        :canResize="canResize"
        :bordered="border"
        showTableSetting
      >
        <template #toolbar>
          <a-button type="primary" @click="toggleCanResize">
            {{ !canResize ? '自适应高度' : '取消自适应' }}
          </a-button>
          <a-button type="primary" @click="toggleBorder">
            {{ !border ? '显示边框' : '隐藏边框' }}
          </a-button>
          <a-button type="primary" @click="toggleLoading"> 开启loading </a-button>
          <a-button type="primary" @click="toggleStriped">
            {{ !striped ? '显示斑马纹' : '隐藏斑马纹' }}
          </a-button>
        </template>
      </BasicTable>
    </template> -->
    <!-- <template v-else> -->
    <BasicTable @register="registerTable" @edit-change="onEditChange" showTableSetting>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction :actions="createActions(record, column)" />
        </template>
      </template>
      <template #toolbar>
        <a-button type="primary" @click="toggleCanResize">
          {{ !canResize ? '自适应高度' : '取消自适应' }}
        </a-button>
        <a-button type="primary" @click="toggleBorder">
          {{ !border ? '显示边框' : '隐藏边框' }}
        </a-button>
        <a-button type="primary" @click="toggleLoading"> 开启loading </a-button>
        <a-button type="primary" @click="toggleStriped">
          {{ !striped ? '显示斑马纹' : '隐藏斑马纹' }}
        </a-button>
      </template>
    </BasicTable>
    <!-- </template> -->
  </div>
</template>
<script lang="ts">
  import { defineComponent, h, ref } from 'vue';
  import {
    BasicTable,
    useTable,
    BasicColumn,
    ColumnChangeParam,
    EditRecordRow,
    ActionItem,
  } from '/@/components/Table';
  import { optionsListApi } from '/@/api/demo/select';
  import { cloneDeep } from 'lodash-es';
  import { demoListApi } from '/@/api/demo/table';
  import { treeOptionsListApi } from '/@/api/demo/tree';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Progress } from 'ant-design-vue';
  const columns: BasicColumn[] = [
    {
      title: '输入框',
      dataIndex: 'name',
      edit: true,
      editComponentProps: {
        prefix: '$',
      },
      width: 200,
    },
    {
      title: '默认输入状态',
      dataIndex: 'name7',
      edit: true,
      editable: true,
      width: 200,
    },
    {
      title: '输入框校验',
      dataIndex: 'name1',
      edit: true,
      // 默认必填校验
      editRule: true,
      width: 200,
    },
    {
      title: '输入框函数校验',
      dataIndex: 'name2',
      edit: true,
      editRule: async (text) => {
        if (text === '2') {
          return '不能输入该值';
        }
        return '';
      },
      width: 200,
    },
    {
      title: '数字输入框',
      dataIndex: 'id',
      edit: true,
      editRule: true,
      editComponent: 'InputNumber',
      width: 200,
      editComponentProps: () => {
        return {
          max: 100,
          min: 0,
        };
      },
      editRender: ({ text }) => {
        return h(Progress, { percent: Number(text) });
      },
    },
    {
      title: '下拉框',
      dataIndex: 'name3',
      edit: true,
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
        ],
      },
      width: 200,
    },
    {
      title: '远程下拉',
      dataIndex: 'name4',
      edit: true,
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
      edit: true,
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
      edit: true,
      editComponent: 'DatePicker',
      editComponentProps: {
        valueFormat: 'YYYY-MM-DD',
        format: 'YYYY-MM-DD',
      },
      width: 200,
    },
    {
      title: '时间选择',
      dataIndex: 'time',
      edit: true,
      editComponent: 'TimePicker',
      editComponentProps: {
        valueFormat: 'HH:mm',
        format: 'HH:mm',
      },
      width: 200,
    },
    {
      title: '勾选框',
      dataIndex: 'name5',
      edit: true,
      editComponent: 'Checkbox',
      editValueMap: (value) => {
        return value ? '是' : '否';
      },
      width: 200,
    },
    {
      title: '开关',
      dataIndex: 'name6',
      edit: true,
      editComponent: 'Switch',
      editValueMap: (value) => {
        return value ? '开' : '关';
      },
      width: 200,
    },
    {
      title: '单选框',
      dataIndex: 'radio1',
      edit: true,
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
      edit: true,
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
      edit: true,
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
    components: { BasicTable },
    setup() {
      const [registerTable] = useTable({
        title: '可编辑单元格示例',
        api: demoListApi,
        columns: columns,
        showIndexColumn: false,
        bordered: true,
        titleHelpMessage: [
          '本例中修改[数字输入框]这一列时，同一行的[远程下拉]列的当前编辑数据也会同步发生改变',
        ],
        showTableSetting: true,
        tableSetting: { fullScreen: true },
        actionColumn: {
          width: 160,
          title: 'Action',
          dataIndex: 'action',
          // slots: { customRender: 'action' },
        },
      });

      //const { createMessage } = useMessage();
      const { createMessage: msg } = useMessage();
      const canResize = ref(false);
      const loading = ref(false);
      const striped = ref(true);
      const border = ref(true);
      const currentEditKeyRef = ref('');
      const pagination = ref<any>(false);

      function handleEditEnd({ record, index, key, value }: Recordable) {
        console.log(record, index, key, value);
        return false;
      }

      // 模拟将指定数据保存
      function feakSave({ value, key, id }) {
        msg.loading({
          content: `正在模拟保存${key}`,
          key: '_save_fake_data',
          duration: 0,
        });
        return new Promise((resolve) => {
          setTimeout(() => {
            if (value === '') {
              msg.error({
                content: '保存失败：不能为空',
                key: '_save_fake_data',
                duration: 2,
              });
              resolve(false);
            } else {
              msg.success({
                content: `记录${id}的${key}已保存`,
                key: '_save_fake_data',
                duration: 2,
              });
              resolve(true);
            }
          }, 2000);
        });
      }

      async function beforeEditSubmit({ record, index, key, value }) {
        console.log('单元格数据正在准备提交', { record, index, key, value });
        return await feakSave({ id: record.id, key, value });
      }

      function handleEditCancel() {
        console.log('cancel');
      }

      function toggleCanResize() {
        canResize.value = !canResize.value;
        console.log(canResize.value);
      }
      function toggleStriped() {
        striped.value = !striped.value;
      }
      function toggleLoading() {
        loading.value = true;
        setTimeout(() => {
          loading.value = false;
          pagination.value = { pageSize: 20 };
        }, 3000);
      }
      function toggleBorder() {
        border.value = !border.value;
      }

      function handleColumnChange(data: ColumnChangeParam[]) {
        console.log('ColumnChanged', data);
      }

      function onEditChange({ column, value, record }) {
        // 本例
        if (column.dataIndex === 'id') {
          record.editValueRefs.name4.value = `${value}`;
        }
        console.log(column, value, record);
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

      return {
        registerTable,
        handleEditEnd,
        handleEditCancel,
        beforeEditSubmit,
        handleColumnChange,
        toggleBorder,
        toggleLoading,
        toggleStriped,
        toggleCanResize,
        canResize,
        loading,
        striped,
        border,
        onEditChange,
        createActions,
      };
    },
  });
</script>
