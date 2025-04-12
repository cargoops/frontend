'use client'; 
// Next.js 13의 App Router에서 클라이언트 사이드 상호작용을 하려면 "use client" 선언 필요

import React, { useState, useCallback, useEffect } from 'react';

type TabName = 
  | 'storingOrders'
  | 'packages'
  | 'pickSlips'
  | 'packageQuery'
  | 'storingOrderCheck';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabName>('storingOrders');
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isClient, setIsClient] = useState(false);

  // POST 체크용으로 사용할 양식 입력값
  const [soId, setSoId] = useState('');
  const [awb, setAwb] = useState('');
  const [boe, setBoe] = useState('');

  // packageId로 조회할 때 입력값
  const [packageId, setPackageId] = useState('');

  const API_BASE = 'https://kmoj7dnkpg.execute-api.us-east-2.amazonaws.com/Prod'; // 실제 API 서버 주소로 변경 필요

  useEffect(() => {
    console.log('useEffect 실행');
    setIsClient(true);
    console.log('isClient 상태 변경됨:', true);
  }, []);

  const fetchData = useCallback(async (path: string, method: string = 'GET', body?: any) => {
    console.log('fetchData 호출됨');
    if (!isClient) {
      console.log('클라이언트 사이드가 아님');
      return;
    }
    
    try {
      setError('');
      setData(null);
      setLoading(true);
      console.log('API 호출 시작:', { path, method, body, API_BASE });

      const options: RequestInit = { 
        method,
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        ...(body && { body: JSON.stringify(body) })
      };

      const fullUrl = `${API_BASE}${path}`;
      console.log('요청 URL:', fullUrl);

      const res = await fetch(fullUrl, options);
      console.log('응답 상태:', res.status);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const jsonData = await res.json();
      console.log('응답 데이터:', jsonData);
      setData(jsonData);
    } catch (err: any) {
      console.error('API 호출 에러:', err);
      setError(err.message || '알 수 없는 에러가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [isClient]);

  const handleTabClick = useCallback((tab: TabName) => {
    console.log('handleTabClick 호출됨:', tab);
    if (!isClient) {
      console.log('클라이언트 사이드가 아님');
      return;
    }
    
    setActiveTab(tab);
    setData(null);
    setError('');

    switch (tab) {
      case 'storingOrders':
        fetchData('/storing-orders');
        break;
      case 'packages':
        fetchData('/packages');
        break;
      case 'pickSlips':
        fetchData('/pickslips');
        break;
      case 'packageQuery':
        // 여기서는 탭 클릭만으로는 호출 안 함.
        break;
      case 'storingOrderCheck':
        // 탭 클릭만으로 아무 것도 안 함. 사용자 폼 입력 후 post 처리
        break;
    }
  }, [fetchData, isClient]);

  const handlePackageQuery = useCallback(() => {
    console.log('handlePackageQuery 호출됨');
    if (!isClient) {
      console.log('클라이언트 사이드가 아님');
      return;
    }
    
    if (!packageId) {
      setError('Please enter packageId');
      return;
    }
    fetchData(`/package?packageId=${packageId}`);
  }, [packageId, fetchData, isClient]);

  const handleStoringOrderCheck = useCallback(async (e: React.FormEvent) => {
    console.log('handleStoringOrderCheck 호출됨');
    if (!isClient) {
      console.log('클라이언트 사이드가 아님');
      return;
    }
    
    e.preventDefault();
    if (!soId || !awb || !boe) {
      setError('Fill all fields');
      return;
    }
    fetchData('/storing-order/check', 'POST', {
      storingOrderId: soId,
      airwayBillNumber: awb,
      billOfEntryId: boe
    });
  }, [soId, awb, boe, fetchData, isClient]);

  console.log('렌더링:', { isClient, activeTab, loading });

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Tab Menu */}
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => handleTabClick('storingOrders')} disabled={loading}>StoringOrders</button>
        <button onClick={() => handleTabClick('packages')} disabled={loading}>Packages</button>
        <button onClick={() => handleTabClick('pickSlips')} disabled={loading}>PickSlips</button>
        <button onClick={() => handleTabClick('packageQuery')} disabled={loading}>Package Query</button>
        <button onClick={() => handleTabClick('storingOrderCheck')} disabled={loading}>StoringOrder Check</button>
      </div>

      {/* 로딩 상태 표시 */}
      {loading && <div>Loading...</div>}

      {/* 에러 / 결과 표시 */}
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      {data && (
        <div style={{ background: '#eee', padding: '1rem', marginBottom: '1rem' }}>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}

      {/* Render tab content */}
      {activeTab === 'storingOrders' && <p>Fetched StoringOrders data above if success.</p>}
      {activeTab === 'packages' && <p>Fetched Packages data above if success.</p>}
      {activeTab === 'pickSlips' && <p>Fetched PickSlips data above if success.</p>}

      {activeTab === 'packageQuery' && (
        <div>
          <h3>Package Query</h3>
          <input
            type="text"
            placeholder="Enter packageId"
            value={packageId}
            onChange={(e) => setPackageId(e.target.value)}
          />
          <button onClick={handlePackageQuery}>Search</button>
          <p>Result will appear above if successful.</p>
        </div>
      )}

      {activeTab === 'storingOrderCheck' && (
        <div>
          <h3>StoringOrder Check & Update</h3>
          <form onSubmit={handleStoringOrderCheck} style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px' }}>
            <label>
              StoringOrderId
              <input
                type="text"
                value={soId}
                onChange={(e) => setSoId(e.target.value)}
              />
            </label>
            <label>
              AirwayBillNumber
              <input
                type="text"
                value={awb}
                onChange={(e) => setAwb(e.target.value)}
              />
            </label>
            <label>
              BillOfEntryId
              <input
                type="text"
                value={boe}
                onChange={(e) => setBoe(e.target.value)}
              />
            </label>
            <button type="submit">Check / Update</button>
          </form>
          <p>Result will appear above if successful (status {'->'} TQ).</p>
        </div>
      )}
    </div>
  );
}
