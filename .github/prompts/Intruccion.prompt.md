---
agent: agent
---
# Reglas de Desarrollo y Estilo

## TypeScript y Código
- **Lenguaje**: Utiliza TypeScript estrictamente.
- **Importaciones**: 
  - Usa `import type` para importar tipos e interfaces.
  - Prefiere las importaciones nombradas (`import { ... } from ...`).
- **Funciones**: Define las funciones usando la sintaxis de declaración: `function nombreFuncion() {}`.
- **Naming**: 
  - Variables y funciones en **inglés** y **camelCase**.
  - Componentes en **PascalCase**.
- **Comentarios**: Evita comentarios obvios o innecesarios. El código debe ser autoexplicativo.
- **Exportaciones**: No se usa el index para agrupar las exportaciones.

## Estilos (Tailwind CSS)
- **Framework**: Usa Tailwind CSS V4.
- **Variables**: Implementa los estilos utilizando las variables CSS definidas en `index.css` (ej. `bg-[var(--surface)]`).
- **Consistencia**: Usa las clases de utilidad predefinidas de Tailwind siempre que sea posible. Evita valores arbitrarios (ej. `w-[123px]`) a menos que correspondan a tokens de diseño específicos.

## Localización
- **Idioma**: Todo el texto visible para el usuario debe estar en **español**.
- **Rutas**: Los segmentos de URL y links deben estar en español (ej. `/inicio`, `/casos`).