import { db } from './firebase';
import { collection, onSnapshot, addDoc, doc, deleteDoc } from 'firebase/firestore';

// 1. Membaca Data Materi Real-time dari Firebase
useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, "materials"), (snapshot) => {
    const materialsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setMaterials(materialsData);
  });
  return () => unsubscribe();
}, []);

// 2. Menambah Materi Baru ke Firebase (Fungsi Guru)
const handleAddMaterial = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!newMaterial.title || !newMaterial.driveUrl) return;

  await addDoc(collection(db, "materials"), {
    ...newMaterial,
    date: new Date().toISOString().split('T')[0]
  });

  setIsMaterialModalOpen(false);
  showToast('Materi berhasil disimpan ke cloud Firebase!');
};
} from 'lucide-react';

// ==========================================
// MOCK DATA INITIALIZATION
// ==========================================
const INITIAL_MATERIALS = [
  { id: 'm1', title: 'Berpikir Komputasional & Algoritma', grade: 'X', category: 'Teori', driveUrl: 'https://drive.google.com', date: '2026-09-10' },
  { id: 'm2', title: 'Pemrograman Web Dasar (HTML/CSS)', grade: 'XI', category: 'Praktikum', driveUrl: 'https://drive.google.com', date: '2026-09-15' },
  { id: 'm3', title: 'Basis Data & SQL Advanced', grade: 'XII', category: 'Praktikum', driveUrl: 'https://drive.google.com', date: '2026-09-20' },
  { id: 'm4', title: 'Jaringan Komputer & Cybersecurity', grade: 'XI', category: 'Teori', driveUrl: 'https://drive.google.com', date: '2026-09-22' },
];

const INITIAL_ASSIGNMENTS = [
  { id: 'a1', title: 'Tugas 1: Analisis Algoritma Sorting', grade: 'X', deadline: '2026-10-05', status: 'Pending', link: '' },
  { id: 'a2', title: 'Tugas 2: Desain Layout Web Responsif', grade: 'XI', deadline: '2026-10-01', status: 'Submitted', link: 'https://drive.google.com/file/d/123' },
  { id: 'a3', title: 'Tugas 3: Query ERD & Normalisasi Database', grade: 'XII', deadline: '2026-09-28', status: 'Graded', link: 'https://drive.google.com/file/d/456', score: 95 },
];

const INITIAL_ANALYTICS = [
  { id: 's1', name: 'Alvaro Mamahit', grade: 'X IPA 1', visits: 42, lastActive: '2026-09-26 14:20', submissions: 5 },
  { id: 's2', name: 'Keisha Lumangkun', grade: 'XI MIPA 2', visits: 38, lastActive: '2026-09-26 16:45', submissions: 4 },
  { id: 's3', name: 'Gradianto Pongoh', grade: 'XII MIPA 1', visits: 55, lastActive: '2026-09-26 18:10', submissions: 6 },
  { id: 's4', name: 'Jesyca Wenas', grade: 'X IPA 3', visits: 29, lastActive: '2026-09-25 09:30', submissions: 3 },
];

