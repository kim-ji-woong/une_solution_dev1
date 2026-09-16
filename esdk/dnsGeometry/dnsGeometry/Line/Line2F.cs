namespace UnE.Geometry
{
    public class Line2F : Line
    {
        private Vertex2F m_vBegin;
        private Vertex2F m_vEnd;

        public Line2F()
        {
            m_vBegin = new Vertex2F();
            m_vEnd = new Vertex2F();
        }

        public Line2F(LineType lineType)
        {
            m_vBegin = new Vertex2F();
            m_vEnd = new Vertex2F();
            m_lineType = lineType;
        }

        public Line2F(Line2F line)
        {
            m_vBegin = new Vertex2F(line.m_vBegin);
            m_vEnd = new Vertex2F(line.m_vEnd);
            m_lineType = line.m_lineType;
        }

        public Line2F(Vertex2F vBegin, Vertex2F vEnd)
        {
            m_vBegin = new Vertex2F(vBegin);
            m_vEnd = new Vertex2F(vEnd);
        }

        public Line2F(Vertex2F vBegin, Vertex2F vEnd, LineType lineType)
        {
            m_vBegin = new Vertex2F(vBegin);
            m_vEnd = new Vertex2F(vEnd);
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

        public void SetVertex(Vertex2F vertex, bool isBegin)
        {
            if (isBegin)
                m_vBegin.CopyFrom(vertex);
            else
                m_vEnd.CopyFrom(vertex);
        }

        public Vertex2F GetVertex(bool isBegin)
        {
            return isBegin ? m_vBegin : m_vEnd;
        }

        /// <summary>
        /// vertex가 Line내에 포함되어 있는지 알려준다.
        /// </summary>
        /// <param name=""></param>
        /// <param name="vertex"></param>
        /// <returns></returns>
        public bool IsInclude(Vertex2F vertex)
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
        public double GetDistance(Vertex2F vertex, bool noLimit)
        {
            Vertex2F vBegin = this.GetVertex(true);
            Vertex2F vEnd = this.GetVertex(false);

            double a = vertex.GetDistance(vBegin);
            double b = vBegin.GetDistance(vEnd);
            double c = vertex.GetDistance(vEnd);

            if (a <= Math.COORD_TOLERANCE() || c <= Math.COORD_TOLERANCE())
                return 0.0;
            if (b <= Math.COORD_TOLERANCE())
                return a;

            double dCos = (a * a + b * b - c * c) / 2 / a / b;
            Vertex2F _vertex = Math.GetLinearVertex(vBegin, vEnd, (float)(dCos * a));
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
        public Line2F Offset(Vertex2F vertex, float len)
        {
            Vertex2F rBegin = this.GetVertex(true);
            Vertex2F rEnd = this.GetVertex(false);

            Vertex2F vTarget = Math.GetNearestVertex(vertex, rBegin, rEnd, true);
            float distance = vTarget.GetDistance(vertex);

            if (distance <= Math.HALF_TOLERANCE())
                return new Line2F(rBegin, rEnd, this.GetLineType());

            Vertex2F vBegin = rBegin + (vertex - vTarget) * len / distance;
            Vertex2F vEnd = rEnd + (vertex - vTarget) * len / distance;

            return new Line2F(vBegin, vEnd, this.GetLineType());
        }

        /// <summary>
        /// 현재 직선에서 오른쪽 방향으로(rightSide가 false이면 왼쪽 방향) dLen 만큼 떨어진 객체를 만들어 리턴한다.
        /// LineType은 현재 직선과 동일하다.
        /// 방향은 직선의 시작점과 끝점을 기준으로 판단한다.
        /// </summary>
        /// <param name="rightSide"></param>
        /// <param name="len"></param>
        /// <returns></returns>
        public Line2F Offset(bool rightSide, float len)
        {
            if (!rightSide)
                len = -len;

            Vertex2F vBegin = Math.GetRightVertex(m_vBegin, m_vEnd, len);
            Vertex2F vEnd = Math.GetRightVertex(m_vEnd, m_vBegin, -len);

            return new Line2F(vBegin, vEnd, m_lineType);
        }

        /// <summary>
        /// v1과 v2를 지나는 직선을 기준으로 현재의 직선과 대칭되는 객체를 만들어 리턴한다.
        /// LineType은 현재 직선과 동일하다.
        /// v1과 v2가 동일한 좌표일 경우 false를 리턴한다.
        /// </summary>
        /// <param name=""></param>
        /// <param name="v1"></param>
        /// <param name=""></param>
        /// <param name="v2"></param>
        /// <param name="CBR"></param>
        /// <param name=""></param>
        /// <param name=""></param>
        /// <returns></returns>
        public bool Mirror(Vertex2F v1, Vertex2F v2, out Line2F result)
        {
            result = null;

            if (v1.GetDistance(v2) <= Math.HALF_TOLERANCE())
                return false;

            Vertex2F _v1 = Math.GetNearestVertex(m_vBegin, v1, v2, true);
            Vertex2F _v2 = Math.GetNearestVertex(m_vEnd, v1, v2, true);

            Vertex2F vBegin = _v1 * 2 - m_vBegin;
            Vertex2F vEnd = _v2 * 2 - m_vEnd;

            result = new Line2F(vBegin, vEnd, m_lineType);
            return true;
        }

        /// <summary>
        /// 두 직선의 교차점을 구한다.
        /// </summary>
        /// <param name="rLine"></param>
        /// <param name="rVertex1">교차점이 하나만 존재할 경우 rVertex1에만 값이 담겨지며 1이 리턴된다.</param>
        /// <param name="rVertex2">교차점이 두 개 존재할 경우 rVertex1과 rVertex2에 각각 값이 담겨진다.</param>
        /// <param name="rResultType">교차점이 두 개인 경우는 직선에 해당하기 때문에 rResultType을 읽어 어떠한 형태의 직선인지 알아낼 수 있다.</param>
        /// <returns>
        /// rLine과 만나지 않으면 0을 리턴한다.
        /// 교차점이 하나만 존재할 경우 rVertex1에만 값이 담겨지며 1이 리턴된다.
        /// 교차점이 하나만 존재할 경우 rVertex1에만 값이 담겨지며 1이 리턴된다.
        /// </returns>
        public int IntersectLine(Line2F rLine, out Vertex2F rVertex1, out Vertex2F rVertex2, out LineType rResultType)
        {
            Line2D line1 = new Line2D(new Vertex2D(m_vBegin.x, m_vBegin.y), new Vertex2D(m_vEnd.x, m_vEnd.y));
            Line2D line2 = new Line2D(new Vertex2D(rLine.m_vBegin.x, rLine.m_vBegin.y), new Vertex2D(rLine.m_vEnd.x, rLine.m_vEnd.y));

            Vertex2D v1, v2;
            int nResult = line1.IntersectLine(line2, out v1, out v2, out rResultType);

            rVertex1 = new Vertex2F((float)v1.x, (float)v1.y);
            rVertex2 = new Vertex2F((float)v2.x, (float)v2.y);
            return nResult;
        }
    }
}
