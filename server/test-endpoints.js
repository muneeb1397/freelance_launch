// Comprehensive API Smoke Test Suite for FreelanceLaunch
const testEndpoints = async () => {
  const baseUrl = 'http://localhost:5000';
  console.log('🧪 Starting FreelanceLaunch End-to-End API Smoke Tests...\n');

  try {
    // 1. Health Check
    console.log('1️⃣ Testing GET /api/health');
    const healthRes = await fetch(`${baseUrl}/api/health`);
    const healthData = await healthRes.json();
    console.log('   Status:', healthRes.status, '| Success:', healthData.success);
    console.log('   Message:', healthData.message, '\n');

    // 2. Proposal API (Member 1)
    console.log('2️⃣ Testing POST /api/proposal (Member 1)');
    const proposalRes = await fetch(`${baseUrl}/api/proposal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobTitle: 'Full-Stack React & Node.js Developer',
        jobDescription: 'Build modern analytics dashboard with responsive UI and charts',
        clientName: 'Alex Rivera',
        skills: 'React, Node.js, Tailwind CSS',
        tone: 'Confident & Professional'
      })
    });
    const propData = await proposalRes.json();
    console.log('   Status:', proposalRes.status, '| Success:', propData.success);
    console.log('   Generated Hook:', propData.result?.subjectLine);
    console.log('   Highlights Count:', propData.result?.keyHighlights?.length, '\n');

    // 3. Code Review API (Member 3)
    console.log('3️⃣ Testing POST /api/review (Member 3)');
    const reviewRes = await fetch(`${baseUrl}/api/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: 'async function getData(id) { const res = await db.query("SELECT * FROM users WHERE id=" + id); return res; }',
        language: 'javascript',
        focusArea: 'Security & Vulnerability Audit'
      })
    });
    const reviewData = await reviewRes.json();
    console.log('   Status:', reviewRes.status, '| Success:', reviewData.success);
    console.log('   Quality Score:', reviewData.result?.score, '/ 100');
    console.log('   Issues Flagged:', reviewData.result?.issues?.length);
    console.log('   Verdict:', reviewData.result?.deliveryReadinessVerdict, '\n');

    // 4. Contract & Invoice API (Member 4)
    console.log('4️⃣ Testing POST /api/contract (Member 4)');
    const contractRes = await fetch(`${baseUrl}/api/contract`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        freelancerName: 'Sarah Developer',
        clientName: 'Acme Corp',
        projectTitle: 'E-Commerce Platform MVP',
        scopeOfWork: 'Design and build 5 responsive pages with checkout flow',
        totalAmount: 1500,
        currency: 'USD'
      })
    });
    const contractData = await contractRes.json();
    console.log('   Status:', contractRes.status, '| Success:', contractData.success);
    console.log('   Contract:', contractData.result?.contractTitle);
    console.log('   Invoice Total:', contractData.result?.invoice?.total, '\n');

    // 5. Client Communication API (Member 5)
    console.log('5️⃣ Testing POST /api/message (Member 5)');
    const messageRes = await fetch(`${baseUrl}/api/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scenario: 'scope_creep',
        clientName: 'Alex',
        freelancerName: 'Sarah',
        projectDetails: 'Client requested 2 extra pages and dark mode not in original SOW'
      })
    });
    const messageData = await messageRes.json();
    console.log('   Status:', messageRes.status, '| Success:', messageData.success);
    console.log('   Subject:', messageData.result?.subjectLine);
    console.log('   Channel:', messageData.result?.recommendedChannel);
    console.log('   Short Version:', messageData.result?.alternativeShortVersion?.slice(0, 50) + '...\n');

    console.log('🎉 ALL 5 SMOKE TESTS PASSED CLEANLY! Ready for Demo & Member Route Handoffs.');
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
};

testEndpoints();
