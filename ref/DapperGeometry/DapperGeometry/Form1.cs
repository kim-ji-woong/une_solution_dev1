using dnsDapperDBUtil.DataAccessLayer.DAL;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using NetTopologySuite.IO;
using NetTopologySuite.Geometries;
using DapperGeometry.Models;

namespace DapperGeometry
{
    public partial class Form1 : Form
    {
        private DataManager dataManager = null;
        public Form1()
        {
            InitializeComponent();
            dataManager = new DataManager(3, "192.168.0.244", "TestDB", "postgres", "9449966Ab");
        }

        private void btnSelect_Click(object sender, EventArgs e)
        {
            
            List<Models.BuildingGroup> bgs = dataManager.GetSelect().SelectGeometry<Models.BuildingGroup>("", out string strErr);
            List<Models.Zone> zs = dataManager.GetSelect().SelectGeometry<Models.Zone>("", out strErr);

            if (zs != null && zs.Count > 0)
            {
                foreach (var item in zs[0].Boundary.Coordinates)
                {
                }
            }
        }

        private Polygon SimplePolygon()
        {
            var polygon = new Polygon(new LinearRing(new Coordinate[] {
                new Coordinate(1.0, 1.0),
                new Coordinate(1.05, 1.1),
                new Coordinate(1.1, 1.1),
                new Coordinate(1.1, 1.05),
                new Coordinate(1, 1),
            }));
            return polygon;
        }

        private NetTopologySuite.Geometries.Point SimplePoint()
        {
            var point = new NetTopologySuite.Geometries.Point(new Coordinate() { X = 2.0, Y = 3.0 });
            return point;
        }

        private NetTopologySuite.Geometries.LineString SimpleLineString()
        {
            var lineString = new NetTopologySuite.Geometries.LineString(new Coordinate[] {
                new Coordinate(1.0, 1.0),
                new Coordinate(1.05, 1.1),
                new Coordinate(1.1, 1.1),
                new Coordinate(1.1, 1.05),
                new Coordinate(1, 1),
            });
            return lineString;
        }

        private void btnInsert_Click(object sender, EventArgs e)
        {
            Zone z = new Zone();
            z.ID = 1;
            z.ZoneName = "1층";
            z.Boundary = SimplePolygon();

            bool result = dataManager.GetCreate().InsertGeometry<Zone>(z, out string strError);

            //BuildingGroup bg = new BuildingGroup();
            //bg.ID = 4;
            //bg.GroupName = "4단지";
            //bg.TextCenter = SimplePoint();

            //BuildingGroup bg = new BuildingGroup();
            //bg.ID = 5;
            //bg.GroupName = "5단지";
            //bg.TextCenter = SimpleLineString();

            //bool result2 = dataManager.GetCreate().InsertGeometry<BuildingGroup>(bg, out string strError);
        }

        private void btnUpdate_Click(object sender, EventArgs e)
        {
            List<Models.BuildingGroup> bgs = dataManager.GetSelect().SelectGeometry<Models.BuildingGroup>("", out string strErr);
            bgs[0].TextCenter = SimpleLineString();
            
            bool result = dataManager.GetUpdate().UpdateGeometry<BuildingGroup>(bgs[0], out string strError);

            List<Models.Zone> zs = dataManager.GetSelect().SelectGeometry<Models.Zone>("", out strErr);
            zs[0].Boundary = SimpleLineString();

            bool result2 = dataManager.GetUpdate().UpdateGeometry<Zone>(zs[0], out strError);
        }

        private void btnNpgsql_Click(object sender, EventArgs e)
        {
            dnsDapperDBUtil.DataAccessLayer.IDAL.IDataManager clonData = dataManager.Clone();
            clonData.BeginBatch(out string strErr);

            Regular r = new Regular();
            r.TeamName = "5번";
            r.SiteID = 1;

            bool result = clonData.GetCreate().Insert<Regular>(r, out int nAddID, out strErr);

            Regular regular = clonData.GetSelect().SelectFirst<Regular>("ID=" + nAddID, out strErr);
            regular.TeamName = regular.TeamName + "_";

            bool result2 = clonData.GetUpdate().Update<Regular>(regular, "", out strErr);

            Regular regular2 = clonData.GetSelect().SelectFirst<Regular>("ID=" + nAddID, out strErr);
            bool result3 = clonData.BatchRollback(out strErr);
            //bool result4 = clonData.BatchCommit(out strErr);
        }
    }
}
