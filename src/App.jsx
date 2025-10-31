import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, Users, Briefcase, Plus, Search, Edit2, Trash2, X, Check, Clock, UserCheck, User, BarChart3, PieChart, TrendingUp, ChevronLeft, ChevronRight, Filter, LogOut, Menu, LayoutDashboard, LogIn, Mail, Lock } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, RadialBarChart, RadialBar } from 'recharts';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [entretienFilter, setEntretienFilter] = useState('tous');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  
  const [recruteurs, setRecruteurs] = useState([
    { id: 1, nom: 'Dupont', prenom: 'Jean', email: 'jean.dupont@email.com', telephone: '0611111111', specialite: 'IT', disponibilites: ['2025-11-05', '2025-11-07', '2025-11-10'], statut: 'disponible' },
    { id: 2, nom: 'Lefebvre', prenom: 'Marie', email: 'marie.lefebvre@email.com', telephone: '0622222222', specialite: 'Design', disponibilites: ['2025-11-06', '2025-11-08', '2025-11-11'], statut: 'disponible' },
    { id: 3, nom: 'Bernard', prenom: 'Paul', email: 'paul.bernard@email.com', telephone: '0633333333', specialite: 'Management', disponibilites: ['2025-11-05', '2025-11-09'], statut: 'occupe' },
  ]);
  
  const [candidats, setCandidats] = useState([
    { id: 1, nom: 'Dubois', prenom: 'Marie', email: 'marie.dubois@email.com', telephone: '0612345678', statut: 'en_attente', poste: 'Développeur Full Stack', datePostulation: '2025-10-15', recruteurId: null },
    { id: 2, nom: 'Martin', prenom: 'Pierre', email: 'pierre.martin@email.com', telephone: '0623456789', statut: 'accepte', poste: 'Designer UI/UX', datePostulation: '2025-10-20', recruteurId: 2 },
    { id: 3, nom: 'Bernard', prenom: 'Sophie', email: 'sophie.bernard@email.com', telephone: '0634567890', statut: 'refuse', poste: 'Chef de Projet', datePostulation: '2025-10-10', recruteurId: 3 },
    { id: 4, nom: 'Durand', prenom: 'Lucas', email: 'lucas.durand@email.com', telephone: '0645678901', statut: 'en_attente', poste: 'Développeur Frontend', datePostulation: '2025-10-25', recruteurId: null },
    { id: 5, nom: 'Moreau', prenom: 'Emma', email: 'emma.moreau@email.com', telephone: '0656789012', statut: 'accepte', poste: 'Product Manager', datePostulation: '2025-10-18', recruteurId: 3 },
  ]);

  const [entretiens, setEntretiens] = useState([
    { id: 1, candidatId: 1, recruteurId: 1, date: '2025-11-05', heure: '10:00', duree: 60, lieu: 'Salle A', statut: 'planifie', notes: '' },
    { id: 2, candidatId: 2, recruteurId: 2, date: '2025-11-06', heure: '14:00', duree: 45, lieu: 'Salle B', statut: 'termine', notes: 'Excellent candidat, très prometteur' },
    { id: 3, candidatId: 4, recruteurId: 1, date: '2025-11-08', heure: '11:00', duree: 30, lieu: 'Salle A', statut: 'planifie', notes: '' },
    { id: 4, candidatId: 5, recruteurId: 3, date: '2025-10-28', heure: '15:00', duree: 60, lieu: 'Salle C', statut: 'termine', notes: 'Candidat accepté' },
    { id: 5, candidatId: 3, recruteurId: 3, date: '2025-10-30', heure: '16:00', duree: 30, lieu: 'Salle C', statut: 'annule', notes: 'Annulé par le candidat' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({});
  const [validationError, setValidationError] = useState('');

  // Fonction de connexion
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    
    // Simulation d'authentification simple
    // En production, cela devrait être une vraie API
    const validCredentials = [
      { email: 'admin@email.com', password: 'admin123', name: 'Admin', role: 'admin' },
      { email: 'recruteur@email.com', password: 'rec123', name: 'Jean Dupont', role: 'recruteur' },
    ];
    
    const user = validCredentials.find(
      cred => cred.email === loginForm.email && cred.password === loginForm.password
    );
    
    if (user) {
      setCurrentUser({ name: user.name, role: user.role, email: user.email });
      setIsAuthenticated(true);
      setLoginForm({ email: '', password: '' });
    } else {
      setLoginError('Email ou mot de passe incorrect');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentView('dashboard');
  };

  const getRecruteurById = (id) => recruteurs.find(r => r.id === id);
  const getCandidatById = (id) => candidats.find(c => c.id === id);

  const getStatutBadge = (statut) => {
    const classes = {
      en_attente: 'badge badge-yellow',
      accepte: 'badge badge-green',
      refuse: 'badge badge-red',
      planifie: 'badge badge-blue',
      termine: 'badge badge-gray',
      annule: 'badge badge-red',
      disponible: 'badge badge-green',
      occupe: 'badge badge-yellow'
    };
    const labels = {
      en_attente: 'En attente',
      accepte: 'Accepté',
      refuse: 'Refusé',
      planifie: 'Planifié',
      termine: 'Terminé',
      annule: 'Annulé',
      disponible: 'Disponible',
      occupe: 'Occupé'
    };
    return <span className={classes[statut]}>{labels[statut]}</span>;
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setFormData(item || {});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setSelectedItem(null);
    setFormData({});
    setValidationError('');
  };

  // Fonction pour convertir l'heure en minutes depuis minuit
  const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Fonction pour calculer l'heure de fin
  const getEndTime = (date, heure, duree) => {
    const startMinutes = timeToMinutes(heure);
    const endMinutes = startMinutes + duree;
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    return { hours: endHours, minutes: endMins };
  };

  // Fonction pour vérifier si deux plages horaires se chevauchent
  const hasTimeOverlap = (date1, heure1, duree1, date2, heure2, duree2) => {
    if (date1 !== date2) return false;
    
    const start1 = timeToMinutes(heure1);
    const end1 = start1 + duree1;
    const start2 = timeToMinutes(heure2);
    const end2 = start2 + duree2;
    
    // Vérifier si les plages se chevauchent
    return !(end1 <= start2 || end2 <= start1);
  };

  // Constantes pour les validations
  const MIN_DURATION = 15; // Durée minimale en minutes
  const MAX_DURATION = 180; // Durée maximale en minutes (3 heures)
  const BUFFER_TIME = 5; // Marge entre deux entretiens en minutes

  // Fonction pour vérifier si deux plages se chevauchent avec une marge
  const hasTimeOverlapWithBuffer = (date1, heure1, duree1, date2, heure2, duree2, buffer = 0) => {
    if (date1 !== date2) return false;
    
    const start1 = timeToMinutes(heure1);
    const end1 = start1 + duree1 + buffer;
    const start2 = timeToMinutes(heure2);
    const end2 = start2 + duree2 + buffer;
    
    // Vérifier si les plages se chevauchent : (StartA < EndB) AND (StartB < EndA)
    return (start1 < end2) && (start2 < end1);
  };

  // Fonction de validation pour les entretiens
  const validateEntretien = (formData, isEdit = false, editingId = null) => {
    setValidationError('');
    
    // Vérifier que tous les champs requis sont remplis
    if (!formData.candidatId || !formData.recruteurId || !formData.date || !formData.heure || !formData.lieu || !formData.duree) {
      setValidationError('Tous les champs sont requis, y compris la durée.');
      return false;
    }

    // Vérifier que la durée est valide
    const duree = parseInt(formData.duree);
    if (isNaN(duree) || duree <= 0) {
      setValidationError('La durée doit être un nombre positif supérieur à 0 minutes.');
      return false;
    }

    if (duree < MIN_DURATION) {
      setValidationError(`La durée minimale est de ${MIN_DURATION} minutes.`);
      return false;
    }

    if (duree > MAX_DURATION) {
      setValidationError(`La durée maximale est de ${MAX_DURATION} minutes (3 heures).`);
      return false;
    }

    // Vérifier que l'heure de fin > heure de début
    const startMinutes = timeToMinutes(formData.heure);
    const endMinutes = startMinutes + duree;
    if (endMinutes <= startMinutes) {
      setValidationError('L\'heure de fin doit être postérieure à l\'heure de début.');
      return false;
    }

    // Vérifier que la date n'est pas dans le passé
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const entretienDate = new Date(formData.date);
    entretienDate.setHours(0, 0, 0, 0);
    
    if (entretienDate < today) {
      setValidationError('Vous ne pouvez pas planifier un entretien dans le passé.');
      return false;
    }

    // Vérifier qu'un candidat ne peut avoir qu'un seul entretien
    const existingEntretienForCandidat = entretiens.find(
      e => e.candidatId === parseInt(formData.candidatId) && (isEdit ? e.id !== editingId : true)
    );
    if (existingEntretienForCandidat) {
      const candidat = getCandidatById(parseInt(formData.candidatId));
      const existingEndTime = getEndTime(existingEntretienForCandidat.date, existingEntretienForCandidat.heure, existingEntretienForCandidat.duree || 60);
      setValidationError(
        `Le candidat ${candidat?.prenom} ${candidat?.nom} a déjà un entretien prévu le ${existingEntretienForCandidat.date} de ${existingEntretienForCandidat.heure} à ${existingEndTime.hours}:${String(existingEndTime.minutes).padStart(2, '0')}. Un candidat ne peut avoir qu'un seul entretien.`
      );
      return false;
    }

    // Vérifier les conflits de salle/heure/durée avec marge
    const conflictingSalle = entretiens.find(e => {
      if (isEdit && e.id === editingId) return false;
      
      // Vérifier si même salle
      if (e.lieu !== formData.lieu) return false;
      
      // Vérifier si même date et horaires qui se chevauchent avec marge
      return hasTimeOverlapWithBuffer(
        formData.date, formData.heure, duree,
        e.date, e.heure, e.duree || 60,
        BUFFER_TIME
      );
    });

    if (conflictingSalle) {
      const endTime = getEndTime(formData.date, formData.heure, duree);
      const conflictingEndTime = getEndTime(conflictingSalle.date, conflictingSalle.heure, conflictingSalle.duree || 60);
      setValidationError(
        `Conflit de salle et horaire ! La ${formData.lieu} est déjà réservée le ${conflictingSalle.date} de ${conflictingSalle.heure} à ${conflictingEndTime.hours}:${String(conflictingEndTime.minutes).padStart(2, '0')}. ` +
        `Votre entretien (${formData.heure} - ${endTime.hours}:${String(endTime.minutes).padStart(2, '0')}) chevauche cette plage horaire. Une marge de ${BUFFER_TIME} minutes est requise entre deux entretiens dans la même salle.`
      );
      return false;
    }

    // Vérifier les conflits de recruteur/heure/durée avec marge
    const conflictingRecruteur = entretiens.find(e => {
      if (isEdit && e.id === editingId) return false;
      
      // Vérifier si même recruteur
      if (e.recruteurId !== parseInt(formData.recruteurId)) return false;
      
      // Vérifier si même date et horaires qui se chevauchent avec marge
      return hasTimeOverlapWithBuffer(
        formData.date, formData.heure, duree,
        e.date, e.heure, e.duree || 60,
        BUFFER_TIME
      );
    });

    if (conflictingRecruteur) {
      const recruteur = getRecruteurById(parseInt(formData.recruteurId));
      const endTime = getEndTime(formData.date, formData.heure, duree);
      const conflictingEndTime = getEndTime(conflictingRecruteur.date, conflictingRecruteur.heure, conflictingRecruteur.duree || 60);
      setValidationError(
        `Conflit de disponibilité du recruteur ! ${recruteur?.prenom} ${recruteur?.nom} a déjà un entretien le ${conflictingRecruteur.date} de ${conflictingRecruteur.heure} à ${conflictingEndTime.hours}:${String(conflictingEndTime.minutes).padStart(2, '0')}. ` +
        `Votre entretien (${formData.heure} - ${endTime.hours}:${String(endTime.minutes).padStart(2, '0')}) chevauche cette plage horaire. Un recruteur ne peut pas animer deux entretiens simultanés.`
      );
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (modalType === 'candidat') {
      if (selectedItem) {
        setCandidats(candidats.map(c => c.id === selectedItem.id ? { ...formData, id: selectedItem.id } : c));
      } else {
        setCandidats([...candidats, { ...formData, id: Date.now(), statut: 'en_attente', datePostulation: new Date().toISOString().split('T')[0], recruteurId: null }]);
      }
    } else if (modalType === 'entretien') {
      // Valider l'entretien avant de le sauvegarder
      const isEdit = !!selectedItem;
      const editingId = selectedItem?.id;
      
      if (!validateEntretien(formData, isEdit, editingId)) {
        return; // Ne pas fermer le modal si la validation échoue
      }

      // Convertir duree en nombre si c'est une string
      const entretienData = {
        ...formData,
        duree: parseInt(formData.duree) || 60,
        candidatId: parseInt(formData.candidatId),
        recruteurId: parseInt(formData.recruteurId)
      };

      if (selectedItem) {
        setEntretiens(entretiens.map(e => e.id === selectedItem.id ? { ...entretienData, id: selectedItem.id } : e));
      } else {
        setEntretiens([...entretiens, { 
          ...entretienData, 
          id: Date.now(), 
          recruteurId: currentUser?.role === 'admin' ? entretienData.recruteurId : (currentUser ? 1 : null), 
          statut: 'planifie', 
          notes: entretienData.notes || '' 
        }]);
      }
    } else if (modalType === 'recruteur') {
      if (selectedItem) {
        setRecruteurs(recruteurs.map(r => r.id === selectedItem.id ? { ...formData, id: selectedItem.id, disponibilites: formData.disponibilites || [] } : r));
      } else {
        setRecruteurs([...recruteurs, { ...formData, id: Date.now(), statut: 'disponible', disponibilites: [] }]);
      }
    }
    closeModal();
  };

  const handleDelete = (type, id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      if (type === 'candidat') {
        setCandidats(candidats.filter(c => c.id !== id));
        setEntretiens(entretiens.filter(e => e.candidatId !== id));
      } else if (type === 'entretien') {
        setEntretiens(entretiens.filter(e => e.id !== id));
      } else if (type === 'recruteur') {
        setRecruteurs(recruteurs.filter(r => r.id !== id));
        setEntretiens(entretiens.filter(e => e.recruteurId !== id));
      }
    }
  };

  const assignRecruteurToCandidat = (candidatId, recruteurId) => {
    setCandidats(candidats.map(c => c.id === candidatId ? { ...c, recruteurId } : c));
  };

  const filteredCandidats = candidats.filter(c => 
    c.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = useMemo(() => {
    const now = new Date();
    const entretiensAVenir = entretiens.filter(e => {
      const entretienDate = new Date(e.date + 'T' + e.heure);
      return entretienDate > now && e.statut === 'planifie';
    });
    const entretiensPasses = entretiens.filter(e => {
      const entretienDate = new Date(e.date + 'T' + e.heure);
      return entretienDate < now || e.statut === 'termine';
    });

    return {
    totalCandidats: candidats.length,
    enAttente: candidats.filter(c => c.statut === 'en_attente').length,
    acceptes: candidats.filter(c => c.statut === 'accepte').length,
      refuses: candidats.filter(c => c.statut === 'refuse').length,
      entretiensPrevus: entretiens.filter(e => e.statut === 'planifie').length,
      entretiensTermines: entretiens.filter(e => e.statut === 'termine').length,
      entretiensAVenir: entretiensAVenir.length,
      entretiensPasses: entretiensPasses.length,
      totalRecruteurs: recruteurs.length,
      recruteursDisponibles: recruteurs.filter(r => r.statut === 'disponible').length,
    };
  }, [candidats, entretiens, recruteurs]);

  // Chart data with colors from image
  const statutCandidatsData = [
    { name: 'Acceptés', value: stats.acceptes, color: '#27ae60', fill: 'url(#colorSuccess)' },
    { name: 'En attente', value: stats.enAttente, color: '#f39c12', fill: 'url(#colorWarning)' },
    { name: 'Refusés', value: stats.refuses, color: '#e74c3c', fill: 'url(#colorDanger)' },
  ];

  const statutEntretiensData = [
    { name: 'Terminés', value: stats.entretiensTermines, color: '#1a2b4d', fill: 'url(#colorPrimary)' },
    { name: 'Planifiés', value: stats.entretiensPrevus, color: '#3498db', fill: 'url(#colorBlue)' },
    { name: 'Annulés', value: entretiens.filter(e => e.statut === 'annule').length, color: '#e74c3c', fill: 'url(#colorDanger)' },
  ];

  const candidatsParMois = useMemo(() => {
    const mois = {};
    candidats.forEach(c => {
      const date = new Date(c.datePostulation);
      const moisNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
      const key = `${moisNames[date.getMonth()]} ${date.getFullYear()}`;
      mois[key] = (mois[key] || 0) + 1;
    });
    return Object.entries(mois).sort().map(([name, value]) => ({ name, value }));
  }, [candidats]);

  const entretiensParJour = useMemo(() => {
    const grouped = entretiens.reduce((acc, e) => {
      const date = new Date(e.date);
      const key = date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => new Date(a.name) - new Date(b.name))
      .slice(-7);
  }, [entretiens]);

  const entretiensParRecruteur = useMemo(() => {
    return recruteurs.map(r => {
      const recruteurEntretiens = entretiens.filter(e => e.recruteurId === r.id);
      return {
        name: `${r.prenom} ${r.nom}`,
        value: recruteurEntretiens.length,
        fill: `url(#colorRecruiter${r.id})`
      };
    });
  }, [recruteurs, entretiens]);

  const performanceRate = useMemo(() => {
    const total = stats.acceptes + stats.refuses;
    if (total === 0) return 0;
    return Math.round((stats.acceptes / total) * 100);
  }, [stats]);

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="tooltip-item" style={{ color: entry.color }}>
              <span className="tooltip-name">{entry.name}:</span>
              <span className="tooltip-value">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom Legend Component
  const CustomLegend = ({ payload }) => {
    return (
      <div className="chart-legend">
        {payload.map((entry, index) => (
          <div key={index} className="legend-item-custom">
            <span className="legend-color-box" style={{ backgroundColor: entry.color }}></span>
            <span className="legend-text">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderDashboard = () => (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-info">
              <p>Total Candidats</p>
              <p className="stat-value">{stats.totalCandidats}</p>
            </div>
            <Users className="stat-icon" />
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-info">
              <p>En Attente</p>
              <p className="stat-value yellow">{stats.enAttente}</p>
            </div>
            <Clock className="stat-icon yellow" />
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-info">
              <p>Acceptés</p>
              <p className="stat-value green">{stats.acceptes}</p>
            </div>
            <Check className="stat-icon green" />
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-info">
              <p>Entretiens Prévus</p>
              <p className="stat-value purple">{stats.entretiensPrevus}</p>
            </div>
            <CalendarIcon className="stat-icon purple" />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-info">
              <p>Entretiens Terminés</p>
              <p className="stat-value gray">{stats.entretiensTermines}</p>
            </div>
            <Check className="stat-icon gray" />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-info">
              <p>Recruteurs Disponibles</p>
              <p className="stat-value blue">{stats.recruteursDisponibles}/{stats.totalRecruteurs}</p>
            </div>
            <UserCheck className="stat-icon blue" />
          </div>
        </div>
      </div>

      <div className="dashboard-charts">
        {/* Performance Indicator */}
        <div className="chart-card performance-card">
          <h3 className="section-title">Taux de Performance</h3>
          <div className="performance-indicator">
            <ResponsiveContainer width="100%" height={250}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={[{ name: 'Performance', value: performanceRate }]}>
                <defs>
                  <linearGradient id="colorPerformance" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#1a2b4d" stopOpacity={1} />
                    <stop offset="50%" stopColor="#e74c3c" stopOpacity={1} />
                    <stop offset="100%" stopColor="#3498db" stopOpacity={1} />
                  </linearGradient>
                </defs>
                <RadialBar 
                  dataKey="value" 
                  cornerRadius={10}
                  fill="url(#colorPerformance)"
                  animationBegin={0}
                  animationDuration={2000}
                />
                <text 
                  x="50%" 
                  y="50%" 
                  textAnchor="middle" 
                  dominantBaseline="middle" 
                  className="performance-text"
                  fontSize="3rem"
                  fontWeight="800"
                  fill="#1a2b4d"
                >
                  {performanceRate}%
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <p className="performance-description">Candidats acceptés sur le total traité</p>
        </div>

        {/* Candidates Status Pie Chart */}
        <div className="chart-card">
          <h3 className="section-title">Répartition des Candidats par Statut</h3>
          <ResponsiveContainer width="100%" height={320}>
            <RechartsPieChart>
              <defs>
                <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#27ae60" stopOpacity={1} />
                  <stop offset="95%" stopColor="#229954" stopOpacity={1} />
                </linearGradient>
                <linearGradient id="colorWarning" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f39c12" stopOpacity={1} />
                  <stop offset="95%" stopColor="#d68910" stopOpacity={1} />
                </linearGradient>
                <linearGradient id="colorDanger" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e74c3c" stopOpacity={1} />
                  <stop offset="95%" stopColor="#c0392b" stopOpacity={1} />
                </linearGradient>
              </defs>
              <Pie
                data={statutCandidatsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                innerRadius={50}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={1000}
              >
                {statutCandidatsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill || entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>

        {/* Interviews Status Pie Chart */}
        <div className="chart-card">
          <h3 className="section-title">Répartition des Entretiens par Statut</h3>
          <ResponsiveContainer width="100%" height={320}>
            <RechartsPieChart>
              <defs>
                <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1a2b4d" stopOpacity={1} />
                  <stop offset="95%" stopColor="#2c3e50" stopOpacity={1} />
                </linearGradient>
                <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3498db" stopOpacity={1} />
                  <stop offset="95%" stopColor="#2980b9" stopOpacity={1} />
                </linearGradient>
              </defs>
              <Pie
                data={statutEntretiensData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                innerRadius={50}
                fill="#8884d8"
                dataKey="value"
                animationBegin={500}
                animationDuration={1000}
              >
                {statutEntretiensData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill || entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>

        {/* Candidates by Month Bar Chart */}
        <div className="chart-card full-width">
          <h3 className="section-title">Candidatures par Mois</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={candidatsParMois} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1a2b4d" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#2c3e50" stopOpacity={0.9} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 600 }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 600 }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(26, 43, 77, 0.1)' }} />
              <Legend content={<CustomLegend />} />
              <Bar 
                dataKey="value" 
                fill="url(#colorBar)" 
                name="Candidats"
                radius={[8, 8, 0, 0]}
                animationBegin={1000}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Interviews Evolution Area Chart */}
        <div className="chart-card full-width">
          <h3 className="section-title">Évolution des Entretiens (7 derniers jours)</h3>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={entretiensParJour} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3498db" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3498db" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3498db" stopOpacity={1} />
                  <stop offset="100%" stopColor="#5dade2" stopOpacity={1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 600 }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 600 }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3498db', strokeWidth: 2 }} />
              <Legend content={<CustomLegend />} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="url(#colorLine)" 
                strokeWidth={3}
                fill="url(#colorArea)" 
                name="Entretiens"
                animationBegin={1500}
                animationDuration={1500}
                dot={{ fill: '#3498db', r: 5, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 8 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recruiters Performance Bar Chart */}
        {entretiensParRecruteur.length > 0 && (
          <div className="chart-card full-width">
            <h3 className="section-title">Entretiens par Recruteur</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={entretiensParRecruteur} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  {recruteurs.map((r, index) => {
                    const colors = [
                      { start: '#1a2b4d', end: '#2c3e50' },
                      { start: '#e74c3c', end: '#c0392b' },
                      { start: '#3498db', end: '#2980b9' },
                      { start: '#27ae60', end: '#229954' },
                    ];
                    const color = colors[index % colors.length];
                    return (
                      <linearGradient key={r.id} id={`colorRecruiter${r.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color.start} stopOpacity={0.9} />
                        <stop offset="95%" stopColor={color.end} stopOpacity={0.9} />
                      </linearGradient>
                    );
                  })}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 600 }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 600 }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(26, 43, 77, 0.1)' }} />
                <Legend content={<CustomLegend />} />
                <Bar 
                  dataKey="value" 
                  name="Entretiens"
                  radius={[8, 8, 0, 0]}
                  animationBegin={2000}
                  animationDuration={1500}
                >
                  {entretiensParRecruteur.map((entry, index) => {
                    const recruiter = recruteurs.find(r => `${r.prenom} ${r.nom}` === entry.name);
                    return (
                      <Cell key={`cell-${index}`} fill={recruiter ? `url(#colorRecruiter${recruiter.id})` : '#1a2b4d'} />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="dashboard-sections">
        <div className="section-card">
          <h3 className="section-title">Candidatures Récentes</h3>
          <div className="item-list">
            {candidats.slice(0, 5).map(c => {
              const recruteur = c.recruteurId ? getRecruteurById(c.recruteurId) : null;
              return (
              <div key={c.id} className="item">
                <div className="item-info">
                  <p>{c.prenom} {c.nom}</p>
                  <p>{c.poste}</p>
                    {recruteur && <p className="item-subtext">Recruteur: {recruteur.prenom} {recruteur.nom}</p>}
                </div>
                {getStatutBadge(c.statut)}
              </div>
              );
            })}
          </div>
        </div>

        <div className="section-card">
          <h3 className="section-title">Prochains Entretiens</h3>
          <div className="item-list">
            {entretiens.filter(e => e.statut === 'planifie').slice(0, 5).map(e => {
              const candidat = getCandidatById(e.candidatId);
              const recruteur = getRecruteurById(e.recruteurId);
              return (
                <div key={e.id} className="item">
                  <div className="item-info">
                    <p>{candidat?.prenom} {candidat?.nom}</p>
                    <p>{e.date} à {e.heure}</p>
                    {recruteur && <p className="item-subtext">Recruteur: {recruteur.prenom} {recruteur.nom}</p>}
                  </div>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{e.lieu}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCandidats = () => {
    const filtered = filteredCandidats;
    
    return (
    <div>
      <div className="page-header">
        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <button onClick={() => openModal('candidat')} className="btn-primary">
          <Plus />
          Nouveau Candidat
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Candidat</th>
              <th>Contact</th>
              <th>Poste</th>
              <th>Date</th>
                <th>Recruteur</th>
              <th>Statut</th>
                <th>Entretiens</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
              {filtered.map(c => {
                const recruteur = c.recruteurId ? getRecruteurById(c.recruteurId) : null;
                const candidatEntretiens = entretiens.filter(e => e.candidatId === c.id);
                return (
              <tr key={c.id}>
                <td>
                  <div className="candidate-name">{c.prenom} {c.nom}</div>
                </td>
                <td>
                  <div className="contact-info">
                    <div>{c.email}</div>
                    <div>{c.telephone}</div>
                  </div>
                </td>
                <td>{c.poste}</td>
                <td>{c.datePostulation}</td>
                    <td>
                      {recruteur ? (
                        <span>{recruteur.prenom} {recruteur.nom}</span>
                      ) : (
                        <select
                          value=""
                          onChange={(e) => e.target.value && assignRecruteurToCandidat(c.id, parseInt(e.target.value))}
                          className="form-select small"
                        >
                          <option value="">Assigner un recruteur</option>
                          {recruteurs.filter(r => r.statut === 'disponible').map(r => (
                            <option key={r.id} value={r.id}>{r.prenom} {r.nom}</option>
                          ))}
                        </select>
                      )}
                    </td>
                <td>{getStatutBadge(c.statut)}</td>
                    <td>
                      <div className="interview-count">
                        {candidatEntretiens.length > 0 && (
                          <span className="badge badge-blue">{candidatEntretiens.length}</span>
                        )}
                        <button
                          onClick={() => {
                            const candidatData = { ...candidatEntretiens[0] || { candidatId: c.id } };
                            openModal('entretien', candidatData);
                          }}
                          className="icon-btn edit"
                          title="Gérer les entretiens"
                        >
                          <CalendarIcon />
                        </button>
                      </div>
                    </td>
                <td>
                  <div className="table-actions">
                    <button onClick={() => openModal('candidat', c)} className="icon-btn edit">
                      <Edit2 />
                    </button>
                    <button onClick={() => handleDelete('candidat', c.id)} className="icon-btn delete">
                      <Trash2 />
                    </button>
                  </div>
                </td>
              </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
  };

  const renderEntretiens = () => {
    const filteredEntretiens = entretienFilter === 'tous' 
      ? entretiens 
      : entretiens.filter(e => e.statut === entretienFilter);

    return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Gestion des Entretiens</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div className="filter-group">
              <Filter size={16} />
              <select
                value={entretienFilter}
                onChange={(e) => setEntretienFilter(e.target.value)}
                className="form-select"
              >
                <option value="tous">Tous</option>
                <option value="planifie">Planifiés</option>
                <option value="termine">Terminés</option>
                <option value="annule">Annulés</option>
              </select>
            </div>
        <button onClick={() => openModal('entretien')} className="btn-primary">
          <Plus />
          Planifier un Entretien
        </button>
          </div>
      </div>

      <div className="interviews-grid">
          {filteredEntretiens.map(e => {
          const candidat = getCandidatById(e.candidatId);
            const recruteur = getRecruteurById(e.recruteurId);
          return (
            <div key={e.id} className="interview-card">
              <div className="interview-header">
                <div className="interview-candidate">
                  <h3>{candidat?.prenom} {candidat?.nom}</h3>
                  <p>{candidat?.poste}</p>
                    {recruteur && <p className="recruteur-name">Recruteur: {recruteur.prenom} {recruteur.nom}</p>}
                </div>
                {getStatutBadge(e.statut)}
              </div>
              
              <div className="interview-details">
                <div className="detail-row">
                    <CalendarIcon />
                  <span>{e.date} à {e.heure} ({e.duree || 60} min)</span>
                </div>
                <div className="detail-row">
                  <Briefcase />
                  <span>{e.lieu}</span>
                </div>
                <div className="detail-row">
                  <Clock />
                  <span>Durée: {e.duree || 60} minutes</span>
                </div>
                  {recruteur && (
                <div className="detail-row">
                  <UserCheck />
                      <span>Spécialité: {recruteur.specialite}</span>
                </div>
                  )}
                  {e.notes && (
                    <div className="interview-notes">
                      <strong>Notes:</strong> {e.notes}
                    </div>
                  )}
              </div>

              <div className="interview-actions">
                <button onClick={() => openModal('entretien', e)} className="btn-secondary btn-edit">
                  <Edit2 />
                  Modifier
                </button>
                <button onClick={() => handleDelete('entretien', e.id)} className="btn-secondary btn-delete-secondary">
                  <Trash2 />
                  Supprimer
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
  };

  const renderRecruteurs = () => (
    <div>
      <div className="page-header">
        <h2 className="page-title">Gestion des Recruteurs</h2>
        <button onClick={() => openModal('recruteur')} className="btn-primary">
          <Plus />
          Nouveau Recruteur
        </button>
      </div>

      <div className="recruteurs-grid">
        {recruteurs.map(r => {
          const recruteurEntretiens = entretiens.filter(e => e.recruteurId === r.id);
          const entretiensAVenir = recruteurEntretiens.filter(e => {
            const entretienDate = new Date(e.date + 'T' + e.heure);
            return entretienDate > new Date() && e.statut === 'planifie';
          });
          const candidatsAssigned = candidats.filter(c => c.recruteurId === r.id);

          return (
            <div key={r.id} className="recruteur-card">
              <div className="recruteur-header">
                <div>
                  <h3>{r.prenom} {r.nom}</h3>
                  <p className="recruteur-specialite">{r.specialite}</p>
                </div>
                {getStatutBadge(r.statut)}
              </div>

              <div className="recruteur-info">
                <div className="info-row">
                  <span className="info-label">Email:</span>
                  <span>{r.email}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Téléphone:</span>
                  <span>{r.telephone}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Candidats assignés:</span>
                  <span className="badge badge-blue">{candidatsAssigned.length}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Entretiens à venir:</span>
                  <span className="badge badge-purple">{entretiensAVenir.length}</span>
                </div>
              </div>

              <div className="disponibilites-section">
                <h4 className="disponibilites-title">Disponibilités</h4>
                {r.disponibilites && r.disponibilites.length > 0 ? (
                  <div className="disponibilites-list">
                    {r.disponibilites.map((date, idx) => (
                      <span key={idx} className="date-badge">{date}</span>
                    ))}
                  </div>
                ) : (
                  <p className="no-disponibilites">Aucune disponibilité enregistrée</p>
                )}
              </div>

              <div className="recruteur-actions">
                <button onClick={() => openModal('recruteur', r)} className="btn-secondary btn-edit">
                  <Edit2 />
                  Modifier
                </button>
                <button onClick={() => handleDelete('recruteur', r.id)} className="btn-secondary btn-delete-secondary">
                  <Trash2 />
                  Supprimer
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderCalendrier = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay();
    
    const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    
    const prevMonth = () => {
      setCalendarDate(new Date(year, month - 1, 1));
    };
    
    const nextMonth = () => {
      setCalendarDate(new Date(year, month + 1, 1));
    };
    
    const getEntretiensForDate = (day) => {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      return entretiens.filter(e => e.date === dateStr);
    };
    
    const getDateColor = (day) => {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dateEntretiens = entretiens.filter(e => e.date === dateStr);
      const today = new Date();
      const currentDate = new Date(year, month, day);
      
      if (dateEntretiens.length === 0) return '';
      
      const hasPlanifie = dateEntretiens.some(e => e.statut === 'planifie');
      const hasTermine = dateEntretiens.some(e => e.statut === 'termine');
      const hasAnnule = dateEntretiens.some(e => e.statut === 'annule');
      
      if (currentDate < today) {
        if (hasTermine) return 'calendar-day-past-completed';
        if (hasAnnule) return 'calendar-day-past-cancelled';
        return 'calendar-day-past';
      } else if (currentDate.toDateString() === today.toDateString()) {
        if (hasPlanifie) return 'calendar-day-today-planned';
        return 'calendar-day-today';
      } else {
        if (hasPlanifie) return 'calendar-day-future-planned';
        return 'calendar-day-future';
      }
    };
    
    const calendarDays = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendarDays.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push(day);
    }
    
    return (
      <div className="calendrier-page">
        <div className="calendar-header">
          <button onClick={prevMonth} className="calendar-nav-btn">
            <ChevronLeft />
          </button>
          <h2 className="calendar-title">{monthNames[month]} {year}</h2>
          <button onClick={nextMonth} className="calendar-nav-btn">
            <ChevronRight />
          </button>
        </div>

        <div className="calendar-legend">
          <div className="legend-item">
            <span className="legend-color calendar-day-future-planned"></span>
            <span>Entretiens à venir (Planifiés)</span>
          </div>
          <div className="legend-item">
            <span className="legend-color calendar-day-past-completed"></span>
            <span>Entretiens passés (Terminés)</span>
          </div>
          <div className="legend-item">
            <span className="legend-color calendar-day-today-planned"></span>
            <span>Aujourd'hui (Planifié)</span>
          </div>
          <div className="legend-item">
            <span className="legend-color calendar-day-past-cancelled"></span>
            <span>Annulés</span>
          </div>
        </div>

        <div className="calendar-grid">
          {dayNames.map(day => (
            <div key={day} className="calendar-day-header">{day}</div>
          ))}
          
          {calendarDays.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="calendar-day empty"></div>;
            }
            
            const dateEntretiens = getEntretiensForDate(day);
            const colorClass = getDateColor(day);
            
            return (
              <div key={day} className={`calendar-day ${colorClass}`}>
                <div className="calendar-day-number">{day}</div>
                {dateEntretiens.length > 0 && (
                  <div className="calendar-entretiens">
                    {dateEntretiens.map(e => {
                      const candidat = getCandidatById(e.candidatId);
                      const recruteur = getRecruteurById(e.recruteurId);
                      const endTime = getEndTime(e.date, e.heure, e.duree || 60);
                      return (
                        <div key={e.id} className={`calendar-entretien calendar-entretien-${e.statut}`} title={`${candidat?.prenom} ${candidat?.nom} - ${e.heure} - ${endTime.hours}:${String(endTime.minutes).padStart(2, '0')} (${e.duree || 60} min) - ${recruteur?.prenom} ${recruteur?.nom} - ${e.lieu}`}>
                          <span className="entretien-time">{e.heure}</span>
                          <span className="entretien-name">{candidat?.prenom} {candidat?.nom.substring(0, 5)} ({e.duree || 60} min)</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="calendar-details">
          <h3>Entretiens du mois</h3>
          <div className="calendar-details-list">
            {entretiens
              .filter(e => {
                const entretienDate = new Date(e.date);
                return entretienDate.getMonth() === month && entretienDate.getFullYear() === year;
              })
              .sort((a, b) => new Date(a.date + 'T' + a.heure) - new Date(b.date + 'T' + b.heure))
              .map(e => {
                const candidat = getCandidatById(e.candidatId);
                const recruteur = getRecruteurById(e.recruteurId);
                return (
                  <div key={e.id} className="calendar-detail-item">
                    <div className="detail-item-date">
                      <span className="detail-date">{e.date}</span>
                      <span className="detail-time">{e.heure}</span>
                      {(() => {
                        const endTime = getEndTime(e.date, e.heure, e.duree || 60);
                        return <span className="detail-time" style={{ marginTop: '0.25rem', fontSize: '0.7rem', opacity: 0.8 }}>
                          ({e.duree || 60} min - jusqu'à {endTime.hours}:{String(endTime.minutes).padStart(2, '0')})
                        </span>;
                      })()}
                    </div>
                    <div className="detail-item-info">
                      <p className="detail-candidate">{candidat?.prenom} {candidat?.nom}</p>
                      <p className="detail-poste">{candidat?.poste}</p>
                      {recruteur && <p className="detail-recruteur">Recruteur: {recruteur.prenom} {recruteur.nom}</p>}
                      <p className="detail-lieu">Lieu: {e.lieu}</p>
                      <p className="detail-lieu" style={{ marginTop: '0.25rem' }}>Durée: {e.duree || 60} minutes</p>
                    </div>
                    {getStatutBadge(e.statut)}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  };

  const renderModal = () => {
    if (!showModal) return null;

    let isValid = false;
    if (modalType === 'candidat') {
      isValid = formData.prenom && formData.nom && formData.email && formData.telephone && formData.poste;
    } else if (modalType === 'entretien') {
      isValid = formData.candidatId && formData.recruteurId && formData.date && formData.heure && formData.lieu && formData.duree;
    } else if (modalType === 'recruteur') {
      isValid = formData.prenom && formData.nom && formData.email && formData.telephone && formData.specialite;
    }

    return (
      <div className="modal-overlay">
        <div className="modal">
          <div className="modal-header">
            <h3 className="modal-title">
              {selectedItem ? 'Modifier' : 'Ajouter'} {
                modalType === 'candidat' ? 'un Candidat' : 
                modalType === 'entretien' ? 'un Entretien' : 
                'un Recruteur'
              }
            </h3>
            <button onClick={closeModal} className="close-btn">
              <X />
            </button>
          </div>

          <div className="modal-body">
            {validationError && (
              <div style={{ 
                padding: '1rem', 
                marginBottom: '1.5rem', 
                background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                border: '2px solid #e74c3c',
                borderRadius: '0.75rem',
                color: '#991b1b',
                fontWeight: 600,
                fontSize: '0.875rem'
              }}>
                {validationError}
              </div>
            )}
            {modalType === 'candidat' ? (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Prénom</label>
                    <input
                      type="text"
                      value={formData.prenom || ''}
                      onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nom</label>
                    <input
                      type="text"
                      value={formData.nom || ''}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Téléphone</label>
                  <input
                    type="tel"
                    value={formData.telephone || ''}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Poste</label>
                  <input
                    type="text"
                    value={formData.poste || ''}
                    onChange={(e) => setFormData({ ...formData, poste: e.target.value })}
                    className="form-input"
                  />
                </div>
                
                {selectedItem && (
                  <div className="form-group">
                    <label className="form-label">Statut</label>
                    <select
                      value={formData.statut || 'en_attente'}
                      onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                      className="form-select"
                    >
                      <option value="en_attente">En attente</option>
                      <option value="accepte">Accepté</option>
                      <option value="refuse">Refusé</option>
                    </select>
                  </div>
                )}
              </>
            ) : modalType === 'entretien' ? (
              <>
                <div className="form-group">
                  <label className="form-label">Candidat *</label>
                  <select
                    value={formData.candidatId || ''}
                    onChange={(e) => {
                      const candidatId = parseInt(e.target.value);
                      setFormData({ ...formData, candidatId });
                      // Validation en temps réel
                      if (candidatId && formData.date && formData.heure && formData.lieu && formData.duree) {
                        validateEntretien({ ...formData, candidatId }, !!selectedItem, selectedItem?.id);
                      }
                    }}
                    className="form-select"
                    required
                  >
                    <option value="">Sélectionner un candidat</option>
                    {candidats.map(c => {
                      // Filtrer les candidats qui ont déjà un entretien (sauf en mode édition si c'est le même)
                      const hasEntretien = entretiens.some(e => 
                        e.candidatId === c.id && (!selectedItem || e.id !== selectedItem.id)
                      );
                      return (
                        <option 
                          key={c.id} 
                          value={c.id}
                          disabled={hasEntretien && !selectedItem}
                        >
                          {c.prenom} {c.nom} - {c.poste}
                          {hasEntretien && !selectedItem ? ' (Déjà un entretien)' : ''}
                        </option>
                      );
                    })}
                  </select>
                  {formData.candidatId && (() => {
                    const selectedCandidat = candidats.find(c => c.id === parseInt(formData.candidatId));
                    const existingEntretien = entretiens.find(e => 
                      e.candidatId === parseInt(formData.candidatId) && (!selectedItem || e.id !== selectedItem.id)
                    );
                    if (existingEntretien && selectedCandidat) {
                      return (
                        <small style={{ color: '#e74c3c', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                          ⚠️ Ce candidat a déjà un entretien prévu.
                        </small>
                      );
                    }
                    return null;
                  })()}
                </div>

                <div className="form-group">
                  <label className="form-label">Recruteur *</label>
                  <select
                    value={formData.recruteurId || ''}
                    onChange={(e) => {
                      const recruteurId = parseInt(e.target.value);
                      setFormData({ ...formData, recruteurId });
                      // Validation en temps réel
                      if (recruteurId && formData.date && formData.heure && formData.lieu && formData.duree) {
                        validateEntretien({ ...formData, recruteurId }, !!selectedItem, selectedItem?.id);
                      }
                    }}
                    className="form-select"
                    required
                  >
                    <option value="">Sélectionner un recruteur</option>
                    {recruteurs.filter(r => r.statut === 'disponible').map(r => (
                      <option key={r.id} value={r.id}>{r.prenom} {r.nom} - {r.specialite}</option>
                    ))}
                  </select>
                </div>

                {/* Affichage des créneaux réservés pour la salle sélectionnée */}
                {formData.lieu && formData.date && (
                  <div className="form-group" style={{
                    padding: '1rem',
                    background: 'linear-gradient(135deg, rgba(231, 76, 60, 0.05) 0%, rgba(231, 76, 60, 0.02) 100%)',
                    borderRadius: '0.75rem',
                    border: '1px solid rgba(231, 76, 60, 0.2)',
                    fontSize: '0.875rem'
                  }}>
                    <label className="form-label" style={{ marginBottom: '0.75rem', color: 'var(--navy)', fontSize: '0.875rem', fontWeight: 700 }}>
                      📅 Créneaux déjà réservés pour "{formData.lieu}" le {formData.date}
                    </label>
                    {(() => {
                      const reservations = entretiens
                        .filter(e => e.lieu === formData.lieu && e.date === formData.date && (!selectedItem || e.id !== selectedItem.id))
                        .sort((a, b) => timeToMinutes(a.heure) - timeToMinutes(b.heure))
                        .map(e => {
                          const endTime = getEndTime(e.date, e.heure, e.duree || 60);
                          const candidat = getCandidatById(e.candidatId);
                          return {
                            heure: e.heure,
                            fin: `${endTime.hours}:${String(endTime.minutes).padStart(2, '0')}`,
                            candidat: candidat ? `${candidat.prenom} ${candidat.nom}` : 'N/A'
                          };
                        });

                      if (reservations.length === 0) {
                        return (
                          <div style={{ color: '#27ae60', fontWeight: 600 }}>
                            ✓ Aucune réservation - La salle est disponible toute la journée
                          </div>
                        );
                      }

                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {reservations.map((res, idx) => (
                            <div key={idx} style={{
                              padding: '0.5rem',
                              background: 'rgba(231, 76, 60, 0.1)',
                              borderRadius: '0.5rem',
                              border: '1px solid rgba(231, 76, 60, 0.3)'
                            }}>
                              <strong>{res.heure} - {res.fin}</strong> : {res.candidat}
                            </div>
                          ))}
                          <small style={{ color: 'var(--gray-600)', marginTop: '0.25rem', fontStyle: 'italic' }}>
                            Une marge de {BUFFER_TIME} minutes est requise entre chaque entretien.
                          </small>
                        </div>
                      );
                    })()}
                  </div>
                )}
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Date *</label>
                    <input
                      type="date"
                      value={formData.date || ''}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => {
                        setFormData({ ...formData, date: e.target.value });
                        // Validation en temps réel
                        if (e.target.value && formData.heure && formData.lieu && formData.duree) {
                          validateEntretien({ ...formData, date: e.target.value }, !!selectedItem, selectedItem?.id);
                        }
                      }}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Heure de début *</label>
                    <input
                      type="time"
                      value={formData.heure || ''}
                      onChange={(e) => {
                        setFormData({ ...formData, heure: e.target.value });
                        // Validation en temps réel
                        if (e.target.value && formData.date && formData.lieu && formData.duree) {
                          validateEntretien({ ...formData, heure: e.target.value }, !!selectedItem, selectedItem?.id);
                        }
                      }}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Durée (en minutes) *</label>
                    <input
                      type="number"
                      min={MIN_DURATION}
                      max={MAX_DURATION}
                      step="15"
                      value={formData.duree || ''}
                      onChange={(e) => {
                        const newDuree = parseInt(e.target.value) || '';
                        setFormData({ ...formData, duree: newDuree });
                        // Validation en temps réel
                        if (newDuree && formData.date && formData.heure) {
                          validateEntretien({ ...formData, duree: newDuree }, !!selectedItem, selectedItem?.id);
                        }
                      }}
                      className="form-input"
                      placeholder="60"
                      required
                    />
                    <small style={{ color: 'var(--gray-500)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                      Min: {MIN_DURATION} min | Max: {MAX_DURATION} min (3h)
                    </small>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Lieu (Salle) *</label>
                    <input
                      type="text"
                      value={formData.lieu || ''}
                      onChange={(e) => {
                        setFormData({ ...formData, lieu: e.target.value });
                        // Validation en temps réel
                        if (e.target.value && formData.date && formData.heure && formData.duree) {
                          validateEntretien({ ...formData, lieu: e.target.value }, !!selectedItem, selectedItem?.id);
                        }
                      }}
                      className="form-input"
                      placeholder="Salle A"
                      required
                    />
                  </div>
                </div>

                {/* Affichage automatique de l'heure de fin */}
                {formData.date && formData.heure && formData.duree && formData.duree > 0 && (
                  <div className="form-group" style={{
                    padding: '1rem',
                    background: 'linear-gradient(135deg, rgba(26, 43, 77, 0.05) 0%, rgba(52, 152, 219, 0.05) 100%)',
                    borderRadius: '0.75rem',
                    border: '1px solid rgba(52, 152, 219, 0.2)'
                  }}>
                    <label className="form-label" style={{ marginBottom: '0.5rem', color: 'var(--navy)' }}>
                      <Clock style={{ width: '16px', height: '16px', display: 'inline-block', marginRight: '0.5rem' }} />
                      Heure de fin calculée automatiquement
                    </label>
                    <div style={{ 
                      fontSize: '1.125rem', 
                      fontWeight: 700, 
                      color: 'var(--navy)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <span>{formData.heure}</span>
                      <span style={{ color: 'var(--gray-400)' }}>→</span>
                      <span>
                        {(() => {
                          const endTime = getEndTime(formData.date, formData.heure, parseInt(formData.duree));
                          return `${endTime.hours}:${String(endTime.minutes).padStart(2, '0')}`;
                        })()}
                      </span>
                      <span style={{ fontSize: '0.875rem', color: 'var(--gray-500)', fontWeight: 500, marginLeft: '0.5rem' }}>
                        ({formData.duree} minutes)
                      </span>
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Notes</label>
                  <textarea
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="form-input"
                    rows="3"
                  />
                </div>
                
                {selectedItem && (
                  <div className="form-group">
                    <label className="form-label">Statut</label>
                    <select
                      value={formData.statut || 'planifie'}
                      onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                      className="form-select"
                    >
                      <option value="planifie">Planifié</option>
                      <option value="termine">Terminé</option>
                      <option value="annule">Annulé</option>
                    </select>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Prénom</label>
                    <input
                      type="text"
                      value={formData.prenom || ''}
                      onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nom</label>
                    <input
                      type="text"
                      value={formData.nom || ''}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-input"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Téléphone</label>
                  <input
                    type="tel"
                    value={formData.telephone || ''}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Spécialité</label>
                  <select
                    value={formData.specialite || ''}
                    onChange={(e) => setFormData({ ...formData, specialite: e.target.value })}
                    className="form-select"
                  >
                    <option value="">Sélectionner une spécialité</option>
                    <option value="IT">IT</option>
                    <option value="Design">Design</option>
                    <option value="Management">Management</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Statut</label>
                  <select
                    value={formData.statut || 'disponible'}
                    onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                    className="form-select"
                  >
                    <option value="disponible">Disponible</option>
                    <option value="occupe">Occupé</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Disponibilités (Dates séparées par des virgules, format YYYY-MM-DD)</label>
                  <input
                    type="text"
                    value={Array.isArray(formData.disponibilites) ? formData.disponibilites.join(', ') : (formData.disponibilites || '')}
                    onChange={(e) => {
                      const dates = e.target.value.split(',').map(d => d.trim()).filter(d => d);
                      setFormData({ ...formData, disponibilites: dates });
                    }}
                    className="form-input"
                    placeholder="2025-11-05, 2025-11-06, 2025-11-07"
                  />
                </div>
              </>
            )}

            <div className="modal-footer">
              <button onClick={closeModal} className="btn-cancel">
                Annuler
              </button>
              <button onClick={handleSubmit} disabled={!isValid} className="btn-submit">
                {selectedItem ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Page de connexion
  const renderLogin = () => (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="login-logo">
            <Briefcase className="logo-icon" />
          </div>
          <h1 className="login-title">Suivi des Candidatures</h1>
          <p className="login-subtitle">Connectez-vous pour accéder à votre tableau de bord</p>
        </div>
        
        <form onSubmit={handleLogin} className="login-form">
          {loginError && (
            <div className="login-error">
              {loginError}
            </div>
          )}
          
          <div className="form-group">
            <label className="form-label">
              <Mail className="form-icon" />
              Email
            </label>
            <input
              type="email"
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              className="form-input"
              placeholder="votre.email@exemple.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">
              <Lock className="form-icon" />
              Mot de passe
            </label>
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              className="form-input"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button type="submit" className="btn-login">
            <LogIn />
            Se connecter
          </button>
        </form>
        
        <div className="login-footer">
          <p className="login-demo">Comptes de démonstration :</p>
          <div className="demo-accounts">
            <div className="demo-account">
              <strong>Admin:</strong> admin@email.com / admin123
            </div>
            <div className="demo-account">
              <strong>Recruteur:</strong> recruteur@email.com / rec123
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Si non authentifié, afficher la page de connexion
  if (!isAuthenticated) {
    return renderLogin();
  }

  // Menu de navigation (sidebar)
  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'candidats', label: 'Candidats', icon: Users },
    { id: 'entretiens', label: 'Entretiens', icon: CalendarIcon },
    { id: 'recruteurs', label: 'Recruteurs', icon: UserCheck },
    { id: 'calendrier', label: 'Calendrier', icon: CalendarIcon },
  ];

  return (
    <div className="app">
      {/* Animated Background Elements */}
      <div className="animated-background">
        <div className="bg-shape bg-shape-1"></div>
        <div className="bg-shape bg-shape-2"></div>
        <div className="bg-shape bg-shape-3"></div>
        <div className="bg-shape bg-shape-4"></div>
        <div className="bg-particle bg-particle-1"></div>
        <div className="bg-particle bg-particle-2"></div>
        <div className="bg-particle bg-particle-3"></div>
        <div className="bg-particle bg-particle-4"></div>
        <div className="bg-particle bg-particle-5"></div>
        <div className="bg-gradient-light bg-gradient-light-1"></div>
        <div className="bg-gradient-light bg-gradient-light-2"></div>
        <div className="bg-gradient-light bg-gradient-light-3"></div>
      </div>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <Briefcase className="brand-icon" />
            {sidebarOpen && <span className="brand-text">Suivi Candidatures</span>}
          </div>
              <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="sidebar-toggle"
            aria-label="Toggle sidebar"
              >
            <Menu />
              </button>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`sidebar-item ${currentView === item.id ? 'active' : ''}`}
              >
                <Icon className="sidebar-icon" />
                {sidebarOpen && <span className="sidebar-label">{item.label}</span>}
              </button>
            );
          })}
        </nav>
        
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
            {sidebarOpen && (
              <div className="user-info">
                <div className="user-name">{currentUser?.name}</div>
                <div className="user-role">{currentUser?.role === 'admin' ? 'Administrateur' : 'Recruteur'}</div>
              </div>
            )}
          </div>
          <button onClick={handleLogout} className="sidebar-logout">
            <LogOut />
            {sidebarOpen && <span>Déconnexion</span>}
              </button>
            </div>
      </aside>

      {/* Main Content */}
      <div className="main-wrapper">
        <header className="top-header">
          <div className="header-left">
            <h2 className="page-title">
              {currentView === 'dashboard' && 'Tableau de bord'}
              {currentView === 'candidats' && 'Gestion des Candidats'}
              {currentView === 'entretiens' && 'Gestion des Entretiens'}
              {currentView === 'recruteurs' && 'Gestion des Recruteurs'}
              {currentView === 'calendrier' && 'Calendrier des Entretiens'}
            </h2>
          </div>
          <div className="header-right">
            <div className="header-user">
              <div className="header-avatar">
                {currentUser?.name?.charAt(0) || 'U'}
          </div>
              <div className="header-user-info">
                <span className="header-user-name">{currentUser?.name}</span>
                <span className="header-user-role">{currentUser?.role === 'admin' ? 'Administrateur' : 'Recruteur'}</span>
        </div>
            </div>
          </div>
        </header>

      <main className="main-content">
        {currentView === 'dashboard' && renderDashboard()}
        {currentView === 'candidats' && renderCandidats()}
        {currentView === 'entretiens' && renderEntretiens()}
          {currentView === 'recruteurs' && renderRecruteurs()}
          {currentView === 'calendrier' && renderCalendrier()}
      </main>
      </div>

      {renderModal()}
    </div>
  );
};

export default App;
