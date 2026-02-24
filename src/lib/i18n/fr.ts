// French translations
export const fr = {
  // Navigation
  nav: {
    features: "Fonctionnalités",
    howItWorks: "Comment Ça Marche",
    compliance: "Conformité",
    forPharmacies: "Pour les Pharmacies",
    signIn: "Connexion",
    getStarted: "Commencer",
  },
  
  // Hero Section
  hero: {
    title: "Votre Santé, Notre Priorité",
    subtitle: "Accédez à des pharmacies fiables, téléchargez vos ordonnances et faites-vous livrer vos médicaments à domicile. Connectez-vous avec des pharmaciens diplômés pour des conseils experts.",
    cta1: "Commencer",
    cta2: "En Savoir Plus",
    card1Title: "Télécharger l'Ordonnance",
    card1Desc: "Photographiez et téléchargez votre ordonnance pour vérification rapide",
    card2Title: "Livraison Rapide",
    card2Desc: "Recevez vos médicaments en quelques heures",
    card3Title: "Conseils d'Expert",
    card3Desc: "Discutez avec des pharmaciens certifiés à tout moment",
  },
  
  // Trust Banner
  trustBanner: {
    verified: "Pharmacies Vérifiées",
    secure: "Sécurisé et Privé",
    compliant: "Conforme à la Législation",
    support: "Assistance 24/7",
  },
  
  // Features Section
  features: {
    badge: "Fonctionnalités de la Plateforme",
    title: "Conçu pour la Conformité Sanitaire",
    subtitle: "Chaque fonctionnalité est conçue avec la conformité légale, la sécurité des patients et la responsabilité des pharmaciens au cœur du système.",
    items: [
      {
        title: "Gestion Sécurisée des Ordonnances",
        description: "Téléchargez des ordonnances stockées de manière permanente et juridiquement immuables. Aucune suppression autorisée — uniquement des changements de statut avec une piste d'audit complète.",
        highlights: ["Impossible à supprimer", "Conservation 5-10 ans", "Horodaté et enregistré"],
      },
      {
        title: "Dossiers de Conseil Obligatoires",
        description: "Les pharmaciens doivent remplir un formulaire de conseil structuré avant la délivrance. Le système bloque la délivrance sans conseil complété.",
        highlights: ["Dosage et effets secondaires", "Vérification des interactions médicamenteuses", "Signature numérique requise"],
      },
      {
        title: "Chat Privé Chiffré",
        description: "Communication sécurisée entre patient et pharmacien. Les messages sont chiffrés, immuables et stockés de manière permanente.",
        highlights: ["Chiffrement de bout en bout", "Pas d'accès inter-pharmacies", "Supporte images et références d'ordonnances"],
      },
      {
        title: "Vérification des Pharmaciens",
        description: "Chaque pharmacien est vérifié manuellement par l'administrateur avant activation. License, pièce d'identité et enregistrement de pharmacy requis.",
        highlights: ["Numéro de license vérifié", "Approbation admin requise", "Conforme PPB & MoH"],
      },
      {
        title: "Système de Piste d'Audit Complète",
        description: "Chaque action est enregistrée avec ID utilisateur, adresse IP, info appareil et horodatage. Les logs d'audit ne peuvent être编辑és ou supprimés.",
        highlights: ["Chaque action enregistrée", "Suivi IP et appareil", "Enregistrements non supprimables"],
      },
      {
        title: "Suivi de Livraison",
        description: "Suivi de livraison en temps réel avec confirmation OTP et signature à la livraison. Drapeau chaîne froide pour médicaments thermosensibles.",
        highlights: ["Confirmation OTP", "Support chaîne froide", "Mises à jour en temps réel"],
      },
    ],
  },
  
  // How It Works Section
  howItWorks: {
    badge: "Comment Ça Marche",
    title: "Simple, Sécurisé, Conforme",
    subtitle: "Que vous soyez patient ou pharmacien, PharmabuLink Africa vous guide à chaque étape avec une conformité légale complète.",
    patient: {
      title: "Pour les Patients",
      subtitle: "Recevez vos médicaments en toute sécurité",
      steps: [
        { title: "S'inscrire et Vérifier", description: "Créez votre compte avec vos coordonnées. Votre identité est protégée par notre politique de confidentialité." },
        { title: "Télécharger l'Ordonnance", description: "Téléchargez votre ordonnance en image ou PDF. Elle est stockée de manière permanente et juridiquement protégée." },
        { title: "Choisir une Pharmacy", description: "Parcourez les pharmacies vérifiées près de chez vous. Discutez en privé avec le pharmacien." },
        { title: "Recevoir le Conseil", description: "Votre pharmacien fournit le conseil obligatoire avant de délivrer vos médicaments." },
        { title: "Suivre la Livraison", description: "Suivez votre commande en temps réel. Confirmez la réception avec le code OTP à la livraison." },
      ],
    },
    pharmacist: {
      title: "Pour les Pharmaciens",
      subtitle: "Opérez avec une conformité réglementaire complète",
      steps: [
        { title: "Soumettre les Diplômes", description: "Téléchargez votre numéro de license, pièce d'identité nationale et certificat d'enregistrement de pharmacy." },
        { title: "Vérification Admin", description: "Notre équipe vérifie manuellement vos diplômes contre les bases de données réglementaires." },
        { title: "Télécharger l'Inventaire", description: "Ajoutez votre inventaire de médicaments avec prix, disponibilité et drapeaux de substances contrôlées." },
        { title: "Examiner les Ordonnances", description: "Examinez les ordonnances des patients, approvez ou rejetez les commandes avec raisons documentées." },
        { title: "Compléter le Conseil", description: "Remplissez le formulaire de conseil obligatoire et signez numériquement avant de délivrer." },
      ],
    },
  },
  
  // Compliance Section
  compliance: {
    badge: "Conformité Légale",
    title: "Ceci N'est Pas Une Application E-Commerce Normale",
    subtitle: "PharmabuLink Africa est un système médical réglementé, un système de stockage de preuves juridiques et un outil de conformité sanitaire. La sécurité et la piste d'audit sont plus importantes que le design UI.",
    warningTitle: "Non-Conformité = Fermeture Légale",
    warningDesc: "Toutes les fonctionnalités de conformité sont non négociables et appliquées au niveau système. Aucun utilisateur — incluant les administrateurs — ne peut contourner ces contrôles. Chaque tentative de violation est enregistrée et signalée.",
    items: [
      { title: "Les Ordonnances Ne Peuvent Pas Être Supprimées", description: "Une fois téléchargées, les ordonnances sont stockées de manière permanente. Aucun patient, pharmacien ou admin ne peut les supprimer — seuls les changements de statut sont permis.", status: "Critique" },
      { title: "Conseil Obligatoire Avant Délivrance", description: "Le système bloque la délivrance jusqu'à ce que le pharmacien complète le formulaire de conseil structuré avec signature numérique.", status: "Appliqué" },
      { title: "Surveillance des Substances Contrôlées", description: "Les substances contrôlées nécessitent des ordonnances valides, confirmation supplémentaire du pharmacien, et sont signalées pour la visibilité admin. Les antibiotiques nécessitent une révision d'ordonnance.", status: "Surveillé" },
      { title: "Logs d'Audit Immuables", description: "Chaque action est enregistrée avec ID utilisateur, adresse IP, info appareil et horodatage. Les logs d'audit ne peuvent être edit és ou supprimés par personne.", status: "Toujours Actif" },
      { title: "Alignement Réglementaire", description: "Aligné avec la Pharmacy and Poisons Board du Kenya et le Ministère de la Santé Publique du Burundi. La vérification des pharmaciens suit les normes nationales.", status: "Conforme" },
      { title: "Politique de Rétention de Données", description: "Tous les enregistrements d'ordonnances, notes de conseil et logs d'audit sont conservés pendant un minimum de 5-10 ans comme requis par les réglementations sanitaires.", status: "5-10 Ans" },
    ],
    flowTitle: "Flux de Statut des Ordonnances",
    flowLabels: {
      pending: "En Attente",
      approved: "Approuvé",
      dispensed: "Délivré",
      rejected: "Rejeté",
      expired: "Expiré",
      flagged: "Signalé",
    },
    flowNote: "Tous les changements de statut sont horodatés, enregistrés et stockés de manière permanente. Aucune ordonnance ne peut jamais être supprimée.",
  },
  
  // For Pharmacies Section
  forPharmacies: {
    badge: "Pour les Pharmacies",
    title: "Développez Votre Activité Pharmaceutique Numériquement",
    subtitle: "Rejoignez le réseau de pharmacies le plus fiable d'Afrique. Atteignez plus de patients, opérez avec une conformité complète et générez des revenus récurrents grâce aux services de télésanté.",
    cta: "Enregistrer Votre Pharmacy →",
    verificationTitle: "Exigences de Vérification",
    verificationItems: [
      "Numéro de license de pharmacien valide",
      "Pièce d'identité nationale / Passeport",
      "Certificat d'enregistrement de pharmacy",
      "Vérification manuelle par admin",
      "Vérification croisée base de données réglementaire",
    ],
    benefits: [
      { title: "Élargir Votre Portée", description: "Connectez-vous avec des patients dans toute votre ville et au-delà. Gérez les commandes en ligne aux côtés des clients sur place." },
      { title: "Rester Juridiquement Protégé", description: "Chaque action de délivrance est documentée. Les dossiers de conseil et signatures numériques vous protègent juridiquement." },
      { title: "Revenu Pharmacien Familial", description: "Gérez des revenus mensuels récurrents grâce au modèle d'abonnement Pharmacien Familial." },
      { title: "Gestion d'Inventaire", description: "Gérez votre inventaire de médicaments, définissez la disponibilité, signalez les substances contrôlazes et suivez les niveaux de stock." },
      { title: "Plateforme Mobile", description: "Gérez votre pharmacy de n'importe où avec notre application mobile. Approuvez les commandes, discutez avec les patients, suivez les livraisons." },
      { title: "Support Dédié", description: "Notre équipe vous aide dans le processus de vérification et fournit des conseils de conformité continus." },
    ],
    familyPharmacist: {
      title: "Module Pharmacien Familial",
      description: "Les patients peuvent s'abonner à un pharmacien dédié pour la gestion mensuelle des médicaments. Générez des revenus récurrents tout en prodiguant des soins personnalisés.",
      items: [
        { label: "Rappels de Médicaments" },
        { label: "Suivi des Maladies Chroniques" },
        { label: "Chat Dédié" },
        { label: "Service de Révision Médicamenteuse" },
      ],
    },
  },
  
  // CTA Section
  cta: {
    title: "Prêt à Transformer les Soins de Santé en Afrique?",
    subtitle: "Rejoignez PharmabuLink Africa — où la sécurité des patients, la responsabilité des pharmaciens et la conformité réglementaire passent en premier.",
    cta1: "Trouver une Pharmacy Près de Vous",
    cta2: "Enregistrer Votre Pharmacy",
    availableKenya: "Disponible au Kenya",
    availableBurundi: "Disponible au Burundi",
    paymentMethod: "M-Pesa et Mobile Money",
  },
  
  // Footer
  footer: {
    description: "Le marketplace de pharmacies numériques de confiance pour l'Afrique. Sécurisé, conforme et priorisant les patients.",
    platform: "Plateforme",
    platformLinks: [
      "Trouver une Pharmacy",
      "Télécharger une Ordonnance",
      "Suivre la Livraison",
      "Pharmacien Familial",
      "Télésanté",
    ],
    forPharmacists: "Pour les Pharmaciens",
    forPharmacistsLinks: [
      "Enregistrer Votre Pharmacy",
      "Processus de Vérification",
      "Gestion d'Inventaire",
      "Dossiers de Conseil",
      "Gestion des Livraisons",
    ],
    legal: "Juridique et Conformité",
    legalLinks: [
      "Politique de Confidentialité",
      "Conditions d'Utilisation",
      "Politique de Rétention de Données",
      "Politique de Piste d'Audit",
      "Conformité Réglementaire",
    ],
    badges: [
      { text: "Chiffrement 256-bit" },
      { text: "Conforme HIPAA" },
      { text: "Conforme PPB (Kenya)" },
      { text: "Conforme MoH (Burundi)" },
      { text: "Logs d'Audit Immuables" },
    ],
    kenya: "Kenya — Pharmacy and Poisons Board",
    burundi: "Burundi — Ministère de la Santé",
    copyright: "© 2026 PharmabuLink Africa. Tous droits réservés.",
    disclaimer: "Cette plateforme est un système médical réglementé. Toutes les actions sont enregistrées et juridiquement contraignantes.",
    admin: "Admin",
  },
  
  // Language
  language: {
    select: "Langue",
    en: "English",
    fr: "Français",
  },
};
