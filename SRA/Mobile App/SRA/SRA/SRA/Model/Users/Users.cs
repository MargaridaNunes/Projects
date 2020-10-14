namespace SRA.Model.Users
{
    public class Users
    {
        public Student StudentInformation { get; set; }
        public Collector CollectorInformation { get; set; }
        public Manager ManagerInformation { get; set; }
        public Administrator AdminInformation { get; set; }
    }
}