<template>
  <div>
    <!-- 正常区域的框 -->
    <div class="vxe-table--cell-area" ref="cellarea">
      <span class="vxe-table--cell-main-area"></span>
      <span class="vxe-table--cell-active-area"></span>
    </div>
    <!-- 左边fixed区域的框 -->
    <div class="vxe-table--cell-area" ref="fixedcellarea">
      <span class="vxe-table--cell-main-area"></span>
      <span class="vxe-table--cell-active-area"></span>
    </div>

    <vxe-grid
        ref="xGrid"
        v-bind="gridOptions"
        height="400px"
        @cell-click="tableCellClick"
        @keydown="tableKeydown"
        @toolbar-button-click="toolbarButtonClickEvent"
    />
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted, nextTick} from 'vue'
import type {VxeGridInstance, VxeGridProps} from 'vxe-table'

// 类型定义
interface CellPosition {
  rowIndex: number
  cellIndex: number
}

interface GridDataItem {
  id: number
  name: string
  age: number
  sex: string
  job: string
  address: string
  _X_ROW_KEY?: string
}

// 复制文本到剪贴板
const copyToClipboard = (text: string): void => {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text)
  } else {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    document.execCommand('copy')
    textArea.remove()
  }
}

// DOM 元素引用
const cellarea = ref<HTMLElement>()
const fixedcellarea = ref<HTMLElement>()
const xGrid = ref<VxeGridInstance>()

