import Vertex2D from './Vertex2D';
import Vertex3D from './Vertex3D';

export default class Geometry {
    static Tolerance = 0.001;

    static stringToVertexList(str) {
        const tokens = str.trim().split(' ');
        const tokenCount = tokens.length;

        const vertexList = [];

        for (let i = 0; i < tokenCount; i++) {
            const coord = tokens[i].trim().split(',');

            if (coord.length !== 2) {
                continue;
            }

            const x = parseFloat(coord[0].trim());
            const y = parseFloat(coord[1].trim());

            if (isNaN(x) === false && x !== null && x !== undefined &&
                isNaN(y) === false && y !== null && y !== undefined) {
                vertexList.push(new Vertex2D(x, y));
            }
        }

        return vertexList;
    }

    static getVertexListCenter(vertexList) {
        const vertexCount = vertexList.length;

        if (vertexCount === 0)
            return null;

        if (vertexCount < 2)
            return 0.0;

        const halfLen = Geometry.getVertexListLength(vertexList) / 2;
        let len = 0.0;
        let vPrev = vertexList[0];

        for (let i = 1; i < vertexCount; i++) {
            const vCurrent = vertexList[i];
            len += vPrev.getDistance(vCurrent);

            if (len >= halfLen) {
                return vCurrent.getLinearVertex(vPrev, len - halfLen);
            }

            vPrev = vCurrent;
        }

        return null;
    }

    static getVertexListLength(vertexList) {
        let len = 0.0;
        const vertexCount = vertexList.length;

        if (vertexCount < 2) {
            return len;
        }

        let vPrev = vertexList[0];

        for (let i = 1; i < vertexCount; i++) {
            const vCurrent = vertexList[i];
            len += vPrev.getDistance(vCurrent);
            vPrev = vCurrent;
        }

        return len;
    }

    static getPolylineDistance(vertexList, vertex) {
        let len = null;
        const vertexCount = vertexList.length;

        if (vertexCount < 2) {
            return len;
        }

        let vPrev = vertexList[0];

        for (let i = 1; i < vertexCount; i++) {
            const vCurrent = vertexList[i];
            const length = Geometry.getLineDistance(vPrev, vCurrent, vertex);

            if (length === 0.0) {
                return 0.0;
            }
            else if (len === null || len > length) {
                len = length;
            }

            vPrev = vCurrent;
        }

        return len;
    }

    static getLineDistance(v1, v2, vertex) {
        const a = vertex.getDistance(v1);
        const b = v1.getDistance(v2);
        const c = vertex.getDistance(v2);

        if (a <= 0.001 || c <= 0.001) {
            return 0.0;
        }
        if (b <= 0.001) {
            return a;
        }

        const dCos = (a * a + b * b - c * c) / 2 / a / b;
        const _vertex = v1.getLinearVertex(v2, dCos * a);
        const dLen = _vertex.getDistance(vertex);

        const dAngle1 = Geometry.getAngle(vertex, v1, v2);
        const dAngle2 = Geometry.getAngle(vertex, v2, v1);
        const halfPI = Math.PI / 2;

        if (dAngle1 <= halfPI && dAngle2 <= halfPI) {
            return dLen;
        }

        return a > c ? c : a;
    }

    /// v1과 v2를 지나는 직선과 수직이며 v1을 지나는 직선이 있다.
    /// 이 직선상에 존재하며 v1으로부터 거리 dDistance 만큼 오른쪽(XY 좌표계에서 v2를 원점,
    /// v1을 양의 Y축에 놓았을 경우)으로 떨어진 거리의 점을 구한다.
    static getRightVertex(v1, v2, distance) {
        const len = v1.getDistance(v2);

        if (len === 0.0)
            return new Vertex2D(v1.x, v1.y);

        const vResult = new Vertex2D();
        vResult.x = distance / len * (v1.y - v2.y) + v1.x;
        vResult.y = distance / len * (v2.x - v1.x) + v1.y;
        return vResult;
    }

    static getAngle(v1, vCenter, v2) {
        const a = v1.getDistance(vCenter);
        const b = v2.getDistance(vCenter);
        const c = v1.getDistance(v2);

        let cosData = (a * a + b * b - c * c) / 2 / a / b;

        if (cosData < -1.0)
            cosData = -1.0;
        else if (cosData > 1.0)
            cosData = 1.0;

        return Math.acos(cosData);
    }

