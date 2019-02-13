import { Vector3 } from 'babylonjs';

import { edgevmap, CHILD_MIN_OFFSETS, MATERIAL_SOLID, MATERIAL_AIR } from 'utils';
import {sphereSDF} from "signedDistanceFunction";
import OctreeDrawInfo from 'OctreeDrawInfo';
import QefSolver from "QefSolver";

enum OctreeNodeType {
  None,
  Internal,
  Psuedo,
  Leaf
}

export default class OctreeNode {
  private children: Array<OctreeNode | undefined> = [];
  private type: OctreeNodeType = OctreeNodeType.None;
  private min: Vector3 = new Vector3();
  private size: number = 0;
  private drawInfo: OctreeDrawInfo | undefined;

  constructor() {
    for (let i = 0; i < 8; i++) {
      this.children[i] = undefined;
    }
  }

  public constructOctreeNodes(node: OctreeNode): OctreeNode | undefined {
    if (node == null) {
      return undefined;
    }

    if (node.size === 1) {
      return this.constructLeaf(node);
    }

    const childSize = node.size / 2;
    let hasChildren = false;

    for (let i = 0; i < 8; i++) {
      const child = new OctreeNode();
      child.size = childSize;
      child.min = new Vector3(node.min.x + CHILD_MIN_OFFSETS[i].x * childSize,
        node.min.y + CHILD_MIN_OFFSETS[i].y * childSize,
        node.min.z + CHILD_MIN_OFFSETS[i].z * childSize);

      child.type = OctreeNodeType.Internal;

      node.children[i] = constructOctreeNodes(child);
      hasChildren = hasChildren || node.children[i] != null;
    }

    if (!hasChildren) {
      // delete node;
      return undefined;
    }

    return node;
  }

  
private constructLeaf(leaf: OctreeNode): OctreeNode | undefined {
	if (leaf == null || leaf.size !== 1)
	{
		return undefined;
	}

	let corners = 0;
	for (let i = 0; i < 8; i++)
	{
		const cornerPos: Vector3 = new Vector3(
      leaf.min.x + CHILD_MIN_OFFSETS[i].x,
      leaf.min.y + CHILD_MIN_OFFSETS[i].y,
      leaf.min.z + CHILD_MIN_OFFSETS[i].z);

    const density: number = sphereSDF(cornerPos);
    
    const material = density < 0 ? MATERIAL_SOLID : MATERIAL_AIR;
    
		corners |= (material << i);
	}

	if (corners === 0 || corners === 255)
	{
		// voxel is full inside or outside the volume
		// delete leaf;
		return undefined;
	}

	// otherwise the voxel contains the surface, so find the edge intersections
	const MAX_CROSSINGS = 6;
	let edgeCount = 0;
	let averageNormal = new Vector3();
	const qef: QefSolver = new QefSolver();

	for (let i = 0; i < 12 && edgeCount < MAX_CROSSINGS; i++)
	{
		const c1 = edgevmap[i][0];
		const c2 = edgevmap[i][1];

		const m1 = (corners >> c1) & 1;
		const m2 = (corners >> c2) & 1;

		if ((m1 === MATERIAL_AIR && m2 === MATERIAL_AIR)
			|| (m1 === MATERIAL_SOLID && m2 === MATERIAL_SOLID))
		{
			// no zero crossing on this edge
			continue;
		}

		const p1: Vector3 = leaf.min.add(CHILD_MIN_OFFSETS[c1]);
		const p2: Vector3 = leaf.min.add(CHILD_MIN_OFFSETS[c2]);

		const p: Vector3 = this.approximateZeroCrossingPosition(p1, p2);
		const n: Vector3 = this.calculateSurfaceNormal(p);

		qef.add(p.x, p.y, p.z, n.x, n.y, n.z);

		averageNormal = averageNormal.add(n);

		edgeCount++;
	}

	const qefPosition: Vector3;
	qef.solve(qefPosition, QEF_ERROR, QEF_SWEEPS, QEF_ERROR);

	OctreeDrawInfo* drawInfo = new OctreeDrawInfo;
	drawInfo->position = vec3(qefPosition.x, qefPosition.y, qefPosition.z);
	drawInfo->qef = qef.getData();

	const vec3 min = vec3(leaf->min);
	const vec3 max = vec3(leaf->min + ivec3(leaf->size));
	if (drawInfo->position.x < min.x || drawInfo->position.x > max.x ||
		drawInfo->position.y < min.y || drawInfo->position.y > max.y ||
		drawInfo->position.z < min.z || drawInfo->position.z > max.z)
	{
		const auto& mp = qef.getMassPoint();
		drawInfo->position = vec3(mp.x, mp.y, mp.z);
	}

	drawInfo->averageNormal = glm::normalize(averageNormal / (float)edgeCount);
	drawInfo->corners = corners;

	leaf->type = Node_Leaf;
	leaf->drawInfo = drawInfo;

	return leaf;
}

private approximateZeroCrossingPosition(p0: Vector3, p1: Vector3): Vector3
{
	const steps = 8;
	const increment = 1.0 / steps;

	// Approximate the zero crossing by finding the min value along the edge.
	let minValue = 100000.0;
	let t = 0.0;
	let currentT = 0.0;

	while (currentT <= 1.0)
	{
		// const vec3 p = p0 + ((p1 - p0) * currentT);
		const p = p0.add((p1.subtract(p0)).multiplyByFloats(currentT, currentT, currentT));

		const density = Math.sqrt(sphereSDF(p));
		if (density < minValue)
		{
			minValue = density;
			t = currentT;
		}

		currentT += increment;
	}

	return p0.add((p1.subtract(p0)).multiplyByFloats(t, t, t));
}

private calculateSurfaceNormal(p: Vector3): Vector3
{
	const H = 0.001;

	const dx = sphereSDF(p.add(new Vector3(H, 0.0, 0.0))) - sphereSDF(p.subtract(new Vector3(H, 0.0, 0.0)));
	const dy = sphereSDF(p.add(new Vector3(0.0, H, 0.0))) - sphereSDF(p.subtract(new Vector3(0.0, H, 0.0)));
	const dz = sphereSDF(p.add(new Vector3(0.0, 0.0, H))) - sphereSDF(p.subtract(new Vector3(0.0, 0.0, H)));

	return (new Vector3(dx, dy, dz)).normalize();
}
}
