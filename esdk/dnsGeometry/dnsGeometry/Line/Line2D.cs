namespace UnE.Geometry
{
    public class Line2D : Line
    {
        private Vertex2D m_vBegin;
        private Vertex2D m_vEnd;

        public Line2D()
        {
            m_vBegin = new Vertex2D();
            m_vEnd = new Vertex2D();
        }

        public Line2D(LineType lineType)
        {
            m_vBegin = new Vertex2D();
            m_vEnd = new Vertex2D();
            m_lineType = lineType;
        }

        public Line2D(Line2D line)
        {
            m_vBegin = new Vertex2D(line.m_vBegin);
            m_vEnd = new Vertex2D(line.m_vEnd);
            m_lineType = line.m_lineType;
        }

        public Line2D(Vertex2D vBegin, Vertex2D vEnd)
        {
            m_vBegin = new Vertex2D(vBegin);
            m_vEnd = new Vertex2D(vEnd);
        }

        public Line2D(Vertex2D vBegin, Vertex2D vEnd, LineType lineType)
        {
            m_vBegin = new Vertex2D(vBegin);
            m_vEnd = new Vertex2D(vEnd);
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

        public void SetVertex(Vertex2D vertex, bool isBegin)
        {
            if (isBegin)
                m_vBegin.CopyFrom(vertex);
            else
                m_vEnd.CopyFrom(vertex);
        }

        public Vertex2D GetVertex(bool isBegin)
        {
            return isBegin ? m_vBegin : m_vEnd;
        }

        /// <summary>
        /// vertex가 Line내에 포함되어 있는지 알려준다.
        /// </summary>
        /// <param name=""></param>
        /// <param name="vertex"></param>
        /// <returns></returns>
        public bool IsInclude(Vertex2D vertex)
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
        public double GetDistance(Vertex2D vertex, bool noLimit)
        {
            Vertex2D vBegin = this.GetVertex(true);
            Vertex2D vEnd = this.GetVertex(false);

            double a = vertex.GetDistance(vBegin);
            double b = vBegin.GetDistance(vEnd);
            double c = vertex.GetDistance(vEnd);

            if (a <= Math.COORD_TOLERANCE() || c <= Math.COORD_TOLERANCE())
                return 0.0;
            if (b <= Math.COORD_TOLERANCE())
                return a;

            double dCos = (a * a + b * b - c * c) / 2 / a / b;
            Vertex2D _vertex = Math.GetLinearVertex(vBegin, vEnd, dCos * a);
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
        public Line2D Offset(Vertex2D vertex, double len)
        {
            Vertex2D rBegin = this.GetVertex(true);
            Vertex2D rEnd = this.GetVertex(false);

            Vertex2D vTarget = Math.GetNearestVertex(vertex, rBegin, rEnd, true);
            double distance = vTarget.GetDistance(vertex);

            if (distance <= Math.HALF_TOLERANCE())
                return new Line2D(rBegin, rEnd, this.GetLineType());

            Vertex2D vBegin = rBegin + (vertex - vTarget) * len / distance;
            Vertex2D vEnd = rEnd + (vertex - vTarget) * len / distance;

            return new Line2D(vBegin, vEnd, this.GetLineType());
        }

        /// <summary>
        /// 현재 직선에서 오른쪽 방향으로(rightSide가 false이면 왼쪽 방향) dLen 만큼 떨어진 객체를 만들어 리턴한다.
        /// LineType은 현재 직선과 동일하다.
        /// 방향은 직선의 시작점과 끝점을 기준으로 판단한다.
        /// </summary>
        /// <param name="rightSide"></param>
        /// <param name="len"></param>
        /// <returns></returns>
        public Line2D Offset(bool rightSide, double len)
        {
            if (!rightSide)
                len = -len;

            Vertex2D vBegin = Math.GetRightVertex(m_vBegin, m_vEnd, len);
            Vertex2D vEnd = Math.GetRightVertex(m_vEnd, m_vBegin, -len);

            return new Line2D(vBegin, vEnd, m_lineType);
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
        public bool Mirror(Vertex2D v1, Vertex2D v2, out Line2D result)
        {
            result = null;

            if (v1.GetDistance(v2) <= Math.HALF_TOLERANCE())
                return false;

            Vertex2D _v1 = Math.GetNearestVertex(m_vBegin, v1, v2, true);
            Vertex2D _v2 = Math.GetNearestVertex(m_vEnd, v1, v2, true);

            Vertex2D vBegin = _v1 * 2 - m_vBegin;
            Vertex2D vEnd = _v2 * 2 - m_vEnd;

            result = new Line2D(vBegin, vEnd, m_lineType);
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
        public int IntersectLine(Line2D rLine, out Vertex2D rVertex1, out Vertex2D rVertex2, out LineType rResultType)
        {
            rVertex1 = new Vertex2D();
            rVertex2 = new Vertex2D();
            rResultType = LineType.NO_LINE;

            Vertex2D vBegin1 = GetVertex(true);
            Vertex2D vEnd1 = GetVertex(false);
            Vertex2D vBegin2 = rLine.GetVertex(true);
            Vertex2D vEnd2 = rLine.GetVertex(false);

            double dLen1 = vBegin1.GetDistance(vEnd1);
            double dLen2 = vBegin2.GetDistance(vEnd2);

            // this Line이 한 점일 경우
            if (dLen1 < Math.HALF_TOLERANCE())
            {
                if (dLen2 < Math.HALF_TOLERANCE())
                {
                    if (vBegin1.GetDistance(vBegin2) < Math.HALF_TOLERANCE())
                    {
                        rVertex1.SetVertex(vBegin1.x, vBegin1.y);
                        return 1;
                    }
                }
                else
                {
                    double dLen3 = vBegin1.GetDistance(vBegin2);
                    double dLen4 = vBegin1.GetDistance(vEnd2);

                    if (dLen3 < Math.HALF_TOLERANCE() ||
                        dLen4 < Math.HALF_TOLERANCE())
                    {
                        rVertex1.SetVertex(vBegin1.x, vBegin1.y);
                        return 1;
                    }

                    double dAngle = Math.GetAngle(vBegin2, vBegin1, vEnd2);

                    if (rLine.m_lineType == LineType.LINE)
                    {
                        if (dAngle < Math.HALF_TOLERANCE() ||
                            Math.PI() - dAngle < Math.HALF_TOLERANCE())
                        {
                            rVertex1.SetVertex(vBegin1.x, vBegin1.y);
                            return 1;
                        }
                    }
                    else if (rLine.m_lineType == LineType.HALF_LINE_BEGIN_2_END)
                    {
                        if (Math.PI() - dAngle < Math.HALF_TOLERANCE())
                        {
                            rVertex1.SetVertex(vBegin1.x, vBegin1.y);
                            return 1;
                        }
                        else if (dAngle < Math.HALF_TOLERANCE())
                        {
                            if (dLen4 < dLen3)
                            {
                                rVertex1.SetVertex(vBegin1.x, vBegin1.y);
                                return 1;
                            }
                        }
                    }
                    else if (rLine.m_lineType == LineType.HALF_LINE_END_2_BEGIN)
                    {
                        if (Math.PI() - dAngle < Math.HALF_TOLERANCE())
                        {
                            rVertex1.SetVertex(vBegin1.x, vBegin1.y);
                            return 1;
                        }
                        else if (dAngle < Math.HALF_TOLERANCE())
                        {
                            if (dLen3 < dLen4)
                            {
                                rVertex1.SetVertex(vBegin1.x, vBegin1.y);
                                return 1;
                            }
                        }
                    }
                    else if (rLine.m_lineType == LineType.SEGMENT)
                    {
                        if (Math.PI() - dAngle < Math.HALF_TOLERANCE())
                        {
                            rVertex1.SetVertex(vBegin1.x, vBegin1.y);
                            return 1;
                        }
                    }
                }

                return 0;
            }
            // rLine이 한 점일 경우
            else if (dLen2 < Math.HALF_TOLERANCE())
            {
                double dLen3 = vBegin2.GetDistance(vBegin1);
                double dLen4 = vBegin2.GetDistance(vEnd1);

                if (dLen3 < Math.HALF_TOLERANCE() ||
                    dLen4 < Math.HALF_TOLERANCE())
                {
                    rVertex1.SetVertex(vBegin2.x, vBegin2.y);
                    return 1;
                }

                double dAngle = Math.GetAngle(vBegin1, vBegin2, vEnd1);

                if (m_lineType == LineType.LINE)
                {
                    if (dAngle < Math.HALF_TOLERANCE() ||
                        Math.PI() - dAngle < Math.HALF_TOLERANCE())
                    {
                        rVertex1.SetVertex(vBegin2.x, vBegin2.y);
                        return 1;
                    }
                }
                else if (m_lineType == LineType.HALF_LINE_BEGIN_2_END)
                {
                    if (Math.PI() - dAngle < Math.HALF_TOLERANCE())
                    {
                        rVertex1.SetVertex(vBegin2.x, vBegin2.y);
                        return 1;
                    }
                    else if (dAngle < Math.HALF_TOLERANCE())
                    {
                        if (dLen4 < dLen3)
                        {
                            rVertex1.SetVertex(vBegin2.x, vBegin2.y);
                            return 1;
                        }
                    }
                }
                else if (m_lineType == LineType.HALF_LINE_END_2_BEGIN)
                {
                    if (Math.PI() - dAngle < Math.HALF_TOLERANCE())
                    {
                        rVertex1.SetVertex(vBegin2.x, vBegin2.y);
                        return 1;
                    }
                    else if (dAngle < Math.HALF_TOLERANCE())
                    {
                        if (dLen3 < dLen4)
                        {
                            rVertex1.SetVertex(vBegin2.x, vBegin2.y);
                            return 1;
                        }
                    }
                }
                else if (m_lineType == LineType.SEGMENT)
                {
                    if (Math.PI() - dAngle < Math.HALF_TOLERANCE())
                    {
                        rVertex1.SetVertex(vBegin2.x, vBegin2.y);
                        return 1;
                    }
                }

                return 0;
            }

            return _IntersectLine(rLine, ref rVertex1, ref rVertex2, ref rResultType);
        }

        private int _IntersectLine(Line2D rLine, ref Vertex2D rVertex1, ref Vertex2D rVertex2, ref LineType rResultType)
        {
            // this Line을 잇는 직선 y = (a1)x + b1
            // rLine을 잇는 직선 y = (a2)x + b2
            // x = constant 형태의 직선일 경우
            // 첫번째 직선의 x값 : c1
            // 두번째 직선의 x값 : c2
            double[] a = new double[2] { 0, 0 };
            double[] b = new double[2] { 0, 0 };
            double[] c = new double[2] { 0, 0 };

            int i, nIndex1, nIndex2;
            bool[] bXEq = new bool[2]{ false, false };    // x = const 형태의 방정식인가?
            double x, y;
            Vertex2D[] vArr = new Vertex2D[4] { this.m_vBegin, this.m_vEnd, rLine.m_vBegin, rLine.m_vEnd };

            for (i = 0; i < 2; i++)
            {
                nIndex1 = i * 2;
                nIndex2 = nIndex1 + 1;

                if (System.Math.Abs(vArr[nIndex1].x - vArr[nIndex2].x) <= Math.HALF_TOLERANCE())
                {
                    a[i] = b[i] = 0.0;
                    c[i] = vArr[nIndex1].x;
                    bXEq[i] = true;
                }
                else if (System.Math.Abs(vArr[nIndex1].y - vArr[nIndex2].y) <= Math.HALF_TOLERANCE())
                {
                    a[i] = 0.0;
                    b[i] = vArr[nIndex1].y;
                }
                else
                {
                    a[i] = (vArr[nIndex2].y - vArr[nIndex1].y) / (vArr[nIndex2].x - vArr[nIndex1].x);
                    b[i] = vArr[nIndex2].y - (vArr[nIndex2].y - vArr[nIndex1].y) * vArr[nIndex2].x / (vArr[nIndex2].x - vArr[nIndex1].x);
                }
            }

            if (bXEq[0] && bXEq[1])
            {
                if (System.Math.Abs(c[0] - c[1]) > Math.HALF_TOLERANCE())
                    return 0;

                LineType type1 = this.GetLineType();
                LineType type2 = rLine.GetLineType();

                if (type1 == LineType.LINE)
                {
                    if (type2 == LineType.LINE)
                    {
                        rVertex1.CopyFrom(this.m_vBegin);
                        rVertex2.CopyFrom(this.m_vEnd);
                        rResultType = LineType.LINE;
                        return 2;
                    }
                    else// if (type2 == LineType.HALF_LINE_BEGIN_2_END || type2 == LineType.HALF_LINE_END_2_BEGIN || type2 == LineType.SEGMENT)
                    {
                        rVertex1.CopyFrom(rLine.m_vBegin);
                        rVertex2.CopyFrom(rLine.m_vEnd);
                        rResultType = type2;
                        return 2;
                    }
                }
                else if (type1 == LineType.HALF_LINE_BEGIN_2_END || type1 == LineType.HALF_LINE_END_2_BEGIN)
                {
                    if (type2 == LineType.LINE)
                    {
                        rVertex1.CopyFrom(this.m_vBegin);
                        rVertex2.CopyFrom(this.m_vEnd);
                        rResultType = type1;
                        return 2;
                    }
                    else if (type2 == LineType.HALF_LINE_BEGIN_2_END || type2 == LineType.HALF_LINE_END_2_BEGIN)
                    {
                        return HalfLineToHalfLine(rLine, ref rVertex1, ref rVertex2, ref rResultType);
                    }
                    else// if (type2 == LineType.SEGMENT)
                    {
                        return HalfLineToSegment(this, rLine, ref rVertex1, ref rVertex2, ref rResultType);
                    }
                }

                double dBig1 = this.m_vBegin.y, dSmall1 = this.m_vEnd.y;
                double dBig2 = rLine.m_vBegin.y, dSmall2 = rLine.m_vEnd.y;

                if (dBig1 < this.m_vEnd.y)
                {
                    dBig1 = this.m_vEnd.y;
                    dSmall1 = this.m_vBegin.y;
                }
                if (dBig2 < rLine.m_vEnd.y)
                {
                    dBig2 = rLine.m_vEnd.y;
                    dSmall2 = rLine.m_vBegin.y;
                }

                if ((dBig1 < dSmall2 && System.Math.Abs(dBig1 - dSmall2) > Math.HALF_TOLERANCE()) || (dBig2 < dSmall1 && System.Math.Abs(dBig2 - dSmall1) > Math.HALF_TOLERANCE()))
                    return 0;
                else if (System.Math.Abs(dBig1 - dSmall2) <= Math.HALF_TOLERANCE())
                {
                    rVertex1.x = c[0];
                    rVertex1.y = dBig1;
                    return 1;
                }
                else if (System.Math.Abs(dBig2 - dSmall1) <= Math.HALF_TOLERANCE())
                {
                    rVertex1.x = c[0];
                    rVertex1.y = dBig2;
                    return 1;
                }
                else if (dBig1 > dSmall2)
                {
                    if (dBig1 <= dBig2)
                        rVertex1.y = dBig1;
                    else
                        rVertex1.y = dBig2;

                    if (dSmall1 < dSmall2)
                        rVertex2.y = dSmall2;
                    else
                        rVertex2.y = dSmall1;

                    rVertex1.x = rVertex2.x = c[0];
                    return -1;
                }
                else //if (dBig2 > dSmall1)
                {
                    if (dBig2 <= dBig1)
                        rVertex1.y = dBig2;
                    else
                        rVertex1.y = dBig1;
                    if (dSmall2 < dSmall1)
                        rVertex2.y = dSmall1;
                    else
                        rVertex2.y = dSmall2;

                    rVertex1.x = rVertex2.x = c[0];
                    return -1;
                }
            }
            else if (bXEq[0])
            {
                x = c[0];
                y = a[1] * x + b[1];
            }
            else if (bXEq[1])
            {
                x = c[1];
                y = a[0] * x + b[0];
            }
            else
            {
                if (System.Math.Abs(a[0] - a[1]) <= Math.HALF_TOLERANCE())
                {
                    if (System.Math.Abs(b[0] - b[1]) > Math.HALF_TOLERANCE())
                        return 0;

                    LineType type1 = this.GetLineType();
                    LineType type2 = rLine.GetLineType();

                    if (type1 == LineType.LINE)
                    {
                        if (type2 == LineType.LINE)
                        {
                            rVertex1.CopyFrom(this.m_vBegin);
                            rVertex2.CopyFrom(this.m_vEnd);
                            rResultType = LineType.LINE;
                            return 2;
                        }
                        else// if (type2 == LineType.HALF_LINE_BEGIN_2_END || type2 == LineType.HALF_LINE_END_2_BEGIN || type2 == LineType.SEGMENT)
                        {
                            rVertex1.CopyFrom(rLine.m_vBegin);
                            rVertex2.CopyFrom(rLine.m_vEnd);
                            rResultType = type2;
                            return 2;
                        }
                    }
                    else if (type1 == LineType.HALF_LINE_BEGIN_2_END || type1 == LineType.HALF_LINE_END_2_BEGIN)
                    {
                        if (type2 == LineType.LINE)
                        {
                            rVertex1.CopyFrom(this.m_vBegin);
                            rVertex2.CopyFrom(this.m_vEnd);
                            rResultType = type1;
                            return 2;
                        }
                        else if (type2 == LineType.HALF_LINE_BEGIN_2_END || type2 == LineType.HALF_LINE_END_2_BEGIN)
                        {
                            return HalfLineToHalfLine(rLine, ref rVertex1, ref rVertex2, ref rResultType);
                        }
                        else// if (type2 == LineType.SEGMENT)
                        {
                            return HalfLineToSegment(this, rLine, ref rVertex1, ref rVertex2, ref rResultType);
                        }
                    }

                    double dBig1 = this.m_vBegin.x, dSmall1 = this.m_vEnd.x;
                    double dBig2 = rLine.m_vBegin.x, dSmall2 = rLine.m_vEnd.x;

                    if (dBig1 < this.m_vEnd.x)
                    {
                        dBig1 = this.m_vEnd.x;
                        dSmall1 = this.m_vBegin.x;
                    }
                    if (dBig2 < rLine.m_vEnd.x)
                    {
                        dBig2 = rLine.m_vEnd.x;
                        dSmall2 = rLine.m_vBegin.x;
                    }

                    if ((dBig1 < dSmall2 && System.Math.Abs(dBig1 - dSmall2) > Math.HALF_TOLERANCE()) || (dBig2 < dSmall1 && System.Math.Abs(dBig2 - dSmall1) > Math.HALF_TOLERANCE()))
                        return 0;
                    else if (System.Math.Abs(dBig1 - dSmall2) <= Math.HALF_TOLERANCE())
                    {
                        rVertex1.x = dBig1;
                        rVertex1.y = a[0] * dBig1 + b[0];
                        return 1;
                    }
                    else if (System.Math.Abs(dBig2 - dSmall1) <= Math.HALF_TOLERANCE())
                    {
                        rVertex1.x = dBig2;
                        rVertex1.y = a[0] * dBig2 + b[0];
                        return 1;
                    }
                    else if (dBig1 > dSmall2)
                    {
                        if (dBig1 <= dBig2) rVertex1.x = dBig1;
                        else rVertex1.x = dBig2;
                        if (dSmall1 < dSmall2) rVertex2.x = dSmall2;
                        else rVertex2.x = dSmall1;

                        rVertex1.y = a[0] * rVertex1.x + b[0];
                        rVertex2.y = a[0] * rVertex2.x + b[0];
                        return -1;
                    }
                    else //if (dBig2 > dSmall1)
                    {
                        if (dBig2 <= dBig1) rVertex1.x = dBig2;
                        else rVertex1.x = dBig1;
                        if (dSmall2 < dSmall1) rVertex2.x = dSmall1;
                        else rVertex2.x = dSmall2;

                        rVertex1.y = a[0] * rVertex1.x + b[0];
                        rVertex2.y = a[0] * rVertex2.x + b[0];
                        return -1;
                    }
                }
                else
                {
                    x = (b[1] - b[0]) / (a[0] - a[1]);
                    y = a[0] * x + b[0];
                }
            }

            rVertex1.x = x;
            rVertex1.y = y;

            if (this.IsInclude(rVertex1) && rLine.IsInclude(rVertex1))
                return 1;

            return 0;
        }

        private static int HalfLineToSegment(Line2D rHalfLine, Line2D rSegment, ref Vertex2D rVertex1, ref Vertex2D rVertex2, ref LineType rResultType)
        {
            LineType type1 = rHalfLine.GetLineType();

            Vertex2D vLine1Fixed = type1 == LineType.HALF_LINE_BEGIN_2_END ? rHalfLine.GetVertex(true) : rHalfLine.GetVertex(false);
            Vertex2D vLine1Opened = type1 == LineType.HALF_LINE_BEGIN_2_END ? rHalfLine.GetVertex(false) : rHalfLine.GetVertex(true);

            bool include1 = rHalfLine.IsInclude(rSegment.GetVertex(true));
            bool include2 = rHalfLine.IsInclude(rSegment.GetVertex(false));

            if (include1 && include2)
            {
                // rSegment가 rHalfLine에 완전히 포함되는 경우
                rVertex1.CopyFrom(rSegment.GetVertex(true));
                rVertex2.CopyFrom(rSegment.GetVertex(false));
                rResultType = LineType.SEGMENT;
            }
            else if (include1)
            {
                if (vLine1Fixed.GetDistance(rSegment.GetVertex(true)) <= Math.HALF_TOLERANCE())
                {
                    // 두 직선이 한 점에서 만나는 경우
                    rVertex1.CopyFrom(vLine1Fixed);
                    rResultType = LineType.NO_LINE;
                    return 1;
                }
                else
                {
                    // 두 직선의 겹침 구간이 하나의 선분을 이루는 경우
                    rVertex1.CopyFrom(vLine1Fixed);
                    rVertex2.CopyFrom(rSegment.GetVertex(true));
                    rResultType = LineType.SEGMENT;
                }
            }
            else if (include2)
            {
                if (vLine1Fixed.GetDistance(rSegment.GetVertex(false)) <= Math.HALF_TOLERANCE())
                {
                    // 두 직선이 한 점에서 만나는 경우
                    rVertex1.CopyFrom(vLine1Fixed);
                    rResultType = LineType.NO_LINE;
                    return 1;
                }
                else
                {
                    // 두 직선의 겹침 구간이 하나의 선분을 이루는 경우
                    rVertex1.CopyFrom(vLine1Fixed);
                    rVertex2.CopyFrom(rSegment.GetVertex(false));
                    rResultType = LineType.SEGMENT;
                }
            }
            else
                return 0;

            return 2;
        }

        private int HalfLineToHalfLine(Line2D rLine, ref Vertex2D rVertex1, ref Vertex2D rVertex2, ref LineType rResultType)
        {
            LineType type1 = this.GetLineType();
            LineType type2 = rLine.GetLineType();

            Vertex2D vLine1Fixed = type1 == LineType.HALF_LINE_BEGIN_2_END ? this.GetVertex(true) : this.GetVertex(false);
            Vertex2D vLine1Opened = type1 == LineType.HALF_LINE_BEGIN_2_END ? this.GetVertex(false) : this.GetVertex(true);
            Vertex2D vLine2Fixed = type2 == LineType.HALF_LINE_BEGIN_2_END ? rLine.GetVertex(true) : rLine.GetVertex(false);
            Vertex2D vLine2Opened = type2 == LineType.HALF_LINE_BEGIN_2_END ? rLine.GetVertex(false) : rLine.GetVertex(true);

            bool include1 = rLine.IsInclude(vLine1Fixed);
            bool include2 = this.IsInclude(vLine2Fixed);

            if (include1 && include2)
            {
                Vertex2D vertex = Math.GetLinearVertex(vLine1Fixed, vLine1Opened, -100.0);

                if (rLine.IsInclude(vertex))
                {
                    // 두 Line이 동일한 경우
                    rVertex1.CopyFrom(vLine1Fixed);
                    rVertex2.CopyFrom(vLine1Opened);
                    rResultType = type1;
                }
                else
                {
                    // 두 Line이 반대 방향이며, 겹치는 부분이 하나의 선분을 이루는 경우
                    rVertex1.CopyFrom(vLine1Fixed);
                    rVertex2.CopyFrom(vLine2Fixed);
                    rResultType = LineType.SEGMENT;
                }
            }
            else if (include1)
            {
                // rLine1이 rLine2에 포함되는 경우
                rVertex1.CopyFrom(vLine1Fixed);
                rVertex2.CopyFrom(vLine1Opened);
                rResultType = type1;
            }
            else if (include2)
            {
                // rLine2가 rLine1에 포함되는 경우
                rVertex1.CopyFrom(vLine2Fixed);
                rVertex2.CopyFrom(vLine2Opened);
                rResultType = type2;
            }
            else
                return 0;

            return 2;
        }
    }
}
