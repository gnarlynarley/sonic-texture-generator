export interface VectorLike {
  x: number;
  y: number;
}

export default class Vector implements VectorLike {
  x: number;
  y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  add(vec: VectorLike): Vector {
    return new Vector(this.x + vec.x, this.y + vec.y);
  }

  mult(scalar: number): Vector {
    return new Vector(this.x * scalar, this.y * scalar);
  }

  static createUnitVector(mag: number, angle: number): Vector {
    const x = mag * Math.cos(angle);
    const y = mag * Math.sin(angle);

    return new Vector(x, y);
  }
}
