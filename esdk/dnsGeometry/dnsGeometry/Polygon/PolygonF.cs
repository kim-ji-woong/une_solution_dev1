using System.Collections.Generic;

namespace UnE.Geometry
{
    public class PolygonF
    {
        protected List<Vertex2F> m_arrVertices = new List<Vertex2F>();

        public PolygonF()
        {

        }

        public int GetVertexCount()
        {
            return m_arrVertices.Count;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="nIndex"></param>
        /// <returns>nIndex가 배열의 범위를 벗어나면 NULL을 리턴한다.</returns>
        public Vertex2F GetVertex(int nIndex)
        {
            if (nIndex >= GetVertexCount())
                return null;

            return m_arrVertices[nIndex];
        }

        public void AddVertex(Vertex2F vertex)
        {
            m_arrVertices.Add(vertex);
        }

        public bool Insert(int nIndex, Vertex2F vertex)
        {
            if (nIndex >= GetVertexCount())
                return false;

            m_arrVertices.Insert(nIndex, vertex);
            return true;
        }

        public bool UpdateVertex(int nIndex, Vertex2F vertex)
        {
            if (nIndex >= GetVertexCount())
                return false;

            Vertex2F rVertex = m_arrVertices[nIndex];

            rVertex.x = vertex.x;
            rVertex.y = vertex.y;

            return true;
        }

        public bool RemoveVertex(int nIndex)
        {
            if (nIndex >= GetVertexCount())
                return false;

            m_arrVertices.RemoveAt(nIndex);
            return true;
        }

        public void Clear()
        {
            m_arrVertices.Clear();
        }

        /// <summary>
        /// vertex가 폴리곤 내부에 있는지 검색
        /// 폴리곤의 시작점과 끝점이 다를 경우, 시작점과 끝점이 연결된 폐곡선으로 간주한다.
        /// 물론 폴리곤의 시작점과 끝점이 같아도 상관없다.
        /// </summary>
        /// <param name=""></param>
        /// <param name="vertex"></param>
        /// <returns>
        /// 1이면 vertex가 폴리곤의 내부에 위치한다.
        /// 0이면 vertex가 폴리곤의 외부에 위치한다.
        /// -1이면 vertex가 폴리곤의 경계에 위치한다.
        /// </returns>
        public int HitTest(Vertex2F vertex)
        {
            int nVertexCount = GetVertexCount();
            if (nVertexCount < 3)
                return 0;

            // 시작점과 끝점이 같은지 검사한다.
            Vertex2F vFirst = m_arrVertices[0];
            Vertex2F vLast = m_arrVertices[nVertexCount - 1];
            bool isFirstLastSame = vFirst.GetDistance(vLast) <= Math.HALF_TOLERANCE();

            if (isFirstLastSame)
                nVertexCount--;

            Vertex2F rBeginVertex = m_arrVertices[0];
            Vertex2F rEndVertex = m_arrVertices[nVertexCount - 1];

            double x;
            int nCount = 0;
            Vertex2F pPrev = rEndVertex;

            for (int i = 0; i < nVertexCount; i++)
            {
                Vertex2F rVertex = m_arrVertices[i];
                Line2F line = new Line2F(pPrev, rVertex);

                if (line.IsInclude(vertex))
                    return -1;
                else
                {
                    double diff = pPrev.y - rVertex.y;
                    if (diff < 0)
                        diff = -diff;

                    // X축과 평행한 선분은 계산하지 않는다.
                    if (diff > Math.HALF_TOLERANCE())
                    {
                        if (GetXFromLine(line, vertex.y, out x))
                        {
                            diff = x - vertex.x;
                            if (diff < 0.0)
                                diff = -diff;

                            if (diff <= Math.GetTolerance(x))
                                return -1;
                            else if (x > vertex.x)
                            {
                                CheckPointCount(pPrev, rVertex, vertex.y, ref nCount);
                            }
                        }
                    }
                }

                pPrev = rVertex;
            }

            if (nCount % 2 == 0)
                return 0;

            return 1;
        }

        // rLine에서 특정 좌표가 y값을 가지는 경우 x값을 알려준다.
        // y값을 가질수 없거나 해가 무수히 많은 경우 false를 리턴한다.
        private bool GetXFromLine(Line2F rLine, double y, out double x)
        {
            Vertex2F rBegin = rLine.GetVertex(true);
            Vertex2F rEnd = rLine.GetVertex(false);

            if (rBegin.y == rEnd.y)
            {
                if (y == rBegin.y)
                {
                    x = (rBegin.x + rEnd.x) / 2;
                    return true;
                }
                else
                {
                    x = 0.0;
                    return false;
                }
            }

            x = (rEnd.x - rBegin.x) / (rEnd.y - rBegin.y) * (y - rBegin.y) + rBegin.x;

            Line2F.LineType noLimitLineType = Line2F.LineType.LINE;

            if (rLine.GetLineType() == noLimitLineType)
                return true;

            if (rBegin.x < rEnd.x)
            {
                if (x < rBegin.x - Math.HALF_TOLERANCE() || x > rEnd.x + Math.HALF_TOLERANCE())
                    return false;
            }
            else
            {
                if (x < rEnd.x - Math.HALF_TOLERANCE() || x > rBegin.x + Math.HALF_TOLERANCE())
                    return false;
            }

            if (rBegin.y < rEnd.y)
            {
                if (y < rBegin.y - Math.HALF_TOLERANCE() || y > rEnd.y + Math.HALF_TOLERANCE())
                    return false;
            }
            else
            {
                if (y < rEnd.y - Math.HALF_TOLERANCE() || y > rBegin.y + Math.HALF_TOLERANCE())
                    return false;
            }

            return true;
        }

        private void CheckPointCount(Vertex2F rLineBegin, Vertex2F rLineEnd, double y, ref int rCount)
        {
            double dMaxY, dMinY;

            if (rLineBegin.y < rLineEnd.y)
            {
                dMinY = rLineBegin.y;
                dMaxY = rLineEnd.y;
            }
            else
            {
                dMinY = rLineEnd.y;
                dMaxY = rLineBegin.y;
            }

            // y가 rLineBegin과 rLineEnd 사이에 있거나, y가 둘 중 최소점과 일치하는 경우 rCount를 증가시킨다.
            // y가 둘 중 최대점과 일치하는 경우 rCount를 증가시키지 않는다.
            if (y < dMaxY - Math.HALF_TOLERANCE() && y >= dMinY - Math.HALF_TOLERANCE())
            {
                rCount++;
            }
        }

        /// <summary>
        /// 폴리곤의 무게중심을 구한다.
        /// </summary>
        /// <returns></returns>
        public Vertex2F CalcWeightCenter()
        {
            Vertex2F vCenter = new Vertex2F();
            int nVertexCount = GetVertexCount();
            if (nVertexCount < 3)
                return vCenter;

            float fArea = 0.0f;

            // For all vertices
            int i = 0;
            for (i = 0; i < nVertexCount; ++i)
            {
                int nIndex2 = (i + 1) % nVertexCount;

                Vertex2F v1 = m_arrVertices[i];
                Vertex2F v2 = m_arrVertices[nIndex2];

                float a = v1.x * v2.y - v2.x * v1.y;
                fArea += a;
                vCenter.x += (v1.x + v2.x) * a;
                vCenter.y += (v1.y + v2.y) * a;
            }

            fArea *= 0.5f;
            vCenter.x /= (6.0f * fArea);
            vCenter.y /= (6.0f * fArea);

            return vCenter;
        }

        public double GetArea()
        {
            double dArea = 0.0;
            int nVertexCount = GetVertexCount();

            for (int i = 0; i < nVertexCount; i++)
            {
                int nSecondIndex = (i + 1) % nVertexCount;

                Vertex2F v1 = m_arrVertices[i];
                Vertex2F v2 = m_arrVertices[nSecondIndex];

                dArea += v1.x * v2.y - v2.x * v1.y;
            }

            if (dArea < 0.0)
                return -dArea / 2;
            return dArea / 2;
        }

        /// <summary>
        /// 폴리곤을 둘러싼 외곽 사각형 영역의 (minX, minY) 좌표
        /// </summary>
		public Vertex2F GetMin()
        {
            Vertex2F vCenter = new Vertex2F();

            int nVertexCount = GetVertexCount();
            if (nVertexCount < 3)
                return vCenter;

            float max_x = float.MaxValue;
            float max_y = float.MaxValue;
            for (int i = 0; i < nVertexCount; i++)
            {
                Vertex2F rVertex = m_arrVertices[i];

                if (max_x > rVertex.x)
                {
                    max_x = rVertex.x;
                }

                if (max_y > rVertex.y)
                {
                    max_y = rVertex.y;
                }
            }

            vCenter.x = max_x;
            vCenter.y = max_y;

            return vCenter;
        }

        /// <summary>
        /// 폴리곤을 둘러싼 외곽 사각형 영역의 (maxX, maxY) 좌표
        /// </summary>
        public Vertex2F GetMax()
        {
            Vertex2F vCenter = new Vertex2F();

            int nVertexCount = GetVertexCount();
            if (nVertexCount < 3)
                return vCenter;

            float min_x = -float.MinValue;
            float min_y = -float.MinValue;
            for (int i = 0; i < nVertexCount; i++)
            {
                Vertex2F rVertex = m_arrVertices[i];

                if (min_x < rVertex.x)
                {
                    min_x = rVertex.x;
                }

                if (min_y < rVertex.y)
                {
                    min_y = rVertex.y;
                }
            }

            vCenter.x = min_x;
            vCenter.y = min_y;

            return vCenter;
        }

        /// <summary>
        /// vertex와 Polygon의 가장 가까운 외곽선과의 거리를 구한다.
        /// </summary>
        /// <param name="vertex"></param>
        /// <returns>vertex가 Polygon의 내부에 존재할 경우 음수값을 리턴한다.</returns>
        public double GetDistance(Vertex2F vertex)
        {
            Vertex2F vResult;
            return GetDistanceNVertex(vertex, out vResult);
        }

        /// <summary>
        /// vertex와 Polygon의 가장 가까운 외곽선과의 거리 및 가장 가까운 점을 구한다.
        /// </summary>
        /// <param name="vertex"></param>
        /// <param name="vResult"></param>
        /// <returns>vertex가 Polygon의 내부에 존재할 경우 음수값을 리턴한다.</returns>
        public double GetDistanceNVertex(Vertex2F vertex, out Vertex2F vResult)
        {
            vResult = new Vertex2F();

            int nVertexCount = GetVertexCount();
            if (nVertexCount < 3)
                return 0.0;

            // 시작점과 끝점이 같은지 검사한다.
            Vertex2F vFirst = m_arrVertices[0];
            Vertex2F vLast = m_arrVertices[nVertexCount - 1];
            bool isFirstLastSame = vFirst.GetDistance(vLast) <= Math.HALF_TOLERANCE();
            if (isFirstLastSame) nVertexCount--;

            Vertex2F rBeginVertex = m_arrVertices[0];
            Vertex2F rEndVertex = m_arrVertices[nVertexCount - 1];

            double x, minDistance = -1.0;
            int nCount = 0;
            Vertex2F pPrev = rEndVertex;

            for (int i = 0; i < nVertexCount; i++)
            {
                Vertex2F rVertex = m_arrVertices[i];
                Line2F line = new Line2F(pPrev, rVertex);

                Vertex2F vNear = Math.GetNearestVertex(vertex, pPrev, rVertex, false);
                double distance = vertex.GetDistance(vNear);

                if (minDistance < 0.0 || minDistance > distance)
                {
                    vResult.SetVertex(vNear.x, vNear.y);
                    minDistance = distance;
                }

                if (line.IsInclude(vertex))
                {
                    // vertex가 외곽선내에 포함되어 있다.
                    return 0.0;
                }
                else
                {
                    double diff = pPrev.y - rVertex.y;
                    if (diff < 0)
                        diff = -diff;

                    // X축과 평행한 선분은 계산하지 않는다.
                    if (diff > Math.HALF_TOLERANCE())
                    {
                        if (GetXFromLine(line, vertex.y, out x))
                        {
                            diff = x - vertex.x;
                            if (diff < 0.0)
                                diff = -diff;

                            if (diff <= Math.GetTolerance(x))
                                return -1;
                            else if (x > vertex.x)
                            {
                                CheckPointCount(pPrev, rVertex, vertex.y, ref nCount);
                            }
                        }
                    }
                }

                pPrev = rVertex;
            }

            if (nCount % 2 == 0)
                return minDistance;

            // vertex가 폴리곤의 내부에 위치한다.
            return -minDistance;
        }

        public bool IsClockWise()
        {
            double sum = 0.0;
            int nVertexCount = GetVertexCount();

            for (int i = 0; i < nVertexCount; i++)
            {
                Vertex2F v1 = GetVertex(i);
                Vertex2F v2 = GetVertex((i + 1) % nVertexCount);
                sum += (v2.x - v1.x) * (v2.y + v1.y);
            }

            return sum > 0.0;
        }

        /// <summary>
        /// Polygon 연산을 수행하기 위하여 VertexList를 직접 사용할 수 있도록 한다.
        /// </summary>
        /// <returns></returns>
        public List<Vertex2F> GetVertexList()
        {
            return m_arrVertices;
        }
    }
}
