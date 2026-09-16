using System;
using System.Collections.Generic;
using System.Text;

namespace UnE.Geometry
{
    public class Quaternion
    {
        private double _x = 0.0;
        private double _y = 0.0;
        private double _z = 0.0;
        private double _w = 0.0;

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

        public double w
        {
            get { return _w; }
            set { _w = value; }
        }

        public static Quaternion operator +(Quaternion a, Quaternion b)
        {
            return new Quaternion(a.x + b.x, a.y + b.y, a.z + b.z, a.w + b.w);
        }

        public static Quaternion operator -(Quaternion a, Quaternion b)
        {
            return new Quaternion(a.x - b.x, a.y - b.y, a.z - b.z, a.w - b.w);
        }

        public static Quaternion operator *(Quaternion a, double b)
        {
            return new Quaternion(a.x * b, a.y * b, a.z * b, a.w * b);
        }

        public static Quaternion operator /(Quaternion a, double b)
        {
            return new Quaternion(a.x / b, a.y / b, a.z / b, a.w / b);
        }

        public Quaternion()
        {
        }

        public Quaternion(Quaternion q)
        {
            this.x = q.x;
            this.y = q.y;
            this.z = q.z;
            this.w = q.w;
        }

        public Quaternion(double x, double y, double z, double w)
        {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }

        public void Set(double x, double y, double z, double w)
        {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }

        public void CopyFrom(Quaternion q)
        {
            this.x = q.x;
            this.y = q.y;
            this.z = q.z;
            this.w = q.w;
        }
    }
}
