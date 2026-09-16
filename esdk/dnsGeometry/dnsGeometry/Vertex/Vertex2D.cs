namespace UnE.Geometry
{
    public class Vertex2D
    {
        private double _x = 0.0;
        private double _y = 0.0;

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

        public static Vertex2D operator +(Vertex2D a, Vertex2D b)
        {
            return new Vertex2D(a.x + b.x, a.y + b.y);
        }

        public static Vertex2D operator -(Vertex2D a, Vertex2D b)
        {
            return new Vertex2D(a.x - b.x, a.y - b.y);
        }

        public static Vertex2D operator *(Vertex2D a, double b)
        {
            return new Vertex2D(a.x * b, a.y * b);
        }

        public static Vertex2D operator /(Vertex2D a, double b)
        {
            return new Vertex2D(a.x / b, a.y / b);
        }

        public Vertex2D()
        {
        }

        public Vertex2D(Vertex2D vertex)
        {
            this.x = vertex.x;
            this.y = vertex.y;
        }

        public Vertex2D(double x, double y)
        {
            this.x = x;
            this.y = y;
        }

        public void SetVertex(double x, double y)
        {
            this.x = x;
            this.y = y;
        }

        public void CopyFrom(Vertex2D vertex)
        {
            this.x = vertex.x;
            this.y = vertex.y;
        }

        /// <summary>
        /// vertex와의 거리를 알려준다.
        /// </summary>
        /// <param name="vertex"></param>
        /// <returns></returns>
        public double GetDistance(Vertex2D vertex)
        {
            double _x = this.x - vertex.x;
            double _y = this.y - vertex.y;

            return System.Math.Sqrt(_x * _x + _y * _y);
        }

        /// <summary>
        /// v1과 v2를 지나는 직선을 기준으로 현재의 버텍스와 대칭되는 객체를 만들어 리턴한다.
        /// v1과 v2가 동일한 좌표일 경우 false를 리턴한다.
        /// </summary>
        /// <param name="v1"></param>
        /// <param name="v2"></param>
        /// <param name="result"></param>
        /// <returns></returns>
        public bool Mirror(Vertex2D v1, Vertex2D v2, out Vertex2D result)
        {
            result = null;

            if (v1.GetDistance(v2) <= Math.HALF_TOLERANCE())
                return false;

            double len = this.GetDistance(v1);
            double dAngle = Math.GetAngle(this, v1, v2);
            double h = len * System.Math.Cos(dAngle);

            Vertex2D vCenter = Math.GetLinearVertex(this, v1, h);
            result = vCenter * 2 - this;
            return true;
        }
    }
}
