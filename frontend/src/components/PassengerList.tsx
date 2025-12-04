import React, { useMemo, useState } from 'react'

interface Passenger {
  passengerId: string;
  name: string;
  idType?: string;
  idNumber?: string;
  phone?: string;
  verificationStatus?: string;
  discountType?: string;
  isSelf?: boolean;
}

type Props = {
  passengers?: Passenger[]
  onAdd?: () => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onBatchDelete?: (ids: string[]) => void
}

export default function PassengerList({ passengers = [], onAdd, onBatchDelete }: Props) {
  const [selected, setSelected] = useState<string[]>([])
  const [message, setMessage] = useState<string>('')
  const [searchName, setSearchName] = useState<string>('')

  const rows = useMemo(() => {
    const list = passengers
    if (!searchName.trim()) return list
    return list.filter((p) => (p.name || '').includes(searchName.trim()))
  }, [passengers, searchName])

  const toggle = (id: string, checked: boolean) => {
    if (checked) setSelected((s) => Array.from(new Set([...s, id])))
    else setSelected((s) => s.filter((x) => x !== id))
  }

  const handleBatchDelete = () => {
    if (selected.length === 0) {
      setMessage('请先选择联系人')
      return
    }
    setMessage('')
    onBatchDelete && onBatchDelete(selected)
  }

  return (
    <div style={{ border: '1px solid #e8e8e8', borderRadius: 4, padding: 16, background: '#fff' }}>
      {/* 查询条（第一行） */}
      <div style={{ marginBottom: 12, display: 'flex', gap: 8 }}>
        <input
          aria-label="乘客姓名"
          placeholder="请输入乘客姓名"
          value={searchName}
          onChange={(e) => setSearchName(e.currentTarget.value)}
          style={{ flex: '0 0 240px', height: 32, border: '1px solid #d9d9d9', borderRadius: 4, padding: '0 8px' }}
        />
        <button 
          onClick={() => setSearchName(searchName.trim())}
          style={{
            height: 32,
            padding: '0 15px',
            backgroundColor: '#1890ff',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer'
          }}
        >
          查询
        </button>
      </div>

      {/* 表头行（第二行，灰色底） */}
      <div
        style={{
          background: '#f5f5f5',
          border: '1px solid #e8e8e8',
          borderRadius: 4,
          padding: '8px 12px',
          marginBottom: 12,
          display: 'grid',
          gridTemplateColumns: '70px 110px 110px 180px 140px 110px 110px',
          columnGap: 8,
          overflow: 'hidden',
          fontWeight: 'bold',
          color: '#333'
        }}
      >
        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>序号</div>
        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>姓名</div>
        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>证件类型</div>
        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>证件号码</div>
        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>手机/电话</div>
        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>核验状态</div>
        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>操作</div>
      </div>

      {/* 乘车人信息展示区域（蓝色边框） */}
      <div style={{ border: '1px solid #91d5ff', borderRadius: 4, padding: 12 }}>
        {/* 第一行：左侧添加/批量删除按钮 */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          <button 
            onClick={onAdd}
            style={{
              padding: '5px 15px',
              backgroundColor: '#faad14',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer'
            }}
          >
            + 添加
          </button>
          <button 
            onClick={handleBatchDelete}
            style={{
              padding: '5px 15px',
              backgroundColor: '#ff4d4f',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer'
            }}
          >
            批量删除
          </button>
        </div>
        {message && <div style={{ color: '#ff4d4f', marginBottom: 8 }}>{message}</div>}

        {/* 列表行 */}
        <div style={{ display: 'grid', rowGap: 8 }}>
          {rows.length === 0 ? (
             <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>暂无乘车人信息</div>
          ) : (
            rows.map((p, idx) => {
              const rowNo = idx + 1
              return (
                <div
                  key={p.passengerId}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '70px 110px 110px 180px 140px 110px 110px',
                    columnGap: 8,
                    alignItems: 'center',
                    padding: '6px 8px',
                    borderBottom: '1px solid #f0f0f0',
                    fontSize: '13px'
                  }}
                >
                  <div>
                    <input
                      type="checkbox"
                      data-testid={`row-${rowNo}-checkbox`}
                      onChange={(e) => toggle(p.passengerId, e.currentTarget.checked)}
                    />
                    <span style={{ marginLeft: 8, whiteSpace: 'nowrap' }}>{rowNo}</span>
                  </div>
                  <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                  <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.idType || '中国居民身份证'}</div>
                  <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.idNumber || '-'}</div>
                  <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.phone || '-'}</div>
                  <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: p.verificationStatus === '已通过' ? '#52c41a' : '#faad14' }}>{p.verificationStatus || '未核验'}</div>
                  <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <span style={{ color: '#1890ff', cursor: 'pointer', marginRight: 8 }}>编辑</span>
                    <span style={{ color: '#ff4d4f', cursor: 'pointer' }}>删除</span>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
