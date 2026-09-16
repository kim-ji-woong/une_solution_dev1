namespace SoulbrainWebAPIServer.Model
{
    public class BuildingData
    {
        public BuildingData(int nID, string strDisplayName, string? strName = null, int? nFloorIndex = null)
        {
            this.ID = nID;
            this.DisplayName = strDisplayName;
            this.Name = strName;
            this.FloorIndex = nFloorIndex;
        }

        public int ID { get; set; }
        public string Name { get; set; }
        public string? DisplayName { get; set; }
        public int? FloorIndex { get; set; }
    }
}