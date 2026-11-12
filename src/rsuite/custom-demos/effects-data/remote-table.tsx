import React, { useEffect, useMemo, useState } from 'react';
import { Button, Input, Pagination, SelectPicker, Table, Tag } from 'rsuite';
import ReloadIcon from '@rsuite/icons/Reload';

const { Column, Cell, HeaderCell } = Table;

type Row = {
  id: number;
  name: string;
  dept: string;
  city: string;
  salary: number;
  status: '在职' | '试用' | '离职';
  joined: string;
};

const DEPTS = ['研发', '设计', '市场', '销售', '人事'];
const CITIES = ['北京', '上海', '杭州', '深圳', '成都', '广州'];
const SURNAMES = '赵钱孙李周吴郑王冯陈褚卫蒋沈韩杨'.split('');
const GIVENS = ['伟', '芳', '娜', '敏', '静', '磊', '军', '洋', '勇', '艳', '杰', '涛', '明', '超', '秀英', '霞'];

const buildAll = (): Row[] =>
  Array.from({ length: 137 }, (_, i) => ({
    id: i + 1,
    name: SURNAMES[i % SURNAMES.length] + GIVENS[(i * 7) % GIVENS.length],
    dept: DEPTS[i % DEPTS.length],
    city: CITIES[(i * 3) % CITIES.length],
    salary: 8000 + ((i * 1373) % 22000),
    status: (['在职', '在职', '在职', '试用', '离职'] as const)[i % 5],
    joined: `202${1 + (i % 5)}-${String(1 + (i % 12)).padStart(2, '0')}-${String(1 + (i % 27)).padStart(2, '0')}`,
  }));

const STATUS_COLOR: Record<Row['status'], string> = { 在职: 'green', 试用: 'orange', 离职: 'red' };

const App = () => {
  const all = useMemo(buildAll, []);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [sortColumn, setSortColumn] = useState<string | undefined>();
  const [sortType, setSortType] = useState<'asc' | 'desc' | undefined>();

  useEffect(() => {
    const t = window.setTimeout(() => {
      setSearch(input.trim());
      setPage(1);
    }, 400);
    return () => window.clearTimeout(t);
  }, [input]);

  useEffect(() => {
    setLoading(true);
    const t = window.setTimeout(() => {
      let rows = all;
      if (search) rows = rows.filter((r) => r.name.includes(search));
      if (dept) rows = rows.filter((r) => r.dept === dept);
      if (sortColumn && sortType) {
        rows = [...rows].sort((a: any, b: any) => {
          const va = a[sortColumn];
          const vb = b[sortColumn];
          const r = typeof va === 'number' ? va - vb : String(va).localeCompare(String(vb));
          return sortType === 'asc' ? r : -r;
        });
      }
      setTotal(rows.length);
      setData(rows.slice((page - 1) * limit, page * limit));
      setLoading(false);
    }, 450);
    return () => window.clearTimeout(t);
  }, [all, page, limit, search, dept, sortColumn, sortType, refreshKey]);

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
        <Input value={input} onChange={setInput} placeholder="搜索姓名（防抖 400ms）" style={{ width: 220 }} />
        <SelectPicker
          data={[{ label: '全部部门', value: '' }, ...DEPTS.map((d) => ({ label: d, value: d }))]}
          value={dept}
          onChange={(v) => {
            setDept(v ? String(v) : '');
            setPage(1);
          }}
          style={{ width: 140 }}
          cleanable={false}
        />
        <Button startIcon={<ReloadIcon />} onClick={() => setRefreshKey((k) => k + 1)}>
          刷新
        </Button>
      </div>

      <Table
        loading={loading}
        data={data}
        autoHeight
        sortColumn={sortColumn}
        sortType={sortType}
        onSortColumn={(key, type) => {
          setSortColumn(key);
          setSortType(type);
        }}
      >
        <Column width={70}>
          <HeaderCell>ID</HeaderCell>
          <Cell dataKey="id" />
        </Column>
        <Column width={110} sortable>
          <HeaderCell>姓名</HeaderCell>
          <Cell dataKey="name" />
        </Column>
        <Column width={90}>
          <HeaderCell>部门</HeaderCell>
          <Cell dataKey="dept" />
        </Column>
        <Column width={90}>
          <HeaderCell>城市</HeaderCell>
          <Cell dataKey="city" />
        </Column>
        <Column width={120} sortable>
          <HeaderCell>月薪</HeaderCell>
          <Cell>{(row: Row) => `¥${row.salary.toLocaleString()}`}</Cell>
        </Column>
        <Column width={90}>
          <HeaderCell>状态</HeaderCell>
          <Cell>{(row: Row) => <Tag color={STATUS_COLOR[row.status]}>{row.status}</Tag>}</Cell>
        </Column>
        <Column width={120}>
          <HeaderCell>入职日期</HeaderCell>
          <Cell dataKey="joined" />
        </Column>
      </Table>

      <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
        <Pagination
          total={total}
          limit={limit}
          limitOptions={[10, 20, 50]}
          layout={['total', '-', 'limit', '|', 'pager']}
          activePage={page}
          onChangePage={setPage}
          onChangeLimit={(l) => {
            setLimit(l);
            setPage(1);
          }}
        />
      </div>
    </div>
  );
};

export default App;
