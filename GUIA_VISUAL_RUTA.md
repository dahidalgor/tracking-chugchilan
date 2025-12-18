# 🎨 Resumen Visual: Cómo funciona la Ruta

## 🛤️ Estados de la Ruta

### ESTADO 1: Mapa inicial (sin iniciar)
```
┌─────────────────────────────────┐
│                                 │
│     Mapa con ruta azul oscura   │
│     ═══════════════════════     │
│     Grosor: 4px                 │
│     Color: #2563eb (azul)       │
│                                 │
│  [🚀 INICIAR] [🧭 Seguir ON]   │
│  [📍 Mi ubicación] [🧲 Brújula] │
│                                 │
└─────────────────────────────────┘
```

### ESTADO 2: Después de hacer click en "INICIAR"
```
┌─────────────────────────────────┐
│                                 │
│   Mapa con ruta CYAN BRILLANTE  │
│   ══════════════════════════════ │
│   Grosor: 6px (más gruesa)      │
│   Color: #18c1e6 (cyan)         │
│                                 │
│  [✓ INICIADO] [🧭 Seguir ON]   │
│  [📍 Mi ubicación] [🧲 Brújula] │
│  Tu ubicación con GPS se activa │
│                                 │
└─────────────────────────────────┘
```

## 🔄 Cambios al iniciar

```
ANTES:
Color: #2563eb (azul oscuro)
Grosor: 4px
Opacidad: 0.95
Estado: Visible pero discreta

               ↓↓↓ CLICK EN INICIAR ↓↓↓

DESPUÉS:
Color: #18c1e6 (cyan brillante)  ← DESTACA
Grosor: 6px                       ← MÁS VISIBLE
Opacidad: 1 (100%)               ← MÁXIMO CONTRASTE
Estado: Muy visible, fácil seguir
```

## 📍 Dónde cambiar los valores

### Ubicación en el código:

```
frontend/index.html
│
├─ Línea ~270: Color inicial de la ruta
│  polyline_options: { color:'#2563eb', weight:4, opacity:.95 }
│  ↓ Aquí cambias el azul inicial
│
└─ Línea ~310-315: Color al iniciar
   gpxLayer.setStyle({ 
     color: '#18c1e6',  ← Aquí cambias el cyan
     weight: 6,        ← Aquí cambias el grosor
     opacity: 1        ← Aquí cambias la opacidad
   });
```

## 🎨 Colores recomendados

### Para ruta inicial (antes de iniciar):
- `#2563eb` - Azul oscuro (actual, recomendado)
- `#0066ff` - Azul puro
- `#4a5568` - Gris azulado

### Para ruta activa (después de iniciar):
- `#18c1e6` - Cyan brillante (actual, recomendado)
- `#00ffff` - Cyan puro
- `#ff6b6b` - Rojo brillante
- `#00ff00` - Verde brillante

## 🔧 Cómo personalizar

### Ejemplo 1: Ruta roja que se vuelve naranja
```javascript
// Línea ~270:
polyline_options: { color:'#ff0000', weight:4, opacity:.95 }

// Línea ~315:
color: '#ffa500'
```

### Ejemplo 2: Ruta más gruesa
```javascript
// Línea ~270:
polyline_options: { color:'#2563eb', weight:6, opacity:.95 }  // cambié 4→6

// Línea ~315:
weight: 8  // cambié 6→8
```

### Ejemplo 3: Colores oscuros
```javascript
// Línea ~270:
polyline_options: { color:'#1a237e', weight:4, opacity:.95 }  // azul muy oscuro

// Línea ~315:
color: '#1565c0'  // azul más claro
```

## ✅ Checklist de personalización

- [ ] Decidí qué color quiero antes de iniciar
- [ ] Decidí qué color quiero después de iniciar
- [ ] Encontré los colores HEX (usa https://www.colorpicker.com)
- [ ] Actualicé línea ~270 con color inicial
- [ ] Actualicé línea ~315 con color de inicio
- [ ] Probé en el navegador (F5 para refrescar)
- [ ] ¡Se ve bien? ¡Listo!

---

**Recuerda:** Siempre que cambies colores, presiona **F5** en el navegador para ver los cambios.
