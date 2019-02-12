import { Vector3 } from 'babylonjs';

export const MATERIAL_AIR = 0;
export const MATERIAL_SOLID = 1;

export const QEF_ERROR = 1e-6;
export const QEF_SWEEPS = 4;

// Needs to match the vertMap from Dual Contouring impl.
export const CHILD_MIN_OFFSETS: Vector3[] = [
  new Vector3(0, 0, 0),
  new Vector3(0, 0, 1),
  new Vector3(0, 1, 0),
  new Vector3(0, 1, 1),
  new Vector3(1, 0, 0),
  new Vector3(1, 0, 1),
  new Vector3(1, 1, 0),
  new Vector3(1, 1, 1)
];

export const edgevmap: number[][] = [
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7], // x-axis
  [0, 2],
  [1, 3],
  [4, 6],
  [5, 7], // y-axis
  [0, 1],
  [2, 3],
  [4, 5],
  [6, 7] // z-axis
];

export const edgemask: number[] = [5, 3, 6];

export const vertMap: number[][] = [
  [0, 0, 0],
  [0, 0, 1],
  [0, 1, 0],
  [0, 1, 1],
  [1, 0, 0],
  [1, 0, 1],
  [1, 1, 0],
  [1, 1, 1]
];

export const faceMap: number[][] = [
  [4, 8, 5, 9],
  [6, 10, 7, 11],
  [0, 8, 1, 10],
  [2, 9, 3, 11],
  [0, 4, 2, 6],
  [1, 5, 3, 7]
];

export const cellProcFaceMask: number[][] = [
  [0, 4, 0],
  [1, 5, 0],
  [2, 6, 0],
  [3, 7, 0],
  [0, 2, 1],
  [4, 6, 1],
  [1, 3, 1],
  [5, 7, 1],
  [0, 1, 2],
  [2, 3, 2],
  [4, 5, 2],
  [6, 7, 2]
];

export const cellProcEdgeMask: number[][] = [
  [0, 1, 2, 3, 0],
  [4, 5, 6, 7, 0],
  [0, 4, 1, 5, 1],
  [2, 6, 3, 7, 1],
  [0, 2, 4, 6, 2],
  [1, 3, 5, 7, 2]
];

export const faceProcFaceMask: number[][][] = [
  [[4, 0, 0], [5, 1, 0], [6, 2, 0], [7, 3, 0]],
  [[2, 0, 1], [6, 4, 1], [3, 1, 1], [7, 5, 1]],
  [[1, 0, 2], [3, 2, 2], [5, 4, 2], [7, 6, 2]]
];

export const faceProcEdgeMask: number[][][] = [
  [[1, 4, 0, 5, 1, 1], [1, 6, 2, 7, 3, 1], [0, 4, 6, 0, 2, 2], [0, 5, 7, 1, 3, 2]],
  [[0, 2, 3, 0, 1, 0], [0, 6, 7, 4, 5, 0], [1, 2, 0, 6, 4, 2], [1, 3, 1, 7, 5, 2]],
  [[1, 1, 0, 3, 2, 0], [1, 5, 4, 7, 6, 0], [0, 1, 5, 0, 4, 1], [0, 3, 7, 2, 6, 1]]
];

export const edgeProcEdgeMask: number[][][] = [
  [[3, 2, 1, 0, 0], [7, 6, 5, 4, 0]],
  [[5, 1, 4, 0, 1], [7, 3, 6, 2, 1]],
  [[6, 4, 2, 0, 2], [7, 5, 3, 1, 2]]
];

export const processEdgeMask: number[][] = [[3, 2, 1, 0], [7, 5, 6, 4], [11, 10, 9, 8]];
