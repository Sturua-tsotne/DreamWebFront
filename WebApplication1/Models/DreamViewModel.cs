using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;

namespace WebApplication1.Models
{
	public class DreamViewModel
	{
		public int Id { get; set; }
		public int UserID { get; set; }

		public string Title { get; set; }

		public string Description { get; set; }


		public System.DateTime CreateDate { get; set; }

		public List<string> Categories { get; set; }
		public string CategoryIcon { get; set; }

		public List<string> Tags { get; set; }

		public string GenerateSlug()
		{
			string phrase = string.Format("{0}-{1}", Id, Title);

			string str = Regex.Replace(phrase, " ", "-");

			return str;
		}
	}
}