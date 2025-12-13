---
applyTo: '**'
---
No puede haber emojis en el codigo que generes.

Los archivos no pueden tener mas de 450 lineas.

Evita el uso de any si es posible.

Todas las Views tienen que estar formadas obligatoriamente por componentes más pequeños y "tontos" creados en la ruta src/components

Todo el texto que se muestre al usuario tiene que funcionar siempre con las traducciones en src/composables/useLanguage.ts

Todos componentes de vue deben tener el <style scoped>

Todos los estilos deben ser responsive para dispositivos mobiles o pantallas pequeñas

Despues de haber termido con la tarea que te asigné, vas a ejecutar siempre un npm run build para asegurarte que no haya errores

El <template> nunca podrá definir estilos, todos deben estar en <style>.

Siempre que quieras agregar algo nuevo deberas revisar si ya existe, si ya existe usalo, caso contrario crealo.

Todos los comentarios del codigo deben estar en español.

Cualquier Readme que hagas para explicar un cambio hecho debe ser corto y solo con lo mas importante

Aplica patrones de diseño si es posible y recomendado segun el caso, no lo fuerces

Aplica los principios SOLID de ser posible

Siempre que hagas algo asegurate que respete las interfaces en /src/type que representa el dominio del sistema. NO PUEDES INVENTARTE COSAS QUE NO SE DEFINAN AHÍ

Todos los llamados usando la API REST de supabase se tienen que hacer en los /src/service NUNCA en los componentes, los componentes solo usan los metodos definidos en el service