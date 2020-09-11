using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
	public class MapController : Controller
	{
		DreamsEntities _db = new DreamsEntities();
		// GET: Map
		public ActionResult Index()
		{
			return View();
		}
		public JsonResult GetAllLocation()
		{
			//var data = _db.Dreams.Select(x => new { x.Lat, x.Long}).ToList();
			var data = _db.Dreams.Where(x => x.isPublic == true).ToList();
			var dataFinal = new List<MapCustom>();
			foreach (var dream in data)
			{
				var dreamCustom = new MapCustom()
				{



					ID = dream.ID,
					Title = dream.Title,
					Description = dream.Description,
					Lat = dream.Lat,
					Long = dream.Long,
					Icon = dream.DreamAndCategories.FirstOrDefault(e => e.DreamID == dream.ID).Category.Icon
				};
				dataFinal.Add(dreamCustom);
			}

			var dreams = dataFinal.Select(e => new { e.ID, e.Title, e.Description, e.Lat, e.Long, e.Icon, slug = e.GenerateSlug() }).ToList();

			return Json(dreams, JsonRequestBehavior.AllowGet);
		}
	}
}