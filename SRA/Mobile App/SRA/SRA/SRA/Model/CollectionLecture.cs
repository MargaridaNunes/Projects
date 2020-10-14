using System;
using Newtonsoft.Json;
using SRA.Utils;

namespace SRA.Model
{
    public class CollectionLecture
    {
        public int LectureId { get; set; }
        public string TeacherName { get; set; }
        public string CourseName { get; set; }
        public string ClassId { get; set; }
        public string Classroom { get; set; }
        public string AttributionDate { get; set; }
        public DateTime ClassStartDate { get; set; }
        public DateTime ClassEndDate { get; set; }
        
        public string ClassSchedule => $"{ClassStartDate.Day}/{ClassStartDate.Month}/{ClassStartDate.Year}  {ClassStartDate.TimeOfDay} - {ClassEndDate.TimeOfDay}";
    }
}