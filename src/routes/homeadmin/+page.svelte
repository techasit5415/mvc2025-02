<script>
  import { goto } from '$app/navigation';
  
  export let data;

  function logout() {
    document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    localStorage.removeItem('isLoggedIn');
    goto('/login');
  }

  function viewCandidate(candidateId) {
    goto(`/admin/candidate/${candidateId}`);
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('th-TH');
  }
</script>

<div class="admin-container">
  <header class="admin-header">
    <div class="header-left">
      <h1>Admin Dashboard - รายชื่อผู้สมัครทั้งหมด</h1>
    </div>
    <div class="header-right">
      <a href="/admin/jobs" class="nav-btn">
        📋 ดูตำแหน่งงานที่เปิด
      </a>
      <button on:click={logout} class="logout-btn">
        ออกจากระบบ
      </button>
    </div>
  </header>

  <main class="admin-content">
    <div class="stats-grid">
      <div class="stat-card">
        <h3>{data.stats.total_candidates}</h3>
        <p>ผู้สมัครทั้งหมด</p>
      </div>
      <div class="stat-card">
        <h3>{data.stats.open_jobs}</h3>
        <p>ตำแหน่งงานที่เปิด</p>
      </div>
      <div class="stat-card">
        <h3>{data.stats.total_applications}</h3>
        <p>ใบสมัครทั้งหมด</p>
      </div>
      <div class="stat-card">
        <h3>{data.stats.total_companies}</h3>
        <p>บริษัทที่เข้าร่วม</p>
      </div>
    </div>

    <div class="candidates-section">
      <h2>รายชื่อผู้สมัคร (เรียงตามชื่อ)</h2>
      
      {#if data.candidates.length > 0}
        <div class="candidates-table-container">
          <table class="candidates-table">
            <thead>
              <tr>
                <th>รหัสผู้สมัคร</th>
                <th>ชื่อ-นามสกุล</th>
                <th>อีเมล</th>
                <th>วันที่สมัคร</th>
                <th>จำนวนงานที่สมัคร</th>
                <th>การดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {#each data.candidates as candidate}
                <tr class="candidate-row">
                  <td class="candidate-id">{candidate.candidate_id}</td>
                  <td class="candidate-name">
                    <strong>{candidate.first_name} {candidate.last_name}</strong>
                  </td>
                  <td class="candidate-email">{candidate.email}</td>
                  <td class="created-date">{formatDate(candidate.created_at)}</td>
                  <td class="application-count">
                    <span class="count-badge">{candidate.application_count}</span>
                  </td>
                  <td class="actions">
                    <button 
                      class="view-btn" 
                      on:click={() => viewCandidate(candidate.candidate_id)}
                    >
                      ดูรายละเอียด
                    </button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {:else}
        <div class="empty-state">
          <h3>ยังไม่มีผู้สมัครในระบบ</h3>
          <p>รอผู้สมัครเข้ามาใช้งานระบบ</p>
        </div>
      {/if}
    </div>
  </main>
</div>

<style>
  .admin-container {
    min-height: 100vh;
    background: #f8f9fa;
  }

  .admin-header {
    background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
    color: white;
    padding: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .header-left h1 {
    margin: 0;
    font-size: 1.8rem;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .nav-btn {
    background: rgba(255,255,255,0.2);
    color: white;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    border: 1px solid rgba(255,255,255,0.3);
    transition: background 0.2s;
  }

  .nav-btn:hover {
    background: rgba(255,255,255,0.3);
  }

  .logout-btn {
    background: rgba(255,255,255,0.2);
    color: white;
    border: 1px solid rgba(255,255,255,0.3);
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .logout-btn:hover {
    background: rgba(255,255,255,0.3);
  }

  .admin-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .stat-card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    text-align: center;
  }

  .stat-card h3 {
    font-size: 2.5rem;
    margin: 0 0 0.5rem 0;
    color: #3498db;
    font-weight: bold;
  }

  .stat-card p {
    margin: 0;
    color: #666;
    font-size: 1rem;
  }

  .candidates-section {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    overflow: hidden;
  }

  .candidates-section h2 {
    margin: 0;
    padding: 1.5rem;
    background: #f8f9fa;
    border-bottom: 1px solid #dee2e6;
    color: #2c3e50;
  }

  .candidates-table-container {
    overflow-x: auto;
  }

  .candidates-table {
    width: 100%;
    border-collapse: collapse;
  }

  .candidates-table th {
    background: #f8f9fa;
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: #495057;
    border-bottom: 2px solid #dee2e6;
  }

  .candidates-table td {
    padding: 1rem;
    border-bottom: 1px solid #dee2e6;
    vertical-align: middle;
  }

  .candidate-row:hover {
    background: #f8f9fa;
  }

  .candidate-id {
    font-family: monospace;
    color: #6c757d;
    font-size: 0.9rem;
  }

  .candidate-name strong {
    color: #2c3e50;
  }

  .candidate-email {
    color: #3498db;
  }

  .created-date {
    color: #6c757d;
    font-size: 0.9rem;
  }

  .application-count {
    text-align: center;
  }

  .count-badge {
    background: #3498db;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.9rem;
    font-weight: bold;
  }

  .view-btn {
    background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: opacity 0.2s;
  }

  .view-btn:hover {
    opacity: 0.9;
  }

  .empty-state {
    text-align: center;
    padding: 3rem;
    color: #6c757d;
  }

  .empty-state h3 {
    margin-bottom: 1rem;
  }

  .empty-state p {
    margin: 0;
  }
</style>
