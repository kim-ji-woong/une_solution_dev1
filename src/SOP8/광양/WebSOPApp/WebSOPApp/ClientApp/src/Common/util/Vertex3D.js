export default class Vertex3D {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    getDistance(vertex) {
        const w = this.x - vertex.x;
        const h = this.y - vertex.y;
        const t = this.z - vertex.z;

        return Math.sqrt(w * w + h * h + t * t);
    }

    getLinearVertex(target, len) {
        const distance = this.getDistance(target);

        if (distance <= 0.001)
            return new Vertex3D(this.x, this.y, this.z);

        const x = this.x + (target.x - this.x) * len / distance;
        const y = this.y + (target.y - this.y) * len / distance;
        const z = this.z + (target.z - this.z) * len / distance;

        return new Vertex3D(x, y, z);
    }

    static crossProduct(v1, v2) {
        return new Vertex3D(v1.y * v2.z - v1.z * v2.y, v1.z * v2.x - v1.x * v2.z, v1.x * v2.y - v1.y * v2.x);
    }
}