export default function InformaticsApp() {
  // State Management
  const [darkMode, setDarkMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; role: 'teacher' | 'student'; grade?: string } | null>({
    name: 'Glendy A. Taawoeda, S.Pd',
    role: 'teacher'
  });
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'materials' | 'assignments' | 'analytics'>('dashboard');
  const [selectedGrade, setSelectedGrade] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Data States
  const [materials, setMaterials] = useState(() => {
    const saved = localStorage.getItem('sman4_materials');
    return saved ? JSON.parse(saved) : INITIAL_MATERIALS;
  });

  const [assignments, setAssignments] = useState(() => {
    const saved = localStorage.getItem('sman4_assignments');
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
  });

  const [analytics, setAnalytics] = useState(() => {
    const saved = localStorage.getItem('sman4_analytics');
    return saved ? JSON.parse(saved) : INITIAL_ANALYTICS;
  });

  // Modal States
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [newMaterial, setNewMaterial] = useState({ title: '', grade: 'X', category: 'Teori', driveUrl: '' });

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [submissionLink, setSubmissionLink] = useState('');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('sman4_materials', JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem('sman4_assignments', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('sman4_analytics', JSON.stringify(analytics));
  }, [analytics]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Handler CRUD Materi
  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMaterial.title || !newMaterial.driveUrl) return;

    const item = {
      id: `m_${Date.now()}`,
      ...newMaterial,
      date: new Date().toISOString().split('T')[0]
    };

    setMaterials([item, ...materials]);
    setIsMaterialModalOpen(false);
    setNewMaterial({ title: '', grade: 'X', category: 'Teori', driveUrl: '' });
    showToast('Materi baru berhasil ditambahkan!');
  };

  const handleDeleteMaterial = (id: string) => {
    setMaterials(materials.filter((m: any) => m.id !== id));
    showToast('Materi berhasil dihapus.');
  };

  // Handler Submit Tugas
  const handleSubmitAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionLink || !selectedAssignmentId) return;

    setAssignments(assignments.map((a: any) => 
      a.id === selectedAssignmentId ? { ...a, status: 'Submitted', link: submissionLink } : a
    ));

    setIsSubmitModalOpen(false);
    setSubmissionLink('');
    setSelectedAssignmentId(null);
    showToast('Tugas berhasil dikirim!');
  };

  // Export Analytics to CSV
  const exportToCSV = () => {
    const headers = "Nama Siswa,Kelas,Kunjungan Website,Tugas Dikirim,Terakhir Aktif\n";
    const rows = analytics.map((a: any) => `"${a.name}","${a.grade}",${a.visits},${a.submissions},"${a.lastActive}"`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Keaktifan_Siswa_SMAN4_Manado_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showToast('Data analitik berhasil diekspor ke CSV.');
  };

  // Filter Data based on Grade & Search
  const filteredMaterials = materials.filter((m: any) => 
    (selectedGrade === 'All' || m.grade === selectedGrade) &&
    m.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAssignments = assignments.filter((a: any) => 
    (selectedGrade === 'All' || a.grade === selectedGrade) &&
    a.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'} transition-colors duration-200`}>
      
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-indigo-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER / NAVIGATION */}
      <header className={`sticky top-0 z-40 border-b ${darkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-white/90 border-slate-200'} backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-200 dark:shadow-none">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Informatika SMAN 4 Manado</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Portal Pembelajaran Interaktif</p>
            </div>
          </div>

          {/* Search & User Profile */}
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari materi atau tugas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-9 pr-4 py-1.5 rounded-full text-sm outline-none border transition-all w-64 ${
                  darkMode 
                    ? 'bg-slate-700 border-slate-600 focus:border-indigo-400' 
                    : 'bg-slate-100 border-slate-200 focus:border-indigo-600'
                }`}
              />
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg border ${darkMode ? 'border-slate-700 hover:bg-slate-700' : 'border-slate-200 hover:bg-slate-100'}`}
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Profile Dropdown / Switch Role */}
            <div className="flex items-center gap-3 border-l pl-4 border-slate-200 dark:border-slate-700">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold leading-none">{currentUser?.name}</p>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                  {currentUser?.role === 'teacher' ? 'Guru Pengampu' : `Siswa Kelas ${currentUser?.grade}`}
                </span>
              </div>
              <button
                onClick={() => {
                  if (currentUser?.role === 'teacher') {
                    setCurrentUser({ name: 'Alvaro Mamahit', role: 'student', grade: 'X IPA 1' });
                    showToast('Beralih ke Tampilan Siswa');
                  } else {
                    setCurrentUser({ name: 'Glendy A. Taawoeda, S.Pd', role: 'teacher' });
                    showToast('Beralih ke Tampilan Guru');
                  }
                }}
                className="text-xs bg-slate-200 dark:bg-slate-700 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 px-2.5 py-1.5 rounded-md font-medium transition-colors"
                title="Klik untuk beralih mode Guru / Siswa"
              >
                Switch Role
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* SUB-HEADER CONTROLS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          {/* Tabs Navigation */}
          <nav className="flex space-x-1 bg-slate-200/60 dark:bg-slate-800 p-1 rounded-xl w-fit">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
              { id: 'materials', label: 'Materi (Drive)', icon: BookOpen },
              { id: 'assignments', label: 'Pengumpulan Tugas', icon: Upload },
              { id: 'analytics', label: 'Keaktifan Siswa', icon: Users },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Grade Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Filter Kelas:</span>
            {['All', 'X', 'XI', 'XII'].map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGrade(g)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  selectedGrade === g
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300'
                }`}
              >
                {g === 'All' ? 'Semua Kelas' : `Kelas ${g}`}
              </button>
            ))}
          </div>
        </div>

        {/* ========================================== */}
        {/* TAB 1: DASHBOARD OVERVIEW                   */}
        {/* ========================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* STATS METRIC CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-medium text-slate-500">Total Materi Aktif</p>
                    <h3 className="text-2xl font-bold mt-1">{materials.length}</h3>
                  </div>
                  <div className="p-2 bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 rounded-lg">
                    <BookOpen className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-xs text-emerald-500 font-medium mt-3 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Tersedia di Google Drive
                </p>
              </div>

              <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-medium text-slate-500">Tugas Terjadwal</p>
                    <h3 className="text-2xl font-bold mt-1">{assignments.length}</h3>
                  </div>
                  <div className="p-2 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400 rounded-lg">
                    <FileText className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-3">Untuk Kelas X, XI, & XII</p>
              </div>

              <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-medium text-slate-500">Kunjungan Siswa Hari Ini</p>
                    <h3 className="text-2xl font-bold mt-1">164</h3>
                  </div>
                  <div className="p-2 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400 rounded-lg">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-xs text-emerald-500 font-medium mt-3">+12% dari minggu lalu</p>
              </div>

              <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-medium text-slate-500">Rata-rata Keaktifan</p>
                    <h3 className="text-2xl font-bold mt-1">88.5%</h3>
                  </div>
                  <div className="p-2 bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400 rounded-lg">
                    <Award className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-xs text-amber-500 font-medium mt-3">Status Sangat Baik</p>
              </div>
            </div>

            {/* QUICK ACTIONS & BANNER */}
            <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-gradient-to-r from-slate-800 to-indigo-950 border-slate-700' : 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white'} shadow-md`}>
              <div className="max-w-2xl">
                <span className="text-xs bg-white/20 px-3 py-1 rounded-full uppercase tracking-wider font-semibold">
                  Tahun Ajaran 2026/2027
                </span>
                <h2 className="text-2xl font-bold mt-3">Selamat Datang di Portal Informatika SMAN 4 Manado</h2>
                <p className="mt-2 text-sm text-indigo-100 leading-relaxed">
                  Platform pembelajaran terpadu untuk mengakses modul materi resmi, mengumpulkan tugas berbasis cloud, dan memantau progres keaktifan belajar secara real-time.
                </p>
                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => setActiveTab('materials')}
                    className="bg-white text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm"
                  >
                    Akses Materi
                  </button>
                  <button
                    onClick={() => setActiveTab('assignments')}
                    className="bg-indigo-700/50 hover:bg-indigo-700 text-white border border-white/20 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                  >
                    Kirim Tugas
                  </button>
                </div>
              </div>
            </div>

            {/* RECENT MATERI PREVIEW */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Materi Pembelajaran Terbaru</h3>
                <button onClick={() => setActiveTab('materials')} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                  Lihat Semua
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {materials.slice(0, 4).map((item: any) => (
                  <div key={item.id} className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} flex justify-between items-center`}>
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-indigo-50 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 rounded-lg">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">{item.title}</h4>
                        <div className="flex gap-2 mt-1 text-xs text-slate-500">
                          <span className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">Kelas {item.grade}</span>
                          <span>•</span>
                          <span>{item.category}</span>
                        </div>
                      </div>
                    </div>
                    <a
                      href={item.driveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                      title="Buka Google Drive"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 2: MATERI PEMBELAJARAN (GOOGLE DRIVE)   */}
        {/* ========================================== */}
        {activeTab === 'materials' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Modul & Materi Pembelajaran</h2>
                <p className="text-xs text-slate-500">Diunggah langsung dari Google Drive Pengajar</p>
              </div>
              {currentUser?.role === 'teacher' && (
                <button
                  onClick={() => setIsMaterialModalOpen(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" /> Tambah Materi Drive
                </button>
              )}
            </div>

            {filteredMaterials.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
                <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">Tidak ada materi ditemukan untuk filter ini.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredMaterials.map((item: any) => (
                  <div
                    key={item.id}
                    className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold text-xs rounded-md">
                          Kelas {item.grade}
                        </span>
                        <span className="text-xs text-slate-400">{item.date}</span>
                      </div>
                      <h3 className="font-bold text-base mb-2">{item.title}</h3>
                      <p className="text-xs text-slate-500 mb-4">Kategori: {item.category}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                      <a
                        href={item.driveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        <ExternalLink className="w-4 h-4" /> Buka Google Drive
                      </a>
                      {currentUser?.role === 'teacher' && (
                        <button
                          onClick={() => handleDeleteMaterial(item.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Hapus Materi"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 3: PENGUMPULAN TUGAS                   */}
        {/* ========================================== */}
        {activeTab === 'assignments' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">Manajemen & Pengumpulan Tugas</h2>
              <p className="text-xs text-slate-500">Kirimkan tautan tugas (Google Drive / GitHub) sebelum tenggat waktu</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {filteredAssignments.map((assignment: any) => (
                <div
                  key={assignment.id}
                  className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} flex flex-col sm:flex-row justify-between sm:items-center gap-4`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded">
                        Kelas {assignment.grade}
                      </span>
                      <h3 className="font-bold text-base">{assignment.title}</h3>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-500" /> Tenggat: <span className="font-medium text-slate-700 dark:text-slate-300">{assignment.deadline}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {assignment.status === 'Pending' && (
                      <span className="px-3 py-1 bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 text-xs font-medium rounded-full border border-amber-200 dark:border-amber-800">
                        Belum Dikirim
                      </span>
                    )}
                    {assignment.status === 'Submitted' && (
                      <span className="px-3 py-1 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full border border-blue-200 dark:border-blue-800">
                        Sudah Dikirim
                      </span>
                    )}
                    {assignment.status === 'Graded' && (
                      <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full border border-emerald-200 dark:border-emerald-800">
                        Nilai: {assignment.score}/100
                      </span>
                    )}

                    {currentUser?.role === 'student' && assignment.status === 'Pending' && (
                      <button
                        onClick={() => {
                          setSelectedAssignmentId(assignment.id);
                          setIsSubmitModalOpen(true);
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all"
                      >
                        Kirim Tugas
                      </button>
                    )}

                    {assignment.link && (
                      <a
                        href={assignment.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 transition-colors"
                        title="Lihat Berkas Tugas"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 4: KEAKTIFAN SISWA & ANALITIK           */}
        {/* ========================================== */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Laporan Keaktifan Siswa</h2>
                <p className="text-xs text-slate-500">Monitoring jumlah kunjungan & statistik pengumpulan tugas</p>
              </div>
              <button
                onClick={exportToCSV}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 shadow-sm transition-all"
              >
                <Download className="w-4 h-4" /> Ekspor Data (CSV)
              </button>
            </div>

            {/* TABEL KEAKTIFAN */}
            <div className={`overflow-hidden rounded-2xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b text-xs font-semibold uppercase tracking-wider ${darkMode ? 'bg-slate-700/50 text-slate-400 border-slate-700' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                    <th className="p-4">Nama Siswa</th>
                    <th className="p-4">Kelas</th>
                    <th className="p-4">Jumlah Kunjungan</th>
                    <th className="p-4">Tugas Selesai</th>
                    <th className="p-4">Aktivitas Terakhir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm">
                  {analytics.map((student: any) => (
                    <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="p-4 font-semibold">{student.name}</td>
                      <td className="p-4 text-xs">
                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-md">
                          {student.grade}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{student.visits}</span> kali
                      </td>
                      <td className="p-4">{student.submissions} Tugas</td>
                      <td className="p-4 text-xs text-slate-400">{student.lastActive}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* ========================================== */}
      {/* MODAL: TAMBAH MATERI DRIVE (GURU)          */}
      {/* ========================================== */}
      {isMaterialModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-2xl p-6 shadow-xl ${darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white'}`}>
            <h3 className="text-lg font-bold mb-4">Tambah Materi Pembelajaran</h3>
            <form onSubmit={handleAddMaterial} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Judul Materi</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pengenalan Python Dasar"
                  value={newMaterial.title}
                  onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl text-sm outline-none border ${
                    darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">Kelas Target</label>
                  <select
                    value={newMaterial.grade}
                    onChange={(e) => setNewMaterial({ ...newMaterial, grade: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl text-sm outline-none border ${
                      darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <option value="X">Kelas X</option>
                    <option value="XI">Kelas XI</option>
                    <option value="XII">Kelas XII</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">Kategori</label>
                  <select
                    value={newMaterial.category}
                    onChange={(e) => setNewMaterial({ ...newMaterial, category: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl text-sm outline-none border ${
                      darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <option value="Teori">Teori</option>
                    <option value="Praktikum">Praktikum</option>
                    <option value="Proyek">Proyek</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Tautan Google Drive</label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/file/d/..."
                  value={newMaterial.driveUrl}
                  onChange={(e) => setNewMaterial({ ...newMaterial, driveUrl: e.target.value })}
                  className={`w-full px-3 py-2 rounded-xl text-sm outline-none border ${
                    darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'
                  }`}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsMaterialModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm"
                >
                  Simpan Materi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: SUBMIT TUGAS (SISWA)                */}
      {/* ========================================== */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-2xl p-6 shadow-xl ${darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white'}`}>
            <h3 className="text-lg font-bold mb-4">Pengumpulan Tugas</h3>
            <form onSubmit={handleSubmitAssignment} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Tautan Berkas (Google Drive / Cloud)</label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/file/d/..."
                  value={submissionLink}
                  onChange={(e) => setSubmissionLink(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-sm outline-none border ${
                    darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'
                  }`}
                />
                <p className="text-[10px] text-slate-400 mt-1">Pastikan izin akses tautan Google Drive telah diubah menjadi "Siapa saja yang memiliki link".</p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm"
                >
                  Kirim Berkas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}