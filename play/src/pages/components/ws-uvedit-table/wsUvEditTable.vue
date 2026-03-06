<template>
  <div>
    <vxe-grid v-bind="gridOptions" v-on="gridEvents"></vxe-grid>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { VxeGridProps, VxeGridListeners } from 'vxe-table'

interface RowVO {
  id: number
  name: string
  role: string
  sex: string
  num: number
  age: number
  address: string
}

const meanNum = (list: RowVO[], field: keyof RowVO) => {
  let count = 0
  list.forEach(item => {
    count += Number(item[field])
  })
  return `${count / list.length}`
}

const sumNum = (list: RowVO[], field: keyof RowVO) => {
  let count = 0
  list.forEach(item => {
    count += Number(item[field])
  })
  return `${count}`
}

const gridOptions = reactive<VxeGridProps<RowVO>>({
  border: true,
  height: 500,
  showOverflow: true,
  keepSource: true,
  showFooter: true,
  columnConfig: {
    resizable: true
  },
  editConfig: {
    mode: 'cell',
    trigger: 'dblclick',
    showStatus: true
  },
  areaConfig: {
    multiple: true // 是否启用多区域选取功能
  },
  mouseConfig: {
    area: true, // 是否开启区域选取
    extension: false
  },
  keyboardConfig: {
    arrowCursorLock: true, // 方向键光标锁，开启后处于非聚焦式编辑状态，将支持在编辑状态中通过方向键切换单元格。（切换为聚焦编辑状态，可以按 F2 键或者鼠标左键点击输入框，就可以用方向键左右移动输入框的光标）
    isClip: true, // 是否开启复制粘贴
    isArrow: true, // 是否开启方向键功能
    isShift: true, // 是否开启同时按住方向键以活动区域为起始，向指定方向扩展单元格区域
    isTab: true, // 是否开启 Tab 键功能
    isEnter: true, // 是否开启回车键功能
    isEdit: true, // 是否开启任意键进入编辑（功能键除外）
    isDel: true, // 是否开启删除键功能
    isEsc: true, // 是否开启Esc键关闭编辑功能
    isFNR: true, // 是否开启查找与替换
    isMerge: true // 是否启用合并
  },
  menuConfig: {
    header: {
      options: []
    },
    body: {
      options: [
        // 自行自定义 code 的功能，自己实现更灵活
        [
          { code: 'myCode', name: '自定义的菜单' }
        ],
        [
          { code: 'SYSTEM_PAGE_REFRESH', name: '重新加载 (F5)' },
          { code: 'SYSTEM_PAGE_BACK', name: '后退 (Alt+向左箭头)' },
          { code: 'SYSTEM_PAGE_FORWARD', name: '前进 (Alt+向右箭头)' }
        ],
        // 引入 plugin-menu 扩展插件之后可以直接使用以下内置 code，使用最简单
        [
          { code: 'CLEAR_CELL', name: '清除单元格值 (Del)' },
          { code: 'COPY_CELL', name: '页面内复制 (Ctrl+C)', prefixIcon: 'vxe-icon-copy' },
          { code: 'CUT_CELL', name: '页面内剪贴 (Ctrl+X)', prefixIcon: 'vxe-icon-cut' },
          { code: 'PASTE_CELL', name: '页面内粘贴 (Ctrl+V)', prefixIcon: 'vxe-icon-paste' }
        ],
        [
          { code: 'OPEN_FIND', name: '查找 (Ctrl+F)' },
          { code: 'OPEN_REPLACE', name: '替换 (Ctrl+H)' },
          { code: 'MERGE_OR_CLEAR', name: '合并/取消 (Ctrl+M)', prefixIcon: 'vxe-icon-merge-cells' }
        ],
        [
          {
            name: '插入单行数据',
            children: [
              { code: 'INSERT_AT_ROW', name: '插入单行' },
              { code: 'INSERT_NEXT_AT_ROW', name: '插入单行 next' },
              { code: 'INSERT_AT_EDIT_ROW', name: '插入单行并编辑' },
              { code: 'INSERT_NEXT_AT_EDIT_ROW', name: '插入单行 next 并编辑' }
            ]
          },
          {
            name: '插入多行数据',
            children: [
              { code: 'BATCH_INSERT_AT_ROW', name: '插入多行' },
              { code: 'BATCH_INSERT_NEXT_AT_ROW', name: '插入多行 next' },
              { code: 'BATCH_INSERT_AT_EDIT_ROW', name: '插入多行并编辑' },
              { code: 'BATCH_INSERT_NEXT_AT_EDIT_ROW', name: '插入多行 next 并编辑 ' }
            ]
          }
        ],
        [
          {
            name: '删除数据',
            children: [
              { code: 'DELETE_ROW', name: '删除行' },
              { code: 'DELETE_AREA_ROW', name: '删除选取范围内的行' },
            ]
          }
        ],
      ]
    },
    footer: {
      options: [
        []
      ]
    }
  },
  columns: [
    { type: 'seq', width: 60 },
    { field: 'name', title: 'name', sortable: true, editRender: { name: 'input' } },
    { field: 'role', title: 'Role', editRender: { name: 'input' } },
    {
      field: 'sex',
      title: 'sex',
      filters: [
        { label: 'Man', value: 'Man' },
        { label: 'Women', value: 'Women' }
      ],
      editRender: {
        name: 'input'
      }
    },
    { field: 'num', title: 'Num', sortable: true, editRender: { name: 'input' } },
    { field: 'age', title: 'age', sortable: true, editRender: { name: 'input' } },
    { field: 'address', title: 'Address', width: 300, editRender: { name: 'input' } }
  ],
  data: [
    { id: 10001, name: 'Test1', role: 'Develop', sex: 'Man', num: 23, age: 28, address: 'Shengzhen' },
    { id: 10002, name: 'Test2', role: 'Test', sex: 'Women', num: 23, age: 22, address: 'Guangzhou' },
    { id: 10003, name: 'Test3', role: 'PM', sex: 'Man', num: 23, age: 32, address: 'Shanghai' },
    { id: 10004, name: 'Test4', role: 'Designer', sex: 'Women', num: 456, age: 24, address: 'Shanghai' },
    { id: 10005, name: 'Test5', role: 'Designer', sex: 'Women', num: 0, age: 42, address: 'Guangzhou' },
    { id: 10006, name: 'Test6', role: 'Designer', sex: 'Man', num: 23, age: 38, address: 'Shengzhen' },
    { id: 10007, name: 'Test7', role: 'Test', sex: 'Women', num: 100, age: 24, address: 'Shengzhen' },
    { id: 10008, name: 'Test8', role: 'PM', sex: 'Man', num: 345, age: 34, address: 'Shanghai' },
    { id: 10009, name: 'Test9', role: 'Designer', sex: 'Man', num: 67, age: 52, address: 'Shanghai' },
    { id: 10010, name: 'Test10', role: 'Test', sex: 'Women', num: 23, age: 44, address: 'Guangzhou' },
    { id: 10011, name: 'Test11', role: 'Designer', sex: 'Man', num: 56, age: 52, address: 'Shanghai' },
    { id: 10012, name: 'Test12', role: 'Test', sex: 'Women', num: 23, age: 16, address: 'Guangzhou' }
  ],
  footerMethod ({ data, columns }) {
    const means: string[] = []
    const sums: string[] = []
    columns.forEach((column, columnIndex) => {
      if (columnIndex === 0) {
        means.push('平均')
        sums.push('和值')
      } else {
        let meanCell = '-'
        let sumCell = '-'
        switch (column.field) {
          case 'age':
          case 'num':
            meanCell = meanNum(data, column.field)
            sumCell = sumNum(data, column.field)
            break
        }
        means.push(meanCell)
        sums.push(sumCell)
      }
    })
    // 返回一个二维数组的表尾合计
    return [means, sums]
  }
})

const gridEvents = reactive<VxeGridListeners<RowVO>>({
  menuClick ({ menu }) {
    switch (menu.code) {
      case 'myCode':
        alert('自定义菜单')
        break
    }
  }
})
</script>