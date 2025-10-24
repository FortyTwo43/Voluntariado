<template>
  <section class="projects-view">
    <div class="projects-header">
      <h1 class="page-title">Explorar Proyectos</h1>
      <p class="page-subtitle">Encuentra proyectos de voluntariado que se ajusten a tus intereses</p>
    </div>

    <div class="filters-section">
      <div class="filter-group">
        <label>
          <span class="material-symbols-outlined">search</span>
          <input type="search" placeholder="Buscar proyectos..." class="filter-input" />
        </label>
      </div>
      
      <div class="filter-group">
        <select class="filter-select">
          <option>Todas las categorías</option>
          <option>Educación</option>
          <option>Medio Ambiente</option>
          <option>Salud</option>
          <option>Tecnología</option>
        </select>
      </div>
      
      <div class="filter-group">
        <select class="filter-select">
          <option>Todas las ubicaciones</option>
          <option>Madrid</option>
          <option>Barcelona</option>
          <option>Valencia</option>
          <option>Remoto</option>
        </select>
      </div>
    </div>

    <div class="projects-grid">
      <article class="project-card" v-for="i in 9" :key="i">
        <div class="project-header">
          <div class="project-image">
            <span class="material-symbols-outlined">volunteer_activism</span>
          </div>
          <span class="project-badge">Nuevo</span>
        </div>
        
        <div class="project-body">
          <h3 class="project-title">Proyecto de Voluntariado {{ i }}</h3>
          <p class="project-organization">
            <span class="material-symbols-outlined">groups</span>
            Organización Ejemplo
          </p>
          
          <p class="project-description">
            Descripción del proyecto de voluntariado. Aquí se detalla brevemente en qué consiste 
            el proyecto y qué tipo de actividades se realizan.
          </p>
          
          <div class="project-tags">
            <span class="tag">Educación</span>
            <span class="tag">Jóvenes</span>
          </div>
          
          <div class="project-meta">
            <div class="meta-item">
              <span class="material-symbols-outlined">location_on</span>
              <span>Madrid</span>
            </div>
            <div class="meta-item">
              <span class="material-symbols-outlined">calendar_today</span>
              <span>Flexible</span>
            </div>
            <div class="meta-item">
              <span class="material-symbols-outlined">schedule</span>
              <span>4-6h/semana</span>
            </div>
          </div>
        </div>
        
        <div class="project-footer">
          <button class="btn-outline">Ver más</button>
          <button class="btn-primary">Postularme</button>
        </div>
      </article>
    </div>

    <div class="pagination">
      <button class="pagination-btn" disabled>Anterior</button>
      <div class="pagination-numbers">
        <button class="pagination-number active">1</button>
        <button class="pagination-number">2</button>
        <button class="pagination-number">3</button>
        <span>...</span>
        <button class="pagination-number">10</button>
      </div>
      <button class="pagination-btn">Siguiente</button>
    </div>
  </section>
</template>

<style scoped>
.projects-view {
  max-width: 80rem;
  margin: 0 auto;
}

.projects-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: var(--color-text-secondary);
}

.filters-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-group {
  flex: 1;
  min-width: 200px;
}

.filter-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
}

.filter-group label .material-symbols-outlined {
  position: absolute;
  left: 0.75rem;
  color: var(--color-text-secondary);
  pointer-events: none;
}

.filter-input {
  width: 100%;
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
}

.filter-select {
  width: 100%;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
  cursor: pointer;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.project-card {
  display: flex;
  flex-direction: column;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  overflow: hidden;
  transition: box-shadow 0.2s, transform 0.2s;
}

.project-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.project-header {
  position: relative;
}

.project-image {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 180px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
}

.project-image .material-symbols-outlined {
  font-size: 5rem;
  color: white;
  opacity: 0.9;
}

.project-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  background-color: var(--color-secondary);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 0.25rem;
  text-transform: uppercase;
}

.project-body {
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.project-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.project-organization {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin: 0;
}

.project-organization .material-symbols-outlined {
  font-size: 1rem;
}

.project-description {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin: 0;
}

.project-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  padding: 0.25rem 0.75rem;
  background-color: var(--color-background);
  color: var(--color-primary);
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 0.25rem;
}

.project-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.meta-item .material-symbols-outlined {
  font-size: 1rem;
}

.project-footer {
  display: flex;
  gap: 0.5rem;
  padding: 1rem 1.25rem;
  border-top: 1px solid var(--color-border);
  background-color: var(--color-background);
}

.btn-outline {
  flex: 1;
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  background-color: transparent;
  border-radius: 0.375rem;
  font-weight: 500;
}

.btn-outline:hover {
  background-color: rgba(79, 70, 229, 0.05);
}

.btn-primary {
  flex: 1;
  padding: 0.5rem 1rem;
  background-color: var(--color-primary);
  color: white;
  border-radius: 0.375rem;
  font-weight: 500;
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem 0;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
  border-radius: 0.375rem;
  font-weight: 500;
}

.pagination-btn:hover:not(:disabled) {
  background-color: var(--color-background);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-numbers {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-number {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
  border-radius: 0.375rem;
  min-width: 2.5rem;
}

.pagination-number:hover {
  background-color: var(--color-background);
}

.pagination-number.active {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}
</style>