// 表格配置
const gridOptions = reactive<VxeGridProps>({
  keyboardConfig: {
    isArrow: true,
  },
  toolbarConfig: {
    perfect: true,
    enabled: true,
    size: "mini",
    buttons: [
      {
        code: 'getcellselctdata', type: "text", name: '获取选中数据(结果看控制台)'
      }
    ],
  },
  columnConfig: {resizable: true, useKey: true},
  border: "full",
  stripe: true,
  editConfig: {
    trigger: 'dblclick',
    mode: 'cell',
    showStatus: true
  },
  menuConfig: {
    header: {
      options: [
        // 引入 plugin-menu 扩展插件之后可以直接使用以下内置 code，使用最简单
        [
          { code: 'COPY_TITLE', name: '复制列标题' },
          { code: 'EXPORT_ALL', name: '导出 CSV', prefixIcon: 'vxe-icon-download', params: { filename: '导出数据', type: 'csv' } }
        ]
      ]
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
              { code: 'DELETE_CHECKBOX_ROW', name: '删除复选框勾选行' }
            ]
          }
        ],
        [
          { code: 'EDIT_CELL', name: '编辑' },
          { code: 'REVERT_CELL', name: '还原值', prefixIcon: 'vxe-icon-repeat' }
        ],
        [
          { code: 'CLEAR_FILTER', name: '清除筛选' },
          { code: 'CLEAR_ALL_FILTER', name: '清除所有筛选' },
          {
            name: '排序',
            children: [
              { code: 'CLEAR_SORT', name: '清除排序' },
              { code: 'SORT_ASC', name: '升序', prefixIcon: 'vxe-icon-sort-alpha-asc' },
              { code: 'SORT_DESC', name: '倒序', prefixIcon: 'vxe-icon-sort-alpha-desc' }
            ]
          }
        ],
        [
          {
            name: '单元格选取',
            children: [
              { code: 'SELECT_ALL_AREA', name: '全部选中 (Ctrl+A)' },
              { code: 'SELECT_AREA_TO_LEFT', name: '选中到左侧 (Ctrl+Shift+←)' },
              { code: 'SELECT_AREA_TO_RIGHT', name: '选中到右侧 (Ctrl+Shift+→)' },
              { code: 'SELECT_AREA_TO_TOP', name: '选中到顶部 (Ctrl+Shift+↑)' },
              { code: 'SELECT_AREA_TO_BOTTON', name: '选中到底部 (Ctrl+Shift+↓)' }
            ]
          }
        ],
        // 引入 plugin-menu 扩展插件之后可以直接使用以下内置 code，使用最简单
        [
          { code: 'PRINT_ALL', name: '打印', prefixIcon: 'vxe-icon-print', params: { columns: ['name', 'role', 'sex', 'num', 'age'] } },
          { code: 'EXPORT_ALL', name: '导出 CSV', prefixIcon: 'vxe-icon-download', params: { filename: '导出数据', type: 'csv' } }
        ]
      ]
    },
    footer: {
      options: [
        [
          { code: 'PRINT_ALL', name: '打印', prefixIcon: 'vxe-icon-print', params: { columns: ['name', 'role', 'sex', 'num', 'age'] } }
        ]
      ]
    }
  },
  columns: [
    {minWidth: 70, field: "id", title: "#", align: "left"},
    {minWidth: 100, field: "name", title: "姓名", align: "left",editRender: { name: 'input' }},
    {minWidth: 100, field: "age", title: "年龄", align: "left",editRender: { name: 'input' }},
    {minWidth: 100, field: "sex", title: "性别", align: "left",editRender: { name: 'input' }},
    {minWidth: 100, field: "job", title: "岗位", align: "left",editRender: { name: 'input' }},
    {minWidth: 270, field: "address", title: "地址", align: "left",editRender: { name: 'input' }},
    {minWidth: 70, field: "id", title: "#", align: "left"},
    {minWidth: 100, field: "name", title: "姓名", align: "left",editRender: { name: 'input' }},
    {minWidth: 100, field: "age", title: "年龄", align: "left",editRender: { name: 'input' }},
    {minWidth: 100, field: "sex", title: "性别", align: "left",editRender: { name: 'input' }},
    {minWidth: 100, field: "job", title: "岗位", align: "left",editRender: { name: 'input' }},
    {minWidth: 270, field: "address", title: "地址", align: "left",editRender: { name: 'input' }},
    {minWidth: 70, field: "id", title: "#", align: "left"},
    {minWidth: 100, field: "name", title: "姓名", align: "left",editRender: { name: 'input' }},
    {minWidth: 100, field: "age", title: "年龄", align: "left",editRender: { name: 'input' }},
    {minWidth: 100, field: "sex", title: "性别", align: "left",editRender: { name: 'input' }},
    {minWidth: 100, field: "job", title: "岗位", align: "left",editRender: { name: 'input' }},
    {minWidth: 270, field: "address", title: "地址", align: "left",editRender: { name: 'input' }},
  ],
  data: [
    {id: 1, name: "张三", age: 30, sex: "男", job: "前端", address: "中国xxxxxxxxxx"},
    {id: 2, name: "李四", age: 30, sex: "男", job: "后端", address: "中国xxxxxxxxxx"},
    {id: 3, name: "王五", age: 30, sex: "女", job: "运维", address: "中国xxxxxxxxxx"},
    {id: 4, name: "赵六", age: 30, sex: "男", job: "美工", address: "中国xxxxxxxxxx"},
    {id: 5, name: "老八", age: 30, sex: "男", job: "项目经理", address: "中国xxxxxxxxxx"},
    {id: 6, name: "桀桀", age: 30, sex: "女", job: "售后", address: "中国xxxxxxxxxx"},
  ] as GridDataItem[],
  showOverflow: true,
  rowConfig: {isCurrent: true, height: 35, isHover: true},
})

// 状态变量
const isSelecting = ref<boolean>(false)
const selectionStart = ref<CellPosition>({rowIndex: -1, cellIndex: -1})
const selectionEnd = ref<CellPosition>({rowIndex: -1, cellIndex: -1})
const lastActive = ref<{ rowid: string; colid: string } | null>(null)

// 获取表格实例的便捷方法
const getTablexGrid = (): VxeGridInstance => {
  return xGrid.value as VxeGridInstance
}

