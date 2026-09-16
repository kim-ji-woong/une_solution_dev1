namespace UnE.Geometry
{
    public static class Math
    {
        private static double _COORD_TOLERANCE = 0.0000001;
        private static float _HALF_TOLERANCE  = 0.0001f;

        public static double COORD_TOLERANCE()
        {
            return _COORD_TOLERANCE;
        }

        public static float HALF_TOLERANCE()
        {
            return _HALF_TOLERANCE;
        }

        public static double HALF_PI()
        {
            return 1.57079632679489661923; ;
        }

        public static double PI()
        {
            return 3.14159265358979323846;
        }

        public static double _3HALF_PI()
        {
            return 4.71238898038468985769;
        }

        public static double _2PI()
        {
            return 6.28318530717958647692;
        }

        /// <summary>
        /// v1과 vCenter가 이루는 직선과 vCenter와 v2가 이루는 직선이 서로 만나 이루는 각을 리턴한다.
        /// </summary>
        /// <param name="v1"></param>
        /// <param name="vCenter"></param>
        /// <param name="v2"></param>
        /// <returns>Radian</returns>
        public static double GetAngle(Vertex2F v1, Vertex2F vCenter, Vertex2F v2)
        {
            return GetAngle(new Vertex3D(v1.x, v1.y, 0), new Vertex3D(vCenter.x, vCenter.y, 0), new Vertex3D(v2.x, v2.y, 0));
        }

        /// <summary>
        /// v1과 vCenter가 이루는 직선과 vCenter와 v2가 이루는 직선이 서로 만나 이루는 각을 리턴한다.
        /// </summary>
        /// <param name="v1"></param>
        /// <param name="vCenter"></param>
        /// <param name="v2"></param>
        /// <returns>Radian</returns>
        public static double GetAngle(Vertex2D v1, Vertex2D vCenter, Vertex2D v2)
        {
            return GetAngle(new Vertex3D(v1.x, v1.y, 0), new Vertex3D(vCenter.x, vCenter.y, 0), new Vertex3D(v2.x, v2.y, 0));
        }

        /// <summary>
        /// v1과 vCenter가 이루는 직선과 vCenter와 v2가 이루는 직선이 서로 만나 이루는 각을 리턴한다.
        /// </summary>
        /// <param name="v1"></param>
        /// <param name="vCenter"></param>
        /// <param name="v2"></param>
        /// <returns>Radian</returns>
        public static double GetAngle(Vertex3F v1, Vertex3F vCenter, Vertex3F v2)
        {
            return GetAngle(new Vertex3D(v1.x, v1.y, v1.z), new Vertex3D(vCenter.x, vCenter.y, vCenter.z), new Vertex3D(v2.x, v2.y, v2.z));
        }

        /// <summary>
        /// v1과 vCenter가 이루는 직선과 vCenter와 v2가 이루는 직선이 서로 만나 이루는 각을 리턴한다.
        /// </summary>
        /// <param name="v1"></param>
        /// <param name="vCenter"></param>
        /// <param name="v2"></param>
        /// <returns>Radian</returns>
        public static double GetAngle(Vertex3D v1, Vertex3D vCenter, Vertex3D v2)
        {
            // 코사인 제2법칙
            // C²= A²+ B²- 2ABcosΘ
            double a = v1.GetDistance(vCenter);
            double b = v2.GetDistance(vCenter);
            double c = v1.GetDistance(v2);

            double cosData = (a * a + b * b - c * c) / 2 / a / b;

            if (cosData < -1.0)
                cosData = -1.0;
            else if (cosData > 1.0)
                cosData = 1.0;

            return System.Math.Acos(cosData);
        }

        /// <summary>
        /// v1과 v2를 잇는 직선상에서 v1으로부터 v2 방향으로 dLength 만큼 떨어진 거리의 점을 구한다.
        /// </summary>
        /// <param name="v1"></param>
        /// <param name="v2"></param>
        /// <param name="length"></param>
        /// <returns></returns>
        public static Vertex2F GetLinearVertex(Vertex2F v1, Vertex2F v2, float length)
        {
            Vertex3D result = GetLinearVertex(new Vertex3D(v1.x, v1.y, 0), new Vertex3D(v2.x, v2.y, 0), length);
            return new Vertex2F((float)result.x, (float)result.y);
        }

        /// <summary>
        /// v1과 v2를 잇는 직선상에서 v1으로부터 v2 방향으로 dLength 만큼 떨어진 거리의 점을 구한다.
        /// </summary>
        /// <param name="v1"></param>
        /// <param name="v2"></param>
        /// <param name="fLength"></param>
        /// <returns></returns>
        public static Vertex2D GetLinearVertex(Vertex2D v1, Vertex2D v2, double length)
        {
            Vertex3D result = GetLinearVertex(new Vertex3D(v1.x, v1.y, 0), new Vertex3D(v2.x, v2.y, 0), length);
            return new Vertex2D(result.x, result.y);
        }

        /// <summary>
        /// v1과 v2를 잇는 직선상에서 v1으로부터 v2 방향으로 dLength 만큼 떨어진 거리의 점을 구한다.
        /// </summary>
        /// <param name="v1"></param>
        /// <param name="v2"></param>
        /// <param name="length"></param>
        /// <returns></returns>
        public static Vertex3F GetLinearVertex(Vertex3F v1, Vertex3F v2, float length)
        {
            Vertex3D result = GetLinearVertex(new Vertex3D(v1.x, v1.y, v1.z), new Vertex3D(v2.x, v2.y, v2.z), length);
            return new Vertex3F((float)result.x, (float)result.y, (float)result.z);
        }

        /// <summary>
        /// v1과 v2를 잇는 직선상에서 v1으로부터 v2 방향으로 dLength 만큼 떨어진 거리의 점을 구한다.
        /// </summary>
        /// <param name="v1"></param>
        /// <param name="v2"></param>
        /// <param name="fLength"></param>
        /// <returns></returns>
        public static Vertex3D GetLinearVertex(Vertex3D v1, Vertex3D v2, double length)
        {
            // v1과 v2 사이의 거리
            double len = v1.GetDistance(v2);

            if (len <= COORD_TOLERANCE())
                return new Vertex3D(v1);

            Vertex3D v3 = v1 + (v2 - v1) * length / len;
            return v3;
        }

        /// <summary>
        /// v1과 v2를 지나는 직선과 수직이며 v1을 지나는 직선이 있다.
        /// 이 직선상에 존재하며 v1으로부터 거리 dDistance 만큼 오른쪽(XY 좌표계에서 v2를 원점,
        /// v1을 양의 Y축에 놓았을 경우)으로 떨어진 거리의 점을 구한다.
        /// </summary>
        /// <param name="v1"></param>
        /// <param name="v2"></param>
        /// <param name="dDistance"></param>
        /// <returns></returns>
        public static Vertex2D GetRightVertex(Vertex2D v1, Vertex2D v2, double distance)
        {
            double dLen = v1.GetDistance(v2);
            if (dLen == 0.0)
                return new Vertex2D(v1);

            Vertex2D vResult = new Vertex2D();
            vResult.x = distance / dLen * (v1.y - v2.y) + v1.x;
            vResult.y = distance / dLen * (v2.x - v1.x) + v1.y;
            return vResult;
        }

        /// <summary>
        /// v1과 v2를 지나는 직선과 수직이며 v1을 지나는 직선이 있다.
        /// 이 직선상에 존재하며 v1으로부터 거리 dDistance 만큼 오른쪽(XY 좌표계에서 v2를 원점,
        /// v1을 양의 Y축에 놓았을 경우)으로 떨어진 거리의 점을 구한다.
        /// </summary>
        /// <param name="v1"></param>
        /// <param name="v2"></param>
        /// <param name="dDistance"></param>
        /// <returns></returns>
        public static Vertex2F GetRightVertex(Vertex2F v1, Vertex2F v2, float distance)
        {
            float len = v1.GetDistance(v2);
            if (len == 0.0f)
                return new Vertex2F(v1);

            Vertex2F vResult = new Vertex2F();
            vResult.x = distance / len * (v1.y - v2.y) + v1.x;
            vResult.y = distance / len * (v2.x - v1.x) + v1.y;
            return vResult;
        }

        /// <summary>
        /// vLineBegin과 vLineEnd를 잇는 직선위에서 vertex와 가장 가까운 점을 알려준다.
        /// </summary>
        /// <param name="vertex"></param>
        /// <param name="vLineBegin"></param>
        /// <param name="vLineEnd"></param>
        /// <param name="noLimit">true이면 직선은 무한한 길이를 갖고 있으며, false이면 직선은 vLineBegin과 vLineEnd 사이의 제한된 길이를 가진다.</param>
        /// <returns></returns>
        public static Vertex3D GetNearestVertex(Vertex3D vertex, Vertex3D vLineBegin, Vertex3D vLineEnd, bool noLimit)
        {
            double dLen = vertex.GetDistance(vLineBegin);
            double dLen2 = vertex.GetDistance(vLineEnd);

            if (dLen <= Math.HALF_TOLERANCE() || dLen2 <= Math.HALF_TOLERANCE())
                return vertex;

            double dAngle = Math.GetAngle(vertex, vLineBegin, vLineEnd);
            double h = dLen * System.Math.Cos(dAngle);

            Vertex3D _vertex = Math.GetLinearVertex(vLineBegin, vLineEnd, h);
            Line3D line = new Line3D(vLineBegin, vLineEnd);

            if (noLimit || line.IsInclude(_vertex))
            {
                return _vertex;
            }

            return dLen < dLen2 ? new Vertex3D(vLineBegin) : new Vertex3D(vLineEnd);
        }

        /// <summary>
        /// vLineBegin과 vLineEnd를 잇는 직선위에서 vertex와 가장 가까운 점을 알려준다.
        /// </summary>
        /// <param name="vertex"></param>
        /// <param name="vLineBegin"></param>
        /// <param name="vLineEnd"></param>
        /// <param name="noLimit">true이면 직선은 무한한 길이를 갖고 있으며, false이면 직선은 vLineBegin과 vLineEnd 사이의 제한된 길이를 가진다.</param>
        /// <returns></returns>
        public static Vertex3F GetNearestVertex(Vertex3F vertex, Vertex3F vLineBegin, Vertex3F vLineEnd, bool noLimit)
        {
            Vertex3D result =GetNearestVertex(new Vertex3D(vertex.x, vertex.y, vertex.z), new Vertex3D(vLineBegin.x, vLineBegin.y, vLineBegin.z), new Vertex3D(vLineEnd.x, vLineEnd.y, vLineEnd.z), noLimit);
            return new Vertex3F((float)result.x, (float)result.y, (float)result.z);
        }

        /// <summary>
        /// vLineBegin과 vLineEnd를 잇는 직선위에서 vertex와 가장 가까운 점을 알려준다.
        /// </summary>
        /// <param name="vertex"></param>
        /// <param name="vLineBegin"></param>
        /// <param name="vLineEnd"></param>
        /// <param name="noLimit">true이면 직선은 무한한 길이를 갖고 있으며, false이면 직선은 vLineBegin과 vLineEnd 사이의 제한된 길이를 가진다.</param>
        /// <returns></returns>
        public static Vertex2D GetNearestVertex(Vertex2D vertex, Vertex2D vLineBegin, Vertex2D vLineEnd, bool noLimit)
        {
            Vertex3D result = GetNearestVertex(new Vertex3D(vertex.x, vertex.y, 0), new Vertex3D(vLineBegin.x, vLineBegin.y, 0), new Vertex3D(vLineEnd.x, vLineEnd.y, 0), noLimit);
            return new Vertex2D(result.x, result.y);
        }

        /// <summary>
        /// vLineBegin과 vLineEnd를 잇는 직선위에서 vertex와 가장 가까운 점을 알려준다.
        /// </summary>
        /// <param name="vertex"></param>
        /// <param name="vLineBegin"></param>
        /// <param name="vLineEnd"></param>
        /// <param name="noLimit">true이면 직선은 무한한 길이를 갖고 있으며, false이면 직선은 vLineBegin과 vLineEnd 사이의 제한된 길이를 가진다.</param>
        /// <returns></returns>
        public static Vertex2F GetNearestVertex(Vertex2F vertex, Vertex2F vLineBegin, Vertex2F vLineEnd, bool noLimit)
        {
            Vertex3D result = GetNearestVertex(new Vertex3D(vertex.x, vertex.y, 0), new Vertex3D(vLineBegin.x, vLineBegin.y, 0), new Vertex3D(vLineEnd.x, vLineEnd.y, 0), noLimit);
            return new Vertex2F((float)result.x, (float)result.y);
        }

        /// <summary>
        /// 평면(ax + by + cz + d = 0) 위에서 rVertex와 가장 가까운 점을 알려준다.
        /// </summary>
        /// <param name="vertex"></param>
        /// <param name="a"></param>
        /// <param name="b"></param>
        /// <param name="c"></param>
        /// <param name="d"></param>
        /// <returns></returns>
        public static Vertex3D GetNearestVertex(Vertex3D vertex, double a, double b, double c, double d)
        {
            double k = -(a * vertex.x + b * vertex.y + c * vertex.z + d) / (a * a + b * b + c * c);
            return new Vertex3D(a * k + vertex.x, b * k + vertex.y, c * k + vertex.z);
        }

        /// <summary>
        /// v1, v2, v3를 지나는 평면의 방정식을 구한다.(ax + by + cz + d = 0)
        /// v1, v2, v3가 평면을 구성하지 못할 경우 false를 리턴한다.
        /// </summary>
        /// <param name="v1"></param>
        /// <param name="v2"></param>
        /// <param name="v3"></param>
        /// <param name="a"></param>
        /// <param name="b"></param>
        /// <param name="c"></param>
        /// <param name="d"></param>
        /// <returns></returns>
        public static bool MakePlane(Vertex3D v1, Vertex3D v2, Vertex3D v3, out double a, out double b, out double c, out double d)
        {
            a = b = c = d = 0.0;

            if (v1.GetDistance(v2) <= HALF_TOLERANCE() || v2.GetDistance(v3) <= HALF_TOLERANCE() || v3.GetDistance(v1) <= HALF_TOLERANCE())
                return false;

            Line3D line = new Line3D(v1, v2, Line3D.LineType.LINE);

            if (line.IsInclude(v3))
                return false;

            a = v1.y * (v2.z - v3.z) + v2.y * (v3.z - v1.z) + v3.y * (v1.z - v2.z);
            b = v1.z * (v2.x - v3.x) + v2.z * (v3.x - v1.x) + v3.z * (v1.x - v2.x);
            c = v1.x * (v2.y - v3.y) + v2.x * (v3.y - v1.y) + v3.x * (v1.y - v2.y);
            d = -(v1.x * (v2.y * v3.z - v3.y * v2.z) + v2.x * (v3.y * v1.z - v1.y * v3.z) + v3.x * (v1.y * v2.z - v2.y * v1.z));
            return true;
        }

        /// <summary>
        /// 직선과 평면의 교차점을 구한다.
        /// 직선 : vOrigin에서 vDir (양)방향으로 그려진 직선. 무한히 긴 직선으로 간주한다.
        /// 평면 : ax + by + cz + d = 0
        /// </summary>
        /// <param name="vOrigin">직선의 한 점</param>
        /// <param name="vDir">직선의 진행방향</param>
        /// <param name="a"></param>
        /// <param name="b"></param>
        /// <param name="c"></param>
        /// <param name="d"></param>
        /// <param name="vResult1"></param>
        /// <param name="vResult2"></param>
        /// <returns>
        /// 교차점이 존재하지 않으면 false를 리턴한다.
        /// 교차점이 한개 존재하면 vResult1에 값이 할당되고, true를 리턴한다.
        /// 직선이 평면에 완전히 속해 있으면 vResult1은 vOrigin, vResult2에는 직선위 또다른 한 점이 할당되며, true가 리턴된다.
        /// </returns>
        public static bool GetIntersectLineToPlane(Vertex3D vOrigin, Vertex3D vDir, double a, double b, double c, double d, out Vertex3D vResult1, out Vertex3D vResult2)
        {
            vResult1 = vResult2 = null;

            if (System.Math.Abs(a * vOrigin.x + b * vOrigin.y + c * vOrigin.z + d) <= HALF_TOLERANCE())
            {
                Vertex3D v2 = vOrigin + vDir * 100;

                if (System.Math.Abs(a * v2.x + b * v2.y + c * v2.z + d) <= HALF_TOLERANCE())
                {
                    // 직선이 평면에 완전히 속해있다.
                    vResult1 = new Vertex3D(vOrigin);
                    vResult2 = v2;
                    return true;
                }
            }

            double xDir = System.Math.Abs(vDir.x);
            double yDir = System.Math.Abs(vDir.y);
            double zDir = System.Math.Abs(vDir.z);

            if (xDir > HALF_TOLERANCE() && yDir > HALF_TOLERANCE() && zDir > HALF_TOLERANCE())
            {
                return GetIntersectLineToPlaneXYZ(vOrigin, vDir, a, b, c, d, out vResult1, out vResult2);
            }
            else if (xDir > HALF_TOLERANCE() && yDir > HALF_TOLERANCE())
            {
                return GetIntersectLineToPlaneXY(vOrigin, vDir, a, b, c, d, out vResult1, out vResult2);
            }
            else if (xDir > HALF_TOLERANCE() && zDir > HALF_TOLERANCE())
            {
                return GetIntersectLineToPlaneXZ(vOrigin, vDir, a, b, c, d, out vResult1, out vResult2);
            }
            else if (yDir > HALF_TOLERANCE() && zDir > HALF_TOLERANCE())
            {
                return GetIntersectLineToPlaneYZ(vOrigin, vDir, a, b, c, d, out vResult1, out vResult2);
            }
            else if (xDir > HALF_TOLERANCE())
            {
                return GetIntersectLineToPlaneX(vOrigin, vDir, a, b, c, d, out vResult1, out vResult2);
            }
            else if (yDir > HALF_TOLERANCE())
            {
                return GetIntersectLineToPlaneY(vOrigin, vDir, a, b, c, d, out vResult1, out vResult2);
            }
            else if (zDir > HALF_TOLERANCE())
            {
                return GetIntersectLineToPlaneZ(vOrigin, vDir, a, b, c, d, out vResult1, out vResult2);
            }

            return false;
        }

        private static bool GetIntersectLineToPlaneXYZ(Vertex3D vOrigin, Vertex3D vDir, double a, double b, double c, double d, out Vertex3D vResult1, out Vertex3D vResult2)
        {
            vResult1 = vResult2 = null;

            double xParam = a + vDir.z * c / vDir.x + vDir.y * b / vDir.x;
            double xOther = d - vDir.y * vOrigin.x * b / vDir.x + vOrigin.y * b - vDir.z * vOrigin.x * c / vDir.x + vOrigin.z * c;

            if (System.Math.Abs(xParam) <= HALF_TOLERANCE())
                return false;

            double x = -xOther / xParam;
            double y = vDir.y * (x - vOrigin.x) / vDir.x + vOrigin.y;
            double z = vDir.z * (x - vOrigin.x) / vDir.x + vOrigin.z;

            vResult1 = new Vertex3D(x, y, z);
            return true;
        }

        private static bool GetIntersectLineToPlaneXY(Vertex3D vOrigin, Vertex3D vDir, double a, double b, double c, double d, out Vertex3D vResult1, out Vertex3D vResult2)
        {
            vResult1 = vResult2 = null;
            double z = vOrigin.z;

            double xParam = a + vDir.y * b / vDir.x;
            double xOther = d - vDir.y * vOrigin.x * b / vDir.x + vOrigin.y * b + z * c;

            if (System.Math.Abs(xParam) <= HALF_TOLERANCE())
                return false;

            double x = -xOther / xParam;
            double y = vDir.y * (x - vOrigin.x) / vDir.x + vOrigin.y;

            vResult1 = new Vertex3D(x, y, z);
            return true;
        }

        private static bool GetIntersectLineToPlaneXZ(Vertex3D vOrigin, Vertex3D vDir, double a, double b, double c, double d, out Vertex3D vResult1, out Vertex3D vResult2)
        {
            vResult1 = vResult2 = null;
            double y = vOrigin.y;

            double xParam = a + vDir.z * c / vDir.x;
            double xOther = d - vDir.z * vOrigin.x * c / vDir.x + vOrigin.z * c + y * b;

            if (System.Math.Abs(xParam) <= HALF_TOLERANCE())
                return false;

            double x = -xOther / xParam;
            double z = vDir.z * (x - vOrigin.x) / vDir.x + vOrigin.z;

            vResult1 = new Vertex3D(x, y, z);
            return true;
        }

        private static bool GetIntersectLineToPlaneYZ(Vertex3D vOrigin, Vertex3D vDir, double a, double b, double c, double d, out Vertex3D vResult1, out Vertex3D vResult2)
        {
            vResult1 = vResult2 = null;
            double x = vOrigin.x;

            double yParam = b + vDir.z * c / vDir.y;
            double yOther = d + a * x - vDir.z * vOrigin.y * c / vDir.y + vOrigin.z * c;

            if (System.Math.Abs(yParam) <= HALF_TOLERANCE())
                return false;

            double y = -yOther / yParam;
            double z = vDir.z * (y - vOrigin.y) / vDir.y + vOrigin.z;

            vResult1 = new Vertex3D(x, y, z);
            return true;
        }

        private static bool GetIntersectLineToPlaneX(Vertex3D vOrigin, Vertex3D vDir, double a, double b, double c, double d, out Vertex3D vResult1, out Vertex3D vResult2)
        {
            vResult1 = vResult2 = null;
            double y = vOrigin.y;
            double z = vOrigin.z;

            double xParam = a;
            double xOther = b * y + c * z + d;

            if (System.Math.Abs(xParam) <= HALF_TOLERANCE())
                return false;

            double x = -xOther / xParam;

            vResult1 = new Vertex3D(x, y, z);
            return true;
        }

        private static bool GetIntersectLineToPlaneY(Vertex3D vOrigin, Vertex3D vDir, double a, double b, double c, double d, out Vertex3D vResult1, out Vertex3D vResult2)
        {
            vResult1 = vResult2 = null;
            double x = vOrigin.x;
            double z = vOrigin.z;

            double yParam = b;
            double yOther = a * x + c * z + d;

            if (System.Math.Abs(yParam) <= HALF_TOLERANCE())
                return false;

            double y = -yOther / yParam;

            vResult1 = new Vertex3D(x, y, z);
            return true;
        }

        private static bool GetIntersectLineToPlaneZ(Vertex3D vOrigin, Vertex3D vDir, double a, double b, double c, double d, out Vertex3D vResult1, out Vertex3D vResult2)
        {
            vResult1 = vResult2 = null;
            double x = vOrigin.x;
            double y = vOrigin.y;

            double zParam = c;
            double zOther = a * x + b * y + d;

            if (System.Math.Abs(zParam) <= HALF_TOLERANCE())
                return false;

            double z = -zOther / zParam;

            vResult1 = new Vertex3D(x, y, z);
            return true;
        }

        /// <summary>
        /// vBegin과 vEnd를 잇는 직선이 있다.
        /// 가상 좌표계에서 vEnd를 원점, vBegin을 양의 Y축에 있다고 가정하였을 때,
        /// rVertex가 양의 X축에 있는지 여부를 알려준다.
        /// </summary>
        /// <param name="rVertex"></param>
        /// <param name="vBegin"></param>
        /// <param name="vEnd"></param>
        /// <returns>
        /// 1 (직선의 오른쪽에 있다. => 양의 X축)
        /// 0 (직선의 왼쪽에 있다. => 음의 X축)
        /// -1 (직선위에 존재한다.)
        /// </returns>
        public static int IsRightSideFromLine(Vertex2D rVertex, Vertex2D vBegin, Vertex2D vEnd)
        {
            Vertex2D vR = GetRightVertex(vBegin, vEnd, 100.0);
            double dAngle1 = GetAngle(vEnd, vBegin, rVertex);
            double dAngle2 = GetAngle(rVertex, vBegin, vR);

            Vertex2D v;

            if (dAngle1 < Math.HALF_PI())
            {
                double dLen = vBegin.GetDistance(rVertex);
                v = Math.GetLinearVertex(vBegin, vEnd, dLen);
            }
            else
            {
                double dLen = vEnd.GetDistance(rVertex);
                v = Math.GetLinearVertex(vEnd, vBegin, dLen);
            }

            if (v.GetDistance(rVertex) <= Math.COORD_TOLERANCE())
                return -1;

            if (dAngle2 < Math.HALF_PI())
                return 1;
            return 0;
        }

        /// <summary>
        /// 소수점 몇자리까지 허용할 것인가를 판단한 다음 값을 넘겨준다.
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public static double GetTolerance(double data)
        {
            int nCount = (int)System.Math.Log10(data) + 1;
            nCount = 10 - nCount;

            double dTolerance = 0.1;

            for (int i = 1; i < nCount; i++)
            {
                dTolerance /= 10.0;
            }

            return dTolerance;
        }

        /// <summary>
        /// 소수점 몇자리까지 허용할 것인가를 판단한 다음 값을 넘겨준다.
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public static void SetHalfTolerance(float fTolerance)
        {
            _HALF_TOLERANCE = fTolerance;
        }

        public static void SetCoordTolerance(double dTolerance)
        {
            _COORD_TOLERANCE = dTolerance;
        }

        public static double RadToDeg(double dRadian)
        {
            return 180.0 * dRadian / PI();
        }

        public static double DegToRad(double dDegree)
        {
            return PI() * dDegree / 180.0;
        }
    }
}
