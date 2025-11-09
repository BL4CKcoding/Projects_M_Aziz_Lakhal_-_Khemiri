export const sampleApplications = [
  { id: 1, firstname: "Jean", lastname: "Dupont", email: "jean.dupont@email.com", phone: "01 23 45 67 89", department: "Informatique", position: "Développeur Frontend", cv: "https://example.com/cv1.pdf", status: "pending", date: "2023-10-15", notes: "Expérience en React" },
  { id: 2, firstname: "Marie", lastname: "Martin", email: "marie.martin@email.com", phone: "01 34 56 78 90", department: "Design", position: "Designer UX/UI", cv: "https://example.com/cv2.pdf", status: "accepted", date: "2023-10-12", notes: "Portfolio impressionnant" },
  { id: 3, firstname: "Pierre", lastname: "Bernard", email: "pierre.bernard@email.com", phone: "01 45 67 89 01", department: "Informatique", position: "Développeur Backend", cv: "https://example.com/cv3.pdf", status: "rejected", date: "2023-10-10", notes: "Compétences en Node.js" },
  { id: 4, firstname: "Sophie", lastname: "Leroy", email: "sophie.leroy@email.com", phone: "01 56 78 90 12", department: "Gestion de projet", position: "Chef de projet", cv: "https://example.com/cv4.pdf", status: "pending", date: "2023-10-08", notes: "Expérience en gestion d'équipe" },
  { id: 5, firstname: "Thomas", lastname: "Moreau", email: "thomas.moreau@email.com", phone: "01 67 89 01 23", department: "Data", position: "Data Analyst", cv: "https://example.com/cv5.pdf", status: "accepted", date: "2023-10-05", notes: "Maîtrise de Python et SQL" }
];

export const sampleInterviews = [
  { id: 1, candidateId: 2, date: "2023-10-20", time: "14:00", duration: 45, recruiterId: 1, status: "scheduled", notes: "Discuter des attentes salariales" },
  { id: 2, candidateId: 5, date: "2023-10-22", time: "10:30", duration: 60, recruiterId: 2, status: "scheduled", notes: "Présentation du projet" }
];

export const sampleRecruiters = [
  { id: 1, firstname: "Claire", lastname: "Dubois", position: "Responsable RH", email: "claire.dubois@entreprise.com", phone: "01 23 45 67 89" },
  { id: 2, firstname: "Antoine", lastname: "Lefebvre", position: "Tech Lead", email: "antoine.lefebvre@entreprise.com", phone: "01 34 56 78 90" },
  { id: 3, firstname: "Élodie", lastname: "Girard", position: "Recruteuse Technique", email: "elodie.girard@entreprise.com", phone: "01 45 67 89 01" }
];

export const sampleAbsences = [
  // { id: 1, recruiterId: 2, date: '2023-10-22', reason: 'Congé' }
];