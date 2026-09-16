export default class Vertex2D
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }

    getDistance(vertex) {
        const w = this.x - vertex.x;
        const h = this.y - vertex.y;
        return Math.sqrt(w * w + h * h);
    }

    getLinearVertex(target, len) {
        const distance = this.getDistance(target);

        if (distance <= 0.001)
            return new Vertex2D(this.x, this.y);

        const x = this.x + (target.x - this.x) * len / distance;
        const y = this.y + (target.y - this.y) * len / distance;
        return new Vertex2D(x, y);
    }
}