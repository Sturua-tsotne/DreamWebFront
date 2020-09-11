using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;

namespace WebApplication1.Models
{
	public class UserCustom
	{
		public int Id { get; set; }
		public string UserName { get; set; }

		public string GenerateSlug()
		{
			string phrase = string.Format("{0}-{1}", Id, UserName);

			string str = Regex.Replace(phrase, " ", "-");

			return str;
		}
	}
}