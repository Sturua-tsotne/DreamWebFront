using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;

namespace WebApplication1.Models
{
	public class MapCustom
	{
		public int ID { get; set; }
		public string Title { get; set; }
		public string Description { get; set; }
		public string Long { get; set; }
		public string Lat { get; set; }
		public string Icon { get; set; }

		public string GenerateSlug()
		{
			string phrase = string.Format("{0}-{1}", ID, Title);

			string str = Regex.Replace(phrase, " ", "-");

			return str;
		}
	}
}