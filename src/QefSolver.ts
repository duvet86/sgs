import QefData from "QefData";
import SMat3 from "SMat3";
import { Vector3 } from "babylonjs";

export default class QefSolver {
  private data: QefData = new QefData();
  private ata: SMat3;
  private atb: Vector3;
  private massPoint: Vector3;
  private x: Vector3;
  private hasSolution: boolean;

  public add(px: number, py: number, pz: number, nx: number, ny: number, nz: number) {
    this.hasSolution = false;
    this.normalize(nx, ny, nz);
    this.data.ata00 += nx * nx;
    this.data.ata01 += nx * ny;
    this.data.ata02 += nx * nz;
    this.data.ata11 += ny * ny;
    this.data.ata12 += ny * nz;
    this.data.ata22 += nz * nz;
    const dot = nx * px + ny * py + nz * pz;
    this.data.atbX += dot * nx;
    this.data.atbY += dot * ny;
    this.data.atbZ += dot * nz;
    this.data.btb += dot * dot;
    this.data.massPointX += px;
    this.data.massPointY += py;
    this.data.massPointZ += pz;
    ++this.data.numPoints;
  }

  public solve(outx: Vector3, svdTol: number,
    svdSweeps: number, pinvTol: number)
    {
    if (this.data.numPoints === 0) {
    throw new Error("Invalid arguments.");
    }

    this.massPoint.set(this.data.massPointX, this.data.massPointY,
        this.data.massPointZ);

    this.massPoint = this.massPoint.scale(1.0 / this.data.numPoints);

    this.setAta();
    this.setAtb();

    let tmpv: Vector3;

    // MatUtils::vmul_symmetric(tmpv, this->ata, this->massPoint);

    this.ata
    tmpv

    VecUtils::sub(this->atb, this->atb, tmpv);
    this->x.clear();
    const float result = Svd::solveSymmetric(this->ata, this->atb,
        this->x, svd_tol, svd_sweeps, pinv_tol);
    VecUtils::addScaled(this->x, 1, this->massPoint);
    this->setAtb();
    outx.set(x);
    this->hasSolution = true;
    return result;
    }

  // TO DO make pure.
  private normalize(nx: number, ny: number, nz: number) {
    const tmpv = new Vector3(nx, ny, nz);
    tmpv.normalize();
    nx = tmpv.x;
    ny = tmpv.y;
    nz = tmpv.z;
  }

  private setAta()
    {
        this.ata.setSymmetric(this.data.ata00, this.data.ata01,
                               this.data.ata02, this.data.ata11, this.data.ata12,
                               this.data.ata22);
    }

    private setAtb()
    {
        this.atb.set(this.data.atbX, this.data.atbY, this.data.atbZ);
    }
}