// 添加事件监听
const addListener = (): void => {
  nextTick(() => {
    const table = getTablexGrid()
    const tbody = table.$el.querySelector(".vxe-table--main-wrapper table tbody")
    if (tbody) {
      tbody.addEventListener("mousedown", tbodymousedown)
      tbody.addEventListener("mouseup", tbodymouseup)
      tbody.addEventListener("mousemove", tbodymousemove)
      tbody.addEventListener("paste", tbodykeydown as (event: ClipboardEvent) => void)
    }

    const bodyWrapper = table.$el.querySelector(".vxe-table--main-wrapper .vxe-table--body-wrapper")
    if (bodyWrapper && cellarea.value) {
      bodyWrapper.appendChild(cellarea.value)
      bodyWrapper.addEventListener("scroll", () => {
        if (isSelecting.value) {
          setselectedCellArea(); // 滚动时重新绘制选中区域
        }
      });
    }

    setTimeout(() => {
      const fixedtbody = table.$el.querySelector(".vxe-table--fixed-wrapper table tbody")
      if (fixedtbody) {
        fixedtbody.addEventListener("mousedown", tbodymousedown)
        fixedtbody.addEventListener("mouseup", tbodymouseup)
        fixedtbody.addEventListener("mousemove", tbodymousemove)
        fixedtbody.addEventListener("paste", tbodykeydown as (event: ClipboardEvent) => void)
      }

      const fixedBodyWrapper = table.$el.querySelector(".vxe-table--fixed-wrapper .vxe-table--body-wrapper")
      if (fixedBodyWrapper && fixedcellarea.value) {
        fixedBodyWrapper.appendChild(fixedcellarea.value)
      }
    })
  })
}

// 鼠标按下事件
const tbodymousedown = (event: MouseEvent): void => {
  if (event.button === 0) {
    selectionStart.value = getCellPosition(event.target as HTMLElement)
    isSelecting.value = true
  }
}

// 鼠标移动事件
const tbodymousemove = (event: MouseEvent): void => {
  if (event.button === 0 && isSelecting.value) {
    selectionEnd.value = getCellPosition(event.target as HTMLElement)
    setselectedCellArea()

    const x = event.clientX
    const table = getTablexGrid().$el.querySelector(".vxe-table--body-wrapper table")
    if (table) {
      const tableRect = table.parentElement!.getBoundingClientRect()
      if (x > tableRect.right - 20) {
        table.parentElement!.scrollLeft += 20
      }
    }
  }
}

// 鼠标松开事件
const tbodymouseup = (event: MouseEvent): void => {
  if (event.button === 0) {
    isSelecting.value = false
  }
}

// 获取单元格位置
const getCellPosition = (cell: HTMLElement): CellPosition => {
  try {
    while (cell.tagName !== 'TD') {
      cell = cell.parentElement as HTMLElement
    }

    const table = getTablexGrid()
    const visibleColumn = (table.getTableColumn() as any).visibleColumn
    const cellIndex = visibleColumn.findIndex((col: any) => {
      return col.id === cell.getAttribute("colid")
    })

    const visibleData = (table.getTableData() as any).visibleData
    const rowIndex = visibleData.findIndex((row: any) => {
      return row._X_ROW_KEY === cell.parentElement?.getAttribute("rowid")
    })

    return {rowIndex, cellIndex}
  } catch {
    return {rowIndex: -1, cellIndex: -1}
  }
}

