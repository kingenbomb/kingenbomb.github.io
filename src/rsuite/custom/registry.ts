import type { CategoryMeta } from '../generated/registry';

export const customCategories: CategoryMeta[] = [
  {
    id: 'effects',
    name: 'Effects',
    title: '常用效果',
    pages: [
      {
        id: 'effects-forms',
        name: 'Form Patterns',
        title: '表单模式',
        description: '登录、动态增减字段、分步向导、草稿自动保存、密码强度校验——日常业务里最常写的五类表单交互。',
        components: ['Form'],
        hasDemos: true,
        demos: [
          { id: 'login', title: '登录表单', description: '用户名 / 密码模型校验、密码可见切换、记住我、异步提交 loading 与成功反馈。', file: 'login.tsx' },
          { id: 'dynamic-fields', title: '动态增减字段', description: '联系人列表：任意添加 / 删除行、行内选择器与输入联动、提交前校验与数据预览。', file: 'dynamic-fields.tsx' },
          { id: 'wizard', title: '分步向导', description: 'Steps 三步表单：分步校验、上一步 / 下一步、最终确认与提交成功态。', file: 'wizard.tsx' },
          { id: 'autosave', title: '草稿自动保存', description: '停止输入 900ms 后自动保存：脏标记 / 保存中 / 已保存时间与次数，支持手动立即保存。', file: 'autosave.tsx' },
          { id: 'password-strength', title: '密码强度校验', description: '规则清单实时校验（长度 / 大小写 / 数字 / 符号），强度进度与两次输入一致性检查。', file: 'password-strength.tsx' },
        ],
      },
      {
        id: 'effects-data',
        name: 'Data Patterns',
        title: '数据列表',
        description: '远程分页表格、无限滚动、拖拽排序、批量删除、主从联动——数据密集型页面最常见的五种模式。',
        components: ['Table'],
        hasDemos: true,
        demos: [
          { id: 'remote-table', title: '远程分页表格', description: '模拟接口的筛选 + 排序 + 分页表格：带防抖搜索、部门过滤、加载态与总量统计。', file: 'remote-table.tsx' },
          { id: 'infinite-list', title: '无限滚动列表', description: 'IntersectionObserver 触底加载更多：骨架首屏、加载中行、到底提示。', file: 'infinite-list.tsx' },
          { id: 'draggable-list', title: '拖拽排序', description: '原生 HTML5 拖放重排列表：拖拽高亮、落点指示、一键重置顺序。', file: 'draggable-list.tsx' },
          { id: 'multi-delete', title: '批量选择删除', description: '表头全选（半选态）+ 选中工具栏 + 二次确认，删除后即时反馈。', file: 'multi-delete.tsx' },
          { id: 'master-detail', title: '主从联动', description: '左侧会话列表 + 右侧详情面板：未读标记、消息发送、标为已读联动。', file: 'master-detail.tsx' },
        ],
      },
      {
        id: 'effects-feedback',
        name: 'Feedback',
        title: '反馈状态',
        description: '全局提示、二次确认、加载状态、骨架屏、空态与重试——把「系统正在做什么」清楚地告诉用户。',
        components: ['Message'],
        hasDemos: true,
        demos: [
          { id: 'toast-patterns', title: '全局提示模式', description: '成功 / 警告 / 错误 / 信息四种 Toast、位置切换、加载 → 成功的异步更新模式。', file: 'toast-patterns.tsx' },
          { id: 'confirm-flows', title: '二次确认流程', description: '常规确认、危险操作输入 DELETE 强确认、行内 Popover 轻确认三种强度。', file: 'confirm-flows.tsx' },
          { id: 'loading-states', title: '加载状态集合', description: '按钮 loading、区域刷新遮罩、进度条三种加载表达，区分「马上回来」和「需要等待」。', file: 'loading-states.tsx' },
          { id: 'skeleton-page', title: '骨架屏', description: '首屏占位：头像 + 文本 + 列表骨架，加载完成后替换为真实内容。', file: 'skeleton-page.tsx' },
          { id: 'empty-retry', title: '空态与错误重试', description: '空数据引导、加载失败提示与重试按钮，三种状态一键切换演示。', file: 'empty-retry.tsx' },
        ],
      },
      {
        id: 'effects-interaction',
        name: 'Interaction',
        title: '交互增强',
        description: '命令面板、主题切换、复制反馈、快捷键面板、图片预览——让页面「手感更好」的五个细节。',
        components: ['Modal'],
        hasDemos: true,
        demos: [
          { id: 'command-palette', title: '命令面板', description: 'Ctrl / Cmd + K 唤起、模糊过滤、↑↓ 选择、Enter 执行、Esc 关闭。', file: 'command-palette.tsx' },
          { id: 'theme-switch', title: '明暗主题切换', description: '基于 CustomProvider 的局部深浅色切换，组件无需刷新即换肤。', file: 'theme-switch.tsx' },
          { id: 'copy-feedback', title: '复制与反馈', description: '复制按钮的三种形态：输入框复制、图标按钮、代码块角标，成功即时打勾。', file: 'copy-feedback.tsx' },
          { id: 'keyboard-hints', title: '键盘快捷键', description: '快捷键说明表 + 可交互按键区：实时展示按下的组合键，演示 Ctrl+S 拦截。', file: 'keyboard-hints.tsx' },
          { id: 'image-preview', title: '图片预览', description: '缩略图网格 + 灯箱：左右切换、键盘方向键、页码指示。', file: 'image-preview.tsx' },
        ],
      },
    ],
  },
];
