using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Models
{
    public class DreamCustom
    {
        public int Id { get; set; }
        public int UserID { get; set; }
        [Required (ErrorMessage ="მიუთითეთ სიზმირს დასახელება")]
        public string Title { get; set; }
        [Required(ErrorMessage = "დაამატეთ სიზმრის აღწერა")]
        public string Description { get; set; }
        public string Long { get; set; }
        public string Lat { get; set; }
        public bool isPublic { get; set; }
        public string Lang { get; set; }
        [Required(ErrorMessage = "მიუთითეთ სიზმრის თარიღი")]
        public System.DateTime CreateDate { get; set; }
        [Required(ErrorMessage = "აირჩიეთ კატეგორია")]
        public List<int> Categories { get; set; }
        [Required(ErrorMessage = "დაამატეთ ჰეშთეგი")]
        public List<string> Tags { get; set; }
    }
}