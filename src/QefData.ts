export default class QefData {
  public ata00: number = 0;
  public ata01: number = 0;
  public ata02: number = 0;
  public ata11: number = 0;
  public ata12: number = 0;
  public ata22: number = 0;

  public atbX: number = 0;
  public atbY: number = 0;
  public atbZ: number = 0;
  public btb: number = 0;
  public massPointX: number = 0;
  public massPointY: number = 0;
  public massPointZ: number = 0;
  public numPoints: number = 0;

  public add(rhs: QefData) {
    this.ata00 += rhs.ata00;
    this.ata01 += rhs.ata01;
    this.ata02 += rhs.ata02;
    this.ata11 += rhs.ata11;
    this.ata12 += rhs.ata12;
    this.ata22 += rhs.ata22;
    this.atbX += rhs.atbX;
    this.atbY += rhs.atbY;
    this.atbZ += rhs.atbZ;
    this.btb += rhs.btb;
    this.massPointX += rhs.massPointX;
    this.massPointY += rhs.massPointY;
    this.massPointZ += rhs.massPointZ;
    this.numPoints += rhs.numPoints;
  }

  private set(
    ata00: number,
    ata01: number,
    ata02: number,
    ata11: number,
    ata12: number,
    ata22: number,
    atbX: number,
    atbY: number,
    atbZ: number,
    btb: number,
    massPointX: number,
    massPointY: number,
    massPointZ: number,
    numPoints: number
  ) {
    this.ata00 = ata00;
    this.ata01 = ata01;
    this.ata02 = ata02;
    this.ata11 = ata11;
    this.ata12 = ata12;
    this.ata22 = ata22;
    this.atbX = atbX;
    this.atbY = atbY;
    this.atbZ = atbZ;
    this.btb = btb;
    this.massPointX = massPointX;
    this.massPointY = massPointY;
    this.massPointZ = massPointZ;
    this.numPoints = numPoints;
  }
}
