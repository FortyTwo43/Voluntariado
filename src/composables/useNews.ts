import { ref } from 'vue'

export interface Noticia {
  id: number
  titulo: string
  descripcion: string
  imagen_url?: string
  categoria?: string
  fecha_publicacion?: string
  autor?: string
  contenido_completo?: string
}

export function useNews() {
  const news = ref<Noticia[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchNews = async (limit: number = 4) => {
    loading.value = true
    error.value = null

    // Simular un pequeño delay para efecto de carga
    await new Promise(resolve => setTimeout(resolve, 500))

    try {
      // Usar datos locales directamente
      const allNews = getDefaultNews()
      news.value = allNews.slice(0, limit)
    } catch (err) {
      console.error('Error al cargar noticias:', err)
      error.value = err instanceof Error ? err.message : 'Error desconocido'
      news.value = []
    } finally {
      loading.value = false
    }
  }

  const getDefaultNews = (): Noticia[] => {
    const today = new Date()
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const twoWeeksAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000)
    const threeWeeksAgo = new Date(today.getTime() - 21 * 24 * 60 * 60 * 1000)
    
    return [
      {
        id: 1,
        titulo: 'Jornada de Limpieza de Playas en Galápagos',
        descripcion: 'Más de 200 voluntarios se unieron para proteger el patrimonio natural de Ecuador, limpiando las costas de las Islas Galápagos y recolectando más de 2 toneladas de residuos plásticos.',
        imagen_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=1200&auto=format&fit=crop',
        categoria: 'Medio Ambiente',
        fecha_publicacion: today.toISOString(),
        autor: 'Fundación Charles Darwin',
        contenido_completo: 'La jornada de limpieza contó con la participación de voluntarios locales e internacionales, quienes dedicaron su día a preservar la biodiversidad única de las Islas Galápagos. Se recolectaron principalmente botellas plásticas, redes de pesca abandonadas y otros desechos que amenazaban la vida marina.'
      },
      {
        id: 2,
        titulo: 'Programa de Tutorías en Comunidades Rurales de Quito',
        descripcion: 'Voluntarios universitarios ofrecen clases de refuerzo gratuitas a niños de escasos recursos en la zona rural de Quito, beneficiando a más de 150 estudiantes.',
        imagen_url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1200&auto=format&fit=crop',
        categoria: 'Educación',
        fecha_publicacion: lastWeek.toISOString(),
        autor: 'Fundación Educación para Todos',
        contenido_completo: 'El programa ha logrado mejorar significativamente el rendimiento académico de los estudiantes participantes, con un incremento promedio del 30% en sus calificaciones.'
      },
      {
        id: 3,
        titulo: 'Reforestación Masiva en la Amazonía Ecuatoriana',
        descripcion: 'Iniciativa ciudadana logra plantar 10,000 árboles nativos en la región amazónica, contribuyendo a la recuperación de áreas deforestadas y la protección del ecosistema.',
        imagen_url: 'https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=1200&auto=format&fit=crop',
        categoria: 'Medio Ambiente',
        fecha_publicacion: lastWeek.toISOString(),
        autor: 'Pachamama Foundation',
        contenido_completo: 'La campaña de reforestación contó con el apoyo de comunidades locales y voluntarios de todo el país. Se plantaron especies nativas como ceibo, guayacán y laurel, fundamentales para el ecosistema amazónico.'
      },
      {
        id: 4,
        titulo: 'Comedor Social en Guayaquil Atiende 500 Familias',
        descripcion: 'Voluntarios preparan y distribuyen alimentos calientes diariamente a familias vulnerables en Guayaquil, brindando apoyo nutricional a quienes más lo necesitan.',
        imagen_url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop',
        categoria: 'Social',
        fecha_publicacion: twoWeeksAgo.toISOString(),
        autor: 'Cruz Roja Ecuatoriana',
        contenido_completo: 'El comedor social opera gracias al trabajo de 40 voluntarios que preparan desayunos y almuerzos nutritivos. La iniciativa ha beneficiado a más de 500 familias desde su apertura.'
      },
      {
        id: 5,
        titulo: 'Brigadas Médicas Gratuitas en Zonas Rurales',
        descripcion: 'Profesionales de la salud voluntarios brindan atención médica gratuita en comunidades alejadas de Manabí, atendiendo a más de 300 personas en una jornada.',
        imagen_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop',
        categoria: 'Salud',
        fecha_publicacion: twoWeeksAgo.toISOString(),
        autor: 'Médicos Sin Fronteras Ecuador',
        contenido_completo: 'Las brigadas médicas incluyeron consultas generales, odontología, oftalmología y entrega de medicamentos gratuitos. Los voluntarios también realizaron charlas preventivas sobre salud e higiene.'
      },
      {
        id: 6,
        titulo: 'Refugio de Animales Callejeros Busca Voluntarios en Cuenca',
        descripcion: 'El albergue necesita personas que ayuden con el cuidado, alimentación y rehabilitación de perros y gatos rescatados de las calles de Cuenca.',
        imagen_url: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=1200&auto=format&fit=crop',
        categoria: 'Animales',
        fecha_publicacion: threeWeeksAgo.toISOString(),
        autor: 'PAE - Protección Animal Ecuador',
        contenido_completo: 'El refugio alberga actualmente más de 80 animales que necesitan cuidados diarios. Los voluntarios ayudan con la limpieza, alimentación, paseos y socialización de los animales mientras encuentran un hogar permanente.'
      },
      {
        id: 7,
        titulo: 'Construcción de Viviendas para Comunidades Afectadas',
        descripcion: 'Voluntarios de Techo Ecuador trabajan en la construcción de viviendas de emergencia para familias damnificadas en zonas vulnerables de Esmeraldas.',
        imagen_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop',
        categoria: 'Social',
        fecha_publicacion: threeWeeksAgo.toISOString(),
        autor: 'Techo Ecuador',
        contenido_completo: 'La jornada de construcción contó con 60 voluntarios que trabajaron durante todo el fin de semana. Se completaron 8 viviendas que ahora albergan a familias que perdieron sus hogares debido a inundaciones.'
      },
      {
        id: 8,
        titulo: 'Campaña de Alfabetización Digital para Adultos Mayores',
        descripcion: 'Jóvenes voluntarios enseñan a adultos mayores el uso de smartphones y computadoras en Loja, ayudándoles a mantenerse conectados con sus familias.',
        imagen_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop',
        categoria: 'Educación',
        fecha_publicacion: threeWeeksAgo.toISOString(),
        autor: 'Fundación Conecta Ecuador',
        contenido_completo: 'El programa ha capacitado a más de 100 adultos mayores en el uso de videollamadas, redes sociales y trámites en línea. Las clases se realizan dos veces por semana en centros comunitarios.'
      }
    ]
  }

  return {
    news,
    loading,
    error,
    fetchNews
  }
}