// 设置选中区域
const setselectedCellArea = (): void => {
  try {
    const startRowIndex = selectionStart.value.rowIndex
    const endRowIndex = selectionEnd.value.rowIndex
    const startColumnIndex = selectionStart.value.cellIndex
    const endColumnIndex = selectionEnd.value.cellIndex

    const {width, height, left, top} = getAreaBoxPostion()

    const activeElement = getTablexGrid().$el.querySelector(".vxe-table--main-wrapper .vxe-table--body-wrapper .vxe-table--cell-active-area") as HTMLElement
    const mainElement = getTablexGrid().$el.querySelector(".vxe-table--main-wrapper .vxe-table--body-wrapper .vxe-table--cell-main-area") as HTMLElement
    const fixedActiveElement = getTablexGrid().$el.querySelector(".vxe-table--fixed-wrapper .vxe-table--body-wrapper .vxe-table--cell-active-area") as HTMLElement
    const fixedMainElement = getTablexGrid().$el.querySelector(".vxe-table--fixed-wrapper .vxe-table--body-wrapper .vxe-table--cell-main-area") as HTMLElement

    let fixedWidth = 0
    const flexDiv = getTablexGrid().$el.querySelector(".vxe-table--fixed-left-wrapper") as HTMLElement
    if (flexDiv) {
      fixedWidth = flexDiv.offsetWidth
    }
    // 修正左侧坐标，减去固定列宽度
    const correctedLeft = left - fixedWidth;
    const elements = [activeElement, mainElement, fixedActiveElement, fixedMainElement]
    elements.forEach((element) => {
      if (element) {
        element.style.width = `${width}px`
        element.style.height = `${height}px`
        element.style.top = `${top}px`
        element.style.left = `${correctedLeft}px`
        element.style.display = "block"
      }
    })

    openAreaBox()
    selectionStart.value = {cellIndex: startColumnIndex, rowIndex: startRowIndex}
    selectionEnd.value = {cellIndex: endColumnIndex, rowIndex: endRowIndex}
  } catch (error) {
    console.error(error)
  }
}

// 计算选中区域的位置和大小
const getAreaBoxPostion = (): { width: number; height: number; left: number; top: number } => {
  let startRowIndex = selectionStart.value.rowIndex
  let endRowIndex = selectionEnd.value.rowIndex
  let startColumnIndex = selectionStart.value.cellIndex
  let endColumnIndex = selectionEnd.value.cellIndex

  const table = getTablexGrid()
  const visibleColumn = (table.getTableColumn() as any).visibleColumn
  const visibleData = (table.getTableData() as any).visibleData

  if (startColumnIndex < 0 || endColumnIndex < 0 || startRowIndex < 0 || endRowIndex < 0) {
    return {width: 0, height: 0, left: 0, top: 0}
  }

  const maxColumnIndex = visibleColumn.length - 1
  const maxRowIndex = visibleData.length - 1

  if (endColumnIndex > maxColumnIndex) {
    endColumnIndex = maxColumnIndex
  }
  if (endRowIndex > maxRowIndex) {
    endRowIndex = maxRowIndex
  }

  let width = 0, height = 0, left = 0, top = 0

  visibleColumn.forEach((col: any, index: number) => {
    if (index < startColumnIndex) {
      left += (table.getColumnWidth as any)(col)
    }
    if (index <= endColumnIndex && startColumnIndex <= index) {
      width += (table.getColumnWidth as any)(col)
    }
  })

  height = (endRowIndex - startRowIndex + 1) * (gridOptions.rowConfig?.height as number)

  if (height <= 0 || width <= 0) {
    destroyAreaBox()
    return {width: 0, height: 0, left: 0, top: 0}
  }

  top = startRowIndex * (gridOptions.rowConfig?.height as number)

  return {width, height, left, top}
}

// 显示区域框
const openAreaBox = (): void => {
  const mainElement = xGrid.value?.$el.querySelector(".vxe-table--main-wrapper .vxe-table--body-wrapper .vxe-table--cell-area") as HTMLElement
  if (mainElement) {
    mainElement.style.display = "block"
  }

  const fixedElement = xGrid.value?.$el.querySelector(".vxe-table--fixed-wrapper .vxe-table--body-wrapper .vxe-table--cell-area") as HTMLElement
  if (fixedElement) {
    fixedElement.style.display = "block"
  }
}

// 销毁区域框
const destroyAreaBox = (): void => {
  selectionStart.value = {rowIndex: -1, cellIndex: -1}
  selectionEnd.value = {rowIndex: -1, cellIndex: -1}

  const mainElement = getTablexGrid().$el.querySelector(".vxe-table--main-wrapper .vxe-table--body-wrapper .vxe-table--cell-area") as HTMLElement
  if (mainElement) {
    mainElement.style.display = "none"
  }

  const fixedElement = getTablexGrid().$el.querySelector(".vxe-table--fixed-wrapper .vxe-table--body-wrapper .vxe-table--cell-area") as HTMLElement
  if (fixedElement) {
    fixedElement.style.display = "none"
  }
}

