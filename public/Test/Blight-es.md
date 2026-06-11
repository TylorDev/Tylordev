# Blight

Datos de pagina del proyecto para la app de escritorio Blight.

## RawProject translation patch in Markdown

locale: es-mx

translation:

- subtitle: Economia de crafteo en escritorio para inventario, tickets de fabricacion, analisis XL y comparacion de mercados.

sections:

- summary: Inventario y compras
- modalContent: Blight registra compras de materiales, conserva el historial de facturas y controla el inventario actual por categoria, tier, cantidad, inversion total y costo promedio. Las compras actualizan stock y facturas para mantener el costo de materiales conectado con los calculos posteriores de tickets.
- summary: Tickets de fabricacion y TicketXL
- modalContent: Blight crea tickets de fabricacion usando recetas soportadas, tax de crafteo, costos promedio del stock y sobras disponibles. TicketXL guia un lote de cuatro tickets en T5, T6, T7 y T8 con la misma receta y tax, y prepara un snapshot de historial para analizar el lote.
- summary: Cierre de produccion e historial
- modalContent: Los tickets abiertos se cierran con validacion de stock, valores de diarios llenos, sobras de tablas y telas, y cantidades de bastones producidos por calidad. Un cierre exitoso actualiza stock, historial de tickets, creditos de sobras, stock de bastones, lotes y movimientos.
- summary: Analisis de rentabilidad y comparacion de precios
- modalContent: TicketAnalizer evalua cuatro tickets cerrados, uno por tier, para calcular costo total, venta bruta, impuestos, ganancia neta y rentabilidad por poder de item, tier y calidad. El comparador de precios ayuda a comparar mercados en modo simple o avanzado sin modificar el inventario.
