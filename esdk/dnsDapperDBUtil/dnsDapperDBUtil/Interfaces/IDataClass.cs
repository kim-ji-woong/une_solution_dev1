namespace dnsDapperDBUtil.Interfaces
{
    public interface IDataClass
    {
        object MakeDataClass();
        void Binding(params object[] obj);
    }
}
