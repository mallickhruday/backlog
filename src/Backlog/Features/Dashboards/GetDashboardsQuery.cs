using MediatR;
using Backlog.Data;
using Backlog.Features.Core;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using System.Data.Entity;

namespace Backlog.Features.Dashboards
{
    public class GetDashboardsQuery
    {
        public class Request : BaseRequest, IRequest<Response> { }

        public class Response
        {
            public ICollection<DashboardApiModel> Dashboards { get; set; } = new HashSet<DashboardApiModel>();
        }

        public class Handler : IAsyncRequestHandler<Request, Response>
        {
            public Handler(IBacklogContext context, ICache cache)
            {
                _context = context;
                _cache = cache;
            }

            public async Task<Response> Handle(Request request)
            {
                var dashboards = await _context.Dashboards
                    .Include(x => x.Tenant)
                    .Where(x => x.Tenant.UniqueId == request.TenantUniqueId )
                    .ToListAsync();

                return new Response()
                {
                    Dashboards = dashboards.Select(x => DashboardApiModel.FromDashboard(x)).ToList()
                };
            }

            private readonly IBacklogContext _context;
            private readonly ICache _cache;
        }
    }
}
