/* ============================================================
   HARGEYSA EXAMINATION RESULTS PORTAL
   Client Logic & Interactive Controller (app.js)
   ============================================================ */

const app = (() => {
  let isAdminLoggedIn = false;
  let currentStudent = null;
  let activeHonorFilter = 'ALL';

  // Quick Toast Notification
  const showToast = (message, type = 'info') => {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'fa-circle-info';
    if (type === 'success') icon = 'fa-circle-check';
    if (type === 'error') icon = 'fa-triangle-exclamation';

    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  };

  // Helper SVG QR Code Generator
  const generateQRCodeSVG = (text) => {
    // Generate stylized SVG matrix pattern
    const size = 64;
    const hash = String(text).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    let rects = '';
    
    // Corners (Finder Patterns)
    rects += `<rect x="0" y="0" width="18" height="18" fill="#7c3aed" rx="3"/>`;
    rects += `<rect x="3" y="3" width="12" height="12" fill="#ffffff" rx="2"/>`;
    rects += `<rect x="6" y="6" width="6" height="6" fill="#7c3aed" rx="1"/>`;

    rects += `<rect x="46" y="0" width="18" height="18" fill="#7c3aed" rx="3"/>`;
    rects += `<rect x="49" y="3" width="12" height="12" fill="#ffffff" rx="2"/>`;
    rects += `<rect x="52" y="6" width="6" height="6" fill="#7c3aed" rx="1"/>`;

    rects += `<rect x="0" y="46" width="18" height="18" fill="#7c3aed" rx="3"/>`;
    rects += `<rect x="3" y="49" width="12" height="12" fill="#ffffff" rx="2"/>`;
    rects += `<rect x="6" y="52" width="6" height="6" fill="#7c3aed" rx="1"/>`;

    // Data dots
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if ((r < 3 && c < 3) || (r < 3 && c > 3) || (r > 3 && c < 3)) continue;
        const fillVal = (hash * (r + 1) * (c + 1)) % 3 === 0 ? '#4f46e5' : ((hash + r + c) % 2 === 0 ? '#d946ef' : 'transparent');
        if (fillVal !== 'transparent') {
          rects += `<rect x="${22 + c * 5}" y="${22 + r * 5}" width="4" height="4" fill="${fillVal}" rx="1"/>`;
        }
      }
    }

    return `<svg viewBox="0 0 ${size} ${size}" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#fff; border-radius:6px;">
      ${rects}
    </svg>`;
  };

  // Render Top Honor Roll
  const renderHonorRoll = (filter = 'ALL') => {
    const tbody = document.getElementById('honor-roll-tbody');
    if (!tbody) return;

    let students = DB.getStudents();

    if (filter !== 'ALL') {
      students = students.filter(s => s.gradeLevel === filter);
    }

    // Sort by percentage descending
    students.sort((a, b) => (parseFloat(b.percentage) || 0) - (parseFloat(a.percentage) || 0));

    const top5 = students.slice(0, 5);

    if (top5.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted">Lama helin arday.</td></tr>`;
      return;
    }

    let html = '';
    top5.forEach((std, idx) => {
      const rankNum = idx + 1;
      let rankClass = 'rank-other';
      let rankIcon = rankNum;

      if (rankNum === 1) { rankClass = 'rank-1'; rankIcon = '<i class="fa-solid fa-crown"></i>'; }
      if (rankNum === 2) { rankClass = 'rank-2'; rankIcon = '2'; }
      if (rankNum === 3) { rankClass = 'rank-3'; rankIcon = '3'; }

      html += `
        <tr>
          <td class="text-center">
            <div class="rank-badge ${rankClass}">${rankIcon}</div>
          </td>
          <td>
            <div class="honor-student-name">${std.name}</div>
            <div class="honor-student-school">${std.gradeLevel || 'Fasalka 8aad'}</div>
          </td>
          <td>${std.school}</td>
          <td class="text-center"><strong>${std.rollNumber}</strong></td>
          <td class="text-center">${std.totalScore || '812'} / ${std.totalMax || '900'}</td>
          <td class="text-center">
            <span class="gradient-text-purple" style="font-weight:900; font-size:1.1rem;">${std.percentage}%</span>
          </td>
          <td class="text-center">
            <button class="glass-btn glass-btn-primary" style="padding:0.35rem 0.85rem; font-size:0.78rem;" onclick="app.searchByRoll('${std.rollNumber}')">
              <i class="fa-solid fa-eye"></i> Eeg Kaadhka
            </button>
          </td>
        </tr>
      `;
    });

    tbody.innerHTML = html;
  };

  // Render Official Slip
  const renderOfficialSlip = (student) => {
    currentStudent = student;

    document.getElementById('slip-student-name').textContent = student.name;
    document.getElementById('slip-roll-number').textContent = student.rollNumber;
    document.getElementById('slip-school-name').textContent = student.school;
    document.getElementById('slip-grade-level').textContent = `${student.gradeLevel} (${student.academicYear || '2024-2025'})`;
    document.getElementById('slip-academic-year').textContent = student.academicYear || '2024-2025';
    document.getElementById('slip-percentage').textContent = `${student.percentage}%`;
    document.getElementById('slip-grade-letter').textContent = student.overallGrade || 'Hoor Sare (A)';
    document.getElementById('slip-total-marks').textContent = `${student.totalScore || 812} / ${student.totalMax || 900}`;
    document.getElementById('slip-rank-position').textContent = student.rankPosition || 'Kaalmada 2aad';
    document.getElementById('slip-location').textContent = student.location || 'Maroodi-Jeex (Hargeysa)';
    
    // Security Hash & QR
    const secCode = `${student.rollNumber}-SEC-REG`;
    document.getElementById('slip-security-hash').textContent = secCode;
    document.getElementById('qr-code-holder').innerHTML = generateQRCodeSVG(secCode);

    // Subject breakdown table
    const tbody = document.getElementById('subject-marks-tbody');
    let subjectHtml = '';

    if (student.subjects && student.subjects.length > 0) {
      student.subjects.forEach(sub => {
        let badgeColor = 'badge-a';
        if (sub.grade === 'A+') badgeColor = 'badge-a-plus';
        if (sub.grade === 'B+' || sub.grade === 'B') badgeColor = 'badge-b';
        if (sub.grade === 'F') badgeColor = 'badge-fail';

        subjectHtml += `
          <tr>
            <td><strong>${sub.name}</strong></td>
            <td class="text-center">${sub.max || 100}</td>
            <td class="text-center"><strong>${sub.score}</strong></td>
            <td class="text-center"><span class="grade-badge ${badgeColor}">${sub.grade}</span></td>
            <td class="text-center"><span class="grade-badge badge-pass">${sub.status || 'Passed'}</span></td>
          </tr>
        `;
      });
    } else {
      subjectHtml = `<tr><td colspan="5" class="text-center">Maadaama aysan jirin tafaasiil.</td></tr>`;
    }

    tbody.innerHTML = subjectHtml;

    // Show slip section
    const slipSection = document.getElementById('result-slip-section');
    slipSection.classList.remove('hidden');
    slipSection.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle Search Submission
  const handleSearch = (event) => {
    if (event) event.preventDefault();
    const rollInput = document.getElementById('roll-number-input').value.trim();
    if (!rollInput) {
      showToast('Fadlan geli Roll Number-ka fadhiga!', 'error');
      return;
    }

    const student = DB.getStudentByRoll(rollInput);
    if (student) {
      showToast(`Natiijada ardayga ${student.name} waa la helay!`, 'success');
      renderOfficialSlip(student);
    } else {
      showToast(`Lama helin natiijo leh Roll Number-ka (${rollInput}). Fadlan xaqiiji.`, 'error');
    }
  };

  // Search by roll string
  const searchByRoll = (rollStr) => {
    document.getElementById('roll-number-input').value = rollStr;
    const student = DB.getStudentByRoll(rollStr);
    if (student) {
      showToast(`Kaadhka natiijada waa la furay!`, 'success');
      renderOfficialSlip(student);
    } else {
      showToast(`Roll Number-kan lama helin!`, 'error');
    }
  };

  const fillSampleRoll = () => {
    const samples = ['HRG-84920-24', 'HRG-11001-24', 'HRG-12901-24', 'HRG-15491-24', 'HRG-17112-24'];
    const random = samples[Math.floor(Math.random() * samples.length)];
    searchByRoll(random);
  };

  const hideResultSlip = () => {
    document.getElementById('result-slip-section').classList.add('hidden');
    scrollToSection('search-section');
  };

  const printResultSlip = () => {
    window.print();
  };

  // Download PDF generator
  const downloadResultPDF = () => {
    if (!currentStudent) {
      showToast('Natiijo la doortay ma jirto.', 'error');
      return;
    }

    try {
      if (window.jspdf && window.jspdf.jsPDF) {
        const doc = new window.jspdf.jsPDF();
        doc.setFontSize(18);
        doc.setTextColor(124, 58, 237);
        doc.text('HARGEYSA EXAMINATION RESULTS', 105, 20, { align: 'center' });
        
        doc.setFontSize(12);
        doc.setTextColor(50, 50, 50);
        doc.text('KAADHKA NATIIJADA ARDAYGA (OFFICIAL RESULT SLIP)', 105, 28, { align: 'center' });
        doc.line(20, 32, 190, 32);

        doc.setFontSize(11);
        doc.text(`Magaca Ardayga: ${currentStudent.name}`, 20, 42);
        doc.text(`Roll Number: ${currentStudent.rollNumber}`, 20, 50);
        doc.text(`Dugsiga: ${currentStudent.school}`, 20, 58);
        doc.text(`Fasalka: ${currentStudent.gradeLevel}`, 20, 66);
        doc.text(`Wadarta Dhibcaha: ${currentStudent.totalScore} / ${currentStudent.totalMax}`, 20, 74);
        doc.text(`Boqolkiiba Score: ${currentStudent.percentage}%`, 20, 82);

        doc.line(20, 88, 190, 88);
        doc.text('TAFAASIILTA MAADOOYINKA:', 20, 96);

        let y = 104;
        if (currentStudent.subjects) {
          currentStudent.subjects.forEach(sub => {
            doc.text(`${sub.name}: ${sub.score} / ${sub.max || 100} (${sub.grade})`, 25, y);
            y += 8;
          });
        }

        doc.setFontSize(9);
        doc.text(`Digital Verification Hash: ${currentStudent.rollNumber}-SEC-REG`, 20, y + 15);
        doc.text('Officially Verified by Hargeysa Examination Board - Somaliland', 20, y + 22);

        doc.save(`${currentStudent.rollNumber}_Result_Slip.pdf`);
        showToast('PDF-ka Natiijada waa la soo dajiyay!', 'success');
      } else {
        window.print();
      }
    } catch (e) {
      console.error(e);
      window.print();
    }
  };

  const shareResult = () => {
    if (navigator.share && currentStudent) {
      navigator.share({
        title: `Natiijada Imtixaanka - ${currentStudent.name}`,
        text: `Koodhka Roll Number: ${currentStudent.rollNumber} - Score: ${currentStudent.percentage}% (${currentStudent.overallGrade})`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link-ga Portal-ka waa la koobiyay!', 'success');
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Mobile menu toggle
  const toggleMobileMenu = () => {
    const menu = document.getElementById('nav-menu');
    menu.classList.toggle('show-mobile');
  };

  // Filter honor roll tabs
  const filterHonorRoll = (level, btn) => {
    activeHonorFilter = level;
    document.querySelectorAll('.segmented-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderHonorRoll(level);
  };

  /* ==================== ADMIN DASHBOARD CONTROLLER ==================== */
  const openAdminModal = () => {
    document.getElementById('admin-modal-overlay').classList.remove('hidden');
    if (isAdminLoggedIn) {
      showAdminDashboardView();
    } else {
      showAdminLoginView();
    }
  };

  const closeAdminModal = () => {
    document.getElementById('admin-modal-overlay').classList.add('hidden');
  };

  const showAdminLoginView = () => {
    document.getElementById('admin-login-view').classList.remove('hidden');
    document.getElementById('admin-dashboard-view').classList.add('hidden');
  };

  const showAdminDashboardView = () => {
    document.getElementById('admin-login-view').classList.add('hidden');
    document.getElementById('admin-dashboard-view').classList.remove('hidden');
    renderAdminStudentsTable();
    renderAdminAppeals();
    renderAdminStatsSummary();
    renderSubjectFormInputs();
  };

  const handleAdminLogin = (event) => {
    event.preventDefault();
    const pass = document.getElementById('admin-pass-input').value;
    // Authenticate via SHA-256 hash comparison. Password is never stored in plaintext.
    const AUTH_HASH = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'; // SHA-256
    const FALLBACK_HASH = '9ba0f65b'; // djb2 pre-computed hash (no plaintext stored)
    const djb2Hash = (str) => {
      let hash = 5381;
      for (let i = 0; i < str.length; i++) {
        hash = (hash * 33) ^ str.charCodeAt(i);
        hash = hash >>> 0;
      }
      return hash.toString(16).padStart(8, '0');
    };
    const checkPassword = async (input) => {
      try {
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex === AUTH_HASH;
      } catch(e) {
        // Fallback: compare against pre-computed djb2 hash only
        return djb2Hash(input) === FALLBACK_HASH;
      }
    };
    checkPassword(pass).then(isValid => {
      if (isValid) {
        isAdminLoggedIn = true;
        showToast('Waa ku soo dhowaatay Portal-ka Maamulka Admin-ka!', 'success');
        showAdminDashboardView();
      } else {
        showToast('Furaha sirta ah (Password) waa xaaraan / galin kalsooni darro ah!', 'error');
      }
    });
  };

  const adminLogout = () => {
    isAdminLoggedIn = false;
    showAdminLoginView();
    showToast('Waad ka baxday Portal-ka Admin-ka.', 'info');
  };

  const switchAdminTab = (tabName, btn) => {
    document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    document.querySelectorAll('.admin-tab-panel').forEach(p => p.classList.remove('active'));
    const panel = document.getElementById(`tab-panel-${tabName}`);
    if (panel) panel.classList.add('active');
  };

  // Render Admin Students Table
  const renderAdminStudentsTable = () => {
    const tbody = document.getElementById('admin-students-tbody');
    if (!tbody) return;

    const query = (document.getElementById('admin-student-search')?.value || '').toLowerCase();
    const gradeFilter = document.getElementById('admin-grade-filter')?.value || 'ALL';

    let students = DB.getStudents();

    if (query) {
      students = students.filter(s => 
        s.name.toLowerCase().includes(query) || 
        s.rollNumber.toLowerCase().includes(query) ||
        s.school.toLowerCase().includes(query)
      );
    }

    if (gradeFilter !== 'ALL') {
      students = students.filter(s => s.gradeLevel === gradeFilter);
    }

    if (students.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted">Lama helin arday.</td></tr>`;
      return;
    }

    let html = '';
    students.forEach(std => {
      html += `
        <tr>
          <td><strong>${std.rollNumber}</strong></td>
          <td>${std.name}</td>
          <td>${std.school}</td>
          <td>${std.gradeLevel}</td>
          <td class="text-center">${std.totalScore || 812} / ${std.totalMax || 900}</td>
          <td class="text-center"><strong>${std.percentage}%</strong></td>
          <td class="text-center">
            <button class="glass-btn glass-btn-secondary" style="padding:0.3rem 0.6rem; font-size:0.75rem;" onclick="app.editStudent('${std.id}')">
              <i class="fa-solid fa-pen-to-square"></i> Edit
            </button>
            <button class="glass-btn glass-btn-danger" style="padding:0.3rem 0.6rem; font-size:0.75rem;" onclick="app.deleteStudent('${std.id}')">
              <i class="fa-solid fa-trash"></i> Delete
            </button>
          </td>
        </tr>
      `;
    });

    tbody.innerHTML = html;
  };

  // Form subject inputs generator
  const renderSubjectFormInputs = () => {
    const container = document.getElementById('form-subjects-container');
    if (!container) return;

    const subjects = DB.getSTANDARD_SUBJECTS();
    let html = '';

    subjects.forEach((sub, idx) => {
      html += `
        <div class="form-group">
          <label>${sub.name} (Max 100):</label>
          <input 
            type="number" 
            min="0" 
            max="100" 
            class="glass-input subject-score-input" 
            data-subject-name="${sub.name}" 
            placeholder="0 - 100" 
            value="85" 
            required 
          />
        </div>
      `;
    });

    container.innerHTML = html;
  };

  const clearStudentForm = () => {
    document.getElementById('form-student-id').value = '';
    document.getElementById('form-roll-number').value = '';
    document.getElementById('form-student-name').value = '';
    document.getElementById('form-school-name').value = '';
    document.getElementById('admin-form-title').textContent = 'Diiwaangeli Arday Cusub';
  };

  const editStudent = (id) => {
    const students = DB.getStudents();
    const std = students.find(s => s.id === id);
    if (!std) return;

    document.getElementById('form-student-id').value = std.id;
    document.getElementById('form-roll-number').value = std.rollNumber;
    document.getElementById('form-student-name').value = std.name;
    document.getElementById('form-school-name').value = std.school;
    document.getElementById('form-grade-level').value = std.gradeLevel;
    document.getElementById('form-academic-year').value = std.academicYear || '2024-2025';
    document.getElementById('admin-form-title').textContent = `Wax ka baddal Natiijada (${std.rollNumber})`;

    // Fill subjects if matching
    const inputs = document.querySelectorAll('.subject-score-input');
    inputs.forEach(inp => {
      const subName = inp.getAttribute('data-subject-name');
      const match = std.subjects ? std.subjects.find(s => s.name === subName) : null;
      if (match) {
        inp.value = match.score;
      }
    });

    switchAdminTab('add-student');
  };

  const handleSaveStudent = (event) => {
    event.preventDefault();

    const id = document.getElementById('form-student-id').value;
    const rollNumber = document.getElementById('form-roll-number').value.trim();
    const name = document.getElementById('form-student-name').value.trim();
    const school = document.getElementById('form-school-name').value.trim();
    const gradeLevel = document.getElementById('form-grade-level').value;
    const academicYear = document.getElementById('form-academic-year').value;
    const location = document.getElementById('form-location').value;

    const subjectInputs = document.querySelectorAll('.subject-score-input');
    const subjects = [];

    subjectInputs.forEach(inp => {
      const subName = inp.getAttribute('data-subject-name');
      const score = parseFloat(inp.value) || 0;
      let grade = 'A';
      let status = 'Passed';

      if (score >= 93) { grade = 'A+'; status = 'Distinction'; }
      else if (score >= 88) { grade = 'A'; status = 'Distinction'; }
      else if (score >= 84) { grade = 'A-'; status = 'Excellent'; }
      else if (score >= 78) { grade = 'B+'; status = 'Very Good'; }
      else if (score >= 70) { grade = 'B'; status = 'Good'; }
      else if (score >= 50) { grade = 'C'; status = 'Pass'; }
      else { grade = 'F'; status = 'Fail'; }

      subjects.push({
        name: subName,
        max: 100,
        score: score,
        grade: grade,
        status: status
      });
    });

    const studentData = {
      id: id || undefined,
      rollNumber,
      name,
      school,
      gradeLevel,
      academicYear,
      location,
      subjects
    };

    DB.saveStudent(studentData);
    showToast('Natiijada ardayga waa la kaydiyay!', 'success');

    clearStudentForm();
    renderAdminStudentsTable();
    renderHonorRoll(activeHonorFilter);
    switchAdminTab('students');
  };

  const deleteStudent = (id) => {
    if (confirm('Ma hubtaa inaad tirtirto natiijada ardaygan?')) {
      DB.deleteStudent(id);
      showToast('Ardayga waa la tirtiray.', 'info');
      renderAdminStudentsTable();
      renderHonorRoll(activeHonorFilter);
    }
  };

  const renderAdminAppeals = () => {
    const tbody = document.getElementById('admin-appeals-tbody');
    const badgeCount = document.getElementById('admin-appeals-count');
    if (!tbody) return;

    const appeals = DB.getAppeals();
    if (badgeCount) badgeCount.textContent = appeals.filter(a => a.status === 'PENDING').length;

    if (appeals.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted">Cabashooyin ma jiraan.</td></tr>`;
      return;
    }

    let html = '';
    appeals.forEach(app => {
      let statusBadge = `<span class="grade-badge badge-b">PENDING</span>`;
      if (app.status === 'APPROVED') statusBadge = `<span class="grade-badge badge-pass">APPROVED</span>`;
      if (app.status === 'REJECTED') statusBadge = `<span class="grade-badge badge-fail">REJECTED</span>`;

      html += `
        <tr>
          <td>${new Date(app.createdAt).toLocaleDateString()}</td>
          <td><strong>${app.rollNumber}</strong></td>
          <td>${app.studentName}</td>
          <td>${app.subject}</td>
          <td>${app.reason}</td>
          <td class="text-center">${statusBadge}</td>
          <td class="text-center">
            <button class="glass-btn glass-btn-primary" style="padding:0.25rem 0.5rem; font-size:0.75rem;" onclick="app.updateAppeal('${app.id}', 'APPROVED')">
              Approve
            </button>
            <button class="glass-btn glass-btn-danger" style="padding:0.25rem 0.5rem; font-size:0.75rem;" onclick="app.updateAppeal('${app.id}', 'REJECTED')">
              Reject
            </button>
          </td>
        </tr>
      `;
    });

    tbody.innerHTML = html;
  };

  const updateAppeal = (id, status) => {
    DB.updateAppealStatus(id, status);
    showToast(`Status-ka cabashada waa la baddalay: ${status}`, 'success');
    renderAdminAppeals();
  };

  const renderAdminStatsSummary = () => {
    const container = document.getElementById('admin-stats-summary-container');
    if (!container) return;

    const students = DB.getStudents();
    const appeals = DB.getAppeals();

    const totalStudents = students.length;
    const totalPassed = students.filter(s => parseFloat(s.percentage) >= 50).length;
    const passRate = totalStudents > 0 ? ((totalPassed / totalStudents) * 100).toFixed(1) : 0;

    container.innerHTML = `
      <div class="slip-stat-card">
        <span class="stat-lbl">WADARTA ARDAYDA</span>
        <span class="stat-val gradient-text-purple">${totalStudents}</span>
      </div>
      <div class="slip-stat-card">
        <span class="stat-lbl">BOQOLKIIBA GUDUBKA</span>
        <span class="stat-val gradient-text-gold">${passRate}%</span>
      </div>
      <div class="slip-stat-card">
        <span class="stat-lbl">CABASHOOYINKA</span>
        <span class="stat-val">${appeals.length}</span>
      </div>
    `;
  };

  const resetDataToDefaults = () => {
    if (confirm('Ma hubtaa inaad dib u soo celiso dhammaan sample data-ga rasmiga ah?')) {
      DB.resetToDefaults();
      showToast('Data-dii bilowga ahayd waa la soo celiyay!', 'success');
      renderAdminStudentsTable();
      renderHonorRoll('ALL');
    }
  };

  // Modals
  const openAppealModal = () => document.getElementById('appeal-modal-overlay').classList.remove('hidden');
  const closeAppealModal = () => document.getElementById('appeal-modal-overlay').classList.add('hidden');
  const openCertificateModal = () => {
    openInfoModal('Shahaadooyinka & Aadkis-in', 'Shahaadooyinka rasmiga ah ee Fasalka 8aad iyo 12aad waxaa laga qaadan karaa Xafiiska Dexam Hargeysa ama Dugsiga aad ka baxday adoo wata kaadhka fadhiga.');
  };
  const openContactModal = () => {
    openInfoModal('Xafiisyada & Taageerada Gobolka', 'Taleefanada: 0638742888 / 0634990451<br/>Email: support@moe.gov.so<br/>Location: Gobolka Maroodi-Jeex, Hargeysa Somaliland');
  };

  const openInfoModal = (title, content) => {
    document.getElementById('info-modal-title').innerHTML = `<i class="fa-solid fa-circle-info gradient-text-purple"></i> <h3>${title}</h3>`;
    document.getElementById('info-modal-body').innerHTML = `<p style="font-size:1.05rem; line-height:1.7;">${content}</p>`;
    document.getElementById('info-modal-overlay').classList.remove('hidden');
  };

  const closeInfoModal = () => document.getElementById('info-modal-overlay').classList.add('hidden');

  const handleAppealSubmit = (event) => {
    event.preventDefault();
    const rollNumber = document.getElementById('appeal-roll-input').value.trim();
    const studentName = document.getElementById('appeal-name-input').value.trim();
    const subject = document.getElementById('appeal-subject-select').value;
    const reason = document.getElementById('appeal-reason-input').value.trim();

    DB.saveAppeal({ rollNumber, studentName, subject, reason });
    showToast('Cabashadaada waa la soo gudbiyay! Maamulka ayaa dib u eegi doona.', 'success');
    closeAppealModal();
    renderAdminAppeals();
  };

  const handleSaveSettings = (event) => {
    event.preventDefault();
    const ann = document.getElementById('setting-announcement').value;
    const title = document.getElementById('setting-portal-title').value;

    DB.saveSettings({ announcement: ann, portalTitle: title });
    document.getElementById('top-announcement-text').textContent = ann;
    showToast('Settings-ka waa la kaydiyay!', 'success');
  };

  // Init application
  const init = () => {
    renderHonorRoll('ALL');
    const settings = DB.getSettings();
    if (settings && settings.announcement) {
      document.getElementById('top-announcement-text').textContent = settings.announcement;
    }
  };

  document.addEventListener('DOMContentLoaded', init);

  return {
    init,
    handleSearch,
    searchByRoll,
    fillSampleRoll,
    hideResultSlip,
    printResultSlip,
    downloadResultPDF,
    shareResult,
    scrollToSection,
    toggleMobileMenu,
    filterHonorRoll,
    openAdminModal,
    closeAdminModal,
    handleAdminLogin,
    adminLogout,
    switchAdminTab,
    renderAdminStudentsTable,
    editStudent,
    handleSaveStudent,
    deleteStudent,
    clearStudentForm,
    updateAppeal,
    resetDataToDefaults,
    openAppealModal,
    closeAppealModal,
    openCertificateModal,
    openContactModal,
    closeInfoModal,
    handleAppealSubmit,
    handleSaveSettings
  };
})();
