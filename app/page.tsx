'use client'; 
// Next.js 13의 App Router에서 클라이언트 사이드 상호작용을 하려면 "use client" 선언 필요

import React, { useState } from 'react';

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

  // POST 체크용으로 사용할 양식 입력값
  const [soId, setSoId] = useState('');
  const [awb, setAwb] = useState('');
  const [boe, setBoe] = useState('');

  // packageId로 조회할 때 입력값
  const [packageId, setPackageId] = useState('');

  const API_BASE = 'https://kmoj7dnkpg.execute-api.us-east-2.amazonaws.com/Prod'; // 실제 API 서버 주소로 변경 필요

  // 간단한 fetch 헬퍼 함수
  async function fetchData(path: string, method: string = 'GET', body?: any) {
    try {
      setError('');
      setData(null);
      setLoading(true);
      console.log('API 호출 시작:', { path, method, body, API_BASE });

      let options: RequestInit = { 
        method,
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };
      
      if (body) {
        options.body = JSON.stringify(body);
      }

      console.log('요청 옵션:', options);
      const fullUrl = `${API_BASE}${path}`;
      console.log('전체 URL:', fullUrl);

      const res = await fetch(fullUrl, options);
      console.log('응답 상태:', res.status);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const jsonData = await res.json().catch(e => {
        console.error('JSON 파싱 에러:', e);
        throw new Error('응답을 파싱할 수 없습니다.');
      });
      
      console.log('응답 데이터:', jsonData);
      setData(jsonData);
    } catch (err: any) {
      console.error('API 호출 에러:', err);
      setError(err.message || '알 수 없는 에러가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }

  // 탭별로 API 호출 분기
  const handleTabClick = (tab: TabName) => {
    setActiveTab(tab);
    setData(null);
    setError('');

    switch (tab) {
      case 'storingOrders':
        fetchData('/storing-orders');  // GET /storing-orders (scan)
        break;
      case 'packages':
        fetchData('/packages');        // GET /packages (scan)
        break;
      case 'pickSlips':
        fetchData('/pickslips');       // GET /pickslips (scan)
        break;
      case 'packageQuery':
        // 여기서는 탭 클릭만으로는 호출 안 함.
        break;
      case 'storingOrderCheck':
        // 탭 클릭만으로 아무 것도 안 함. 사용자 폼 입력 후 post 처리
        break;
    }
  };

  // package 단건 조회
  const handlePackageQuery = () => {
    if (!packageId) {
      setError('Please enter packageId');
      return;
    }
    fetchData(`/package?packageId=${packageId}`);
  };

  // storing-order/check POST
  const handleStoringOrderCheck = async (e: React.FormEvent) => {
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
  };

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
