import { Vector3 } from 'babylonjs';

import { edgevmap, CHILD_MIN_OFFSETS, MATERIAL_SOLID, MATERIAL_AIR } from 'utils';
import {sphereSDF} from "signedDistanceFunction";
import OctreeDrawInfo from 'OctreeDrawInfo';

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
	svd::QefSolver qef;

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

		const vec3 p1 = vec3(leaf->min + CHILD_MIN_OFFSETS[c1]);
		const vec3 p2 = vec3(leaf->min + CHILD_MIN_OFFSETS[c2]);
		const vec3 p = ApproximateZeroCrossingPosition(p1, p2);
		const vec3 n = CalculateSurfaceNormal(p);
		qef.add(p.x, p.y, p.z, n.x, n.y, n.z);

		averageNormal += n;

		edgeCount++;
	}

	svd::Vec3 qefPosition;
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
}
