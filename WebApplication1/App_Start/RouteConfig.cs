using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using WebApplication1.Models;

namespace WebApplication1
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.Add("UserDream", new SeoFriendlyRoute("User/ShowDreams/{id}",
           new RouteValueDictionary(new { controller = "User", action = "ShowDreams" }),
           new MvcRouteHandler()));


            routes.Add("DreamsDetails", new SeoFriendlyRoute("dreams/details/{id}",
           new RouteValueDictionary(new { controller = "Dreams", action = "Details" }),
           new MvcRouteHandler()));

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );

            routes.MapRoute("dreams", "{controller}/{action}/{id}", new { controller = "Dreams", action = "GetDreams" });
        }
    }
}
