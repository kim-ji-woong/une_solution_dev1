namespace UnE.Geometry
{
    public class Line3D : Line
    {
        private Vertex3D m_vBegin;
        private Vertex3D m_vEnd;

        public Line3D()
        {
            m_vBegin = new Vertex3D();
            m_vEnd = new Vertex3D();
        }

        public Line3D(LineType lineType)
        {
            m_vBegin = new Vertex3D();
            m_vEnd = new Vertex3D();
            m_lineType = lineType;
        }

        public Line3D(Line3D line)
        {
            m_vBegin = new Vertex3D(line.m_vBegin);
            m_vEnd = new Vertex3D(line.m_vEnd);
            m_lineType = line.m_lineType;
        }

        public Line3D(Vertex3D vBegin, Vertex3D vEnd)
        {
            m_vBegin = new Vertex3D(vBegin);
            m_vEnd = new Vertex3D(vEnd);
        }

        public Line3D(Vertex3D vBegin, Vertex3D vEnd, LineType lineType)
        {
            m_vBegin = new Vertex3D(vBegin);
            m_vEnd = new Vertex3D(vEnd);
            m_lineType = lineType;
        }

        public LineType GetLineType()
        {
            return m_lineType;
        }

        public void SetLineType(LineType lineType)
        {
            m_lineType = lineType;
        }

        public void SetVertex(Vertex3D vertex, bool isBegin)
        {
            if (isBegin)
                m_vBegin.CopyFrom(vertex);
            else
                m_vEnd.CopyFrom(vertex);
        }

        public Vertex3D GetVertex(bool isBegin)
        {
            return isBegin ? m_vBegin : m_vEnd;
        }

        /// <summary>
        /// vertex가 Line내에 포함되어 있는지 알려준다.
        /// </summary>
        /// <param name=""></param>
        /// <param name="vertex"></param>
        /// <returns></returns>
        public bool IsInclude(Vertex3D vertex)
        {
            double len = this.GetDistance(vertex, false);

            if (len <= Math.HALF_TOLERANCE())
                return true;

            return false;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="vertex"></param>
        /// <param name="noLimit">true이면 실제 LineType에 상관없이 무한히 뻗은 직선이라 가정하고 계산한다.</param>
        /// <returns></returns>
        // noLimit이 true이면 실제 LineType에 상관없이 무한히 뻗은 직선이라 가정하고 계산한다.
        // noLimit이 false이면 실제 LineType을 고려하여 가장 가까운 거리를 구한다.
        public double GetDistance(Vertex3D vertex, bool noLimit)
        {
            Vertex3D vBegin = this.GetVertex(true);
            Vertex3D vEnd = this.GetVertex(false);

            double a = vertex.GetDistance(vBegin);
            double b = vBegin.GetDistance(vEnd);
            double c = vertex.GetDistance(vEnd);

            if (a <= Math.COORD_TOLERANCE() || c <= Math.COORD_TOLERANCE())
                return 0.0;
            if (b <= Math.COORD_TOLERANCE())
                return a;

            double dCos = (a * a + b * b - c * c) / 2 / a / b;
            Vertex3D _vertex = Math.GetLinearVertex(vBegin, vEnd, dCos * a);
            double dLen = _vertex.GetDistance(vertex);

            LineType type = this.GetLineType();

            if (noLimit || type == LineType.LINE)
                return dLen;

            double dAngle1 = Math.GetAngle(vertex, vBegin, vEnd);
            double dAngle2 = Math.GetAngle(vertex, vEnd, vBegin);

            if (dAngle1 <= Math.HALF_PI() && dAngle2 <= Math.HALF_PI())
                return dLen;

            if (type == LineType.HALF_LINE_BEGIN_2_END)
            {
                if (dAngle1 < Math.HALF_PI())
                    return dLen;
            }
            else if (type == LineType.HALF_LINE_END_2_BEGIN)
            {
                if (dAngle2 < Math.HALF_PI())
                    return dLen;
            }

            return a > c ? c : a;
        }

        /// <summary>
        /// 현재 직선에서 rVertex 방향으로 dLen 만큼 떨어진 객체를 만들어 리턴한다.
        /// LineType은 현재 직선과 동일하다.
        /// </summary>
        /// <param name="vertex"></param>
        /// <param name="len"></param>
        /// <returns></returns>
        public Line3D Offset(Vertex3D vertex, double len)
        {
            Vertex3D rBegin = this.GetVertex(true);
            Vertex3D rEnd = this.GetVertex(false);

            Vertex3D vTarget = Math.GetNearestVertex(vertex, rBegin, rEnd, true);
            double distance = vTarget.GetDistance(vertex);

            if (distance <= Math.HALF_TOLERANCE())
                return new Line3D(rBegin, rEnd, this.GetLineType());

            Vertex3D vBegin = rBegin + (vertex - vTarget) * len / distance;
            Vertex3D vEnd = rEnd + (vertex - vTarget) * len / distance;

            return new Line3D(vBegin, vEnd, this.GetLineType());
        }

        /// <summary>
        /// v1, v2, v3를 지나는 평면을 기준으로 현재의 직선과 대칭되는 객체를 만들어 리턴한다.
        /// LineType은 현재 직선과 동일하다.
        /// v1, v2, v3가 평면을 구성하지 못할 경우 false를 리턴한다.
        /// </summary>
        /// <param name=""></param>
        /// <param name="v1"></param>
        /// <param name=""></param>
        /// <param name="v2"></param>
        /// <param name=""></param>
        /// <param name="v3"></param>
        /// <param name="CBR"></param>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns></returns>
        public bool Mirror(Vertex3D v1, Vertex3D v2, Vertex3D v3, out Line3D result)
        {
            result = null;

            double a, b, c, d;  // ax + by + cz + d = 0
            if (!Math.MakePlane(v1, v2, v3, out a, out b, out c, out d))
                return false;

            Vertex3D _vBegin = Math.GetNearestVertex(m_vBegin, a, b, c, d);
            Vertex3D _vEnd = Math.GetNearestVertex(m_vEnd, a, b, c, d);

            Vertex3D vBegin = _vBegin * 2 - m_vBegin;
            Vertex3D vEnd = _vEnd * 2 - m_vEnd;

            result = new Line3D(vBegin, vEnd, m_lineType);
            return true;
        }
    }
}