// 表格点击事件
const tableCellClick = (e: any): void => {
  const {row, column, $event} = e
  if (!isSelecting.value) {
    if (!lastActive.value || lastActive.value.rowid !== row._X_ROW_KEY || lastActive.value.colid !== column.id) {
      selectionStart.value = getCellPosition($event.target)
      selectionEnd.value = selectionStart.value
      setselectedCellArea()
      lastActive.value = {rowid: row._X_ROW_KEY, colid: column.id}
    }
  }
}

// 工具栏按钮点击
const toolbarButtonClickEvent = ({code}: { code: string }): void => {
  switch (code) {
    case "getcellselctdata":{

      console.log("是否正在进行滑动选中操作：", isSelecting.value)
      console.log("单元格起始位置：索引:", selectionStart.value)
      console.log("单元格结束位置：索引:", selectionEnd.value)

      const tableData = (getTablexGrid().getTableData() as any).visibleData as GridDataItem[]
      const rowStart = selectionStart.value.rowIndex
      const rowEnd = selectionEnd.value.rowIndex
      const selectRows = tableData.filter((_, index) => {
        return rowStart <= index && rowEnd >= index
      })
      console.log("鼠标选中行:", JSON.stringify(selectRows))

      const colStart = selectionStart.value.cellIndex
      const colEnd = selectionEnd.value.cellIndex
      const tableColumn = (getTablexGrid().getTableColumn() as any).visibleColumn
      const selectCols = tableColumn.filter((_: any, index: number) => {
        return colStart <= index && colEnd >= index
      })
      console.log("鼠标选中列:", JSON.stringify(selectCols))
      break
    }
  }
}

// 键盘事件
const tableKeydown = ({$event}: { $event: KeyboardEvent }): void => {
  tbodykeydown($event)
}

// 表格键盘事件处理
const tbodykeydown = (event: KeyboardEvent): void => {
  const table = getTablexGrid()
  const tableColumn = (table.getTableColumn() as any).visibleColumn
  const tableData = (table.getTableData() as any).visibleData

  const startRowIndex = selectionStart.value.rowIndex
  const endRowIndex = selectionEnd.value.rowIndex
  const startColumnIndex = selectionStart.value.cellIndex
  const endColumnIndex = selectionEnd.value.cellIndex

  const maxColumnIndex = tableColumn.length - 1
  const maxRowIndex = tableData.length - 1
  const minColumnIndex = 0
  const minRowIndex = 0

  if (event.ctrlKey && event.keyCode === 67) {
    contextMenuClickEvent({menu: {code: "cellCopy"}})
    event.preventDefault()
  } else if (event.ctrlKey && event.keyCode === 86) {
    contextMenuClickEvent({menu: {code: "cellPaste"}})
    event.preventDefault()
  } else if (event.ctrlKey && event.key === 'd') {
    contextMenuClickEvent({menu: {code: "cellLineCopy"}})
    event.preventDefault()
  } else if (event.key === 'Delete') {
    contextMenuClickEvent({menu: {code: "cellDelete"}})
    event.preventDefault()
  } else if (event.ctrlKey && event.key === 'x') {
    contextMenuClickEvent({menu: {code: "cellCut"}})
    event.preventDefault()
  } else if (event.ctrlKey && event.key === 'z') {
    contextMenuClickEvent({menu: {code: "cellSortValue"}})
    event.preventDefault()
  } else if (event.keyCode === 39) {
    // 向右
    if (endColumnIndex + 1 <= maxColumnIndex) {
      const currentRow = table.getCurrentRecord() as GridDataItem
      const rowIndex = tableData.findIndex((row: any) => {
        return row._X_ROW_KEY === currentRow._X_ROW_KEY
      })
      selectionStart.value = {cellIndex: endColumnIndex + 1, rowIndex}
      selectionEnd.value = {cellIndex: endColumnIndex + 1, rowIndex}
    }
    setselectedCellArea()
    tableScrollMove("right")
    event.preventDefault()
  } else if (event.keyCode === 37) {
    // 向左
    if (startColumnIndex - 1 >= minColumnIndex) {
      const currentRow = table.getCurrentRecord() as GridDataItem
      const rowIndex = tableData.findIndex((row: any) => {
        return row._X_ROW_KEY === currentRow._X_ROW_KEY
      })
      selectionStart.value = {cellIndex: startColumnIndex - 1, rowIndex}
      selectionEnd.value = {cellIndex: startColumnIndex - 1, rowIndex}
    }
    setselectedCellArea()
    tableScrollMove("left")
    event.preventDefault()
  } else if (event.keyCode === 38) {
    // 向上
    const currentRow = table.getCurrentRecord() as GridDataItem
    const rowIndex = tableData.findIndex((row: any) => {
      return row._X_ROW_KEY === currentRow._X_ROW_KEY
    })
    if (rowIndex - 1 >= minRowIndex) {
      selectionStart.value = {cellIndex: startColumnIndex, rowIndex: rowIndex - 1}
      selectionEnd.value = {cellIndex: startColumnIndex, rowIndex: rowIndex - 1}
    }
    setselectedCellArea()
    event.preventDefault()
  } else if (event.keyCode === 40) {
    // 向下
    const currentRow = table.getCurrentRecord() as GridDataItem
    const rowIndex = tableData.findIndex((row: any) => {
      return row._X_ROW_KEY === currentRow._X_ROW_KEY
    })
    if (rowIndex + 1 <= maxRowIndex) {
      selectionStart.value = {cellIndex: startColumnIndex, rowIndex: rowIndex + 1}
      selectionEnd.value = {cellIndex: startColumnIndex, rowIndex: rowIndex + 1}
    }
    setselectedCellArea()
    event.preventDefault()
  }
}

