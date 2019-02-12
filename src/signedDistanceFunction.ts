import { Vector3 } from 'babylonjs';

const radius = 1;
const origin = new Vector3();

// Don't know.
export const sphereSDF = (pos: Vector3): number => {
  return pos.subtract(origin).lengthSquared() - radius * radius;
};
