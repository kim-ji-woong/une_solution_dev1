namespace UnE.Geometry
{
    public class Vertex2F
    {
        private float _x = 0.0f;
        private float _y = 0.0f;

        public float x
        {
            get { return _x; }
            set { _x = value; }
        }

        public float y
        {
            get { return _y; }
            set { _y = value; }
        }

        public static Vertex2F operator +(Vertex2F a, Vertex2F b)
        {
            return new Vertex2F(a.x + b.x, a.y + b.y);
        }

        public static Vertex2F operator -(Vertex2F a, Vertex2F b)
        {
            return new Vertex2F(a.x - b.x, a.y - b.y);
        }

        public static Vertex2F operator *(Vertex2F a, float b)
        {
            return new Vertex2F(a.x * b, a.y * b);
        }

        public static Vertex2F operator /(Vertex2F a, float b)
        {
            return new Vertex2F(a.x / b, a.y / b);
        }

        public Vertex2F()
        {
        }

        public Vertex2F(Vertex2F vertex)
        {
            this.x = vertex.x;
            this.y = vertex.y;
        }

        public Vertex2F(float x, float y)
        {
            this.x = x;
            this.y = y;
        }

        public void SetVertex(float x, float y)
        {
            this.x = x;
            this.y = y;
        }

        public void CopyFrom(Vertex2F vertex)
        {
            this.x = vertex.x;
            this.y = vertex.y;
        }

        /// <summary>
        /// vertex와의 거리를 알려준다.
        /// </summary>
        /// <param name="vertex"></param>
        /// <returns></returns>
        public float GetDistance(Vertex2F vertex)
        {
            double _x = this.x - vertex.x;
            double _y = this.y - vertex.y;

            return (float)System.Math.Sqrt(_x * _x + _y * _y);
        }

        /// <summary>
        /// v1과 v2를 지나는 직선을 기준으로 현재의 버텍스와 대칭되는 객체를 만들어 리턴한다.
        /// v1과 v2가 동일한 좌표일 경우 false를 리턴한다.
        /// </summary>
        /// <param name="v1"></param>
        /// <param name="v2"></param>
        /// <param name="result"></param>
        /// <returns></returns>
        public bool Mirror(Vertex2F v1, Vertex2F v2, out Vertex2F result)
        {
            Vertex2D vSelf = new Vertex2D(this.x, this.y);
            Vertex2D vResult;
            bool success = vSelf.Mirror(new Vertex2D(v1.x, v1.y), new Vertex2D(v2.x, v2.y), out vResult);

            result = new Vertex2F((float)vResult.x, (float)vResult.y);
            return success;
        }
    }
}
