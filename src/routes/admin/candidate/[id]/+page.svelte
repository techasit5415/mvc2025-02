<script>
  import { goto } from '$app/navigation';
  
  export let data;

  let sortBy = 'job_title';
  let sortedApplications = [...data.applications];

  function goBack() {
    goto('/homeadmin');
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('th-TH');
  }

  function getStatusBadge(status) {
    return status === 'open' ? 'เปิดรับสมัคร' : 'ปิดรับสมัคร';
  }

  function getStatusClass(status) {
    return status === 'open' ? 'status-open' : 'status-closed';
  }

  function applySorting() {
    sortedApplications = [...data.applications].sort((a, b) => {
      switch (sortBy) {
        case 'job_title':
          return a.job_title.localeCompare(b.job_title, 'th');
        case 'company_name':
          return a.company_name.localeCompare(b.company_name, 'th');
        case 'application_date':
          return new Date(b.application_date) - new Date(a.application_date);
        default:
          return 0;
      }
    });
  }

  applySorting();
</script>

<div class="candidate-detail-container">
  <header class="detail-header">
    <div class="header-content">
      <button class="back-btn" on:click={goBack}>
        ← กลับ
      </button>
      <h1>รายละเอียดผู้สมัคร</h1>
    </div>
  </header>

  <main class="detail-content">
    <div class="candidate-card">
      <div class="candidate-info">
        <h2>{data.candidate.first_name} {data.candidate.last_name}</h2>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">รหัสผู้สมัคร:</span>
            <span class="value">{data.candidate.candidate_id}</span>
          </div>
          <div class="info-item">
            <span class="label">อีเมล:</span>
            <span class="value">{data.candidate.email}</span>
          </div>
          <div class="info-item">
            <span class="label">วันที่สมัครเข้าระบบ:</span>
            <span class="value">{formatDate(data.candidate.created_at)}</span>
          </div>
          <div class="info-item">
            <span class="label">จำนวนงานที่สมัคร:</span>
            <span class="value highlight">{data.applications.length} ตำแหน่ง</span>
          </div>
        </div>
      </div>
    </div>

    <div class="applications-section">
      <h3>รายการตำแหน่งงานที่สมัคร</h3>
      
      {#if data.applications.length > 0}
        <div class="sort-controls">
          <label>
            เรียงลำดับตาม:
            <select bind:value={sortBy} on:change={applySorting}>
              <option value="job_title">ชื่อตำแหน่งงาน</option>
              <option value="company_name">ชื่อบริษัท</option>
              <option value="application_date">วันที่สมัคร</option>
            </select>
          </label>
        </div>

        <div class="applications-grid">
          {#each sortedApplications as app}
            <div class="application-card">
              <div class="app-header">
                <h4>{app.job_title}</h4>
                <span class="status-badge {getStatusClass(app.job_status)}">
                  {getStatusBadge(app.job_status)}
                </span>
              </div>
              
              <div class="company-info">
                <strong>{app.company_name}</strong>
                <span class="location">{app.location}</span>
              </div>
              
              <p class="job-description">{app.job_description}</p>
              
              <div class="app-meta">
                <div class="meta-item">
                  <span class="meta-label">วันที่สมัคร:</span>
                  <span class="meta-value">{formatDate(app.application_date)}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">ปิดรับสมัคร:</span>
                  <span class="meta-value">{formatDate(app.deadline)}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">รหัสงาน:</span>
                  <span class="meta-value job-id">{app.job_id}</span>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <div class="empty-applications">
          <h4>ยังไม่ได้สมัครงานตำแหน่งใด</h4>
          <p>ผู้สมัครยังไม่ได้สมัครงานในระบบ</p>
        </div>
      {/if}
    </div>
  </main>
</div>

<style>
  .candidate-detail-container {
    min-height: 100vh;
    background: #f8f9fa;
  }

  .detail-header {
    background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
    color: white;
    padding: 2rem;
  }

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .back-btn {
    background: rgba(255,255,255,0.2);
    color: white;
    border: 1px solid rgba(255,255,255,0.3);
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .back-btn:hover {
    background: rgba(255,255,255,0.3);
  }

  .detail-header h1 {
    margin: 0;
    font-size: 1.8rem;
  }

  .detail-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .candidate-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    padding: 2rem;
    margin-bottom: 2rem;
  }

  .candidate-info h2 {
    margin: 0 0 1.5rem 0;
    color: #2c3e50;
    font-size: 1.8rem;
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }

  .info-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .info-item .label {
    font-size: 0.9rem;
    color: #6c757d;
    font-weight: 500;
  }

  .info-item .value {
    font-size: 1.1rem;
    color: #2c3e50;
    font-weight: 600;
  }

  .info-item .value.highlight {
    color: #3498db;
    font-size: 1.2rem;
  }

  .applications-section {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    padding: 2rem;
  }

  .applications-section h3 {
    margin: 0 0 1.5rem 0;
    color: #2c3e50;
    font-size: 1.5rem;
  }

  .applications-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
  }

  .application-card {
    border: 1px solid #dee2e6;
    border-radius: 8px;
    padding: 1.5rem;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .application-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }

  .app-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
  }

  .app-header h4 {
    margin: 0;
    color: #2c3e50;
    font-size: 1.2rem;
    flex: 1;
  }

  .status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: bold;
    margin-left: 1rem;
  }

  .status-badge.status-open {
    background: #d4edda;
    color: #155724;
  }

  .status-badge.status-closed {
    background: #f8d7da;
    color: #721c24;
  }

  .company-info {
    margin-bottom: 1rem;
  }

  .company-info strong {
    display: block;
    color: #3498db;
    font-size: 1.1rem;
  }

  .location {
    color: #6c757d;
    font-size: 0.9rem;
  }

  .job-description {
    color: #555;
    line-height: 1.5;
    margin-bottom: 1rem;
  }

  .app-meta {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding-top: 1rem;
    border-top: 1px solid #dee2e6;
  }

  .meta-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .meta-label {
    font-size: 0.9rem;
    color: #6c757d;
  }

  .meta-value {
    font-weight: 600;
    color: #2c3e50;
  }

  .meta-value.job-id {
    font-family: monospace;
    font-size: 0.9rem;
    color: #6c757d;
  }

  .empty-applications {
    text-align: center;
    padding: 3rem;
    color: #6c757d;
  }

  .empty-applications h4 {
    margin-bottom: 1rem;
    color: #2c3e50;
  }

  .empty-applications p {
    margin: 0;
  }

  .sort-controls {
    margin-bottom: 1.5rem;
  }

  .sort-controls label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
    color: #2c3e50;
  }

  .sort-controls select {
    padding: 0.5rem;
    border: 1px solid #dee2e6;
    border-radius: 6px;
    background: white;
    cursor: pointer;
  }

  .sort-controls select:focus {
    outline: none;
    border-color: #3498db;
  }
</style>
