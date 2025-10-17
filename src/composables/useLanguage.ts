import { ref, computed } from 'vue'

// Estado global del idioma
const currentLanguage = ref<'es' | 'en'>('es')

// Traducciones
const translations = {
  es: {
    // Header
    searchPlaceholder: 'Buscar proyectos, organizaciones...',
    myProfile: 'Mi Perfil',
    logout: 'Cerrar Sesión',
    
    // Sidebar
    home: 'Inicio',
    projects: 'Proyectos',
    explore: 'Explorar',
    myApplications: 'Mis Postulaciones',
    organizations: 'Organizaciones',
    profile: 'Mi Perfil',
    messages: 'Mensajes',
    accessibility: 'Accesibilidad',
    darkMode: 'Modo oscuro',
    settings: 'Configuración',
    help: 'Ayuda',
    exit: 'Salir',
    
    // Dashboard
    greeting: '¡Hola, Alejandro!',
    dashboardSubtitle: 'Aquí tienes un resumen de tu actividad y proyectos recomendados.',
    activeProjects: 'Proyectos Activos',
    hoursThisMonth: 'Horas este mes',
    achievements: 'Logros',
    recommendedProjects: 'Proyectos Recomendados',
    recentActivity: 'Actividad Reciente',
    viewDetails: 'Ver detalles',
    completedActivity: 'Completaste una actividad en',
    daysAgo: 'Hace',
    days: 'días',
    
    // Projects
    exploreProjects: 'Explorar Proyectos',
    projectsSubtitle: 'Encuentra proyectos de voluntariado que se ajusten a tus intereses',
    searchProjects: 'Buscar proyectos...',
    allCategories: 'Todas las categorías',
    education: 'Educación',
    environment: 'Medio Ambiente',
    health: 'Salud',
    technology: 'Tecnología',
    allLocations: 'Todas las ubicaciones',
    madrid: 'Madrid',
    barcelona: 'Barcelona',
    valencia: 'Valencia',
    remote: 'Remoto',
    newBadge: 'Nuevo',
    organization: 'Organización',
    flexible: 'Flexible',
    viewMore: 'Ver más',
    apply: 'Postularme',
    previous: 'Anterior',
    next: 'Siguiente',
    
    // Accessibility
    accessibilityOptions: 'Opciones de accesibilidad',
    fontSize: 'Tamaño de fuente',
    highContrast: 'Alto contraste',
    reduceMotion: 'Reducir movimiento',
    resetSettings: 'Restablecer configuración',
  },
  en: {
    // Header
    searchPlaceholder: 'Search projects, organizations...',
    myProfile: 'My Profile',
    logout: 'Log Out',
    
    // Sidebar
    home: 'Home',
    projects: 'Projects',
    explore: 'Explore',
    myApplications: 'My Applications',
    organizations: 'Organizations',
    profile: 'My Profile',
    messages: 'Messages',
    accessibility: 'Accessibility',
    darkMode: 'Dark mode',
    settings: 'Settings',
    help: 'Help',
    exit: 'Exit',
    
    // Dashboard
    greeting: 'Hello, Alejandro!',
    dashboardSubtitle: 'Here is a summary of your activity and recommended projects.',
    activeProjects: 'Active Projects',
    hoursThisMonth: 'Hours this month',
    achievements: 'Achievements',
    recommendedProjects: 'Recommended Projects',
    recentActivity: 'Recent Activity',
    viewDetails: 'View details',
    completedActivity: 'You completed an activity in',
    daysAgo: '',
    days: 'days ago',
    
    // Projects
    exploreProjects: 'Explore Projects',
    projectsSubtitle: 'Find volunteer projects that match your interests',
    searchProjects: 'Search projects...',
    allCategories: 'All categories',
    education: 'Education',
    environment: 'Environment',
    health: 'Health',
    technology: 'Technology',
    allLocations: 'All locations',
    madrid: 'Madrid',
    barcelona: 'Barcelona',
    valencia: 'Valencia',
    remote: 'Remote',
    newBadge: 'New',
    organization: 'Organization',
    flexible: 'Flexible',
    viewMore: 'View more',
    apply: 'Apply',
    previous: 'Previous',
    next: 'Next',
    
    // Accessibility
    accessibilityOptions: 'Accessibility options',
    fontSize: 'Font size',
    highContrast: 'High contrast',
    reduceMotion: 'Reduce motion',
    resetSettings: 'Reset settings',
  }
}

export function useLanguage() {
  // Inicializar idioma desde localStorage
  const savedLanguage = localStorage.getItem('language') as 'es' | 'en' | null
  if (savedLanguage && (savedLanguage === 'es' || savedLanguage === 'en')) {
    currentLanguage.value = savedLanguage
    document.documentElement.setAttribute('lang', savedLanguage)
  }

  const t = computed(() => translations[currentLanguage.value])

  const changeLanguage = (lang: 'es' | 'en') => {
    currentLanguage.value = lang
    localStorage.setItem('language', lang)
    document.documentElement.setAttribute('lang', lang)
  }

  return {
    currentLanguage,
    t,
    changeLanguage
  }
}
