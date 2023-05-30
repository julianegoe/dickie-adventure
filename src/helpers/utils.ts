export function getRelativePositionToCanvas(position: { x: number, y: number}, camera: any, layerParallaxFactor: number) {
    return {
      x: (position.x - camera.worldView.x) * layerParallaxFactor,
      y: (position.y - camera.worldView.y) * layerParallaxFactor
    }
  }