// 滚动条控制
const tableScrollMove = (move: string): void => {
  const table = getTablexGrid()
  const tableColumn = (table.getTableColumn() as any).visibleColumn
  const startColumnIndex = selectionStart.value.cellIndex
  const endColumnIndex = selectionEnd.value.cellIndex

  let fixedWidth = 0
  const flexDiv = table.$el.querySelector(".vxe-table--fixed-left-wrapper") as HTMLElement
  if (flexDiv) {
    fixedWidth = flexDiv.offsetWidth
  }

  const tbody = table.$el.querySelector(".vxe-table--main-wrapper table tbody")
  if (tbody && move) {
    let column
    if (move === "left") {
      column = tableColumn[startColumnIndex]
    } else if (move === "right") {
      column = tableColumn[endColumnIndex]
    }

    const td = column ? tbody.querySelector(`td[colid="${column.id}"]`) : null

    if (td) {
      const tdRect = td.getBoundingClientRect()
      const tableWrapper = table.$el.querySelector(".vxe-table--body-wrapper table") as HTMLElement
      if (tableWrapper) {
        const tableRect = tableWrapper.parentElement!.getBoundingClientRect()

        if (tdRect.top < tableRect.top || tdRect.bottom > tableRect.bottom ||
            tdRect.left < tableRect.left + fixedWidth || tdRect.right > tableRect.right) {
          if (move === "right") {
            tableWrapper.parentElement!.scrollLeft += (tdRect.right - tableRect.right)
          } else if (move === "left") {
            tableWrapper.parentElement!.scrollLeft += (tdRect.left - tableRect.left - fixedWidth)
          }
        }
      }
    }
  }
}

