<script>
  import { goto } from '$app/navigation';
  
  export let data;

  let sortBy = 'title';
  let sortedJobs = [...data.jobs];

  function goBack() {
    goto('/homeadmin');
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('th-TH');
  }

  function formatDateTime(dateString) {
    return new Date(dateString).toLocaleString('th-TH');
  }

  function isDeadlineSoon(deadline) {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  }

  function applySorting() {
    sortedJobs = [...data.jobs].sort((a, b) => {
      switch (sortBy) {
        // case 'title':
        //   return a.title.localeCompare(b.title, 'th');
        case 'company_name':
          return a.company_name.localeCompare(b.company_name, 'th');
        case 'deadline':
          return new Date(a.deadline) - new Date(b.deadline);
        case 'application_count':
          return b.application_count - a.application_count;
        default:
          return 0;
      }
    });
  }

  applySorting();
</script>

<div class="jobs-container">
  <header class="jobs-header">
    <div class="header-content">
      <button class="back-btn" on:click={goBack}>
        ← กลับ
      </button>
      <h1>ตำแหน่งงานที่เปิดรับสมัคร</h1>
    </div>
  </header>

  <main class="jobs-content">
    <div class="jobs-summary">
      <div class="summary-card">
        <h3>สถิติตำแหน่งงาน</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-number">{data.jobs.length}</span>
            <span class="stat-label">ตำแหน่งที่เปิดรับ</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{data.jobs.reduce((sum, job) => sum + job.application_count, 0)}</span>
            <span class="stat-label">จำนวนผู้สมัครทั้งหมด</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{data.jobs.filter(job => isDeadlineSoon(job.deadline)).length}</span>
            <span class="stat-label">ปิดรับใน 7 วัน</span>
          </div>
        </div>
      </div>
    </div>

    <div class="jobs-section">
      <div class="section-header">
        <h3>รายการตำแหน่งงาน</h3>
        <div class="sort-controls">
          <label>
            เรียงลำดับตาม:
            <select bind:value={sortBy} on:change={applySorting}>
              <option value="title">ชื่อตำแหน่งงาน</option>
              <option value="company_name">ชื่อบริษัท</option>
              <option value="deadline">วันสุดท้ายรับสมัคร</option>
              <option value="application_count">จำนวนผู้สมัคร</option>
            </select>
          </label>
        </div>
      </div>

      {#if sortedJobs.length > 0}
        <div class="jobs-grid">
          {#each sortedJobs as job}
            <div class="job-card" class:deadline-soon={isDeadlineSoon(job.deadline)}>
              <div class="job-header">
                <h4>{job.title}</h4>
                <div class="job-meta">
                  <span class="job-id">#{job.job_id}</span>
                  {#if isDeadlineSoon(job.deadline)}
                    <span class="deadline-warning">⚠️ ปิดเร็ว</span>
                  {/if}
                </div>
              </div>
              
              <div class="company-info">
                <strong>{job.company_name}</strong>
                <span class="location">{job.location}</span>
              </div>
              
              <p class="job-description">{job.description}</p>
              
              <div class="job-stats">
                <div class="stat-row">
                  <span class="stat-label">จำนวนผู้สมัคร:</span>
                  <span class="stat-value highlight">{job.application_count} คน</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">ปิดรับสมัคร:</span>
                  <span class="stat-value">{formatDateTime(job.deadline)}</span>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <div class="empty-jobs">
          <h4>ไม่มีตำแหน่งงานที่เปิดรับสมัคร</h4>
          <p>ยังไม่มีตำแหน่งงานที่เปิดรับสมัครในขณะนี้</p>
        </div>
      {/if}
    </div>
  </main>
</div>

<style>
  .jobs-container {
    min-height: 100vh;
    background: #f8f9fa;
  }

  .jobs-header {
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

  .jobs-header h1 {
    margin: 0;
    font-size: 1.8rem;
  }

  .jobs-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .jobs-summary {
    margin-bottom: 2rem;
  }

  .summary-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    padding: 2rem;
  }

  .summary-card h3 {
    margin: 0 0 1.5rem 0;
    color: #2c3e50;
    font-size: 1.5rem;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
  }

  .stat-item {
    text-align: center;
  }

  .stat-number {
    display: block;
    font-size: 2.5rem;
    font-weight: bold;
    color: #3498db;
    margin-bottom: 0.5rem;
  }

  .stat-label {
    color: #6c757d;
    font-size: 0.9rem;
  }

  .jobs-section {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    padding: 2rem;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .section-header h3 {
    margin: 0;
    color: #2c3e50;
    font-size: 1.5rem;
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

  .jobs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 1.5rem;
  }

  .job-card {
    border: 1px solid #dee2e6;
    border-radius: 8px;
    padding: 1.5rem;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .job-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }

  .job-card.deadline-soon {
    border-left: 4px solid #e74c3c;
    background: #fff5f5;
  }

  .job-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
  }

  .job-header h4 {
    margin: 0;
    color: #2c3e50;
    font-size: 1.2rem;
    flex: 1;
  }

  .job-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.25rem;
  }

  .job-id {
    font-family: monospace;
    font-size: 0.8rem;
    color: #6c757d;
  }

  .deadline-warning {
    font-size: 0.7rem;
    color: #e74c3c;
    font-weight: bold;
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

  .job-stats {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding-top: 1rem;
    border-top: 1px solid #dee2e6;
  }

  .stat-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .stat-label {
    font-size: 0.9rem;
    color: #6c757d;
  }

  .stat-value {
    font-weight: 600;
    color: #2c3e50;
  }

  .stat-value.highlight {
    color: #3498db;
    font-size: 1.1rem;
  }

  .empty-jobs {
    text-align: center;
    padding: 3rem;
    color: #6c757d;
  }

  .empty-jobs h4 {
    margin-bottom: 1rem;
    color: #2c3e50;
  }

  .empty-jobs p {
    margin: 0;
  }
</style>
