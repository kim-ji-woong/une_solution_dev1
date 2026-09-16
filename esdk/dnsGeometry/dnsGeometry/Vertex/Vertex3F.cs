namespace UnE.Geometry
{
    public class Vertex3F
    {
        private float _x = 0.0f;
        private float _y = 0.0f;
        private float _z = 0.0f;

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

        public float z
        {
            get { return _z; }
            set { _z = value; }
        }

        public static Vertex3F operator +(Vertex3F a, Vertex3F b)
        {
            return new Vertex3F(a.x + b.x, a.y + b.y, a.z + b.z);
        }

        public static Vertex3F operator -(Vertex3F a, Vertex3F b)
        {
            return new Vertex3F(a.x - b.x, a.y - b.y, a.z - b.z);
        }

        public static Vertex3F operator *(Vertex3F a, float b)
        {
            return new Vertex3F(a.x * b, a.y * b, a.z * b);
        }

        public static Vertex3F operator /(Vertex3F a, float b)
        {
            return new Vertex3F(a.x / b, a.y / b, a.z / b);
        }

        public Vertex3F()
        {
        }

        public Vertex3F(Vertex3F vertex)
        {
            this.x = vertex.x;
            this.y = vertex.y;
            this.z = vertex.z;
        }

        public Vertex3F(float x, float y, float z)
        {
            this.x = x;
            this.y = y;
            this.z = z;
        }

        public void SetVertex(float x, float y, float z)
        {
            this.x = x;
            this.y = y;
            this.z = z;
        }

        public void CopyFrom(Vertex3F vertex)
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
        public float GetDistance(Vertex3F vertex)
        {
            double _x = this.x - vertex.x;
            double _y = this.y - vertex.y;
            double _z = this.z - vertex.z;

            return (float)System.Math.Sqrt(_x * _x + _y * _y + _z * _z);
        }

        /// <summary>
        /// v1과 v2를 지나는 직선을 기준으로 현재의 버텍스와 대칭되는 객체를 만들어 리턴한다.
        /// v1과 v2가 동일한 좌표일 경우 false를 리턴한다.
        /// </summary>
        /// <param name="v1"></param>
        /// <param name="v2"></param>
        /// <param name="result"></param>
        /// <returns></returns>
        public bool Mirror(Vertex3F v1, Vertex3F v2, out Vertex3F result)
        {
            Vertex3D vResult;
            Vertex3D vSelf = new Vertex3D(this.x, this.y, this.z);

            bool success = vSelf.Mirror(new Vertex3D(v1.x, v1.y, v1.z), new Vertex3D(v2.x, v2.y, v2.z), out vResult);
            result = new Vertex3F((float)vResult.x, (float)vResult.y, (float)vResult.z);
            return success;
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
        public bool Mirror(Vertex3F v1, Vertex3F v2, Vertex3F v3, out Vertex3F result)
        {
            Vertex3D vResult;
            Vertex3D vSelf = new Vertex3D(this.x, this.y, this.z);

            bool success = vSelf.Mirror(new Vertex3D(v1.x, v1.y, v1.z), new Vertex3D(v2.x, v2.y, v2.z), new Vertex3D(v3.x, v3.y, v3.z), out vResult);
            result = new Vertex3F((float)vResult.x, (float)vResult.y, (float)vResult.z);
            return success;
        }
    }
}
