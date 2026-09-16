namespace UnE.Geometry
{
    public class Vertex3D
    {
        private double _x = 0.0;
        private double _y = 0.0;
        private double _z = 0.0;

        public double x
        {
            get { return _x; }
            set { _x = value; }
        }

        public double y
        {
            get { return _y; }
            set { _y = value; }
        }

        public double z
        {
            get { return _z; }
            set { _z = value; }
        }


        public static Vertex3D operator +(Vertex3D a, Vertex3D b)
        {
            return new Vertex3D(a.x + b.x, a.y + b.y, a.z + b.z);
        }

        public static Vertex3D operator -(Vertex3D a, Vertex3D b)
        {
            return new Vertex3D(a.x - b.x, a.y - b.y, a.z - b.z);
        }

        public static Vertex3D operator *(Vertex3D a, double b)
        {
            return new Vertex3D(a.x * b, a.y * b, a.z * b);
        }

        public static Vertex3D operator /(Vertex3D a, double b)
        {
            return new Vertex3D(a.x / b, a.y / b, a.z / b);
        }

        public Vertex3D()
        {
        }

        public Vertex3D(Vertex3D vertex)
        {
            this.x = vertex.x;
            this.y = vertex.y;
            this.z = vertex.z;
        }

        public Vertex3D(double x, double y, double z)
        {
            this.x = x;
            this.y = y;
            this.z = z;
        }

        public void SetVertex(double x, double y, double z)
        {
            this.x = x;
            this.y = y;
            this.z = z;
        }

        public void CopyFrom(Vertex3D vertex)
        {
            this.x = vertex.x;
            this.y = vertex.y;
            this.z = vertex.z;
        }

        /// <summary>
        /// vertex와의 거리를 알려준다.
        /// </summary>
        /// <param name="vertex"></param>
        /// <returns></returns>
        public double GetDistance(Vertex3D vertex)
        {
            double _x = this.x - vertex.x;
            double _y = this.y - vertex.y;
            double _z = this.z - vertex.z;

            return System.Math.Sqrt(_x * _x + _y * _y + _z * _z);
        }

        /// <summary>
        /// v1과 v2를 지나는 직선을 기준으로 현재의 버텍스와 대칭되는 객체를 만들어 리턴한다.
        /// v1과 v2가 동일한 좌표일 경우 false를 리턴한다.
        /// </summary>
        /// <param name="v1"></param>
        /// <param name="v2"></param>
        /// <param name="result"></param>
        /// <returns></returns>
        public bool Mirror(Vertex3D v1, Vertex3D v2, out Vertex3D result)
        {
            result = null;

            if (v1.GetDistance(v2) <= Math.HALF_TOLERANCE())
                return false;

            double len = this.GetDistance(v1);
            double dAngle = Math.GetAngle(this, v1, v2);
            double h = len * System.Math.Cos(dAngle);

            Vertex3D vCenter = Math.GetLinearVertex(this, v1, h);
            result = vCenter * 2 - this;
            return true;
        }

        /// <summary>
        /// v1, v2, v3를 지나는 평면을 기준으로 현재의 버텍스와 대칭되는 객체를 만들어 리턴한다.
        /// v1, v2, v3가 평면을 구성하지 못할 경우 false를 리턴한다.
        /// </summary>
        /// <param name="v1"></param>
        /// <param name="v2"></param>
        /// <param name="v3"></param>
        /// <param name="result"></param>
        /// <returns></returns>
        public bool Mirror(Vertex3D v1, Vertex3D v2, Vertex3D v3, out Vertex3D result)
        {
            result = null;

            double a, b, c, d;  // ax + by + cz + d = 0
            if (!Math.MakePlane(v1, v2, v3, out a, out b, out c, out d))
                return false;

            Vertex3D vTarget = Math.GetNearestVertex(this, a, b, c, d);
            result = vTarget * 2 - this;
            return true;
        }
    }
}
