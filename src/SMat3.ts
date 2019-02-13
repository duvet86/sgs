export default class SMat3 {
  public m00: number = 0;
  public m01: number = 0;
  public m02: number = 0;
  public m11: number = 0;
  public m12: number = 0;
  public m22: number = 0;

  public clear() {
    this.setSymmetric(0, 0, 0, 0, 0, 0);
  }

  public setSymmetric(
    m00: number,
    m01: number,
    m02: number,
    m11: number,
    m12: number,
    m22: number
  ) {
    this.m00 = m00;
    this.m01 = m01;
    this.m02 = m02;
    this.m11 = m11;
    this.m12 = m12;
    this.m22 = m22;
  }

  public setSymmetricFromSMat3(rhs: SMat3) {
    this.setSymmetric(rhs.m00, rhs.m01, rhs.m02, rhs.m11, rhs.m12, rhs.m22);
  }
}
