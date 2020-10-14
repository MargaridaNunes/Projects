using System;
using Newtonsoft.Json;
using SRA.Utils;
using SRA.ViewModel;

namespace SRA.Model
{
    public class StudentLecture
    {
        public string SemesterRepresent { get; set; }
        public string CourseName { get; set; }
        public string ClassId { get; set; }
        public string Classroom { get; set; }
        public string TeacherName { get; set; }
        public DateTime RegistryDate { get; set; }
    }
}