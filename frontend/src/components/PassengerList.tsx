import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { getPassengers, deletePassenger, deletePassengers } from '../api/passengers';
import { getUserInfo } from '../api/personal_user';
import type { Passenger } from '../api/passengers';
import verifiedIcon from '../assets/images/verified.png';
import deleteIcon from '../assets/images/delete.png';
import editIcon from '../assets/images/edit.png';

type Props = {
  passengers?: Passenger[] // Keep for controlled mode if needed, but we will fetch internally mostly
  onAdd?: () => void
  onEdit?: (id: string) => void
}

export default function PassengerList({ onAdd, onEdit }: Props) {
  const [internalPassengers, setInternalPassengers] = useState<Passenger[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [message, setMessage] = useState<string>('')
  const [searchName, setSearchName] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const fetchPassengers = useCallback(async () => {
    setLoading(true)
    try {
      // Parallel fetch user info and passengers
      const [passengerData, userInfo] = await Promise.all([
        getPassengers({ name: searchName }),
        getUserInfo().catch(e => {
          console.error('Failed to fetch user info for self-row:', e);
          return null;
        })
      ]);

      let list = passengerData || [];

      // If we have user info, ensure it's in the list as "Self"
      if (userInfo && userInfo.idNumber) {
        // Check if self is already in the list (by idNumber)
        const selfIndex = list.findIndex((p: Passenger) => p.idNumber === userInfo.idNumber);
        
        const selfPassenger: Passenger = {
          passengerId: userInfo.id || userInfo.userId || 'self',
          name: userInfo.realName || userInfo.username,
          idType: userInfo.idType,
          idNumber: userInfo.idNumber,
          phone: userInfo.phoneNumber,
          verificationStatus: userInfo.verificationStatus || '已通过',
          discountType: userInfo.discountType || '成人',
          isSelf: true
        };

        if (selfIndex !== -1) {
          // Update existing entry to be self and move to top logic handles sorting
          list[selfIndex] = { ...list[selfIndex], ...selfPassenger, isSelf: true };
        } else {
          // Add self if matches search (or no search)
          if (!searchName || (selfPassenger.name && selfPassenger.name.includes(searchName))) {
            list = [selfPassenger, ...list];
          }
        }
      }

      setInternalPassengers(list);
    } catch (error) {
      console.error('Failed to fetch passengers:', error);
    } finally {
      setLoading(false)
    }
  }, [searchName]);

  useEffect(() => {
    void fetchPassengers();
  }, [fetchPassengers]);

  const rows = useMemo(() => {
    const list = internalPassengers
    // Sort so isSelf is first
    return [...list].sort((a, b) => {
      if (a.isSelf && !b.isSelf) return -1;
      if (!a.isSelf && b.isSelf) return 1;
      return 0;
    });
  }, [internalPassengers])

  const toggle = (id: string, checked: boolean) => {
    if (checked) setSelected((s) => Array.from(new Set([...s, id])))
    else setSelected((s) => s.filter((x) => x !== id))
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('确认要删除该乘车人吗？')) {
      try {
        await deletePassenger(id);
        void fetchPassengers();
        setSelected((s) => s.filter((x) => x !== id));
      } catch (error) {
        console.error('Failed to delete passenger:', error);
      }
    }
  }

  const handleBatchDelete = async () => {
    if (selected.length === 0) {
      setMessage('请先选择联系人')
      return
    }
    
    // Check if any selected passenger is self (though UI should prevent selecting self)
    const hasSelf = selected.some(id => internalPassengers.find(p => p.passengerId === id)?.isSelf);
    if (hasSelf) {
      setMessage('本人信息不可删除');
      return;
    }

    if (window.confirm(`确认要删除选中的 ${selected.length} 位乘车人吗？`)) {
      try {
        await deletePassengers(selected);
        setMessage('');
        setSelected([]);
        void fetchPassengers();
      } catch (error) {
        console.error('Failed to batch delete:', error);
        setMessage('删除失败，请重试');
      }
    }
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
          onClick={() => void fetchPassengers()}
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
          gridTemplateColumns: '70px 110px 180px 200px 160px 110px 110px',
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
          {loading ? (
             <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>加载中...</div>
          ) : rows.length === 0 ? (
             <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>暂无乘车人信息</div>
          ) : (
            rows.map((p, idx) => {
              const rowNo = idx + 1
              return (
                <div
                  key={p.passengerId}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '70px 110px 180px 200px 160px 110px 110px',
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
                      checked={selected.includes(p.passengerId)}
                      data-testid={`row-${rowNo}-checkbox`}
                      onChange={(e) => toggle(p.passengerId, e.currentTarget.checked)}
                      style={{ marginRight: 8 }}
                    />
                    <span style={{ marginLeft: 0, whiteSpace: 'nowrap' }}>{rowNo}</span>
                  </div>
                  <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                  <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.idType || '居民身份证'}</div>
                  <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {/* ID Masking: Keep first 4, keep last 4, mask middle */}
                    {p.idNumber && p.idNumber.length > 8
                      ? p.idNumber.substring(0, 4) + '*'.repeat(p.idNumber.length - 8) + p.idNumber.substring(p.idNumber.length - 4)
                      : (p.idNumber || '-')}
                  </div>
                  <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {/* Phone Masking: 138****8000 (Keep first 3, mask 4, keep last 4) */}
                    {p.phone && p.phone.length >= 11
                      ? p.phone.substring(0, 3) + '****' + p.phone.substring(7)
                      : (p.phone || '-')}
                  </div>
                  <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center' }}>
                     <img src={verifiedIcon} alt="已通过" style={{ height: 20 }} />
                  </div>
                  <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center' }}>
                    {!p.isSelf && (
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <img 
                          src={deleteIcon} 
                          alt="删除" 
                          style={{ cursor: 'pointer', height: 20 }}
                          onClick={() => handleDelete(p.passengerId)}
                        />
                        <img 
                          src={editIcon} 
                          alt="修改" 
                          style={{ cursor: 'pointer', height: 20 }}
                          onClick={() => onEdit && onEdit(p.passengerId)}
                        />
                      </div>
                    )}
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
