import { openDb } from '$lib/server/db-sqlite.js';

export async function load() {
    const db = await openDb();
    
    const jobs = await db.all(`
        SELECT 
            j.job_id, 
            j.job_title, 
            j.job_description, 
            j.deadline, 
            j.status,
            c.company_id,
            c.company_name as company_name,
            COUNT(a.application_id) as application_count
        FROM jobs j 
        JOIN companies c ON j.company_id = c.company_id 
        LEFT JOIN applications a ON j.job_id = a.job_id
        WHERE j.status = 'open'
        GROUP BY j.job_id, j.job_title, j.job_description, j.deadline, j.status, c.company_id, c.company_name
        ORDER BY j.job_title ASC
    `);

    return {
        jobs
    };
}
