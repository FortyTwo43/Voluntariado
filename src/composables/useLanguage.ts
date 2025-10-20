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

    // Public landing
    platformName: 'Plataforma de Voluntariado Juvenil',
    heroTitle: '¡Bienvenido a la comunidad de voluntarios!',
    heroSubtitle: 'Únete a nosotros y haz la diferencia.',
    ctaRegister: 'Regístrate ahora',
    ctaBrowse: 'Buscar proyectos',
  newsAndUpdates: 'Novedades y Noticias',
    signIn: 'Entrar',
    terms: 'Política/Términos de uso',
    support: 'Soporte/Contacto',
    institutionalInfo: 'Información institucional',
    termsIntro: 'Lee nuestras políticas y términos de uso.',
    usage: 'Condiciones de uso',
    privacy: 'Privacidad',
    cookies: 'Cookies',
    institutionalIntro: 'Conoce más sobre nuestra organización.',
    mission: 'Misión',
    vision: 'Visión',
    values: 'Valores',
    contactIntro: '¿Tienes dudas o necesitas ayuda? Escríbenos.',
    name: 'Nombre',
    email: 'Correo',
    subject: 'Asunto',
    message: 'Mensaje',
    send: 'Enviar',
    contactInfo: 'Información de contacto',
    lorem: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer in pulvinar nisl. Vivamus euismod, sapien non pulvinar feugiat, purus lacus feugiat orci, vitae bibendum dui augue sit amet turpis.'
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

    // Public landing
    platformName: 'Youth Volunteering Platform',
    heroTitle: 'Welcome to the volunteer community!',
    heroSubtitle: 'Join us and make a difference.',
    ctaRegister: 'Register now',
    ctaBrowse: 'Browse projects',
  newsAndUpdates: 'News & Updates',
    signIn: 'Sign in',
    terms: 'Policy/Terms of use',
    support: 'Support/Contact',
    institutionalInfo: 'Institutional information',
    termsIntro: 'Read our policies and terms of use.',
    usage: 'Terms of use',
    privacy: 'Privacy',
    cookies: 'Cookies',
    institutionalIntro: 'Learn more about our organization.',
    mission: 'Mission',
    vision: 'Vision',
    values: 'Values',
    contactIntro: 'Have questions or need help? Contact us.',
    name: 'Name',
    email: 'Email',
    subject: 'Subject',
    message: 'Message',
    send: 'Send',
    contactInfo: 'Contact information',
    lorem: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer in pulvinar nisl. Vivamus euismod, sapien non pulvinar feugiat, purus lacus feugiat orci, vitae bibendum dui augue sit amet turpis.'
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
