function Meta({
  puntero,
  Porcentaje,
  lastClick,
  metadata,
  viewportSize,
  handleCenter,
}) {
  return (
    <div className="container">
      <button onClick={handleCenter}>Centrar</button>
      <p>Puntero</p>
      <p>
        {puntero.x} {puntero.y}
      </p>
      <p>Visible :</p>
      <div>viewport Centro</div>
      <p>
        X: {viewportSize.width + metadata.width / 15} Y:
        {viewportSize.height + metadata.height / 5}
      </p>
      <p>Posicion del conteiner:</p>
      (X: {metadata.left} Y: {metadata.top} )<p>Dimenciones del conteiner:</p>
      (x: {Porcentaje.x} %, y: {Porcentaje.y} %)<p></p>
      <p>Cordenanas globales del click:</p>
      (X: {lastClick.x}, Y: {lastClick.y})<p></p>
      <p> Alto: {metadata.height}px</p>
      <p> Ancho: {metadata.width}px</p>
      <p>Dimenciones del viewport:</p>
      <p> Alto: {viewportSize.height}px</p>
      <p> Ancho: {viewportSize.width}px</p>
    </div>
  );
}