// 右键菜单事件
const contextMenuClickEvent = ({menu, row, column, rowIndex, columnIndex, $event}: any): void => {
  const startRowIndex = selectionStart.value.rowIndex
  const endRowIndex = selectionEnd.value.rowIndex
  const startColumnIndex = selectionStart.value.cellIndex
  const endColumnIndex = selectionEnd.value.cellIndex

  const tableColumn = JSON.parse(JSON.stringify((getTablexGrid().getTableColumn() as any).visibleColumn))
  const tableData = (getTablexGrid().getTableData() as any).visibleData

  switch (menu.code) {
    case "cellCopy": {

      const enterStr = "\r\n"
      const spaceStr = "\t"
      const data: any[][] = []

      for (let i = startRowIndex; i <= endRowIndex; i++) {
        const value: any[] = []
        for (let j = startColumnIndex; j <= endColumnIndex; j++) {
          value.push(tableData[i][tableColumn[j].field])
        }
        data.push(value)
      }

      const finalStr = data.map((value) => {
        return value.join(spaceStr)
      }).join(enterStr)

      copyValue(finalStr)
      break
    }

    case "cellPaste": {

      navigator.clipboard.readText().then((text) => {
        if (text) {
          text = text.replace(/^\r\n+|\r\n+$/g, '')
          const snsArr = text.split(/\r\n+/)
          const tArr = snsArr.map((value) => {
            return value.split("\t")
          })

          for (let i = 0; i < tArr.length; i++) {
            const line = tArr[i]
            if (startRowIndex + i > tableData.length - 1) break
            const row = tableData[startRowIndex + i]

            for (let j = 0; j < line.length; j++) {
              if (startColumnIndex + j > tableColumn.length) break
              const column = tableColumn[startColumnIndex + j]
              row[column.field] = line[j]
            }
          }
        }
      })
      break
    }

    case "cellDelete": {

      for (let i = startRowIndex; i <= endRowIndex; i++) {
        if (i > tableData.length - 1) break
        for (let j = startColumnIndex; j <= endColumnIndex; j++) {
          if (j > tableColumn.length - 1) break
          const row = tableData[i]
          const column = tableColumn[j]
          getTablexGrid().clearData(row, column.property)
        }
      }
      break
    }

    case "cellLineCopy": {

      const firstRow = tableData[startRowIndex]
      for (let i = startRowIndex + 1; i <= endRowIndex; i++) {
        if (i > tableData.length - 1) break
        for (let j = startColumnIndex; j <= endColumnIndex; j++) {
          if (j > tableColumn.length - 1) break
          tableData[i][tableColumn[j].field] = firstRow[tableColumn[j].field]
        }
      }
      break
    }

    case "cellCut": {

      contextMenuClickEvent({menu: {code: "cellCopy"}})
      contextMenuClickEvent({menu: {code: "cellDelete"}})
      break
    }

    case "cellSortValue": {
      const firstRowForSort = tableData[startRowIndex]
      for (let i = startRowIndex + 1; i <= endRowIndex; i++) {
        if (i > tableData.length - 1) break
        for (let j = startColumnIndex; j <= endColumnIndex; j++) {
          if (j > tableColumn.length - 1) break
          const value = firstRowForSort[tableColumn[j].field]
          if (!value) break

          if (!isNaN(value)) {
            tableData[i][tableColumn[j].field] = parseFloat(value) + (i - startRowIndex)
          } else {
            const lastChar = value[value.length - 1]
            const nvalChar = value.slice(0, -1)
            if (/[a-zA-Z]/.test(lastChar)) {
              const result = generateAlphabetChars(lastChar, i - startRowIndex + 1)
              tableData[i][tableColumn[j].field] = nvalChar + result
            }
          }
        }
      }
      break
    }
  }
}

// 字母自增工具方法
const generateAlphabetChars = (c: string, shift: number): string => {
  const asciiCode = c.charCodeAt(0)
  let shiftedAsciiCode = asciiCode + shift

  if (shiftedAsciiCode > 122) {
    shiftedAsciiCode -= 26
  } else if (shiftedAsciiCode < 97) {
    shiftedAsciiCode += 26
  }

  const shiftedChar = String.fromCharCode(shiftedAsciiCode)
  return asciiCode + shift > 122 ? 'a' + shiftedChar : shiftedChar
}

// 复制方法
const copyValue = (value: string): void => {
  copyToClipboard(value)
  alert("已复制到剪贴板！")
}

// 生命周期钩子
onMounted(() => {
  addListener()
})
</script>

<style scoped>
.vxe-grid {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>