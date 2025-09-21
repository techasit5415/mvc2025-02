<script>
  import { goto } from '$app/navigation';
  
  export let data;

  let sortBy = 'title';
  let sortedJobs = [...data.jobs];

  function logout() {
    document.cookie = 'candidate_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    goto('/login');
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
    const diffTime = deadlineDate.getTime() - today.getTime();
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
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        default:
          return 0;
      }
    });
  }

  async function applyJob(jobId) {
    if (confirm('คุณต้องการสมัครงานตำแหน่งนี้หรือไม่?')) {
      try {
        const formData = new FormData();
        formData.append('job_id', jobId);
        
        const response = await fetch('/candidate/apply', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          alert('สมัครงานสำเร็จ!');
          location.reload();
        } else {
          const error = await response.json();
          alert(error.message || 'เกิดข้อผิดพลาดในการสมัครงาน');
        }
      } catch (error) {
        alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
      }
    }
  }

  applySorting();
</script>

<div class="candidate-container">
  <header class="candidate-header">
    <div>
      <h1>Job Fair - ตำแหน่งงานที่เปิดรับสมัคร</h1>
      {#if data.candidate}
        <p>สวัสดี {data.candidate.first_name} {data.candidate.last_name}</p>
      {/if}
    </div>
    <button on:click={logout} class="logout-btn">ออกจากระบบ</button>
  </header>

  <main class="candidate-content">
    <div class="stats-bar">
      <div class="stat">
        <span class="stat-number">{data.jobs.length}</span>
        <span class="stat-label">ตำแหน่งงานที่เปิด</span>
      </div>
      <div class="stat">
        <span class="stat-number">{data.appliedJobIds.length}</span>
        <span class="stat-label">งานที่คุณสมัครแล้ว</span>
      </div>
    </div>

    <div class="controls-section">
      <div class="sort-controls">
        <label>
          เรียงลำดับตาม:
          <select bind:value={sortBy} on:change={applySorting}>
            <option value="title">ชื่อตำแหน่งงาน</option>
            <option value="company_name">ชื่อบริษัท</option>
            <option value="deadline">วันสุดท้ายรับสมัคร</option>
          </select>
        </label>
      </div>
    </div>

    <div class="jobs-grid">
      {#each sortedJobs as job}
        <div class="job-card" class:applied={data.appliedJobIds.includes(job.job_id)}>
          <div class="job-header">
            <h3>{job.job_title}</h3>
            <div class="company-info">
              <strong>{job.company_name}</strong>
              <span class="location">{job.location}</span>
            </div>
          </div>
          
          <div class="job-body">
            <p class="job-description">{job.job_description}</p>
            
            <div class="job-meta">
              <div class="deadline" class:soon={isDeadlineSoon(job.deadline)}>
                <span class="label">ปิดรับสมัคร:</span>
                <span class="date">{formatDateTime(job.deadline)}</span>
              </div>
              <div class="applicants">
                <span class="count">{job.applicant_count}</span>
                <span class="label">คนสมัคร</span>
              </div>
            </div>
          </div>

          <div class="job-footer">
            {#if data.appliedJobIds.includes(job.job_id)}
              <button class="applied-btn" disabled>สมัครแล้ว ✓</button>
            {:else}
              <button class="apply-btn" on:click={() => applyJob(job.job_id)}>
                สมัครงาน
              </button>
            {/if}
          </div>
        </div>
      {/each}
    </div>

    {#if data.jobs.length === 0}
      <div class="empty-state">
        <h3>ไม่มีตำแหน่งงานที่เปิดรับสมัครในขณะนี้</h3>
        <p>กรุณาตรวจสอบอีกครั้งในภายหลัง</p>
      </div>
    {/if}
  </main>
</div>

<style>
  .candidate-container {
    min-height: 100vh;
    background: #f8f9fa;
  }

  .candidate-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .candidate-header h1 {
    margin: 0;
    font-size: 1.8rem;
  }

  .candidate-header p {
    margin: 0.5rem 0 0 0;
    opacity: 0.9;
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

  .candidate-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .stats-bar {
    display: flex;
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .stat {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    text-align: center;
    min-width: 120px;
  }

  .stat-number {
    display: block;
    font-size: 2rem;
    font-weight: bold;
    color: #667eea;
  }

  .stat-label {
    font-size: 0.9rem;
    color: #666;
  }

  .jobs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
  }

  .job-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .job-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 15px rgba(0,0,0,0.15);
  }

  .job-card.applied {
    border-left: 4px solid #28a745;
  }

  .job-header {
    padding: 1.5rem 1.5rem 1rem;
    border-bottom: 1px solid #eee;
  }

  .job-header h3 {
    margin: 0 0 0.5rem 0;
    color: #333;
    font-size: 1.25rem;
  }

  .company-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .company-info strong {
    color: #667eea;
  }

  .location {
    font-size: 0.9rem;
    color: #666;
  }

  .job-body {
    padding: 1rem 1.5rem;
  }

  .job-description {
    margin: 0 0 1rem 0;
    color: #555;
    line-height: 1.5;
  }

  .job-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.9rem;
  }

  .deadline {
    display: flex;
    flex-direction: column;
  }

  .deadline.soon {
    color: #dc3545;
    font-weight: bold;
  }

  .deadline .label {
    color: #666;
    font-size: 0.8rem;
  }

  .applicants {
    text-align: center;
  }

  .applicants .count {
    display: block;
    font-size: 1.2rem;
    font-weight: bold;
    color: #667eea;
  }

  .applicants .label {
    font-size: 0.8rem;
    color: #666;
  }

  .job-footer {
    padding: 1rem 1.5rem;
    background: #f8f9fa;
  }

  .apply-btn {
    width: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 0.75rem;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .apply-btn:hover {
    opacity: 0.9;
  }

  .applied-btn {
    width: 100%;
    background: #28a745;
    color: white;
    border: none;
    padding: 0.75rem;
    border-radius: 6px;
    font-size: 1rem;
    cursor: not-allowed;
  }

  .empty-state {
    text-align: center;
    padding: 3rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .empty-state h3 {
    color: #666;
    margin-bottom: 1rem;
  }

  .empty-state p {
    color: #999;
  }

  .controls-section {
    margin-bottom: 2rem;
    background: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
    border-color: #667eea;
  }
</style>