    static getAngle3(x1, y1, z1, xCenter, yCenter, zCenter, x3, y3, z3) {
        const a = Geometry.getDistance3(x1, y1, z1, xCenter, yCenter, zCenter);
        const b = Geometry.getDistance3(x3, y3, z3, xCenter, yCenter, zCenter);
        const c = Geometry.getDistance3(x1, y1, z1, x3, y3, z3);

        let cosData = (a * a + b * b - c * c) / 2 / a / b;

        if (cosData < -1.0)
            cosData = -1.0;
        else if (cosData > 1.0)
            cosData = 1.0;

        return Math.acos(cosData);
    }

    static getDistance3(x1, y1, z1, x2, y2, z2) {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) + (z1 - z2) * (z1 - z2));
    }

    static getDistance4(x1, y1, z1, w1, x2, y2, z2, w2) {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) + (z1 - z2) * (z1 - z2) + (w1 - w2) * (w1 - w2));
    }

    // begin에서 target을 향해 len만큼 이동한 지점의 버텍스를 얻어온다.
    static getLinearVertex3(xBegin, yBegin, zBegin, xTarget, yTarget, zTarget, len) {
        const distance = Geometry.getDistance3(xBegin, yBegin, zBegin, xTarget, yTarget, zTarget);

        if (distance <= 0.001)
            return [xBegin, yBegin, zBegin];

        const x = xBegin + (xTarget - xBegin) * len / distance;
        const y = yBegin + (yTarget - yBegin) * len / distance;
        const z = zBegin + (zTarget - zBegin) * len / distance;
        return [x, y, z];
    }

    // begin에서 target을 향해 len만큼 이동한 지점의 버텍스를 얻어온다.
    static getLinearVertex4(xBegin, yBegin, zBegin, wBegin, xTarget, yTarget, zTarget, wTarget, len) {
        const distance = Geometry.getDistance4(xBegin, yBegin, zBegin, wBegin, xTarget, yTarget, zTarget, wTarget);

        if (distance <= 0.001)
            return [xBegin, yBegin, zBegin, wBegin];

        const x = xBegin + (xTarget - xBegin) * len / distance;
        const y = yBegin + (yTarget - yBegin) * len / distance;
        const z = zBegin + (zTarget - zBegin) * len / distance;
        const w = wBegin + (wTarget - wBegin) * len / distance;
        return [x, y, z, w];
    }

    // lineBegin과 lineEnd를 잇는 직선위에서 (x, y, z)와 가장 가까운 점을 알려준다.
    // noLimit : 무한히 긴 직선으로 간주하고 계산할 것인가?
    static getNearestVertex3(x, y, z, lineBeginX, lineBeginY, lineBeginZ, lineEndX, lineEndY, lineEndZ, noLimit) {
        const len1 = Geometry.getDistance3(x, y, z, lineBeginX, lineBeginY, lineBeginZ);
        const len2 = Geometry.getDistance3(x, y, z, lineEndX, lineEndY, lineEndZ);

        if (len1 <= Geometry.Tolerance || len2 <= Geometry.Tolerance)
            return [x, y, z];

        const angle = Geometry.getAngle3(x, y, z, lineBeginX, lineBeginY, lineBeginZ, lineEndX, lineEndY, lineEndZ);
        const h = len1 * Math.cos(angle);

        const [_x, _y, _z] = Geometry.getLinearVertex3(lineBeginX, lineBeginY, lineBeginZ, lineEndX, lineEndY, lineEndZ, h);

        if (noLimit) {
            return [_x, _y, _z];
        }

        if (Geometry.isIncludeInLine3(_x, _y, _z, lineBeginX, lineBeginY, lineBeginZ, lineEndX, lineEndY, lineEndZ)) {
            return [_x, _y, _z];
        }

        return len1 < len2 ? [lineBeginX, lineBeginY, lineBeginZ] : [lineEndX, lineEndY, lineEndZ];
    }

    static isIncludeInLine3(x, y, z, lineBeginX, lineBeginY, lineBeginZ, lineEndX, lineEndY, lineEndZ) {
        const len = Geometry.getDistanceFromLine3(x, y, z, lineBeginX, lineBeginY, lineBeginZ, lineEndX, lineEndY, lineEndZ, false);

        if (len <= Geometry.Tolerance)
            return true;

        return false;
    }

    // lineBegin과 lineEnd를 잇는 직선과 (x, y, z)와의 가장 가까운 거리를 알려준다.
    // noLimit : 무한히 긴 직선으로 간주하고 계산할 것인가?
    static getDistanceFromLine3(x, y, z, lineBeginX, lineBeginY, lineBeginZ, lineEndX, lineEndY, lineEndZ, noLimit) {
        const a = Geometry.getDistance3(x, y, z, lineBeginX, lineBeginY, lineBeginZ);
        const b = Geometry.getDistance3(lineBeginX, lineBeginY, lineBeginZ, lineEndX, lineEndY, lineEndZ);
        const c = Geometry.getDistance3(x, y, z, lineEndX, lineEndY, lineEndZ);

        if (a <= Geometry.Tolerance || c <= Geometry.Tolerance)
            return 0.0;
        if (b <= Geometry.Tolerance)
            return a;

        const dCos = (a * a + b * b - c * c) / 2 / a / b;
        const [_x, _y, _z] = Geometry.getLinearVertex3(lineBeginX, lineBeginY, lineBeginZ, lineEndX, lineEndY, lineEndZ, dCos * a);
        const len = Geometry.getDistance3(_x, _y, _z, x, y, z);

        if (noLimit) {
            return len;
        }

        const angle1 = Geometry.getAngle3(x, y, z, lineBeginX, lineBeginY, lineBeginZ, lineEndX, lineEndY, lineEndZ);
        const angle2 = Geometry.getAngle3(x, y, z, lineEndX, lineEndY, lineEndZ, lineBeginX, lineBeginY, lineBeginZ);

        const halfPI = Math.PI / 2;

        if (angle1 <= halfPI && angle2 <= halfPI)
            return len;

        return a > c ? c : a;
    }

    // 직선과 평면의 교차점을 구한다.
    // 직선 : origin에서 dir (양)방향으로 그려진 직선. 무한히 긴 직선으로 간주한다.
    // 평면 : ax + by + cz + d = 0
    // 리턴값 : 하나의 점과 만나면 [Vertex3D, null]이 리턴된다.
    //          직선이 평면에 완전히 속해있으면 [Vertex3D, Vertex3D]가 리턴된다.
    //          만나지 않을경우 [null, null]이 리턴된다.
    static getIntersectLineToPlane(originX, originY, originZ, dirX, dirY, dirZ, a, b, c, d) {
        if (Math.abs(a * originX + b * originY + c * originZ + d) <= Geometry.Tolerance) {
            const v2 = new Vertex3D(originX + dirX * 100, originY + dirY * 100, originZ + dirZ * 100);

            if (Math.abs(a * v2.x + b * v2.y + c * v2.z + d) <= Geometry.Tolerance()) {
                // 직선이 평면에 완전히 속해있다.
                return [new Vertex3D(originX, originY, originZ), v2];
            }
        }

        const xDir = Math.abs(dirX);
        const yDir = Math.abs(dirY);
        const zDir = Math.abs(dirZ);

        if (xDir > Geometry.Tolerance && yDir > Geometry.Tolerance && zDir > Geometry.Tolerance) {
            return Geometry.getIntersectLineToPlaneXYZ(originX, originY, originZ, dirX, dirY, dirZ, a, b, c, d);
        }
        else if (xDir > Geometry.Tolerance && yDir > Geometry.Tolerance) {
            return Geometry.getIntersectLineToPlaneXY(originX, originY, originZ, dirX, dirY, dirZ, a, b, c, d);
        }
        else if (xDir > Geometry.Tolerance && zDir > Geometry.Tolerance) {
            return Geometry.getIntersectLineToPlaneXZ(originX, originY, originZ, dirX, dirY, dirZ, a, b, c, d);
        }
        else if (yDir > Geometry.Tolerance && zDir > Geometry.Tolerance) {
            return Geometry.getIntersectLineToPlaneYZ(originX, originY, originZ, dirX, dirY, dirZ, a, b, c, d);
        }
        else if (xDir > Geometry.Tolerance) {
            return Geometry.getIntersectLineToPlaneX(originX, originY, originZ, dirX, dirY, dirZ, a, b, c, d);
        }
        else if (yDir > Geometry.Tolerance) {
            return Geometry.getIntersectLineToPlaneY(originX, originY, originZ, dirX, dirY, dirZ, a, b, c, d);
        }
        else if (zDir > Geometry.Tolerance) {
            return Geometry.getIntersectLineToPlaneZ(originX, originY, originZ, dirX, dirY, dirZ, a, b, c, d);
        }

        return [null, null];
    }

    static getIntersectLineToPlaneXYZ(originX, originY, originZ, dirX, dirY, dirZ, a, b, c, d) {
        const xParam = a + dirZ * c / dirX + dirY * b / dirX;
        const xOther = d - dirY * originX * b / dirX + originY * b - dirZ * originX * c / dirX + originZ * c;

        if (Math.abs(xParam) <= Geometry.Tolerance) {
            return [null, null];
        }

        const x = -xOther / xParam;
        const y = dirY * (x - originX) / dirX + originY;
        const z = dirZ * (x - originX) / dirX + originZ;

        return [new Vertex3D(x, y, z), null];
    }

    static getIntersectLineToPlaneXY(originX, originY, originZ, dirX, dirY, dirZ, a, b, c, d) {
        const z = originZ;

        const xParam = a + dirY * b / dirX;
        const xOther = d - dirY * originX * b / dirX + originY * b + z * c;

        if (Math.abs(xParam) <= Geometry.Tolerance) {
            return [null, null];
        }

        const x = -xOther / xParam;
        const y = dirY * (x - originX) / dirX + originY;
        return [new Vertex3D(x, y, z), null];
    }

    static getIntersectLineToPlaneXZ(originX, originY, originZ, dirX, dirY, dirZ, a, b, c, d) {
        const y = originY;

        const xParam = a + dirZ * c / dirX;
        const xOther = d - dirZ * originX * c / dirX + originZ * c + y * b;

        if (Math.abs(xParam) <= Geometry.Tolerance) {
            return [null, null];
        }

        const x = -xOther / xParam;
        const z = dirZ * (x - originX) / dirX + originZ;
        return [new Vertex3D(x, y, z), null];
    }

    static getIntersectLineToPlaneYZ(originX, originY, originZ, dirX, dirY, dirZ, a, b, c, d) {
        const x = originX;

        const yParam = b + dirZ * c / dirY;
        const yOther = d + a * x - dirZ * originY * c / dirY + originZ * c;

        if (Math.abs(yParam) <= Geometry.Tolerance) {
            return [null, null];
        }

        const y = -yOther / yParam;
        const z = dirZ * (y - originY) / dirY + originZ;
        return [new Vertex3D(x, y, z), null];
    }

    static getIntersectLineToPlaneX(originX, originY, originZ, dirX, dirY, dirZ, a, b, c, d) {
        const y = originY;
        const z = originZ;

        const xParam = a;
        const xOther = b * y + c * z + d;

        if (Math.abs(xParam) <= Geometry.Tolerance) {
            return [null, null];
        }

        const x = -xOther / xParam;
        return [new Vertex3D(x, y, z), null];
    }

    static getIntersectLineToPlaneY(originX, originY, originZ, dirX, dirY, dirZ, a, b, c, d) {
        const x = originX;
        const z = originZ;

        const yParam = b;
        const yOther = a * x + c * z + d;

        if (Math.abs(yParam) <= Geometry.Tolerance) {
            return [null, null];
        }

        const y = -yOther / yParam;
        return [new Vertex3D(x, y, z), null];
    }

    static getIntersectLineToPlaneZ(originX, originY, originZ, dirX, dirY, dirZ, a, b, c, d) {
        const x = originX;
        const y = originY;

        const zParam = c;
        const zOther = a * x + b * y + d;

        if (Math.abs(zParam) <= Geometry.Tolerance) {
            return [null, null];
        }

        const z = -zOther / zParam;
        return [new Vertex3D(x, y, z), null];
    }

    // 세점을 지나는 평면의 방정식을 구한다.(ax + by + cz + d = 0)
    static makePlane(x1, y1, z1, x2, y2, z2, x3, y3, z3) {
        if (Geometry.getDistance3(x1, y1, z1, x2, y2, z2) <= Geometry.Tolerance ||
            Geometry.getDistance3(x2, y2, z2, x3, y3, z3) <= Geometry.Tolerance ||
            Geometry.getDistance3(x3, y3, z3, x1, y1, z1) <= Geometry.Tolerance) {
            return [null, null, null, null];
        }

        if (Geometry.isIncludeInLine3(x3, y3, z3, x1, y1, z1, x2, y2, z2)) {
            return [null, null, null, null];
        }

        const a = y1 * (z2 - z3) + y2 * (z3 - z1) + y3 * (z1 - z2);
        const b = z1 * (x2 - x3) + z2 * (x3 - x1) + z3 * (x1 - x2);
        const c = x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2);
        const d = -(x1 * (y2 * z3 - y3 * z2) + x2 * (y3 * z1 - y1 * z3) + x3 * (y1 * z2 - y2 * z1));
        return [a, b, c, d];
    }
}