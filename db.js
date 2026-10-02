/* ============================================================
   HARGEYSA EXAMINATION RESULTS PORTAL
   Database Engine (localStorage & Seed Data)
   ============================================================ */

const DB = (() => {
  const KEYS = {
    STUDENTS: 'hargeysa_students_v2',
    APPEALS:  'hargeysa_appeals_v2',
    SETTINGS: 'hargeysa_settings_v2',
  };

  // Helper read/write
  const read = (key, fallback) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.error('Local Storage Read Error:', e);
      return fallback;
    }
  };

  const write = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Local Storage Write Error:', e);
    }
  };

  // Subject schema defaults
  const STANDARD_SUBJECTS = [
    { code: 'SOM', name: 'Af-Somali', max: 100 },
    { code: 'MATH', name: 'Basic Mathematics', max: 100 },
    { code: 'PHY', name: 'Physics (Fiisikis)', max: 100 },
    { code: 'ISL', name: 'Islamic Studies', max: 100 },
    { code: 'BIO', name: 'Biology (Biyoolaji)', max: 100 },
    { code: 'CHM', name: 'Chemistry (Kimiya)', max: 100 },
    { code: 'ENG', name: 'English (Ingiriisi)', max: 100 },
    { code: 'TAR', name: 'Tarbiya/Taariikh', max: 100 },
    { code: 'GEO', name: 'Geography & History', max: 100 },
  ];

  // Grade calculator helper
  const getGradeInfo = (score) => {
    if (score >= 93) return { grade: 'A+', label: 'Distinction', color: 'badge-a-plus' };
    if (score >= 88) return { grade: 'A',  label: 'Distinction', color: 'badge-a-plus' };
    if (score >= 84) return { grade: 'A-', label: 'Excellent',   color: 'badge-a' };
    if (score >= 78) return { grade: 'B+', label: 'Very Good',   color: 'badge-a-minus' };
    if (score >= 70) return { grade: 'B',  label: 'Good',        color: 'badge-b' };
    if (score >= 60) return { grade: 'C',  label: 'Pass',        color: 'badge-pass' };
    if (score >= 50) return { grade: 'D',  label: 'Pass',        color: 'badge-pass' };
    return { grade: 'F', label: 'Fail', color: 'badge-fail' };
  };

  // Pre-seeded Realistic Hargeysa Exam Students Data
  const INITIAL_STUDENTS = [
    {
      id: 'std-84920',
      rollNumber: 'HRG-84920-24',
      name: 'Cabdiraxmaan Maxamed Cumar',
      school: 'Dugsiga Sare ee Gaandi - Hargeysa',
      gradeLevel: 'Fasalka 8aad',
      academicYear: '2024-2025',
      location: 'Maroodi-Jeex (Hargeysa)',
      rankPosition: 'Kaalmada 2aad',
      overallGrade: 'Hoor Sare (A)',
      status: 'GUULAYSTAY',
      subjects: [
        { name: 'Af-Somali', max: 100, score: 94, grade: 'A+', status: 'Distinction' },
        { name: 'Basic Mathematics', max: 100, score: 91, grade: 'A', status: 'Very Good' },
        { name: 'Physics (Fiisikis)', max: 100, score: 85, grade: 'A-', status: 'Excellent' },
        { name: 'Islamic Studies', max: 100, score: 92, grade: 'A+', status: 'Very Good' },
        { name: 'Biology (Biyoolaji)', max: 100, score: 89, grade: 'A', status: 'Distinction' },
        { name: 'Chemistry (Kimiya)', max: 100, score: 92, grade: 'A+', status: 'Distinction' },
        { name: 'English (Ingiriisi)', max: 100, score: 90, grade: 'A', status: 'Distinction' },
        { name: 'Tarbiya/Taariikh', max: 100, score: 90, grade: 'A', status: 'Distinction' },
        { name: 'Geography & History', max: 100, score: 89, grade: 'A-', status: 'Excellent' },
      ],
      createdAt: '2025-01-10T08:00:00.000Z'
    },
    {
      id: 'std-11001',
      rollNumber: 'HRG-11001-24',
      name: 'Khadra Axmed Cali',
      school: 'Dugsiga S. ee Nuuradiin (Gabdaha)',
      gradeLevel: 'Fasalka 12aad',
      academicYear: '2024-2025',
      location: 'Maroodi-Jeex (Hargeysa)',
      rankPosition: 'Kaalmada 1aad (Top 1)',
      overallGrade: 'Darajada Saree (A+)',
      status: 'GUULAYSTAY',
      subjects: [
        { name: 'Af-Somali', max: 100, score: 98, grade: 'A+', status: 'Distinction' },
        { name: 'Basic Mathematics', max: 100, score: 96, grade: 'A+', status: 'Distinction' },
        { name: 'Physics (Fiisikis)', max: 100, score: 94, grade: 'A+', status: 'Distinction' },
        { name: 'Islamic Studies', max: 100, score: 97, grade: 'A+', status: 'Distinction' },
        { name: 'Biology (Biyoolaji)', max: 100, score: 95, grade: 'A+', status: 'Distinction' },
        { name: 'Chemistry (Kimiya)', max: 100, score: 93, grade: 'A+', status: 'Distinction' },
        { name: 'English (Ingiriisi)', max: 100, score: 95, grade: 'A+', status: 'Distinction' },
        { name: 'Tarbiya/Taariikh', max: 100, score: 96, grade: 'A+', status: 'Distinction' },
        { name: 'Geography & History', max: 100, score: 95, grade: 'A+', status: 'Distinction' },
      ],
      createdAt: '2025-01-10T08:15:00.000Z'
    },
    {
      id: 'std-12901',
      rollNumber: 'HRG-12901-24',
      name: 'Maxamed Cusmaan Faarax',
      school: 'Dugsiga S. ee SOS HG Hargeysa',
      gradeLevel: 'Fasalka 12aad',
      academicYear: '2024-2025',
      location: 'Maroodi-Jeex (Hargeysa)',
      rankPosition: 'Kaalmada 2aad',
      overallGrade: 'Darajada Saree (A+)',
      status: 'GUULAYSTAY',
      subjects: [
        { name: 'Af-Somali', max: 100, score: 95, grade: 'A+', status: 'Distinction' },
        { name: 'Basic Mathematics', max: 100, score: 94, grade: 'A+', status: 'Distinction' },
        { name: 'Physics (Fiisikis)', max: 100, score: 92, grade: 'A+', status: 'Distinction' },
        { name: 'Islamic Studies', max: 100, score: 96, grade: 'A+', status: 'Distinction' },
        { name: 'Biology (Biyoolaji)', max: 100, score: 93, grade: 'A+', status: 'Distinction' },
        { name: 'Chemistry (Kimiya)', max: 100, score: 94, grade: 'A+', status: 'Distinction' },
        { name: 'English (Ingiriisi)', max: 100, score: 95, grade: 'A+', status: 'Distinction' },
        { name: 'Tarbiya/Taariikh', max: 100, score: 94, grade: 'A+', status: 'Distinction' },
        { name: 'Geography & History', max: 100, score: 94, grade: 'A+', status: 'Distinction' },
      ],
      createdAt: '2025-01-10T08:30:00.000Z'
    },
    {
      id: 'std-15491',
      rollNumber: 'HRG-15491-24',
      name: 'Nimco Jaamac Warsame',
      school: 'Dugsiga S. ee Abaarso',
      gradeLevel: 'Fasalka 12aad',
      academicYear: '2024-2025',
      location: 'Maroodi-Jeex (Hargeysa)',
      rankPosition: 'Kaalmada 4aad',
      overallGrade: 'Darajada (A)',
      status: 'GUULAYSTAY',
      subjects: [
        { name: 'Af-Somali', max: 100, score: 91, grade: 'A', status: 'Distinction' },
        { name: 'Basic Mathematics', max: 100, score: 88, grade: 'A', status: 'Very Good' },
        { name: 'Physics (Fiisikis)', max: 100, score: 87, grade: 'A', status: 'Very Good' },
        { name: 'Islamic Studies', max: 100, score: 90, grade: 'A', status: 'Distinction' },
        { name: 'Biology (Biyoolaji)', max: 100, score: 89, grade: 'A', status: 'Distinction' },
        { name: 'Chemistry (Kimiya)', max: 100, score: 88, grade: 'A', status: 'Very Good' },
        { name: 'English (Ingiriisi)', max: 100, score: 92, grade: 'A+', status: 'Distinction' },
        { name: 'Tarbiya/Taariikh', max: 100, score: 88, grade: 'A', status: 'Very Good' },
        { name: 'Geography & History', max: 100, score: 89, grade: 'A', status: 'Distinction' },
      ],
      createdAt: '2025-01-10T08:45:00.000Z'
    },
    {
      id: 'std-17112',
      rollNumber: 'HRG-17112-24',
      name: 'Xamse Cabdillaahi Cise',
      school: 'Dugsiga S. ee Dayaxa',
      gradeLevel: 'Fasalka 8aad',
      academicYear: '2024-2025',
      location: 'Maroodi-Jeex (Hargeysa)',
      rankPosition: 'Kaalmada 5aad',
      overallGrade: 'Darajada (A)',
      status: 'GUULAYSTAY',
      subjects: [
        { name: 'Af-Somali', max: 100, score: 89, grade: 'A', status: 'Distinction' },
        { name: 'Basic Mathematics', max: 100, score: 88, grade: 'A', status: 'Very Good' },
        { name: 'Physics (Fiisikis)', max: 100, score: 86, grade: 'A', status: 'Very Good' },
        { name: 'Islamic Studies', max: 100, score: 91, grade: 'A', status: 'Distinction' },
        { name: 'Biology (Biyoolaji)', max: 100, score: 88, grade: 'A', status: 'Very Good' },
        { name: 'Chemistry (Kimiya)', max: 100, score: 87, grade: 'A', status: 'Very Good' },
        { name: 'English (Ingiriisi)', max: 100, score: 89, grade: 'A', status: 'Distinction' },
        { name: 'Tarbiya/Taariikh', max: 100, score: 88, grade: 'A', status: 'Very Good' },
        { name: 'Geography & History', max: 100, score: 90, grade: 'A', status: 'Distinction' },
      ],
      createdAt: '2025-01-10T09:00:00.000Z'
    }
  ];

  const INITIAL_APPEALS = [
    {
      id: 'app-001',
      rollNumber: 'HRG-84920-24',
      studentName: 'Cabdiraxmaan Maxamed Cumar',
      subject: 'Physics (Fiisikis)',
      reason: 'Waxaan aaminsanahay in qaybta 2aad ee imtixaanka dhibco anay ii raacin.',
      status: 'PENDING',
      createdAt: '2025-01-12T10:00:00.000Z'
    }
  ];

  const INITIAL_SETTINGS = {
    announcement: 'Natiijooyinka Imtixaanka Fasalka 8aad iyo 12aad ee Sanad Dugsiyadeedka 2024/2025 waa la soo saaray!',
    portalTitle: 'Hargeysa Examination Results',
    academicYear: '2024-2025'
  };

  // Self Initialization
  const init = () => {
    if (!localStorage.getItem(KEYS.STUDENTS)) {
      write(KEYS.STUDENTS, INITIAL_STUDENTS);
    }
    if (!localStorage.getItem(KEYS.APPEALS)) {
      write(KEYS.APPEALS, INITIAL_APPEALS);
    }
    if (!localStorage.getItem(KEYS.SETTINGS)) {
      write(KEYS.SETTINGS, INITIAL_SETTINGS);
    }
  };

  init();

  // Calculation helpers
  const calculateTotals = (student) => {
    let totalScore = 0;
    let totalMax = 0;
    
    if (student.subjects && Array.isArray(student.subjects)) {
      student.subjects.forEach(s => {
        totalScore += Number(s.score) || 0;
        totalMax += Number(s.max) || 100;
      });
    }

    const percentage = totalMax > 0 ? ((totalScore / totalMax) * 100).toFixed(1) : 0;
    const gradeObj = getGradeInfo(percentage);

    return {
      totalScore,
      totalMax,
      percentage,
      overallGrade: gradeObj.grade + ' (' + gradeObj.label + ')'
    };
  };

  return {
    getSTANDARD_SUBJECTS: () => STANDARD_SUBJECTS,

    getStudents: () => {
      return read(KEYS.STUDENTS, INITIAL_STUDENTS);
    },

    getStudentByRoll: (rollNum) => {
      const students = read(KEYS.STUDENTS, INITIAL_STUDENTS);
      const cleanRoll = rollNum.trim().toUpperCase();
      return students.find(s => s.rollNumber.toUpperCase() === cleanRoll) || null;
    },

    saveStudent: (studentData) => {
      const students = read(KEYS.STUDENTS, INITIAL_STUDENTS);
      const calculations = calculateTotals(studentData);
      
      const newStudent = {
        ...studentData,
        rollNumber: studentData.rollNumber.trim().toUpperCase(),
        totalScore: calculations.totalScore,
        totalMax: calculations.totalMax,
        percentage: calculations.percentage,
        overallGrade: studentData.overallGrade || calculations.overallGrade,
        status: studentData.status || (calculations.percentage >= 50 ? 'GUULAYSTAY' : 'DHACAY'),
        createdAt: studentData.createdAt || new Date().toISOString()
      };

      const existingIndex = students.findIndex(s => s.id === newStudent.id || s.rollNumber === newStudent.rollNumber);
      
      if (existingIndex >= 0) {
        students[existingIndex] = { ...students[existingIndex], ...newStudent };
      } else {
        newStudent.id = 'std-' + Date.now().toString(36);
        students.unshift(newStudent);
      }

      write(KEYS.STUDENTS, students);
      return newStudent;
    },

    deleteStudent: (id) => {
      let students = read(KEYS.STUDENTS, INITIAL_STUDENTS);
      students = students.filter(s => s.id !== id);
      write(KEYS.STUDENTS, students);
    },

    getAppeals: () => {
      return read(KEYS.APPEALS, INITIAL_APPEALS);
    },

    saveAppeal: (appealData) => {
      const appeals = read(KEYS.APPEALS, INITIAL_APPEALS);
      const newAppeal = {
        id: 'app-' + Date.now().toString(36),
        ...appealData,
        status: 'PENDING',
        createdAt: new Date().toISOString()
      };
      appeals.unshift(newAppeal);
      write(KEYS.APPEALS, appeals);
      return newAppeal;
    },

    updateAppealStatus: (id, newStatus) => {
      const appeals = read(KEYS.APPEALS, INITIAL_APPEALS);
      const appeal = appeals.find(a => a.id === id);
      if (appeal) {
        appeal.status = newStatus;
        write(KEYS.APPEALS, appeals);
      }
    },

    getSettings: () => {
      return read(KEYS.SETTINGS, INITIAL_SETTINGS);
    },

    saveSettings: (settingsData) => {
      write(KEYS.SETTINGS, settingsData);
    },

    resetToDefaults: () => {
      write(KEYS.STUDENTS, INITIAL_STUDENTS);
      write(KEYS.APPEALS, INITIAL_APPEALS);
      write(KEYS.SETTINGS, INITIAL_SETTINGS);
    }
  };
})();
